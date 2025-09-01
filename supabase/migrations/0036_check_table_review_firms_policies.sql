SELECT tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'table_review_firms'
ORDER BY policyname;