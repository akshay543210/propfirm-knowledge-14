-- Final fix for RLS policies on section tables
-- This migration ensures all section tables have proper public read access

-- Enable RLS on tables if not already enabled
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_firms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for explore firms" ON public.explore_firms;

-- Create new public read policies
CREATE POLICY "Public read access for budget prop" ON public.budget_prop
    FOR SELECT USING (true);

CREATE POLICY "Public read access for top5 prop" ON public.top5_prop
    FOR SELECT USING (true);

CREATE POLICY "Public read access for explore firms" ON public.explore_firms
    FOR SELECT USING (true);

-- Verify policies were created
DO $$
BEGIN
    RAISE NOTICE 'RLS Policies created successfully for section tables';
    RAISE NOTICE 'Budget prop policies: %', (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'budget_prop');
    RAISE NOTICE 'Top5 prop policies: %', (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'top5_prop');
    RAISE NOTICE 'Explore firms policies: %', (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'explore_firms');
END $$;