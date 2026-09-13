
REVOKE EXECUTE ON FUNCTION public.assign_admin_role_by_email(text) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.assign_admin_role_by_email(text) TO service_role;
