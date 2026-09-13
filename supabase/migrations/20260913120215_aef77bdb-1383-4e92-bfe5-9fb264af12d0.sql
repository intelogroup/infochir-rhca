
-- Only published rows are publicly readable; admins see everything
DROP POLICY IF EXISTS "Allow public read access" ON public.unified_content;

CREATE POLICY "Public can read published content"
ON public.unified_content FOR SELECT
USING (status = 'published' OR public.has_role('admin'::app_role));

-- Scope uploads to the uploading user
DROP POLICY IF EXISTS "Authenticated can upload article annexes" ON storage.objects;
CREATE POLICY "Authenticated can upload article annexes"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'article_annexes' AND owner = auth.uid());

DROP POLICY IF EXISTS "Authenticated can upload article files" ON storage.objects;
CREATE POLICY "Authenticated can upload article files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'article_files' AND owner = auth.uid());

DROP POLICY IF EXISTS "Authenticated users can upload article submissions" ON storage.objects;
CREATE POLICY "Authenticated users can upload article submissions"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'article_submissions' AND owner = auth.uid());
