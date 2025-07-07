-- Update user role to admin for the current user
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'bigwinner986@gmail.com';