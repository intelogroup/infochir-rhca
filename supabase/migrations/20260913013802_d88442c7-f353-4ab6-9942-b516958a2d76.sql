-- 1. Drop the policy that exposed full donor rows (email, payment ids) to any visitor
DROP POLICY IF EXISTS "Public can view donor names only" ON public.donations;

-- 2. Redacted public donor-wall view: names, amounts, messages only.
-- The view runs as its owner (postgres), which bypasses base-table RLS, so
-- anon/authenticated can read these redacted columns without any base-table access.
CREATE OR REPLACE VIEW public.public_donations AS
SELECT
  id,
  donor_name,
  amount,
  currency,
  message,
  created_at
FROM public.donations
WHERE is_anonymous = false
  AND status = 'completed';

GRANT SELECT ON public.public_donations TO anon;
GRANT SELECT ON public.public_donations TO authenticated;
GRANT ALL ON public.public_donations TO service_role;