-- Check if the profiles table has the correct columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Ensure the role column has the correct default and constraints
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'user';