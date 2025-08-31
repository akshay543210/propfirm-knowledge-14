-- Insert sample categories
INSERT INTO public.categories (id, name, description) VALUES
('beginners', 'Beginner Traders', 'Prop firms suitable for beginner traders'),
('intermediates', 'Intermediate Traders', 'Prop firms for intermediate level traders'),
('pro-traders', 'Pro Traders', 'Prop firms for professional traders')
ON CONFLICT (id) DO NOTHING;

-- Insert sample prop firms
INSERT INTO public.prop_firms (
    id, name, slug, category_id, price, original_price, coupon_code,
    review_score, trust_rating, description, features, logo_url,
    profit_split, payout_rate, funding_amount, user_review_count,
    pros, cons, affiliate_url, brand, platform, max_funding,
    evaluation_model, starting_fee, regulation, show_on_homepage
) VALUES
('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'FTMO', 'ftmo', 'pro-traders', 155, 175, 'SAVE20',
 4.8, 9.2, 'Leading prop trading firm with flexible evaluation models', 
 ARRAY['No time limit', 'Weekend holding allowed', 'News trading allowed'],
 '/placeholder.svg', 80, 95, '$10K - $600K', 1923,
 ARRAY['Very reliable payouts', 'Excellent customer support'],
 ARRAY['Higher evaluation fees', 'Strict risk management rules'],
 'https://ftmo.com', 'FTMO', 'MetaTrader 4/5', '$600K',
 'Two-step', 0, 'EU', true),
('4fa85f64-5717-4562-b3fc-2c963f66afa7', 'The Funded Trader', 'the-funded-trader', 'intermediates', 149, 249, 'TFT30',
 4.4, 8.0, 'Innovative prop firm offering flexible evaluation models',
 ARRAY['One-step evaluation option', 'High profit splits', 'Fast verification'],
 '/placeholder.svg', 85, 92, '$5K - $600K', 1456,
 ARRAY['One-step evaluation available', 'High profit splits'],
 ARRAY['Newer company with less track record', 'Stricter daily loss limits'],
 'https://thefundedtrader.com', 'TFT', 'MetaTrader 4/5', '$600K',
 'One-step', 0, 'N/A', true)
ON CONFLICT (id) DO NOTHING;