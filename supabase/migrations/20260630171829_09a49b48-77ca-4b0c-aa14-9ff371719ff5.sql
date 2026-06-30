
-- article_authors
DROP POLICY IF EXISTS "Allow authenticated users to insert article_authors" ON public.article_authors;
CREATE POLICY "Allow authenticated users to insert article_authors"
  ON public.article_authors FOR INSERT TO authenticated
  WITH CHECK (article_id IS NOT NULL AND member_id IS NOT NULL);

-- contact_messages
DROP POLICY IF EXISTS "Allow anonymous users to create contact messages" ON public.contact_messages;
CREATE POLICY "Allow anonymous users to create contact messages"
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) > 0 AND length(btrim(name)) <= 200
    AND public.is_valid_email(email)
    AND length(btrim(message)) > 0 AND length(message) <= 5000
  );

-- donations (consolidate 3 duplicates)
DROP POLICY IF EXISTS "Anyone can create a donation" ON public.donations;
DROP POLICY IF EXISTS "Enable anonymous insert" ON public.donations;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.donations;
CREATE POLICY "Anyone can create a donation"
  ON public.donations FOR INSERT TO anon, authenticated
  WITH CHECK (amount > 0 AND amount <= 1000000 AND currency IS NOT NULL AND length(currency) BETWEEN 3 AND 8);

-- download_events (consolidate 2 duplicates)
DROP POLICY IF EXISTS "Allow anonymous download event tracking" ON public.download_events;
DROP POLICY IF EXISTS "Allow anonymous users to insert download events" ON public.download_events;
CREATE POLICY "Allow anonymous users to insert download events"
  ON public.download_events FOR INSERT TO anon, authenticated
  WITH CHECK (
    document_id IS NOT NULL
    AND document_type IS NOT NULL AND length(document_type) <= 50
    AND file_name IS NOT NULL AND length(file_name) <= 500
    AND status IS NOT NULL AND status IN ('success','failed','pending')
  );

-- error_events
DROP POLICY IF EXISTS "Allow anonymous insert on error_events" ON public.error_events;
CREATE POLICY "Allow anonymous insert on error_events"
  ON public.error_events FOR INSERT TO anon, authenticated
  WITH CHECK (
    session_id IS NOT NULL AND length(session_id) <= 100
    AND error_type IS NOT NULL AND length(error_type) <= 100
    AND message IS NOT NULL AND length(message) <= 5000
    AND url IS NOT NULL AND length(url) <= 2000
  );

-- newsletter_subscriptions (consolidate 2 duplicates + tighten unsubscribe)
DROP POLICY IF EXISTS "Allow public newsletter subscription" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscriptions FOR INSERT TO anon, authenticated
  WITH CHECK (public.is_valid_email(email));

DROP POLICY IF EXISTS "Anyone with token can unsubscribe" ON public.newsletter_subscriptions;
CREATE POLICY "Anyone with token can unsubscribe"
  ON public.newsletter_subscriptions FOR UPDATE TO anon, authenticated
  USING (unsubscribe_token IS NOT NULL)
  WITH CHECK (is_active = false);

-- performance_metrics
DROP POLICY IF EXISTS "Allow anonymous insert on performance_metrics" ON public.performance_metrics;
CREATE POLICY "Allow anonymous insert on performance_metrics"
  ON public.performance_metrics FOR INSERT TO anon, authenticated
  WITH CHECK (
    session_id IS NOT NULL AND length(session_id) <= 100
    AND page_url IS NOT NULL AND length(page_url) <= 2000
  );
