
-- Tighten table privileges (anon/authenticated currently hold ALL privileges)
REVOKE ALL ON public.members FROM anon, authenticated;
REVOKE ALL ON public.article_authors FROM anon, authenticated;
REVOKE ALL ON public.members_public_view FROM anon, authenticated;

GRANT SELECT ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;

GRANT SELECT ON public.article_authors TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.article_authors TO authenticated;
GRANT ALL ON public.article_authors TO service_role;

GRANT SELECT ON public.members_public_view TO anon, authenticated;
GRANT SELECT ON public.members_public_view TO service_role;

-- De-duplicate the identical public read policies on article_authors
DROP POLICY IF EXISTS "Allow public read access to article authors" ON public.article_authors;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.article_authors;

-- Restrict authorship writes to admins only
DROP POLICY IF EXISTS "Allow authenticated users to insert article_authors" ON public.article_authors;

CREATE POLICY "Admins can insert article_authors"
ON public.article_authors FOR INSERT TO authenticated
WITH CHECK (public.has_role('admin'::app_role));

CREATE POLICY "Admins can update article_authors"
ON public.article_authors FOR UPDATE TO authenticated
USING (public.has_role('admin'::app_role))
WITH CHECK (public.has_role('admin'::app_role));

CREATE POLICY "Admins can delete article_authors"
ON public.article_authors FOR DELETE TO authenticated
USING (public.has_role('admin'::app_role));
