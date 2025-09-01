SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'explore_firms' 
ORDER BY ordinal_position;