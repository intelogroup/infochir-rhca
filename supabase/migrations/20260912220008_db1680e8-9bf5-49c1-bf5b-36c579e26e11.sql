
-- 1) Members: remove the broad authenticated read; admins keep full access via existing admin policy
DROP POLICY IF EXISTS "Authenticated users can read member records" ON public.members;

-- 2) Articles: remove unconditional public read policies that bypass the status='published' filter
DROP POLICY IF EXISTS "Allow public read access" ON public.articles;
DROP POLICY IF EXISTS "Allow public read access to articles" ON public.articles;
DROP POLICY IF EXISTS "Articles are viewable by everyone" ON public.articles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.articles;

-- Authors can read their own articles (including drafts)
CREATE POLICY "Authors can read their own articles"
ON public.articles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can read all articles
CREATE POLICY "Admins can read all articles"
ON public.articles
FOR SELECT
TO authenticated
USING (public.has_role('admin'::app_role));

-- 3) Storage: drop the loose UPDATE policies on article_files / article_annexes.
--    The stricter "Owner Update for Article Files/Annexes" policies (owner = auth.uid()) remain.
DROP POLICY IF EXISTS "Allow users to update their article files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their article annexes" ON storage.objects;

-- 4) Avatars: tie uploads to the requesting user
DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND owner = auth.uid());
