-- Secure prop_firms RLS: restrict writes to admins only, keep public read

-- Ensure RLS is enabled
ALTER TABLE public.prop_firms ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive public write policies
DROP POLICY IF EXISTS "Allow public insert access to prop firms" ON public.prop_firms;
DROP POLICY IF EXISTS "Allow public update access to prop firms" ON public.prop_firms;
DROP POLICY IF EXISTS "Allow public delete access to prop firms" ON public.prop_firms;

-- Create admin-only write policies
CREATE POLICY "Admins can insert prop firms"
ON public.prop_firms
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update prop firms"
ON public.prop_firms
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete prop firms"
ON public.prop_firms
FOR DELETE
TO authenticated
USING (is_admin());