-- Add RLS policies for unified_content table to enable full CRUD for admins

-- INSERT policy for admins
CREATE POLICY "Admins can insert content"
ON public.unified_content
FOR INSERT
TO authenticated
WITH CHECK (public.has_role('admin'::app_role));

-- UPDATE policy for admins
CREATE POLICY "Admins can update content"
ON public.unified_content
FOR UPDATE
TO authenticated
USING (public.has_role('admin'::app_role))
WITH CHECK (public.has_role('admin'::app_role));

-- DELETE policy for admins
CREATE POLICY "Admins can delete content"
ON public.unified_content
FOR DELETE
TO authenticated
USING (public.has_role('admin'::app_role));