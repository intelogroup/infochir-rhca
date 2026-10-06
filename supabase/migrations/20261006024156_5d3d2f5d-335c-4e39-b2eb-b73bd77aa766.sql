DROP POLICY IF EXISTS "Admins manage journal files" ON storage.objects;
CREATE POLICY "Admins manage journal files"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = ANY (ARRAY['igm-pdfs','rhca-pdfs','atlas-pdfs','igm_covers','rhca_covers','atlas_covers','indexmedicuspdf'])
  AND public.has_role('admin'::public.app_role)
)
WITH CHECK (
  bucket_id = ANY (ARRAY['igm-pdfs','rhca-pdfs','atlas-pdfs','igm_covers','rhca_covers','atlas_covers','indexmedicuspdf'])
  AND public.has_role('admin'::public.app_role)
);