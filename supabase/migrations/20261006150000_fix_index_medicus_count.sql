-- total_index_medicus counted source='ADC'; Index Medicus rows use source='INDEX'.
CREATE OR REPLACE VIEW public.admin_analytics_summary AS
SELECT
  (SELECT COUNT(*) FROM articles WHERE source = 'RHCA') AS total_rhca_articles,
  (SELECT COUNT(*) FROM articles WHERE source = 'IGM') AS total_igm_articles,
  (SELECT COUNT(*) FROM articles WHERE source = 'INDEX') AS total_index_medicus,
  (SELECT COALESCE(SUM(views), 0) FROM articles) AS total_views,
  (SELECT COALESCE(SUM(downloads), 0) FROM articles) AS total_downloads,
  (SELECT COALESCE(SUM(shares), 0) FROM articles) AS total_shares,
  (SELECT COUNT(*) FROM members) AS total_members,
  (SELECT COUNT(DISTINCT session_id) FROM user_events WHERE created_at > NOW() - INTERVAL '30 days') AS monthly_unique_sessions,
  (SELECT COUNT(*) FROM user_events WHERE event_type = 'view' AND created_at > NOW() - INTERVAL '30 days') AS monthly_page_views;

ALTER VIEW public.admin_analytics_summary SET (security_invoker = true);
