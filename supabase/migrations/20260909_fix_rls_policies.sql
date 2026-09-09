-- ============================================================================
-- BloodConnect — RLS Security Policies Fix
-- Version: 1.7 (Full RLS Read/Write Access Policies for Requests & Matches)
-- ============================================================================

-- 1. Enable RLS on blood_requests
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Blood requests view policy" ON public.blood_requests;
DROP POLICY IF EXISTS "Blood requests insert policy" ON public.blood_requests;
DROP POLICY IF EXISTS "Blood requests update policy" ON public.blood_requests;

-- View Policy for blood_requests
CREATE POLICY "Blood requests view policy" ON public.blood_requests
  FOR SELECT USING (
    -- Requester view own requests
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = blood_requests.requester_id AND p.auth_user_id = auth.uid()
    )
    OR
    -- Approved requests visible to authenticated users (donors)
    status IN ('APPROVED', 'ACTIVE', 'PARTIALLY_FULFILLED', 'FULFILLED')
    OR
    -- Admin view all
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Insert Policy for blood_requests
CREATE POLICY "Blood requests insert policy" ON public.blood_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = blood_requests.requester_id AND p.auth_user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Update Policy for blood_requests
CREATE POLICY "Blood requests update policy" ON public.blood_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = blood_requests.requester_id AND p.auth_user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- 2. Enable RLS on donor_matches
ALTER TABLE public.donor_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Donor matches view policy" ON public.donor_matches;
DROP POLICY IF EXISTS "Donor matches update policy" ON public.donor_matches;

-- View Policy for donor_matches
CREATE POLICY "Donor matches view policy" ON public.donor_matches
  FOR SELECT USING (
    -- Donor view own matches
    EXISTS (
      SELECT 1 FROM public.donor_profiles dp
      JOIN public.profiles p ON p.id = dp.user_id
      WHERE dp.id = donor_matches.donor_id AND p.auth_user_id = auth.uid()
    )
    OR
    -- Requester view matches for own request
    EXISTS (
      SELECT 1 FROM public.blood_requests br
      JOIN public.profiles p ON p.id = br.requester_id
      WHERE br.id = donor_matches.request_id AND p.auth_user_id = auth.uid()
    )
    OR
    -- Admin view all
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- Update Policy for donor_matches
CREATE POLICY "Donor matches update policy" ON public.donor_matches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.donor_profiles dp
      JOIN public.profiles p ON p.id = dp.user_id
      WHERE dp.id = donor_matches.donor_id AND p.auth_user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.auth_user_id = auth.uid() AND p.role = 'admin'
    )
  );
