CREATE OR REPLACE FUNCTION public.get_public_download_stats()
RETURNS TABLE (total_downloads bigint, successful_downloads bigint, failed_downloads bigint, document_types_stats jsonb)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*)::bigint AS total_downloads,
    COUNT(*) FILTER (WHERE status = 'success')::bigint AS successful_downloads,
    COUNT(*) FILTER (WHERE status <> 'success')::bigint AS failed_downloads,
    COALESCE(
      (SELECT jsonb_object_agg(document_type, cnt)
       FROM (SELECT document_type, COUNT(*) AS cnt FROM download_events GROUP BY document_type) t),
      '{}'::jsonb
    ) AS document_types_stats
  FROM download_events;
$$;

REVOKE ALL ON FUNCTION public.get_public_download_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_download_stats() TO anon, authenticated, service_role;