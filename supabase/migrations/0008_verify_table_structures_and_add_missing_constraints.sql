-- Check if the tables exist and have the correct structure
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('categories', 'prop_firms', 'budget_prop', 'top5_prop', 'table_review_firms', 'reviews', 'drama_reports', 'account_sizes', 'profiles')
ORDER BY table_name, ordinal_position;