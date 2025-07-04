-- Drop existing conflicting policies first
DROP POLICY IF EXISTS "Admins can insert account sizes" ON public.account_sizes;
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;

-- Create new policies for account_sizes to allow public access
CREATE POLICY "Anyone can insert account sizes" 
ON public.account_sizes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update account sizes" 
ON public.account_sizes 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete account sizes" 
ON public.account_sizes 
FOR DELETE 
USING (true);

-- Create simple policies for reviews to allow anyone to create reviews
CREATE POLICY "Anyone can insert reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Create function to handle new user profile creation if not exists
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration if not exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.ensure_user_profile();