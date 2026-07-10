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
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  event_id UUID;
  effective_user_id UUID;
BEGIN
  -- Only trust p_user_id if it matches the authenticated caller.
  -- Never allow spoofing another user's id from an anon/authenticated client.
  IF p_user_id IS NOT NULL AND p_user_id = auth.uid() THEN
    effective_user_id := p_user_id;
  ELSE
    effective_user_id := auth.uid();
  END IF;

  INSERT INTO user_events (
    event_type, document_id, document_type, user_id, event_data,
    session_id, user_agent, referrer, page_url, ip_address
  ) VALUES (
    p_event_type, p_document_id, p_document_type, effective_user_id, p_event_data,
    p_session_id, p_user_agent, p_referrer, p_page_url, p_ip_address
  ) RETURNING id INTO event_id;

  IF p_event_type = 'download' AND p_document_id IS NOT NULL AND p_document_type IS NOT NULL THEN
    INSERT INTO download_events (
      document_id, document_type, file_name, status, error_details,
      user_agent, referrer, screen_size, ip_address
    ) VALUES (
      p_document_id, p_document_type,
      COALESCE((p_event_data->>'fileName')::text, 'unknown.pdf'),
      COALESCE((p_event_data->>'status')::text, 'success'),
      COALESCE((p_event_data->>'error')::text, NULL),
      p_user_agent, p_referrer,
      COALESCE((p_event_data->>'screenSize')::text, NULL),
      p_ip_address
    );

    IF COALESCE((p_event_data->>'status')::text, 'success') = 'success' THEN
      PERFORM increment_count('articles', 'downloads', p_document_id);
    END IF;
  END IF;

  IF p_event_type = 'share' AND p_document_id IS NOT NULL THEN
    PERFORM increment_count('articles', 'shares', p_document_id);
  END IF;

  IF p_event_type = 'view' AND p_document_id IS NOT NULL THEN
    PERFORM increment_count('articles', 'views', p_document_id);
  END IF;

  RETURN event_id;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.track_user_event(text, uuid, text, uuid, jsonb, text, text, text, text, text) TO anon, authenticated;