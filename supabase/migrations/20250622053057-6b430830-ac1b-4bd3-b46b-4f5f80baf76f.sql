
-- Fix Row Level Security policies for prop_firms table
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view prop firms" ON public.prop_firms;
DROP POLICY IF EXISTS "Authenticated users can insert prop firms" ON public.prop_firms;
DROP POLICY IF EXISTS "Authenticated users can update prop firms" ON public.prop_firms;
DROP POLICY IF EXISTS "Authenticated users can delete prop firms" ON public.prop_firms;

-- Create new policies that allow public access for admin operations
-- This removes authentication requirements for CRUD operations
CREATE POLICY "Allow public read access to prop firms" ON public.prop_firms
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to prop firms" ON public.prop_firms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to prop firms" ON public.prop_firms
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to prop firms" ON public.prop_firms
  FOR DELETE USING (true);

-- Also ensure categories table has proper policies
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;

CREATE POLICY "Allow public read access to categories" ON public.categories
  FOR SELECT USING (true);
