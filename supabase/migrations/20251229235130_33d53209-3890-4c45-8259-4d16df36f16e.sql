-- Create a view to aggregate real analytics statistics for admin dashboard
CREATE OR REPLACE VIEW admin_analytics_summary AS
SELECT 
  (SELECT COUNT(*) FROM articles WHERE source = 'RHCA') as total_rhca_articles,
  (SELECT COUNT(*) FROM articles WHERE source = 'IGM') as total_igm_articles,
  (SELECT COUNT(*) FROM articles WHERE source = 'ADC') as total_index_medicus,
  (SELECT COALESCE(SUM(views), 0) FROM articles) as total_views,
  (SELECT COALESCE(SUM(downloads), 0) FROM articles) as total_downloads,
  (SELECT COALESCE(SUM(shares), 0) FROM articles) as total_shares,
  (SELECT COUNT(*) FROM members) as total_members,
  (SELECT COUNT(DISTINCT session_id) FROM user_events WHERE created_at > NOW() - INTERVAL '30 days') as monthly_unique_sessions,
  (SELECT COUNT(*) FROM user_events WHERE event_type = 'view' AND created_at > NOW() - INTERVAL '30 days') as monthly_page_views;

-- Create a view to get popular articles
CREATE OR REPLACE VIEW popular_articles_view AS
SELECT 
  id,
  title,
  source,
  views,
  downloads,
  shares
FROM articles
WHERE status = 'published'
ORDER BY views DESC NULLS LAST
LIMIT 10;

-- Create a view to get daily activity for the last 7 days
CREATE OR REPLACE VIEW daily_activity_view AS
SELECT 
  DATE(created_at) as day,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM user_events
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY day DESC;