-- ============================================================================
-- BloodConnect — Admin Audit Logs & Security RLS Migration
-- Version: 1.3 (Admin Audit Log Trail & Verification Security)
-- ============================================================================

-- 1. Create Admin Audit Logs Table
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for admin_audit_logs (Admins view & insert only; append-only)
DROP POLICY IF EXISTS "Admins view all audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins view all audit logs" ON public.admin_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Admins insert audit logs" ON public.admin_audit_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Secure RLS for Blood Request Approvals by Admins
DROP POLICY IF EXISTS "Admins update blood requests" ON public.blood_requests;
CREATE POLICY "Admins update blood requests" ON public.blood_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE auth_user_id = auth.uid() AND role = 'admin'
    )
  );
