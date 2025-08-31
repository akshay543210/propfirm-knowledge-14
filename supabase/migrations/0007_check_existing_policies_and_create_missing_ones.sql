-- Create or replace the is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create policies for profiles table
CREATE POLICY "Users can read their own profile" ON public.profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid());