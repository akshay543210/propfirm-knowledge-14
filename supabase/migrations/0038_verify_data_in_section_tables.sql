SELECT 
    (SELECT COUNT(*) FROM budget_prop) as budget_count,
    (SELECT COUNT(*) FROM top5_prop) as top_count,
    (SELECT COUNT(*) FROM explore_firms) as explore_count,
    (SELECT COUNT(*) FROM table_review_firms) as table_review_count;