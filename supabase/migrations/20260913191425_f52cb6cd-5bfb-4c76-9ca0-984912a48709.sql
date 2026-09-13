GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;