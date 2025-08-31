-- Test account sizes query
SELECT asz.id, asz.firm_id, asz.size, asz.discounted_price, asz.original_price, asz.promo_code, pf.name
FROM public.account_sizes asz
JOIN public.prop_firms pf ON asz.firm_id = pf.id
ORDER BY pf.name, asz.size;