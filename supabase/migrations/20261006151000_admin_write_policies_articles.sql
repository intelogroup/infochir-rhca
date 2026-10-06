-- Admins could not edit/delete articles they did not author (uploader rows have user_id NULL),
-- and the create form's inserts were rejected without user_id.
CREATE POLICY "Admins can insert articles"
ON public.articles FOR INSERT TO authenticated
WITH CHECK (public.has_role('admin'::app_role));

CREATE POLICY "Admins can update articles"
ON public.articles FOR UPDATE TO authenticated
USING (public.has_role('admin'::app_role))
WITH CHECK (public.has_role('admin'::app_role));

CREATE POLICY "Admins can delete articles"
ON public.articles FOR DELETE TO authenticated
USING (public.has_role('admin'::app_role));
