-- Check budget_prop table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'budget_prop' 
ORDER BY ordinal_position;

-- Check top5_prop table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'top5_prop' 
ORDER BY ordinal_position;

-- Check table_review_firms table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'table_review_firms' 
ORDER BY ordinal_position;