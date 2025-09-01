-- Add public read policies for budget_prop and top5_prop tables
-- These policies allow public read access so that the client-side can fetch section data

-- Add public read policy for budget_prop table
CREATE POLICY "Public read access for budget prop" ON public.budget_prop
    FOR SELECT USING (true);

-- Add public read policy for top5_prop table  
CREATE POLICY "Public read access for top5 prop" ON public.top5_prop
    FOR SELECT USING (true);

-- Also ensure explore_firms has public read access if it doesn't already
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'explore_firms' 
    AND policyname = 'Public read access for explore firms'
  ) THEN
    CREATE POLICY "Public read access for explore firms" ON public.explore_firms
        FOR SELECT USING (true);
  END IF;
END $$;