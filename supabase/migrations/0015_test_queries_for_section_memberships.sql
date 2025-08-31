-- Test budget firms query
SELECT bp.id, bp.propfirm_id, pf.name, pf.price
FROM public.budget_prop bp
JOIN public.prop_firms pf ON bp.propfirm_id = pf.id;

-- Test top firms query
SELECT tp.id, tp.propfirm_id, pf.name, pf.price
FROM public.top5_prop tp
JOIN public.prop_firms pf ON tp.propfirm_id = pf.id;

-- Test table review firms query
SELECT trf.id, trf.firm_id, trf.sort_priority, pf.name, pf.price
FROM public.table_review_firms trf
JOIN public.prop_firms pf ON trf.firm_id = pf.id
WHERE trf.is_approved = true
ORDER BY trf.sort_priority;