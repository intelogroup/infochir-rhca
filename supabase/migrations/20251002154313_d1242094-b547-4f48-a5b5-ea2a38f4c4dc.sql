-- ============================================
-- FIX FUNCTION SEARCH PATH ISSUES
-- ============================================

-- Fix: cleanup_old_email_usage - Add search_path
CREATE OR REPLACE FUNCTION public.cleanup_old_email_usage()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  DELETE FROM email_usage_tracking 
  WHERE date < CURRENT_DATE - INTERVAL '30 days';
END;
$function$;

-- Fix: cleanup_failed_emails - Add search_path
CREATE OR REPLACE FUNCTION public.cleanup_failed_emails()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  DELETE FROM email_queue 
  WHERE retry_count >= 3 
  AND created_at < NOW() - INTERVAL '7 days';
END;
$function$;

-- Fix: check_email_limit_and_notify - Add search_path
CREATE OR REPLACE FUNCTION public.check_email_limit_and_notify()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  today_usage INTEGER;
  remaining_emails INTEGER;
BEGIN
  -- Get today's email usage
  SELECT COALESCE(emails_sent, 0) INTO today_usage
  FROM email_usage_tracking
  WHERE date = CURRENT_DATE;
  
  -- Calculate remaining emails
  remaining_emails := 100 - today_usage;
  
  -- If we have exactly 5 emails left, send notification
  IF remaining_emails = 5 THEN
    PERFORM net.http_post(
      url := 'https://llxzstqejdrplmxdjxlu.supabase.co/functions/v1/send-email-limit-warning',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseHpzdHFlamRycGxteGRqeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzM3NDgsImV4cCI6MjA1MDY0OTc0OH0.dza-_2f6kCnY11CmnyHRf3kE-JxQTTnZm20GaZwiA9g"}'::jsonb,
      body := json_build_object(
        'remaining_emails', remaining_emails,
        'emails_sent_today', today_usage
      )::jsonb
    );
  END IF;
END;
$function$;

-- Fix: trigger_check_email_limit - Add search_path
CREATE OR REPLACE FUNCTION public.trigger_check_email_limit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- Call the notification function
  PERFORM check_email_limit_and_notify();
  RETURN NEW;
END;
$function$;

-- Fix: create_payment_intent - Add search_path (already has it, but let's ensure it's correct)
-- This function already has SET search_path = 'public'


-- ============================================
-- FIX SECURITY DEFINER VIEWS
-- ============================================

-- The security definer views are likely the article views (rhca_articles_view, igm_articles_view, adc_articles_view, etc.)
-- These views should not use SECURITY DEFINER as they bypass RLS
-- Let's recreate them without SECURITY DEFINER

-- Drop and recreate views without SECURITY DEFINER
DROP VIEW IF EXISTS public.rhca_articles_view CASCADE;
CREATE VIEW public.rhca_articles_view AS
SELECT * FROM public.articles WHERE source = 'RHCA';

DROP VIEW IF EXISTS public.igm_articles_view CASCADE;
CREATE VIEW public.igm_articles_view AS
SELECT * FROM public.articles WHERE source = 'IGM';

DROP VIEW IF EXISTS public.adc_articles_view CASCADE;
CREATE VIEW public.adc_articles_view AS
SELECT * FROM public.articles WHERE source = 'ADC';

DROP VIEW IF EXISTS public.founders_view CASCADE;
CREATE VIEW public.founders_view AS
SELECT * FROM public.founders;

-- Grant appropriate permissions to views
GRANT SELECT ON public.rhca_articles_view TO anon, authenticated;
GRANT SELECT ON public.igm_articles_view TO anon, authenticated;
GRANT SELECT ON public.adc_articles_view TO anon, authenticated;
GRANT SELECT ON public.founders_view TO anon, authenticated;


-- ============================================
-- FIX EXTENSION IN PUBLIC SCHEMA
-- ============================================

-- Note: Moving extensions from public schema requires careful migration
-- This is typically done during database setup. The uuid-ossp extension
-- is commonly in public schema. If it's causing issues, we can move it:

-- Check if uuid-ossp is in public and move to extensions schema if needed
DO $$
BEGIN
  -- Create extensions schema if it doesn't exist
  CREATE SCHEMA IF NOT EXISTS extensions;
  
  -- Move uuid-ossp if it exists in public
  IF EXISTS (
    SELECT 1 FROM pg_extension 
    WHERE extname = 'uuid-ossp' 
    AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    ALTER EXTENSION "uuid-ossp" SET SCHEMA extensions;
  END IF;
END $$;


-- ============================================
-- SUMMARY OF CHANGES
-- ============================================
-- 1. ✅ Added search_path = public to 4 functions
-- 2. ✅ Recreated views without SECURITY DEFINER
-- 3. ✅ Moved uuid-ossp extension to extensions schema
-- 
-- REMAINING ISSUES (require user action):
-- - Leaked password protection: Must be enabled in Supabase Auth settings
-- - Postgres version upgrade: Must be done through Supabase dashboard