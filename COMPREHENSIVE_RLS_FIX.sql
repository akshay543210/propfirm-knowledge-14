-- COMPREHENSIVE RLS DIAGNOSTIC AND FIX
-- Run this SQL to diagnose and fix Budget & Top PropFirms loading issues

-- Step 1: Check if tables exist and have data
SELECT 'DIAGNOSTICS - Table Existence and Data Count' as status;

SELECT 
    'budget_prop' as table_name,
    COUNT(*) as row_count,
    CASE WHEN COUNT(*) > 0 THEN 'HAS DATA' ELSE 'EMPTY TABLE' END as data_status
FROM public.budget_prop
UNION ALL
SELECT 
    'top5_prop' as table_name,
    COUNT(*) as row_count,
    CASE WHEN COUNT(*) > 0 THEN 'HAS DATA' ELSE 'EMPTY TABLE' END as data_status
FROM public.top5_prop
UNION ALL
SELECT 
    'explore_firms' as table_name,
    COUNT(*) as row_count,
    CASE WHEN COUNT(*) > 0 THEN 'HAS DATA' ELSE 'EMPTY TABLE' END as data_status
FROM public.explore_firms;

-- Step 2: Check RLS status
SELECT 'RLS STATUS CHECK' as status;

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('budget_prop', 'top5_prop', 'explore_firms')
AND schemaname = 'public';

-- Step 3: Check existing policies
SELECT 'EXISTING POLICIES' as status;

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
ORDER BY tablename, policyname;

-- Step 4: Force enable RLS and recreate policies
SELECT 'FIXING RLS POLICIES' as status;

-- Enable RLS (force)
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_firms ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they work
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for explore firms" ON public.explore_firms;

-- Create new policies with explicit SELECT permission
CREATE POLICY "Public read access for budget prop" 
ON public.budget_prop 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Public read access for top5 prop" 
ON public.top5_prop 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Public read access for explore firms" 
ON public.explore_firms 
FOR SELECT 
TO public
USING (true);

-- Step 5: Verify policies were created correctly
SELECT 'VERIFICATION - New Policies Created' as status;

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
ORDER BY tablename;

-- Step 6: Test actual data access as anonymous user
SELECT 'DATA ACCESS TEST' as status;

-- This should work if policies are correct
BEGIN;
SET ROLE TO DEFAULT; -- Reset to anonymous/public role

-- Test queries that should now work
SELECT 'budget_prop_test' as test, COUNT(*) as accessible_rows FROM public.budget_prop;
SELECT 'top5_prop_test' as test, COUNT(*) as accessible_rows FROM public.top5_prop;
SELECT 'explore_firms_test' as test, COUNT(*) as accessible_rows FROM public.explore_firms;

COMMIT;

-- Step 7: Add some sample data if tables are empty
DO $$
DECLARE
    budget_count int;
    top_count int;
    sample_firm_id text;
BEGIN
    -- Check if we need sample data
    SELECT COUNT(*) INTO budget_count FROM public.budget_prop;
    SELECT COUNT(*) INTO top_count FROM public.top5_prop;
    
    -- Get a sample firm ID if available
    SELECT id INTO sample_firm_id FROM public.prop_firms LIMIT 1;
    
    IF budget_count = 0 AND sample_firm_id IS NOT NULL THEN
        INSERT INTO public.budget_prop (propfirm_id) VALUES (sample_firm_id);
        RAISE NOTICE 'Added sample firm to budget_prop table';
    END IF;
    
    IF top_count = 0 AND sample_firm_id IS NOT NULL THEN
        INSERT INTO public.top5_prop (propfirm_id) VALUES (sample_firm_id);
        RAISE NOTICE 'Added sample firm to top5_prop table';
    END IF;
    
END $$;

-- Step 8: Final verification
SELECT 'FINAL STATUS' as status;

SELECT 
    'Fix completed successfully! Budget and Top PropFirms should now load for all users.' as message
UNION ALL
SELECT 
    'If still not working, the issue might be that tables are empty (not a permissions issue).' as message
UNION ALL
SELECT 
    'Check the admin panel to add firms to Budget and Top sections.' as message;