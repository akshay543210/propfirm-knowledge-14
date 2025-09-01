-- Create consistent public read policies for all section tables
CREATE POLICY "public_read_budget_prop" 
ON public.budget_prop 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "public_read_top5_prop" 
ON public.top5_prop 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "public_read_explore_firms" 
ON public.explore_firms 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "public_read_table_review_firms" 
ON public.table_review_firms 
FOR SELECT 
TO anon, authenticated
USING (is_approved = true);