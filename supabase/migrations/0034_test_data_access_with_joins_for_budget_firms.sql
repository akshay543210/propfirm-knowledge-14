SELECT bp.id, bp.propfirm_id, pf.name, pf.price
FROM budget_prop bp
JOIN prop_firms pf ON bp.propfirm_id = pf.id
LIMIT 5;