-- Enable RLS on all section tables
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_firms ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for explore firms" ON public.explore_firms;

-- Create new public read policies
CREATE POLICY "Public read access for budget prop" 
ON public.budget_prop 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Public read access for top5 prop" 
ON public.top5_prop 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Public read access for explore firms" 
ON public.explore_firms 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Verify policies were created
SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('budget_prop', 'top5_prop', 'explore_firms')
AND policyname LIKE '%Public read access%'
ORDER BY tablename;