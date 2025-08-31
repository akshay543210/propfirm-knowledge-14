-- Insert sample reviews
INSERT INTO public.reviews (firm_id, reviewer_name, rating, title, content) 
SELECT id, 'John Trader', 5, 'Excellent Experience', 'FTMO has been fantastic. Quick payouts and great support.' 
FROM public.prop_firms 
WHERE name = 'FTMO'
ON CONFLICT DO NOTHING;

INSERT INTO public.reviews (firm_id, reviewer_name, rating, title, content) 
SELECT id, 'Jane Investor', 4, 'Good Service', 'The Funded Trader is reliable with fair terms.' 
FROM public.prop_firms 
WHERE name = 'The Funded Trader'
ON CONFLICT DO NOTHING;