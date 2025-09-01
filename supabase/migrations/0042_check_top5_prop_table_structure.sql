SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'top5_prop' 
ORDER BY ordinal_position;