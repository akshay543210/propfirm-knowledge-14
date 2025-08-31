-- First, we need to ensure the profiles table exists with the correct structure
-- This will create the profile if it doesn't exist, or update the role if it does

-- Create or update the profile for the admin user
-- We'll use a more generic approach that works with existing users
INSERT INTO public.profiles (id, email, role, created_at, updated_at)
SELECT 
  id, 
  'bigwinner986@gmail.com', 
  'admin', 
  NOW(), 
  NOW()
FROM auth.users 
WHERE email = 'bigwinner986@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  updated_at = NOW();

-- If the user doesn't exist yet, you would need to create the user first through the signup process
-- Then run this query to set their role to admin