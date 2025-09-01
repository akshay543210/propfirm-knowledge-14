-- Drop all existing policies on section tables
DROP POLICY IF EXISTS "public_read_budget_prop" ON public.budget_prop;
DROP POLICY IF EXISTS "public_read_top5_prop" ON public.top5_prop;
DROP POLICY IF EXISTS "public_read_explore_firms" ON public.explore_firms;
DROP POLICY IF EXISTS "public_read_table_review_firms" ON public.table_review_firms;
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for explore firms" ON public.explore_firms;
DROP POLICY IF EXISTS "Public read access for table review firms" ON public.table_review_firms;
DROP POLICY IF EXISTS "allow_public_read_budget_prop" ON public.budget_prop;
DROP POLICY IF EXISTS "allow_public_read_top5_prop" ON public.top5_prop;
DROP POLICY IF EXISTS "allow_public_read_table_review_firms" ON public.table_review_firms;
DROP POLICY IF EXISTS "allow_public_read_explore_firms" ON public.explore_firms;