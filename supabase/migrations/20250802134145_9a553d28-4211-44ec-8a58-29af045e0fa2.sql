-- Critical Security Fixes Migration (Corrected)

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
-- Drop and recreate all user_roles policies to ensure clean state
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

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
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;

-- Only allow viewing of non-anonymous donations with limited fields
CREATE POLICY "Public can view completed non-anonymous donations" 
ON public.donations 
FOR SELECT 
USING (is_anonymous = false AND status = 'completed');

-- Admins can view all donations
CREATE POLICY "Admins can view all donations" 
ON public.donations 
FOR ALL 
USING (public.has_role('admin'::app_role));

-- Users can view their own donations
CREATE POLICY "Users can view own donations" 
ON public.donations 
FOR SELECT 
USING (donor_email = (auth.jwt() ->> 'email'::text));

-- Fix 4: Create function to safely check admin status for other operations
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT public.has_role('admin'::app_role);
$$;

-- Fix 5: Add function to validate email format
CREATE OR REPLACE FUNCTION public.is_valid_email(email_text TEXT)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT email_text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
$$;

-- Fix 6: Create audit log table for security events
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

-- Drop existing policy if it exists and create new one
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.security_audit_log;
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