SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('budget_prop', 'top5_prop', 'explore_firms', 'table_review_firms')
ORDER BY tablename, policyname;