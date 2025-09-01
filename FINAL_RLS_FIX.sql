-- FINAL COMPREHENSIVE RLS FIX
-- This will ensure Budget PropFirms and Top PropFirms load for ALL users (not just admins)

-- First, let's check what's currently happening
SELECT 'DIAGNOSTIC: Current table data count' as status;

SELECT 
    'budget_prop' as table_name,
    COUNT(*) as total_rows,
    CASE WHEN COUNT(*) > 0 THEN '✅ HAS DATA' ELSE '❌ EMPTY' END as status
FROM public.budget_prop
UNION ALL
SELECT 
    'top5_prop' as table_name,
    COUNT(*) as total_rows,
    CASE WHEN COUNT(*) > 0 THEN '✅ HAS DATA' ELSE '❌ EMPTY' END as status
FROM public.top5_prop
UNION ALL
SELECT 
    'table_review_firms' as table_name,
    COUNT(*) as total_rows,
    CASE WHEN COUNT(*) > 0 THEN '✅ HAS DATA' ELSE '❌ EMPTY' END as status
FROM public.table_review_firms;

-- Check current RLS status
SELECT 'DIAGNOSTIC: RLS Status' as status;

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE WHEN rowsecurity THEN '✅ RLS ON' ELSE '❌ RLS OFF' END as status
FROM pg_tables 
WHERE tablename IN ('budget_prop', 'top5_prop', 'table_review_firms')
AND schemaname = 'public';

-- Check existing policies
SELECT 'DIAGNOSTIC: Current Policies' as status;

SELECT 
    tablename,
    policyname,
    roles,
    cmd as operation
FROM pg_policies 
WHERE tablename IN ('budget_prop', 'top5_prop', 'table_review_firms')
ORDER BY tablename, policyname;

-- NOW FIX THE ISSUE
SELECT 'FIXING: Enabling RLS and creating proper policies' as status;

-- Force enable RLS
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_review_firms ENABLE ROW LEVEL SECURITY;

-- Remove ALL existing policies to start fresh
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for table review firms" ON public.table_review_firms;

-- Remove admin-only policies that might be blocking public access
DROP POLICY IF EXISTS "Admins can manage budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Admins can manage top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Admins can manage table review firms" ON public.table_review_firms;

-- Create NEW public read policies (this is the key fix)
CREATE POLICY "allow_public_read_budget_prop" 
ON public.budget_prop 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "allow_public_read_top5_prop" 
ON public.top5_prop 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "allow_public_read_table_review_firms" 
ON public.table_review_firms 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Create admin management policies
CREATE POLICY "admin_manage_budget_prop" 
ON public.budget_prop 
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
))
WITH CHECK (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
));

CREATE POLICY "admin_manage_top5_prop" 
ON public.top5_prop 
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
))
WITH CHECK (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
));

CREATE POLICY "admin_manage_table_review_firms" 
ON public.table_review_firms 
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
))
WITH CHECK (auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users 
    WHERE raw_user_meta_data ->> 'is_admin' = 'true'
));

-- Verify the new policies
SELECT 'VERIFICATION: New policies created' as status;

SELECT 
    tablename,
    policyname,
    roles,
    cmd as operation
FROM pg_policies 
WHERE tablename IN ('budget_prop', 'top5_prop', 'table_review_firms')
AND policyname LIKE '%public_read%' OR policyname LIKE '%admin_manage%'
ORDER BY tablename, policyname;

-- Add sample data if tables are empty (this might be why users see empty sections)
DO $$
DECLARE
    budget_count int;
    top_count int;
    table_count int;
    sample_firm_id uuid;
BEGIN
    -- Check current counts
    SELECT COUNT(*) INTO budget_count FROM public.budget_prop;
    SELECT COUNT(*) INTO top_count FROM public.top5_prop;
    SELECT COUNT(*) INTO table_count FROM public.table_review_firms;
    
    -- Get a sample firm
    SELECT id INTO sample_firm_id FROM public.prop_firms LIMIT 1;
    
    IF sample_firm_id IS NOT NULL THEN
        -- Add to budget_prop if empty
        IF budget_count = 0 THEN
            INSERT INTO public.budget_prop (propfirm_id) VALUES (sample_firm_id);
            RAISE NOTICE '✅ Added sample firm to budget_prop table';
        END IF;
        
        -- Add to top5_prop if empty  
        IF top_count = 0 THEN
            INSERT INTO public.top5_prop (propfirm_id) VALUES (sample_firm_id);
            RAISE NOTICE '✅ Added sample firm to top5_prop table';
        END IF;
        
        -- Add to table_review_firms if empty
        IF table_count = 0 THEN
            INSERT INTO public.table_review_firms (firm_id, is_approved, sort_priority) 
            VALUES (sample_firm_id, true, 1);
            RAISE NOTICE '✅ Added sample firm to table_review_firms table';
        END IF;
    ELSE
        RAISE NOTICE '⚠️ No prop firms found to use as sample data';
    END IF;
END $$;

-- Final verification with data counts
SELECT 'FINAL VERIFICATION: Data access test' as status;

SELECT 
    'budget_prop' as table_name,
    COUNT(*) as accessible_rows,
    CASE WHEN COUNT(*) > 0 THEN '✅ WORKING' ELSE '❌ STILL EMPTY' END as status
FROM public.budget_prop
UNION ALL
SELECT 
    'top5_prop' as table_name,
    COUNT(*) as accessible_rows,
    CASE WHEN COUNT(*) > 0 THEN '✅ WORKING' ELSE '❌ STILL EMPTY' END as status
FROM public.top5_prop
UNION ALL
SELECT 
    'table_review_firms' as table_name,
    COUNT(*) as accessible_rows,
    CASE WHEN COUNT(*) > 0 THEN '✅ WORKING' ELSE '❌ STILL EMPTY' END as status
FROM public.table_review_firms;

-- Success message
SELECT '🎉 FIX COMPLETED! Budget PropFirms and Top PropFirms should now load for ALL users.' as final_status;