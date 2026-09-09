-- ============================================================================
-- BloodConnect — Donation Fulfillment Lifecycle & Operational Completion
-- Version: 1.6 (Donation Fulfillments, Unit Accounting, Atomic Confirmation RPC)
-- ============================================================================

-- 1. Create Donation Fulfillments Table
CREATE TABLE IF NOT EXISTS public.donation_fulfillments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.donor_matches(id) ON DELETE SET NULL,
  donor_id UUID NOT NULL REFERENCES public.donor_profiles(id) ON DELETE CASCADE,
  units_donated INT NOT NULL DEFAULT 1 CHECK (units_donated > 0),
  status TEXT NOT NULL DEFAULT 'COORDINATED' CHECK (status IN ('PENDING', 'COORDINATED', 'DONOR_CONFIRMED', 'HOSPITAL_CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED')),
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add fulfilled_at timestamp column to blood_requests if missing
ALTER TABLE public.blood_requests ADD COLUMN IF NOT EXISTS fulfilled_at TIMESTAMPTZ;

-- Enable RLS
ALTER TABLE public.donation_fulfillments ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fulfillments_request ON public.donation_fulfillments(request_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_donor ON public.donation_fulfillments(donor_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_match ON public.donation_fulfillments(match_id);
CREATE INDEX IF NOT EXISTS idx_fulfillments_status ON public.donation_fulfillments(status);

-- RLS Policies for donation_fulfillments
DROP POLICY IF EXISTS "Users view relevant donation fulfillments" ON public.donation_fulfillments;
CREATE POLICY "Users view relevant donation fulfillments" ON public.donation_fulfillments
  FOR SELECT USING (
    -- Donor view own
    EXISTS (
      SELECT 1 FROM public.donor_profiles dp
      JOIN public.profiles p ON p.id = dp.user_id
      WHERE dp.id = donation_fulfillments.donor_id AND p.auth_user_id = auth.uid()
    )
    OR
    -- Requester view own request fulfillments
    EXISTS (
      SELECT 1 FROM public.blood_requests br
      JOIN public.profiles p ON p.id = br.requester_id
      WHERE br.id = donation_fulfillments.request_id AND p.auth_user_id = auth.uid()
    )
    OR
    -- Admin view all
    EXISTS (
      SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Donors update own pending fulfillments" ON public.donation_fulfillments;
CREATE POLICY "Donors update own pending fulfillments" ON public.donation_fulfillments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.donor_profiles dp
      JOIN public.profiles p ON p.id = dp.user_id
      WHERE dp.id = donation_fulfillments.donor_id AND p.auth_user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- 2. Atomic Stored Procedure: Confirm Donation & Update Unit Accounting
CREATE OR REPLACE FUNCTION public.confirm_donation_fulfillment(
  p_match_id UUID,
  p_units_donated INT DEFAULT 1,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_match RECORD;
  v_request RECORD;
  v_donor RECORD;
  v_caller_profile RECORD;
  v_new_fulfilled INT;
  v_new_request_status TEXT;
  v_fulfillment_id UUID;
BEGIN
  -- 1. Identify Caller Profile
  SELECT * INTO v_caller_profile FROM public.profiles WHERE auth_user_id = auth.uid();
  IF v_caller_profile.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required.');
  END IF;

  -- 2. Fetch Match & Lock for update
  SELECT * INTO v_match FROM public.donor_matches WHERE id = p_match_id FOR UPDATE;
  IF v_match.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Match record not found.');
  END IF;

  -- 3. Fetch Donor & Request
  SELECT * INTO v_donor FROM public.donor_profiles WHERE id = v_match.donor_id;
  SELECT * INTO v_request FROM public.blood_requests WHERE id = v_match.request_id FOR UPDATE;

  -- 4. Verify Authorization (Caller must be matched donor or admin)
  IF v_donor.user_id != v_caller_profile.id AND v_caller_profile.role != 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized to confirm this donation.');
  END IF;

  -- 5. Check Request Status
  IF v_request.status IN ('FULFILLED', 'CANCELLED', 'EXPIRED', 'REJECTED') THEN
    RETURN jsonb_build_object('success', false, 'error', 'This request is no longer active.');
  END IF;

  -- 6. Check Over-Fulfillment
  IF (v_request.units_fulfilled + p_units_donated) > v_request.units_required THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Donation exceeds required units. Request already has ' || v_request.units_fulfilled || ' of ' || v_request.units_required || ' units.'
    );
  END IF;

  -- 7. Calculate New Fulfillment Totals
  v_new_fulfilled := v_request.units_fulfilled + p_units_donated;
  IF v_new_fulfilled >= v_request.units_required THEN
    v_new_request_status := 'FULFILLED';
  ELSE
    v_new_request_status := 'PARTIALLY_FULFILLED';
  END IF;

  -- 8. Create or Update Donation Fulfillment Record
  INSERT INTO public.donation_fulfillments (
    request_id, match_id, donor_id, units_donated, status, confirmed_at, confirmed_by, notes
  ) VALUES (
    v_request.id, v_match.id, v_donor.id, p_units_donated, 'COMPLETED', now(), v_caller_profile.id, p_notes
  )
  RETURNING id INTO v_fulfillment_id;

  -- 9. Update Donor Match Status
  UPDATE public.donor_matches
  SET status = 'ACCEPTED', updated_at = now()
  WHERE id = v_match.id;

  -- 10. Update Blood Request Units & Status
  UPDATE public.blood_requests
  SET 
    units_fulfilled = v_new_fulfilled,
    status = v_new_request_status,
    fulfilled_at = CASE WHEN v_new_request_status = 'FULFILLED' THEN now() ELSE fulfilled_at END,
    updated_at = now()
  WHERE id = v_request.id;

  -- 11. Insert Record into Donor's History (donation_records)
  INSERT INTO public.donation_records (
    donor_id, request_id, hospital_name, blood_group, units, donation_date, status
  ) VALUES (
    v_donor.id, v_request.id, v_request.hospital_name_text, v_request.blood_group, p_units_donated, CURRENT_DATE, 'COMPLETED'
  );

  -- 12. Create Audit Log Entry
  INSERT INTO public.admin_audit_logs (
    admin_id, action, target_type, target_id, previous_status, new_status, reason
  ) VALUES (
    v_caller_profile.id,
    'DONATION_CONFIRMED',
    'BLOOD_REQUEST',
    v_request.id,
    v_request.status,
    v_new_request_status,
    'Donation confirmed for ' || p_units_donated || ' unit(s). Progress: ' || v_new_fulfilled || '/' || v_request.units_required
  );

  -- 13. Create Notifications
  -- Requester Notification
  INSERT INTO public.notifications (
    user_id, type, title, message, related_request_id, entity_type, entity_id
  ) VALUES (
    v_request.requester_id,
    CASE WHEN v_new_request_status = 'FULFILLED' THEN 'REQUEST_FULFILLED' ELSE 'REQUEST_PARTIALLY_FULFILLED' END,
    CASE WHEN v_new_request_status = 'FULFILLED' THEN 'Request Fulfilled!' ELSE 'Donation Confirmed' END,
    'A donation of ' || p_units_donated || ' unit(s) has been confirmed. Total: ' || v_new_fulfilled || ' of ' || v_request.units_required || ' units fulfilled.',
    v_request.id,
    'BLOOD_REQUEST',
    v_request.id
  );

  -- Donor Notification
  INSERT INTO public.notifications (
    user_id, type, title, message, related_request_id, entity_type, entity_id
  ) VALUES (
    v_caller_profile.id,
    'DONATION_CONFIRMED',
    'Donation Confirmed',
    'Thank you! Your donation of ' || p_units_donated || ' unit(s) for ' || v_request.blood_group || ' at ' || v_request.hospital_name_text || ' has been recorded.',
    v_request.id,
    'DONATION_FULFILLMENT',
    v_fulfillment_id
  );

  RETURN jsonb_build_object(
    'success', true,
    'fulfillment_id', v_fulfillment_id,
    'units_fulfilled', v_new_fulfilled,
    'units_required', v_request.units_required,
    'request_status', v_new_request_status
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Stored Procedure: Donor Withdraws / Cancels Match
CREATE OR REPLACE FUNCTION public.cancel_donor_match(
  p_match_id UUID,
  p_reason TEXT DEFAULT 'Donor unavailable'
)
RETURNS JSONB AS $$
DECLARE
  v_match RECORD;
  v_request RECORD;
  v_donor RECORD;
  v_caller_profile RECORD;
BEGIN
  SELECT * INTO v_caller_profile FROM public.profiles WHERE auth_user_id = auth.uid();
  IF v_caller_profile.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required.');
  END IF;

  SELECT * INTO v_match FROM public.donor_matches WHERE id = p_match_id FOR UPDATE;
  IF v_match.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Match not found.');
  END IF;

  SELECT * INTO v_donor FROM public.donor_profiles WHERE id = v_match.donor_id;
  SELECT * INTO v_request FROM public.blood_requests WHERE id = v_match.request_id;

  IF v_donor.user_id != v_caller_profile.id AND v_caller_profile.role != 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized.');
  END IF;

  -- Update Match Status
  UPDATE public.donor_matches
  SET status = 'CANCELLED', updated_at = now()
  WHERE id = v_match.id;

  -- Update any active fulfillments
  UPDATE public.donation_fulfillments
  SET status = 'CANCELLED', updated_at = now()
  WHERE match_id = v_match.id AND status IN ('PENDING', 'COORDINATED');

  -- Audit Log
  INSERT INTO public.admin_audit_logs (
    admin_id, action, target_type, target_id, previous_status, new_status, reason
  ) VALUES (
    v_caller_profile.id, 'DONOR_CANCELLED_MATCH', 'DONOR_MATCH', v_match.id, v_match.status, 'CANCELLED', p_reason
  );

  -- Notify Requester
  INSERT INTO public.notifications (
    user_id, type, title, message, related_request_id, entity_type, entity_id
  ) VALUES (
    v_request.requester_id,
    'MATCH_CANCELLED',
    'Donor Response Update',
    'A donor was unable to complete donation. Matching remains active for your remaining units.',
    v_request.id,
    'BLOOD_REQUEST',
    v_request.id
  );

  RETURN jsonb_build_object('success', true, 'match_id', v_match.id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Stored Procedure: Requester / Admin Cancels Request
CREATE OR REPLACE FUNCTION public.cancel_blood_request(
  p_request_id UUID,
  p_reason TEXT DEFAULT 'Cancelled by requester'
)
RETURNS JSONB AS $$
DECLARE
  v_request RECORD;
  v_caller_profile RECORD;
BEGIN
  SELECT * INTO v_caller_profile FROM public.profiles WHERE auth_user_id = auth.uid();
  IF v_caller_profile.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Authentication required.');
  END IF;

  SELECT * INTO v_request FROM public.blood_requests WHERE id = p_request_id FOR UPDATE;
  IF v_request.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Request not found.');
  END IF;

  IF v_request.requester_id != v_caller_profile.id AND v_caller_profile.role != 'admin' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized.');
  END IF;

  -- Update Request Status
  UPDATE public.blood_requests
  SET status = 'CANCELLED', updated_at = now()
  WHERE id = v_request.id;

  -- Update all active matches
  UPDATE public.donor_matches
  SET status = 'CANCELLED', updated_at = now()
  WHERE request_id = v_request.id AND status IN ('MATCHED', 'NOTIFIED', 'ACCEPTED');

  -- Audit Log
  INSERT INTO public.admin_audit_logs (
    admin_id, action, target_type, target_id, previous_status, new_status, reason
  ) VALUES (
    v_caller_profile.id, 'REQUEST_CANCELLED', 'BLOOD_REQUEST', v_request.id, v_request.status, 'CANCELLED', p_reason
  );

  -- Notify Active Donors
  INSERT INTO public.notifications (
    user_id, type, title, message, related_request_id, entity_type, entity_id
  )
  SELECT 
    dp.user_id,
    'REQUEST_CANCELLED',
    'Blood Request Cancelled',
    'The ' || v_request.blood_group || ' request at ' || v_request.hospital_name_text || ' has been cancelled.',
    v_request.id,
    'BLOOD_REQUEST',
    v_request.id
  FROM public.donor_matches dm
  JOIN public.donor_profiles dp ON dp.id = dm.donor_id
  WHERE dm.request_id = v_request.id;

  RETURN jsonb_build_object('success', true, 'request_id', v_request.id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Add donation_fulfillments to Realtime Publication
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.donation_fulfillments;
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
