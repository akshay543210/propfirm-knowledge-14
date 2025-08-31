-- Insert sample account sizes for FTMO
INSERT INTO public.account_sizes (firm_id, size, discounted_price, original_price, promo_code, buying_link)
SELECT id, '5K', 155, 175, 'SAVE20', 'https://ftmo.com/buy-5k'
FROM public.prop_firms 
WHERE name = 'FTMO'
ON CONFLICT DO NOTHING;

INSERT INTO public.account_sizes (firm_id, size, discounted_price, original_price, promo_code, buying_link)
SELECT id, '10K', 299, 349, 'SAVE20', 'https://ftmo.com/buy-10k'
FROM public.prop_firms 
WHERE name = 'FTMO'
ON CONFLICT DO NOTHING;

-- Insert sample account sizes for The Funded Trader
INSERT INTO public.account_sizes (firm_id, size, discounted_price, original_price, promo_code, buying_link)
SELECT id, '5K', 149, 249, 'TFT30', 'https://thefundedtrader.com/buy-5k'
FROM public.prop_firms 
WHERE name = 'The Funded Trader'
ON CONFLICT DO NOTHING;

INSERT INTO public.account_sizes (firm_id, size, discounted_price, original_price, promo_code, buying_link)
SELECT id, '10K', 249, 399, 'TFT30', 'https://thefundedtrader.com/buy-10k'
FROM public.prop_firms 
WHERE name = 'The Funded Trader'
ON CONFLICT DO NOTHING;