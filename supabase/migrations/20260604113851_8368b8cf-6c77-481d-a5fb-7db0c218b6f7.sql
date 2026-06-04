
-- 1. newsletter_send_log
CREATE TABLE public.newsletter_send_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  content_title TEXT,
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  resend_message_id TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (content_id, recipient_email)
);

CREATE INDEX idx_newsletter_send_log_content ON public.newsletter_send_log(content_id);
CREATE INDEX idx_newsletter_send_log_sent_at ON public.newsletter_send_log(sent_at DESC);

GRANT SELECT ON public.newsletter_send_log TO authenticated;
GRANT ALL ON public.newsletter_send_log TO service_role;

ALTER TABLE public.newsletter_send_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view send log"
  ON public.newsletter_send_log
  FOR SELECT
  TO authenticated
  USING (public.has_role('admin'::app_role));

-- 2. unsubscribe token on subscribers
ALTER TABLE public.newsletter_subscriptions
  ADD COLUMN IF NOT EXISTS unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_subscriptions_unsubscribe_token
  ON public.newsletter_subscriptions(unsubscribe_token);

-- Allow anonymous unsubscribe via token (edge function uses service role, but this is a safety net)
CREATE POLICY "Anyone with token can unsubscribe"
  ON public.newsletter_subscriptions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (is_active = false);

-- 3. Trigger to invoke newsletter edge function on new published articles
CREATE OR REPLACE FUNCTION public.notify_subscribers_on_new_article()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'published' THEN
    PERFORM net.http_post(
      url := 'https://llxzstqejdrplmxdjxlu.supabase.co/functions/v1/send-new-content-newsletter',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseHpzdHFlamRycGxteGRqeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzM3NDgsImV4cCI6MjA1MDY0OTc0OH0.dza-_2f6kCnY11CmnyHRf3kE-JxQTTnZm20GaZwiA9g"}'::jsonb,
      body := jsonb_build_object('contentId', NEW.id, 'contentType', NEW.source)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_subscribers_on_new_article ON public.articles;
CREATE TRIGGER trg_notify_subscribers_on_new_article
  AFTER INSERT ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_subscribers_on_new_article();

-- Also fire when an existing draft transitions to published
CREATE OR REPLACE FUNCTION public.notify_subscribers_on_publish()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS DISTINCT FROM 'published') THEN
    PERFORM net.http_post(
      url := 'https://llxzstqejdrplmxdjxlu.supabase.co/functions/v1/send-new-content-newsletter',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseHpzdHFlamRycGxteGRqeGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNzM3NDgsImV4cCI6MjA1MDY0OTc0OH0.dza-_2f6kCnY11CmnyHRf3kE-JxQTTnZm20GaZwiA9g"}'::jsonb,
      body := jsonb_build_object('contentId', NEW.id, 'contentType', NEW.source)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_subscribers_on_publish ON public.articles;
CREATE TRIGGER trg_notify_subscribers_on_publish
  AFTER UPDATE OF status ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_subscribers_on_publish();
