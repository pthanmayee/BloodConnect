-- ============================================================================
-- BloodConnect — Donor Dashboard Additional Tables & RLS Migration
-- Version: 1.2 (Donation History Foundation & Notifications System)
-- ============================================================================

-- 1. Create Donation Records Table
CREATE TABLE IF NOT EXISTS public.donation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES public.donor_profiles(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.blood_requests(id) ON DELETE SET NULL,
  hospital_name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  units INT NOT NULL DEFAULT 1,
  donation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'SYSTEM',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_request_id UUID REFERENCES public.blood_requests(id) ON DELETE SET NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.donation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. Policies for donation_records
DROP POLICY IF EXISTS "Donors view own donation records" ON public.donation_records;
CREATE POLICY "Donors view own donation records" ON public.donation_records
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.donor_profiles dp
    JOIN public.profiles p ON p.id = dp.user_id
    WHERE dp.id = donation_records.donor_id AND p.auth_user_id = auth.uid()
  ));

-- 5. Policies for notifications
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = notifications.user_id AND p.auth_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = notifications.user_id AND p.auth_user_id = auth.uid()
  ));
