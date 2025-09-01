-- Ensure RLS is enabled on all section tables
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_review_firms ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for explore firms" ON public.explore_firms;
DROP POLICY IF EXISTS "Public read access for table review firms" ON public.table_review_firms;
DROP POLICY IF EXISTS "allow_public_read_budget_prop" ON public.budget_prop;
DROP POLICY IF EXISTS "allow_public_read_top5_prop" ON public.top5_prop;
DROP POLICY IF EXISTS "allow_public_read_table_review_firms" ON public.table_review_firms;
DROP POLICY IF EXISTS "allow_public_read_explore_firms" ON public.explore_firms;

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

-- Verify all policies are in place
SELECT tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('budget_prop', 'top5_prop', 'explore_firms', 'table_review_firms')
ORDER BY tablename, policyname;