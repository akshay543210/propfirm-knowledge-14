SELECT tp.id, tp.propfirm_id, pf.name, pf.price
FROM top5_prop tp
JOIN prop_firms pf ON tp.propfirm_id = pf.id
LIMIT 5;