-- Drop the existing policy that requires authentication
DROP POLICY IF EXISTS "Authenticated users can view member profiles" ON members;

-- Create a new policy that allows public read access to members
CREATE POLICY "Public read access to members"
ON members
FOR SELECT
TO public
USING (true);