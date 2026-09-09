-- ============================================================================
-- BloodConnect — Supabase Realtime & Automated Notifications Triggers
-- Version: 1.5 (Server-Side State Transition Notification Triggers & Realtime Pub)
-- ============================================================================

-- 1. Add missing entity columns and indexes to notifications table
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS entity_type TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS entity_id UUID;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications (user_id, read, created_at DESC);

-- 2. Trigger Function: Generate Notifications on Blood Request Status Changes
CREATE OR REPLACE FUNCTION public.notify_on_request_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Request Approved by Admin -> Notify Requester
    IF (NEW.status = 'APPROVED') THEN
      INSERT INTO public.notifications (user_id, type, title, message, related_request_id, entity_type, entity_id)
      VALUES (
        NEW.requester_id,
        'REQUEST_APPROVED',
        'Blood Request Approved',
        'Your blood request for ' || NEW.blood_group || ' (' || NEW.units_required || ' units) at ' || NEW.hospital_name_text || ' has been approved. Donor matching is now active.',
        NEW.id,
        'BLOOD_REQUEST',
        NEW.id
      );
    -- Request Rejected by Admin -> Notify Requester
    ELSIF (NEW.status = 'REJECTED') THEN
      INSERT INTO public.notifications (user_id, type, title, message, related_request_id, entity_type, entity_id)
      VALUES (
        NEW.requester_id,
        'REQUEST_REJECTED',
        'Request Review Update',
        'Your blood request for ' || NEW.blood_group || ' could not be approved at this time. Please check your workspace for details.',
        NEW.id,
        'BLOOD_REQUEST',
        NEW.id
      );
    -- Request Cancelled -> Notify Requester and Responding Donors
    ELSIF (NEW.status = 'CANCELLED') THEN
      INSERT INTO public.notifications (user_id, type, title, message, related_request_id, entity_type, entity_id)
      VALUES (
        NEW.requester_id,
        'REQUEST_CANCELLED',
        'Request Cancelled',
        'Your blood request for ' || NEW.blood_group || ' at ' || NEW.hospital_name_text || ' has been cancelled.',
        NEW.id,
        'BLOOD_REQUEST',
        NEW.id
      );

      -- Notify responding donors
      INSERT INTO public.notifications (user_id, type, title, message, related_request_id, entity_type, entity_id)
      SELECT 
        dp.user_id,
        'REQUEST_CANCELLED',
        'Blood Request Update',
        'The ' || NEW.blood_group || ' blood request at ' || NEW.hospital_name_text || ' is no longer active.',
        NEW.id,
        'BLOOD_REQUEST',
        NEW.id
      FROM public.donor_matches dm
      JOIN public.donor_profiles dp ON dp.id = dm.donor_id
      WHERE dm.request_id = NEW.id AND dm.status IN ('ACCEPTED', 'NOTIFIED');

    -- Request Fulfilled -> Notify Requester and Donors
    ELSIF (NEW.status = 'FULFILLED') THEN
      INSERT INTO public.notifications (user_id, type, title, message, related_request_id, entity_type, entity_id)
      VALUES (
        NEW.requester_id,
        'REQUEST_FULFILLED',
        'Request Fulfilled',
        'Your blood request for ' || NEW.blood_group || ' at ' || NEW.hospital_name_text || ' has been successfully fulfilled. Thank you for using BloodConnect.',
        NEW.id,
        'BLOOD_REQUEST',
        NEW.id
      );

      -- Notify responding donors
      INSERT INTO public.notifications (user_id, type, title, message, related_request_id, entity_type, entity_id)
      SELECT 
        dp.user_id,
        'REQUEST_FULFILLED',
        'Donation Completed',
        'Thank you! The ' || NEW.blood_group || ' blood request at ' || NEW.hospital_name_text || ' has been fulfilled.',
        NEW.id,
        'BLOOD_REQUEST',
        NEW.id
      FROM public.donor_matches dm
      JOIN public.donor_profiles dp ON dp.id = dm.donor_id
      WHERE dm.request_id = NEW.id AND dm.status IN ('ACCEPTED', 'NOTIFIED');
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_notify_request_status ON public.blood_requests;
CREATE TRIGGER tr_notify_request_status
  AFTER UPDATE OF status ON public.blood_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_request_status_change();

-- 3. Trigger Function: Generate Notifications on Donor Match / Response
CREATE OR REPLACE FUNCTION public.notify_on_donor_match_change()
RETURNS TRIGGER AS $$
DECLARE
  req_record RECORD;
BEGIN
  SELECT br.* INTO req_record FROM public.blood_requests br WHERE br.id = NEW.request_id;

  IF (NEW.status = 'ACCEPTED' AND (OLD IS NULL OR OLD.status IS DISTINCT FROM 'ACCEPTED')) THEN
    IF req_record.id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, type, title, message, related_request_id, entity_type, entity_id)
      VALUES (
        req_record.requester_id,
        'NEW_DONOR_RESPONSE',
        'Donor Responded',
        'A verified compatible donor has responded to your ' || req_record.blood_group || ' blood request at ' || req_record.hospital_name_text || '.',
        req_record.id,
        'DONOR_MATCH',
        NEW.id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_notify_donor_match ON public.donor_matches;
CREATE TRIGGER tr_notify_donor_match
  AFTER INSERT OR UPDATE OF status ON public.donor_matches
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_donor_match_change();

-- 4. Trigger Function: Generate Notifications on User Verification Status Changes
CREATE OR REPLACE FUNCTION public.notify_on_user_verification_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.verification_status IS DISTINCT FROM NEW.verification_status) THEN
    IF (NEW.verification_status = 'VERIFIED') THEN
      INSERT INTO public.notifications (user_id, type, title, message, entity_type, entity_id)
      VALUES (
        NEW.id,
        'VERIFICATION_APPROVED',
        'Profile Verified',
        'Your account verification has been approved. You now have full access to platform features.',
        'USER_PROFILE',
        NEW.id
      );
    ELSIF (NEW.verification_status = 'REJECTED') THEN
      INSERT INTO public.notifications (user_id, type, title, message, entity_type, entity_id)
      VALUES (
        NEW.id,
        'VERIFICATION_REJECTED',
        'Verification Decision',
        'Your account verification details require attention. Please update your profile information.',
        'USER_PROFILE',
        NEW.id
      );
    ELSIF (NEW.verification_status = 'SUSPENDED') THEN
      INSERT INTO public.notifications (user_id, type, title, message, entity_type, entity_id)
      VALUES (
        NEW.id,
        'VERIFICATION_SUSPENDED',
        'Account Status Update',
        'Your account has been restricted. Please contact platform support for assistance.',
        'USER_PROFILE',
        NEW.id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_notify_user_verification ON public.profiles;
CREATE TRIGGER tr_notify_user_verification
  AFTER UPDATE OF verification_status ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_user_verification_change();

-- 5. Enable Tables in Supabase Realtime Publication
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_requests;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.donor_matches;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_audit_logs;
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Realtime publication configuration safe fallback
  NULL;
END $$;
