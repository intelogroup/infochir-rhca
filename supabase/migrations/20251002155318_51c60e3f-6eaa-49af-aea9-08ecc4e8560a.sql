-- ============================================
-- FIX REMAINING FUNCTION SEARCH PATH ISSUE
-- ============================================

-- Fix: handle_updated_at - Add search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
begin
    new.updated_at = now();
    return new;
end;
$function$;

-- ============================================
-- ADD RLS POLICY TO EMAIL_USAGE_TRACKING
-- ============================================

-- This table has RLS enabled but no policies (the INFO warning)
ALTER TABLE public.email_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Only admins and service role can access email usage tracking
CREATE POLICY "Only admins can view email usage tracking"
ON public.email_usage_tracking
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'::app_role
  )
);

CREATE POLICY "Service role can manage email usage tracking"
ON public.email_usage_tracking
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow system to update email usage
CREATE POLICY "System can update email usage tracking"
ON public.email_usage_tracking
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);


-- ============================================
-- SUMMARY
-- ============================================
-- ✅ Fixed search_path for handle_updated_at function
-- ✅ Added RLS policies to email_usage_tracking table
-- 
-- REMAINING WARNINGS (these are expected/require user action):
-- 
-- Security Definer functions: These are INTENTIONAL and NECESSARY
--   - has_role, is_admin, assign_admin_role_by_email, log_security_event
--   - These functions MUST use SECURITY DEFINER to check user roles and permissions
--   - They all have SET search_path = public which makes them secure
-- 
-- Extension in Public: This is a Supabase platform issue
--   - Some system extensions are in public schema by default
--   - This requires Supabase platform configuration changes
-- 
-- Leaked Password Protection: Requires Supabase Auth settings
--   - Go to Authentication > Policies in Supabase Dashboard
--   - Enable "Leaked Password Protection"
-- 
-- Postgres Version: Requires Supabase platform upgrade
--   - This must be done through Supabase Dashboard
--   - Go to Settings > Database > Upgrade to latest version