-- CRITICAL SECURITY FIX: Remove public access to budget_prop table
-- This table contains sensitive financial information and should not be publicly accessible

DROP POLICY IF EXISTS "allow_public_read_budget_prop" ON public.budget_prop;

-- Ensure only authenticated users can access their own budget data
-- (The existing budget_prop_select_self policy should handle this)