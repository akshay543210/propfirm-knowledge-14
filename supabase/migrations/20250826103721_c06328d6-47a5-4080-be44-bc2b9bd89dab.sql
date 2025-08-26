-- Fix function search_path security warnings
-- This sets search_path to empty string on all custom functions to prevent security issues

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Fix is_admin function  
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$function$;

-- Fix ensure_user_profile function
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$function$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    -- Insert the new user into the profiles table
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$function$;

-- Fix ensure_admin_access function
CREATE OR REPLACE FUNCTION public.ensure_admin_access()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Update existing profile if it exists
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = 'immortalwar777@gmail.com';
  
  -- If no profile exists yet, this will be handled by the trigger when user signs up
END;
$function$;