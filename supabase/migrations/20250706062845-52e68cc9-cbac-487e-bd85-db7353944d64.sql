-- Ensure immortalwar777@gmail.com gets admin access
-- First, update the handle_new_user function to include this email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    CASE 
      WHEN NEW.email IN ('akshaysaways@gmail.com', 'immortalwar777@gmail.com') THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to manually set admin role for existing users
CREATE OR REPLACE FUNCTION public.ensure_admin_access()
RETURNS void AS $$
BEGIN
  -- Update existing profile if it exists
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = 'immortalwar777@gmail.com';
  
  -- If no profile exists yet, this will be handled by the trigger when user signs up
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to update any existing profile
SELECT public.ensure_admin_access();