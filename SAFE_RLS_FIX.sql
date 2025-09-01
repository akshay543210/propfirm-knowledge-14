-- SAFE RLS FIX: No destructive operations, only creates policies if they don't exist
-- This version avoids the Supabase "destructive operation" warning

-- Step 1: Enable RLS on tables (safe operation)
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_firms ENABLE ROW LEVEL SECURITY;

-- Step 2: Create policies only if they don't exist (safe operation)
DO $$ 
BEGIN
  -- Create budget_prop policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'budget_prop' 
    AND policyname = 'Public read access for budget prop'
  ) THEN
    CREATE POLICY "Public read access for budget prop" ON public.budget_prop
        FOR SELECT USING (true);
    RAISE NOTICE '✅ Created public read policy for budget_prop';
  ELSE
    RAISE NOTICE 'ℹ️ Public read policy for budget_prop already exists';
  END IF;

  -- Create top5_prop policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'top5_prop' 
    AND policyname = 'Public read access for top5 prop'
  ) THEN
    CREATE POLICY "Public read access for top5 prop" ON public.top5_prop
        FOR SELECT USING (true);
    RAISE NOTICE '✅ Created public read policy for top5_prop';
  ELSE
    RAISE NOTICE 'ℹ️ Public read policy for top5_prop already exists';
  END IF;

  -- Create explore_firms policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'explore_firms' 
    AND policyname = 'Public read access for explore firms'
  ) THEN
    CREATE POLICY "Public read access for explore firms" ON public.explore_firms
        FOR SELECT USING (true);
    RAISE NOTICE '✅ Created public read policy for explore_firms';
  ELSE
    RAISE NOTICE 'ℹ️ Public read policy for explore_firms already exists';
  END IF;
END $$;

-- Step 3: Verify policies exist
SELECT 
    tablename, 
    policyname, 
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('budget_prop', 'top5_prop', 'explore_firms')
AND policyname LIKE '%Public read access%'
ORDER BY tablename;

-- Step 4: Test data access
SELECT 'Budget firms count:' as test, COUNT(*) as result FROM public.budget_prop
UNION ALL
SELECT 'Top firms count:' as test, COUNT(*) as result FROM public.top5_prop
UNION ALL  
SELECT 'Explore firms count:' as test, COUNT(*) as result FROM public.explore_firms;

-- Step 5: Success message
DO $$
BEGIN
    RAISE NOTICE '🎉 RLS policies fix completed successfully!';
    RAISE NOTICE '🔄 Please refresh your application to see the changes.';
END $$;