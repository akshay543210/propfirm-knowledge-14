-- First, let's check if we have any prop firms
SELECT id, name FROM public.prop_firms;

-- Insert sample data into section membership tables (using existing prop firm IDs)
-- Note: We'll need to use actual IDs from the prop_firms table
INSERT INTO public.budget_prop (propfirm_id) 
SELECT id FROM public.prop_firms 
WHERE name = 'The Funded Trader'
ON CONFLICT (propfirm_id) DO NOTHING;

INSERT INTO public.top5_prop (propfirm_id) 
SELECT id FROM public.prop_firms 
WHERE name = 'FTMO'
ON CONFLICT (propfirm_id) DO NOTHING;

-- Insert into table_review_firms
INSERT INTO public.table_review_firms (firm_id, is_approved, sort_priority) 
SELECT id, true, 1 FROM public.prop_firms 
WHERE name = 'FTMO'
ON CONFLICT (firm_id) DO UPDATE SET is_approved = true, sort_priority = 1;

INSERT INTO public.table_review_firms (firm_id, is_approved, sort_priority) 
SELECT id, true, 2 FROM public.prop_firms 
WHERE name = 'The Funded Trader'
ON CONFLICT (firm_id) DO UPDATE SET is_approved = true, sort_priority = 2;