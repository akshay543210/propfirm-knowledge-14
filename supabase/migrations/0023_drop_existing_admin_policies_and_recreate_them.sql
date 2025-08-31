-- Drop existing admin policies if they exist, then recreate them
-- For prop_firms table
DROP POLICY IF EXISTS "Admins can manage prop firms" ON public.prop_firms;
CREATE POLICY "Admins can manage prop firms" ON public.prop_firms
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- For categories table
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- For reviews table
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
CREATE POLICY "Admins can manage reviews" ON public.reviews
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- For budget_prop table
DROP POLICY IF EXISTS "Admins can manage budget prop" ON public.budget_prop;
CREATE POLICY "Admins can manage budget prop" ON public.budget_prop
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- For top5_prop table
DROP POLICY IF EXISTS "Admins can manage top5 prop" ON public.top5_prop;
CREATE POLICY "Admins can manage top5 prop" ON public.top5_prop
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- For table_review_firms table
DROP POLICY IF EXISTS "Admins can manage table review firms" ON public.table_review_firms;
CREATE POLICY "Admins can manage table review firms" ON public.table_review_firms
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- For drama_reports table
DROP POLICY IF EXISTS "Admins can manage drama reports" ON public.drama_reports;
CREATE POLICY "Admins can manage drama reports" ON public.drama_reports
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- For account_sizes table
DROP POLICY IF EXISTS "Admins can manage account sizes" ON public.account_sizes;
CREATE POLICY "Admins can manage account sizes" ON public.account_sizes
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());