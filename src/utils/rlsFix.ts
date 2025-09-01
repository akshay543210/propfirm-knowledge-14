// Utility to help fix RLS policies for section tables
// This provides the exact SQL needed to fix the Budget and Top PropFirms loading issue

export const RLS_FIX_SQL = `
-- STEP-BY-STEP FIX FOR RLS POLICIES
-- Copy and paste this entire SQL block into Supabase SQL Editor

-- Step 1: Enable RLS on tables
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_firms ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public read access for budget prop" ON public.budget_prop;
DROP POLICY IF EXISTS "Public read access for top5 prop" ON public.top5_prop;
DROP POLICY IF EXISTS "Public read access for explore firms" ON public.explore_firms;

-- Step 3: Create new public read policies
CREATE POLICY "Public read access for budget prop" ON public.budget_prop
    FOR SELECT USING (true);

CREATE POLICY "Public read access for top5 prop" ON public.top5_prop
    FOR SELECT USING (true);

CREATE POLICY "Public read access for explore firms" ON public.explore_firms
    FOR SELECT USING (true);

-- Step 4: Verify success
SELECT 'SUCCESS: RLS policies created!' as status;
`.trim();

export const copyRLSFixToClipboard = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(RLS_FIX_SQL);
    return true;
  }
  return false;
};

export const getRLSPolicyInstructions = () => {
  return {
    title: "Fix Budget & Top PropFirms Loading Issue",
    problem: "Missing RLS (Row Level Security) policies prevent client-side access to section data",
    solution: "Add public read policies to budget_prop, top5_prop, and explore_firms tables",
    steps: [
      "1. Open Supabase Dashboard → SQL Editor",
      "2. Copy the SQL from EMERGENCY_FIX_RLS_POLICIES.sql or use the Copy SQL button",
      "3. Paste the SQL and click RUN",
      "4. Refresh your application",
      "5. Test that Budget PropFirms and Top PropFirms sections now load"
    ],
    sqlLocation: "EMERGENCY_FIX_RLS_POLICIES.sql",
    migrationFile: "supabase/migrations/0026_fix_rls_policies_final.sql"
  };
};