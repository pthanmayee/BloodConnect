-- ============================================================================
-- BloodConnect — PostGIS Donor Matching Engine Migration
-- Version: 1.4 (Spatial Distance Calculation, Deterministic Scoring & Privacy RPCs)
-- ============================================================================

-- 1. Ensure PostGIS & UUID extensions are active
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Trigger Function: Sync GEOGRAPHY Point from Latitude & Longitude
CREATE OR REPLACE FUNCTION public.sync_location_point()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL) THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_donor_location ON public.donor_profiles;
CREATE TRIGGER tr_sync_donor_location
  BEFORE INSERT OR UPDATE OF latitude, longitude ON public.donor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_location_point();

DROP TRIGGER IF EXISTS tr_sync_request_location ON public.blood_requests;
CREATE TRIGGER tr_sync_request_location
  BEFORE INSERT OR UPDATE OF location ON public.blood_requests
  FOR EACH ROW EXECUTE FUNCTION public.sync_location_point();

-- 3. PostGIS GIST & Filter Indexes
CREATE INDEX IF NOT EXISTS idx_donor_profiles_location_gist ON public.donor_profiles USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_blood_requests_location_gist ON public.blood_requests USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_donor_profiles_matching ON public.donor_profiles (availability_status, verification_status, blood_group);
CREATE INDEX IF NOT EXISTS idx_blood_requests_matching ON public.blood_requests (status, urgency, blood_group);

-- 4. Pure SQL Haversine Fallback Distance Function (Kilometers)
CREATE OR REPLACE FUNCTION public.calculate_haversine_distance_km(
  lat1 NUMERIC, lon1 NUMERIC, lat2 NUMERIC, lon2 NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
  dlat NUMERIC;
  dlon NUMERIC;
  a NUMERIC;
  c NUMERIC;
  r NUMERIC := 6371.0; -- Earth's radius in km
BEGIN
  IF lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN
    RETURN 5.0; -- Safe default distance fallback
  END IF;

  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);

  a := sin(dlat / 2.0)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2.0)^2;
  c := 2.0 * atan2(sqrt(a), sqrt(1.0 - a));

  RETURN ROUND((r * c)::numeric, 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 5. RPC 1: Find Compatible Donors for an Approved Blood Request
-- Returns privacy-safe candidate donors sorted by match_score & distance
CREATE OR REPLACE FUNCTION public.find_compatible_donors_for_request(
  p_request_id UUID,
  p_radius_km NUMERIC DEFAULT 25.0
)
RETURNS TABLE (
  donor_profile_id UUID,
  donor_user_id UUID,
  donor_name TEXT,
  blood_group TEXT,
  distance_km NUMERIC,
  city TEXT,
  match_score NUMERIC,
  availability_status TEXT
) AS $$
DECLARE
  req_record RECORD;
  search_radius NUMERIC := COALESCE(p_radius_km, 25.0);
BEGIN
  -- Fetch target request
  SELECT br.*, p.full_name AS requester_name
  INTO req_record
  FROM public.blood_requests br
  JOIN public.profiles p ON p.id = br.requester_id
  WHERE br.id = p_request_id;

  -- CRITICAL TRUST RULE: Rejects PENDING_VERIFICATION, REJECTED, CANCELLED, EXPIRED
  IF req_record.id IS NULL THEN
    RAISE EXCEPTION 'Blood request not found.';
  END IF;

  IF req_record.status NOT IN ('APPROVED', 'ACTIVE', 'PARTIALLY_FULFILLED') THEN
    RETURN; -- Empty result set for unapproved/closed requests
  END IF;

  RETURN QUERY
  WITH compatible_groups AS (
    SELECT donor_blood_group
    FROM public.blood_compatibility
    WHERE recipient_blood_group = req_record.blood_group AND compatible = true
  ),
  candidate_donors AS (
    SELECT 
      dp.id AS dp_id,
      dp.user_id AS dp_user_id,
      p.full_name AS d_name,
      dp.blood_group AS d_bg,
      dp.address_city AS d_city,
      dp.availability_status AS d_avail,
      dp.created_at AS d_created,
      CASE
        WHEN dp.location IS NOT NULL AND req_record.location IS NOT NULL THEN
          ROUND((ST_Distance(dp.location, req_record.location) / 1000.0)::numeric, 1)
        ELSE
          public.calculate_haversine_distance_km(dp.latitude, dp.longitude, 17.3850, 78.4867)
      END AS calc_distance_km
    FROM public.donor_profiles dp
    JOIN public.profiles p ON p.id = dp.user_id
    WHERE dp.blood_group IN (SELECT donor_blood_group FROM compatible_groups)
      AND dp.availability_status = 'AVAILABLE'
      AND dp.verification_status = 'VERIFIED'
      AND p.account_status = 'ACTIVE'
      -- Exclude donors who already declined or responded to this request
      AND NOT EXISTS (
        SELECT 1 FROM public.donor_matches dm
        WHERE dm.request_id = p_request_id AND dm.donor_id = dp.id AND dm.status IN ('ACCEPTED', 'NOTIFIED', 'DECLINED')
      )
  )
  SELECT 
    cd.dp_id,
    cd.dp_user_id,
    cd.d_name,
    cd.d_bg,
    cd.calc_distance_km,
    COALESCE(cd.d_city, 'Nearby Area'),
    ROUND(
      GREATEST(0.0, 50.0 * (1.0 - (cd.calc_distance_km / search_radius))) +
      (CASE WHEN req_record.urgency = 'CRITICAL' THEN 30.0 WHEN req_record.urgency = 'URGENT' THEN 15.0 ELSE 5.0 END) +
      LEAST(20.0, EXTRACT(EPOCH FROM (now() - req_record.created_at)) / 3600.0),
      1
    ) AS match_score,
    cd.d_avail
  FROM candidate_donors cd
  WHERE cd.calc_distance_km <= search_radius
  ORDER BY match_score DESC, cd.calc_distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC 2: Get Matching Requests for a Donor (Used for Donor Feed)
CREATE OR REPLACE FUNCTION public.get_matching_requests_for_donor(
  p_donor_id UUID,
  p_radius_km NUMERIC DEFAULT 25.0
)
RETURNS TABLE (
  request_id UUID,
  patient_name TEXT,
  blood_group TEXT,
  units_required INT,
  units_fulfilled INT,
  urgency TEXT,
  required_date DATE,
  required_time TIME,
  hospital_name_text TEXT,
  hospital_address_text TEXT,
  description TEXT,
  status TEXT,
  distance_km NUMERIC,
  created_at TIMESTAMPTZ,
  match_status TEXT
) AS $$
DECLARE
  donor_rec RECORD;
  search_radius NUMERIC := COALESCE(p_radius_km, 25.0);
BEGIN
  -- Fetch donor details
  SELECT dp.*, p.verification_status AS u_verif
  INTO donor_rec
  FROM public.donor_profiles dp
  JOIN public.profiles p ON p.id = dp.user_id
  WHERE dp.id = p_donor_id OR dp.user_id = p_donor_id;

  IF donor_rec.id IS NULL THEN
    RAISE EXCEPTION 'Donor profile not found.';
  END IF;

  RETURN QUERY
  WITH compatible_recipients AS (
    SELECT recipient_blood_group
    FROM public.blood_compatibility
    WHERE donor_blood_group = donor_rec.blood_group AND compatible = true
  )
  SELECT 
    br.id,
    br.patient_name,
    br.blood_group,
    br.units_required,
    br.units_fulfilled,
    br.urgency,
    br.required_date,
    br.required_time,
    br.hospital_name_text,
    br.hospital_address_text,
    br.description,
    br.status,
    CASE
      WHEN br.location IS NOT NULL AND donor_rec.location IS NOT NULL THEN
        ROUND((ST_Distance(donor_rec.location, br.location) / 1000.0)::numeric, 1)
      ELSE
        public.calculate_haversine_distance_km(donor_rec.latitude, donor_rec.longitude, 17.3850, 78.4867)
    END AS calc_distance_km,
    br.created_at,
    COALESCE(dm.status, 'MATCHED') AS match_status
  FROM public.blood_requests br
  LEFT JOIN public.donor_matches dm ON dm.request_id = br.id AND dm.donor_id = donor_rec.id
  WHERE br.status IN ('APPROVED', 'ACTIVE', 'PARTIALLY_FULFILLED')
    AND br.blood_group IN (SELECT recipient_blood_group FROM compatible_recipients)
  ORDER BY 
    CASE WHEN br.urgency = 'CRITICAL' THEN 1 WHEN br.urgency = 'URGENT' THEN 2 ELSE 3 END,
    calc_distance_km ASC,
    br.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
