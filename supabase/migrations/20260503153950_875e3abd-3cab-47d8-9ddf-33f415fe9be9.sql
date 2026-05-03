
-- 1) Restrict members table to authenticated users only (drop public SELECT policy)
DROP POLICY IF EXISTS "Public read access to members" ON public.members;

CREATE POLICY "Authenticated users can read members"
ON public.members
FOR SELECT
TO authenticated
USING (true);

-- members_public_view (id, name, titre, avatar_url, created_at) keeps its definer-like
-- behavior so anon visitors can still see basic directory info without contacts.
GRANT SELECT ON public.members_public_view TO anon, authenticated;

-- 2) Restrict storage PDF mutations on shared buckets to admins
DROP POLICY IF EXISTS "Authenticated Atlas Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Atlas Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Atlas Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated IGM Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated IGM Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated IGM Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated RHCA Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated RHCA Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated RHCA Delete" ON storage.objects;
DROP POLICY IF EXISTS "Enable updates to rhca-pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Enable uploads to rhca-pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Give public access to PDFs" ON storage.objects;

CREATE POLICY "Admins can upload journal PDFs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('igm-pdfs','atlas-pdfs','rhca-pdfs')
  AND public.has_role('admin'::public.app_role)
);

CREATE POLICY "Admins can update journal PDFs"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id IN ('igm-pdfs','atlas-pdfs','rhca-pdfs')
  AND public.has_role('admin'::public.app_role)
)
WITH CHECK (
  bucket_id IN ('igm-pdfs','atlas-pdfs','rhca-pdfs')
  AND public.has_role('admin'::public.app_role)
);

CREATE POLICY "Admins can delete journal PDFs"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id IN ('igm-pdfs','atlas-pdfs','rhca-pdfs')
  AND public.has_role('admin'::public.app_role)
);

-- 3) Drop overly-permissive articles INSERT policies; keep ownership-bound ones
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.articles;
DROP POLICY IF EXISTS "Allow authenticated users to insert articles" ON public.articles;

-- 4) Pin search_path on the remaining mutable function
ALTER FUNCTION public.get_document_events(uuid, text[]) SET search_path = public;

-- 5) Convert remaining views to security_invoker so they respect caller RLS.
-- members_public_view is intentionally left as definer (column masking for anon directory).
ALTER VIEW public.rhca_articles_view SET (security_invoker = true);
ALTER VIEW public.igm_articles_view SET (security_invoker = true);
ALTER VIEW public.adc_articles_view SET (security_invoker = true);
ALTER VIEW public.founders_view SET (security_invoker = true);
ALTER VIEW public.admin_analytics_summary SET (security_invoker = true);
ALTER VIEW public.popular_articles_view SET (security_invoker = true);
ALTER VIEW public.daily_activity_view SET (security_invoker = true);
ALTER VIEW public.download_stats_view SET (security_invoker = true);
ALTER VIEW public.overall_download_stats_view SET (security_invoker = true);
ALTER VIEW public.analytics_dashboard SET (security_invoker = true);
