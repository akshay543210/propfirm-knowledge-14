-- Secure admin role check and lock down profile emails
-- 1) Harden is_admin() to avoid relying on public read of profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Restrict who can execute the function (authenticated users only)
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2) Remove insecure public read policy on profiles exposing emails
DROP POLICY IF EXISTS "Allow public read for admin checks" ON public.profiles;

-- Ensure least privilege remains: users can still view/update their own profile via existing policies