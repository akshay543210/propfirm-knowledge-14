-- EMERGENCY FIX: Add missing public read policies for section tables
-- Run this SQL in the Supabase SQL Editor to fix Budget PropFirms and Top PropFirms not loading

-- Step 1: Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('budget_prop', 'top5_prop', 'explore_firms')
ORDER BY tablename, policyname;

-- Step 2: Enable RLS on tables if not already enabled
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_firms ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for explore firms" ON public.explore_firms;

-- Step 4: Create new public read policies
CREATE POLICY "Public read access for budget prop" ON public.budget_prop
    FOR SELECT USING (true);

CREATE POLICY "Public read access for top5 prop" ON public.top5_prop
    FOR SELECT USING (true);

CREATE POLICY "Public read access for explore firms" ON public.explore_firms
    FOR SELECT USING (true);

-- Step 5: Verify the policies were created successfully
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename IN ('budget_prop', 'top5_prop', 'explore_firms')
AND policyname LIKE '%Public read access%'
ORDER BY tablename, policyname;

-- Step 6: Test the queries that were failing
SELECT 'Budget firms test:' as test_name, COUNT(*) as count FROM public.budget_prop;
SELECT 'Top firms test:' as test_name, COUNT(*) as count FROM public.top5_prop; 
SELECT 'Explore firms test:' as test_name, COUNT(*) as count FROM public.explore_firms;

-- Step 7: Success confirmation
DO $$
BEGIN
    RAISE NOTICE '✅ RLS Policies fix completed successfully!';
    RAISE NOTICE 'Budget PropFirms and Top PropFirms sections should now load properly.';
    RAISE NOTICE 'Please refresh your application to see the changes.';
END $$;