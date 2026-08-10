-- Public (anonymous) visitors read the redacted view only: no email, no phone.
GRANT SELECT ON public.members_public_view TO anon, authenticated;

-- Signed-in users may read full member records (contact info unlocked after login).
GRANT SELECT ON public.members TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can read member records" ON public.members;
CREATE POLICY "Authenticated users can read member records"
ON public.members
FOR SELECT
TO authenticated
USING (true);