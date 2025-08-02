-- Fix remaining security issues from linter

-- Fix function search_path security issues by setting proper search path
-- Update all existing functions to have secure search_path

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = _role
  );
$$;

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT public.has_role('admin'::app_role);
$$;

-- Fix is_valid_email function
CREATE OR REPLACE FUNCTION public.is_valid_email(email_text TEXT)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = 'public'
AS $$
  SELECT email_text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
$$;

-- Fix log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type_param TEXT,
  event_data_param JSONB DEFAULT '{}',
  ip_address_param TEXT DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- Fix existing functions to have secure search_path
CREATE OR REPLACE FUNCTION public.assign_admin_role_by_email(_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Find user by email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = _email;
    
    IF target_user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN true;
END;
$$;

-- Fix other critical functions
CREATE OR REPLACE FUNCTION public.track_user_event(
  p_event_type text, 
  p_document_id uuid DEFAULT NULL::uuid, 
  p_document_type text DEFAULT NULL::text, 
  p_user_id uuid DEFAULT NULL::uuid, 
  p_event_data jsonb DEFAULT '{}'::jsonb, 
  p_session_id text DEFAULT NULL::text, 
  p_user_agent text DEFAULT NULL::text, 
  p_referrer text DEFAULT NULL::text, 
  p_page_url text DEFAULT NULL::text, 
  p_ip_address text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO user_events (
    event_type, 
    document_id, 
    document_type, 
    user_id, 
    event_data, 
    session_id, 
    user_agent, 
    referrer, 
    page_url, 
    ip_address
  ) VALUES (
    p_event_type, 
    p_document_id, 
    p_document_type, 
    p_user_id, 
    p_event_data, 
    p_session_id, 
    p_user_agent, 
    p_referrer, 
    p_page_url, 
    p_ip_address
  ) RETURNING id INTO event_id;
  
  -- If it's a download event, also record in download_events for backward compatibility
  IF p_event_type = 'download' AND p_document_id IS NOT NULL AND p_document_type IS NOT NULL THEN
    INSERT INTO download_events (
      document_id,
      document_type,
      file_name,
      status,
      error_details,
      user_agent,
      referrer,
      screen_size,
      ip_address
    ) VALUES (
      p_document_id,
      p_document_type,
      COALESCE((p_event_data->>'fileName')::text, 'unknown.pdf'),
      COALESCE((p_event_data->>'status')::text, 'success'),
      COALESCE((p_event_data->>'error')::text, NULL),
      p_user_agent,
      p_referrer,
      COALESCE((p_event_data->>'screenSize')::text, NULL),
      p_ip_address
    );
    
    -- Also update the download count in the articles table if needed
    IF COALESCE((p_event_data->>'status')::text, 'success') = 'success' THEN
      PERFORM increment_count('articles', 'downloads', p_document_id);
    END IF;
  END IF;
  
  -- If it's a share event, update the shares count in the articles table
  IF p_event_type = 'share' AND p_document_id IS NOT NULL THEN
    PERFORM increment_count('articles', 'shares', p_document_id);
  END IF;
  
  -- If it's a view event, update the views count in the articles table
  IF p_event_type = 'view' AND p_document_id IS NOT NULL THEN
    PERFORM increment_count('articles', 'views', p_document_id);
  END IF;
  
  RETURN event_id;
END;
$$;

-- Fix increment_count function
CREATE OR REPLACE FUNCTION public.increment_count(table_name text, column_name text, row_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  EXECUTE format(
    'UPDATE %I SET %I = COALESCE(%I, 0) + 1 WHERE id = $1',
    table_name,
    column_name,
    column_name
  ) USING row_id;
END;
$$;

-- Fix other functions with search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_collection_counts()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE unified_collections
        SET article_count = article_count + 1
        WHERE volume = NEW.volume 
        AND issue = NEW.issue 
        AND source = NEW.source;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE unified_collections
        SET article_count = article_count - 1
        WHERE volume = OLD.volume 
        AND issue = OLD.issue 
        AND source = OLD.source;
    END IF;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_download_stats_monitoring()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  -- Update the stats for the specific document type
  INSERT INTO download_stats_monitoring (document_type, status, count, latest_download)
  VALUES (NEW.document_type, NEW.status, 1, NEW.created_at)
  ON CONFLICT (document_type, status) 
  DO UPDATE SET 
    count = download_stats_monitoring.count + 1,
    latest_download = GREATEST(download_stats_monitoring.latest_download, NEW.created_at);

  RETURN NEW;
END;
$$;