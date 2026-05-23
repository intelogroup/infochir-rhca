
-- 1. annuaire_profile_pics: replace ALL-public policy
DROP POLICY IF EXISTS "Give public access to annuaire_profile_pics" ON storage.objects;
CREATE POLICY "Public can view annuaire profile pics"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'annuaire_profile_pics');
CREATE POLICY "Authenticated can upload annuaire profile pics"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'annuaire_profile_pics' AND owner = auth.uid());
CREATE POLICY "Owners can update annuaire profile pics"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'annuaire_profile_pics' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'annuaire_profile_pics' AND owner = auth.uid());
CREATE POLICY "Owners can delete annuaire profile pics"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'annuaire_profile_pics' AND owner = auth.uid());

-- 2. article_files / article_annexes: remove anonymous/public INSERTs
DROP POLICY IF EXISTS "Allow public uploads to article annexes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to article_annexes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to article_annexes" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to article_files" ON storage.objects;
CREATE POLICY "Authenticated can upload article annexes"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'article_annexes');
CREATE POLICY "Authenticated can upload article files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'article_files');

-- 3. article_submissions: disable anonymous submissions
DROP POLICY IF EXISTS "Allow anonymous submissions" ON public.article_submissions;

-- 4. newsletter_subscriptions: restrict to admins
DROP POLICY IF EXISTS "Allow authenticated users to view subscriptions" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Authenticated users can view subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Only admins can view newsletter subscriptions"
  ON public.newsletter_subscriptions FOR SELECT TO authenticated
  USING (has_role('admin'::app_role));

-- 5. download_stats_monitoring: restrict UPDATE
DROP POLICY IF EXISTS "Authenticated users can update download stats" ON public.download_stats_monitoring;
CREATE POLICY "Only admins can update download stats"
  ON public.download_stats_monitoring FOR UPDATE TO authenticated
  USING (has_role('admin'::app_role))
  WITH CHECK (has_role('admin'::app_role));

-- 6. email_usage_tracking: restrict UPDATE
DROP POLICY IF EXISTS "System can update email usage tracking" ON public.email_usage_tracking;

-- 7. Remove sensitive tables from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.donations;
ALTER PUBLICATION supabase_realtime DROP TABLE public.article_submissions;
ALTER PUBLICATION supabase_realtime DROP TABLE public.contact_messages;
ALTER PUBLICATION supabase_realtime DROP TABLE public.error_events;
ALTER PUBLICATION supabase_realtime DROP TABLE public.download_events;
ALTER PUBLICATION supabase_realtime DROP TABLE public.download_stats_monitoring;
