-- Test budget firms
SELECT bp.id, pf.name, pf.price, pf.profit_split
FROM budget_prop bp
JOIN prop_firms pf ON bp.propfirm_id = pf.id
LIMIT 3;

-- Test top firms  
SELECT tp.id, pf.name, pf.price, pf.review_score
FROM top5_prop tp
JOIN prop_firms pf ON tp.propfirm_id = pf.id
LIMIT 3;

-- Test explore firms
SELECT ef.id, pf.name, pf.price
FROM explore_firms ef
JOIN prop_firms pf ON ef.firm_id = pf.id
LIMIT 3;

-- Test table review firms
SELECT trf.id, pf.name, pf.price, trf.sort_priority
FROM table_review_firms trf
JOIN prop_firms pf ON trf.firm_id = pf.id
WHERE trf.is_approved = true
ORDER BY trf.sort_priority
LIMIT 3;