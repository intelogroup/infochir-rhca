
-- Create download_events table to track document downloads
CREATE TABLE IF NOT EXISTS download_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('igm', 'rhca', 'article', 'other')),
  file_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  error_details TEXT,
  user_agent TEXT,
  referrer TEXT,
  screen_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT
);

-- Create index on document_id for faster queries
CREATE INDEX IF NOT EXISTS idx_download_events_document_id ON download_events(document_id);

-- Create index on document_type for analytics
CREATE INDEX IF NOT EXISTS idx_download_events_document_type ON download_events(document_type);

-- Create index on status for filtering successful vs failed downloads
CREATE INDEX IF NOT EXISTS idx_download_events_status ON download_events(status);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_download_events_created_at ON download_events(created_at);

-- Create a function to get download statistics for a specific document
CREATE OR REPLACE FUNCTION get_document_download_stats(doc_id UUID)
RETURNS TABLE (
  total_downloads BIGINT,
  successful_downloads BIGINT,
  failed_downloads BIGINT,
  last_download_time TIMESTAMP WITH TIME ZONE
) LANGUAGE SQL AS $$
  SELECT 
    COUNT(*) AS total_downloads,
    COUNT(*) FILTER (WHERE status = 'success') AS successful_downloads,
    COUNT(*) FILTER (WHERE status = 'failed') AS failed_downloads,
    MAX(created_at) AS last_download_time
  FROM download_events
  WHERE document_id = doc_id;
$$;

-- Create a function to get overall download statistics by document type
CREATE OR REPLACE FUNCTION get_download_stats_by_type(doc_type TEXT)
RETURNS TABLE (
  total_downloads BIGINT,
  successful_downloads BIGINT,
  failed_downloads BIGINT,
  unique_documents BIGINT
) LANGUAGE SQL AS $$
  SELECT 
    COUNT(*) AS total_downloads,
    COUNT(*) FILTER (WHERE status = 'success') AS successful_downloads,
    COUNT(*) FILTER (WHERE status = 'failed') AS failed_downloads,
    COUNT(DISTINCT document_id) AS unique_documents
  FROM download_events
  WHERE document_type = doc_type;
$$;
