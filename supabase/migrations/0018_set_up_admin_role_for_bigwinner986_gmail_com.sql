-- First, we need to ensure the profiles table has the correct structure
-- This will add the role column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Update the profile for bigwinner986@gmail.com to have admin role
-- Note: This user must first sign up through the application to exist in auth.users
UPDATE public.profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'bigwinner986@gmail.com';

-- Create or replace the is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions for the function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;