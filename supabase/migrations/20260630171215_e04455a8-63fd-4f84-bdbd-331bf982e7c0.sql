
DROP POLICY IF EXISTS "Authenticated users can read members" ON public.members;
CREATE POLICY "Admins can read full member records"
  ON public.members FOR SELECT TO authenticated
  USING (public.has_role('admin'::public.app_role));

DROP POLICY IF EXISTS "Users can create submissions" ON public.article_submissions;
CREATE POLICY "Users can create submissions"
  ON public.article_submissions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
CREATE POLICY "Admins can download article submissions"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'article_submissions' AND public.has_role('admin'::public.app_role));

DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Authenticated users can upload article submissions"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'article_submissions');

DROP POLICY IF EXISTS "Public Upload for Article Files" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload for Article Annexes" ON storage.objects;

DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files in user buckets"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    auth.uid() = owner
    AND bucket_id = ANY (ARRAY[
      'article_files','article_annexes','article_covers','avatars',
      'annuaire_profile_pics','article_submissions'
    ])
  );
