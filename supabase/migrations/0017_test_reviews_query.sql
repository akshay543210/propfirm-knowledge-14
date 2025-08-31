-- Test reviews query
SELECT r.id, r.firm_id, r.reviewer_name, r.rating, r.title, r.content, pf.name
FROM public.reviews r
JOIN public.prop_firms pf ON r.firm_id = pf.id
ORDER BY r.created_at DESC;