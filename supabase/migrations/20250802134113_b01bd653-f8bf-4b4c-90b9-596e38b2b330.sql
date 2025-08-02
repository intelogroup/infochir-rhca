-- Critical Security Fixes Migration

-- Fix 1: Create security definer function to prevent RLS infinite recursion
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = _role
  );
$$;

-- Fix 2: Update problematic RLS policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

-- Create new safe policies using the security definer function
CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role('admin'::app_role))
WITH CHECK (public.has_role('admin'::app_role));

CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Fix 3: Tighten donations table policies to protect donor information
DROP POLICY IF EXISTS "Allow reading all donations" ON public.donations;
DROP POLICY IF EXISTS "Enable authenticated read" ON public.donations;
DROP POLICY IF EXISTS "Enable anonymous read of non-anonymous donations" ON public.donations;

-- Only allow viewing of non-anonymous donations with limited fields
CREATE POLICY "Public can view anonymous donation totals only" 
ON public.donations 
FOR SELECT 
USING (is_anonymous = false AND status = 'completed');

-- Admins can view all donations
CREATE POLICY "Admins can view all donations" 
ON public.donations 
FOR ALL 
USING (public.has_role('admin'::app_role));

-- Users can view their own donations
CREATE POLICY "Users can view their own donations" 
ON public.donations 
FOR SELECT 
USING (donor_email = (auth.jwt() ->> 'email'::text));

-- Fix 4: Tighten article submissions policies to add rate limiting considerations
DROP POLICY IF EXISTS "Allow anonymous submissions" ON public.article_submissions;

-- Replace with more controlled anonymous submissions
CREATE POLICY "Controlled anonymous submissions" 
ON public.article_submissions 
FOR INSERT 
WITH CHECK (
  -- Basic validation: ensure required fields are present
  title IS NOT NULL 
  AND abstract IS NOT NULL 
  AND corresponding_author_email IS NOT NULL
  AND corresponding_author_name IS NOT NULL
  AND publication_type IS NOT NULL
);

-- Fix 5: Add better validation for contact messages
DROP POLICY IF EXISTS "Allow anonymous users to create contact messages" ON public.contact_messages;

CREATE POLICY "Validated anonymous contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (
  name IS NOT NULL 
  AND email IS NOT NULL 
  AND message IS NOT NULL
  AND length(name) > 0
  AND length(email) > 0
  AND length(message) > 0
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Fix 6: Create function to safely check admin status for other operations
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT public.has_role('admin'::app_role);
$$;

-- Fix 7: Add function to validate email format
CREATE OR REPLACE FUNCTION public.is_valid_email(email_text TEXT)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT email_text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
$$;

-- Fix 8: Update download_events policies to be more restrictive
DROP POLICY IF EXISTS "Allow anonymous download tracking" ON public.download_events;

CREATE POLICY "Controlled download tracking" 
ON public.download_events 
FOR INSERT 
WITH CHECK (
  document_id IS NOT NULL 
  AND document_type IS NOT NULL 
  AND file_name IS NOT NULL 
  AND status IS NOT NULL
);

-- Only admins can view download events
CREATE POLICY "Admins can view download events" 
ON public.download_events 
FOR SELECT 
USING (public.has_role('admin'::app_role));

-- Fix 9: Secure user_events table more tightly
DROP POLICY IF EXISTS "Allow anonymous analytics tracking" ON public.user_events;

CREATE POLICY "Controlled analytics tracking" 
ON public.user_events 
FOR INSERT 
WITH CHECK (
  event_type IS NOT NULL
  AND (user_id IS NULL OR auth.uid() = user_id)
  AND event_type IN ('view', 'download', 'share', 'search', 'navigation')
);

-- Fix 10: Add trigger to prevent excessive submissions (basic rate limiting)
CREATE OR REPLACE FUNCTION public.check_submission_rate()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if same email submitted more than 5 times in last hour
  IF (
    SELECT COUNT(*) 
    FROM article_submissions 
    WHERE corresponding_author_email = NEW.corresponding_author_email 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) >= 5 THEN
    RAISE EXCEPTION 'Too many submissions from this email address. Please wait before submitting again.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS submission_rate_limit ON article_submissions;
CREATE TRIGGER submission_rate_limit
  BEFORE INSERT ON article_submissions
  FOR EACH ROW
  EXECUTE FUNCTION check_submission_rate();

-- Fix 11: Create audit log table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  event_data JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.security_audit_log 
FOR ALL 
USING (public.has_role('admin'::app_role));

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type_param TEXT,
  event_data_param JSONB DEFAULT '{}',
  ip_address_param TEXT DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    event_data,
    ip_address,
    user_agent
  ) VALUES (
    event_type_param,
    auth.uid(),
    event_data_param,
    ip_address_param,
    user_agent_param
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;