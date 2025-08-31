-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'prop_firms', 'budget_prop', 'top5_prop', 'table_review_firms', 'reviews', 'drama_reports', 'account_sizes', 'profiles')
ORDER BY table_name;