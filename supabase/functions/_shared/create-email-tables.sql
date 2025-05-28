
-- Email usage tracking table
CREATE TABLE IF NOT EXISTS email_usage_tracking (
  date DATE PRIMARY KEY,
  emails_sent INTEGER DEFAULT 0,
  successful_sends INTEGER DEFAULT 0,
  failed_sends INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email queue table for delayed/retry emails
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  email_type TEXT CHECK (email_type IN ('user_confirmation', 'admin_notification', 'admin_secondary')) NOT NULL,
  submission_id UUID,
  reply_to TEXT,
  retry_count INTEGER DEFAULT 0,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient queue processing
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON email_queue(scheduled_for, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_retry ON email_queue(retry_count);

-- Function to clean up old successful email usage records (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_email_usage() 
RETURNS void AS $$
BEGIN
  DELETE FROM email_usage_tracking 
  WHERE date < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old queued emails that have failed too many times
CREATE OR REPLACE FUNCTION cleanup_failed_emails() 
RETURNS void AS $$
BEGIN
  DELETE FROM email_queue 
  WHERE retry_count >= 3 
  AND created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your setup)
-- These will need to be run by a superuser or database owner
-- ALTER TABLE email_usage_tracking ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
