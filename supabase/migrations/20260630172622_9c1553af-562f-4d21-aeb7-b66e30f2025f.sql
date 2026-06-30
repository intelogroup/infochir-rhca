GRANT INSERT ON public.performance_metrics TO anon, authenticated;
GRANT SELECT ON public.performance_metrics TO authenticated;
GRANT ALL ON public.performance_metrics TO service_role;

GRANT INSERT ON public.error_events TO anon, authenticated;
GRANT SELECT ON public.error_events TO authenticated;
GRANT ALL ON public.error_events TO service_role;