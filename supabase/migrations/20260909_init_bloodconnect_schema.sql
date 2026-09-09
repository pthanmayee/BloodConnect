-- ============================================================================
-- BloodConnect — Primary Database Migration Script
-- Version: 1.1 (Auth, Profiles, Roles, RLS & PostGIS Engine)
-- Schema: PostgreSQL + PostGIS + Supabase Auth + RLS + Triggers
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('donor', 'requester', 'hospital', 'admin')),
  verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
  account_status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'SUSPENDED', 'DEACTIVATED')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create Donor Profiles Table
CREATE TABLE IF NOT EXISTS public.donor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_group TEXT CHECK (blood_group IN ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
  date_of_birth DATE,
  phone TEXT,
  availability_status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (availability_status IN ('AVAILABLE', 'UNAVAILABLE', 'TEMPORARILY_UNAVAILABLE', 'RECENTLY_DONATED', 'SUSPENDED')),
  eligibility_status TEXT NOT NULL DEFAULT 'ELIGIBLE' CHECK (eligibility_status IN ('ELIGIBLE', 'NOT_ELIGIBLE', 'PENDING_REVIEW')),
  last_donation_date DATE,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  location GEOGRAPHY(Point, 4326),
  address_city TEXT,
  verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create Requester Profiles Table
CREATE TABLE IF NOT EXISTS public.requester_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone TEXT,
  relationship_to_patient TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  location GEOGRAPHY(Point, 4326),
  verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Create Hospital Profiles Table
CREATE TABLE IF NOT EXISTS public.hospital_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  location GEOGRAPHY(Point, 4326),
  contact TEXT,
  verification_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Create Blood Requests Table
CREATE TABLE IF NOT EXISTS public.blood_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES public.hospital_profiles(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  blood_group TEXT NOT NULL CHECK (blood_group IN ('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-')),
  units_required INT NOT NULL CHECK (units_required > 0),
  units_fulfilled INT NOT NULL DEFAULT 0 CHECK (units_fulfilled <= units_required),
  urgency TEXT NOT NULL DEFAULT 'NORMAL' CHECK (urgency IN ('NORMAL', 'URGENT', 'CRITICAL')),
  required_date DATE NOT NULL,
  required_time TIME,
  hospital_name_text TEXT NOT NULL,
  hospital_address_text TEXT NOT NULL,
  description TEXT,
  requester_phone TEXT NOT NULL,
  requester_relationship TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326),
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (status IN ('DRAFT', 'PENDING_VERIFICATION', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE', 'PARTIALLY_FULFILLED', 'FULFILLED', 'EXPIRED', 'CANCELLED')),
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Create Request Documents Table
CREATE TABLE IF NOT EXISTS public.request_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'HOSPITAL_REQUISITION',
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Create Donor Matches Table
CREATE TABLE IF NOT EXISTS public.donor_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.blood_requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.donor_profiles(id) ON DELETE CASCADE,
  distance_km NUMERIC(6,2) NOT NULL,
  match_score NUMERIC(5,2) DEFAULT 100.0,
  status TEXT NOT NULL DEFAULT 'MATCHED' CHECK (status IN ('MATCHED', 'NOTIFIED', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED')),
  notified_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(request_id, donor_id)
);

-- 9. Create Blood Compatibility Reference Table & Seed Data
CREATE TABLE IF NOT EXISTS public.blood_compatibility (
  id SERIAL PRIMARY KEY,
  donor_blood_group TEXT NOT NULL,
  recipient_blood_group TEXT NOT NULL,
  compatible BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(donor_blood_group, recipient_blood_group)
);

-- Seed Compatibility Data
INSERT INTO public.blood_compatibility (donor_blood_group, recipient_blood_group, compatible) VALUES
  ('O-', 'O-', true), ('O-', 'O+', true), ('O-', 'A-', true), ('O-', 'A+', true), ('O-', 'B-', true), ('O-', 'B+', true), ('O-', 'AB-', true), ('O-', 'AB+', true),
  ('O+', 'O+', true), ('O+', 'A+', true), ('O+', 'B+', true), ('O+', 'AB+', true),
  ('A-', 'A-', true), ('A-', 'A+', true), ('A-', 'AB-', true), ('A-', 'AB+', true),
  ('A+', 'A+', true), ('A+', 'AB+', true),
  ('B-', 'B-', true), ('B-', 'B+', true), ('B-', 'AB-', true), ('B-', 'AB+', true),
  ('B+', 'B+', true), ('B+', 'AB+', true),
  ('AB-', 'AB-', true), ('AB-', 'AB+', true),
  ('AB+', 'AB+', true)
ON CONFLICT (donor_blood_group, recipient_blood_group) DO NOTHING;

-- 10. Security Trigger: Prevent Non-Admins From Escalating Role to 'admin'
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.role = 'admin' AND OLD.role != 'admin') THEN
    IF (auth.jwt() ->> 'role' != 'service_role' AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin'
    )) THEN
      RAISE EXCEPTION 'Unauthorized: Role escalation to admin is prohibited.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_prevent_role_escalation ON public.profiles;
CREATE TRIGGER tr_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- 11. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requester_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donor_matches ENABLE ROW LEVEL SECURITY;

-- 12. RLS Policies
-- PROFILES: Users read own profile or admins read all
CREATE POLICY "Users view own profile or admins view all" ON public.profiles
  FOR SELECT USING (auth.uid() = auth_user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users edit own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- DONOR PROFILES: Donors manage own, admins read all
CREATE POLICY "Donors manage own donor profile" ON public.donor_profiles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = donor_profiles.user_id AND auth_user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin'
  ));

-- REQUESTER PROFILES: Requesters manage own
CREATE POLICY "Requesters manage own profile" ON public.requester_profiles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = requester_profiles.user_id AND auth_user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin'
  ));

-- HOSPITAL PROFILES: Owners manage own, public view verified
CREATE POLICY "Hospital owners manage own profile" ON public.hospital_profiles
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = hospital_profiles.owner_user_id AND auth_user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role = 'admin'
  ));
