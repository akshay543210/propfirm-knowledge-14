
-- Add more dummy prop firms data for testing
INSERT INTO public.prop_firms (
  name, slug, category_id, price, original_price, coupon_code, review_score, 
  trust_rating, description, features, profit_split, payout_rate, funding_amount,
  user_review_count, pros, cons, affiliate_url, brand, platform, max_funding,
  evaluation_model, starting_fee, regulation
) VALUES
(
  'Apex Trader Funding', 'apex-trader-funding', (SELECT id FROM public.categories WHERE name = 'intermediate'),
  97.00, 150.00, 'APEX20', 4.3, 8, 
  'Modern prop firm with flexible rules and good support',
  ARRAY['MetaTrader 4/5', 'NinjaTrader', 'TradingView', 'Mobile App', 'Swing Trading'],
  90, 95, '$25K - $300K', 650,
  ARRAY['High profit splits', 'Modern platform', 'Good mobile app', 'Flexible rules'],
  ARRAY['Limited instruments', 'New company'],
  'https://apextraderfunding.com/?ref=test123', 'Apex', 'NinjaTrader',
  '$300,000', '1-Step Evaluation', 97.00, 'USA'
),
(
  'E8 Funding', 'e8-funding', (SELECT id FROM public.categories WHERE name = 'pro'),
  25.00, 50.00, 'E8SAVE', 4.1, 7,
  'Low-cost entry point with competitive features',
  ARRAY['MetaTrader 4/5', 'Copy Trading', 'Expert Advisors', 'News Trading'],
  80, 88, '$25K - $400K', 420,
  ARRAY['Very low entry cost', 'Copy trading allowed', 'Good for beginners'],
  ARRAY['Lower profit splits', 'Strict daily loss limits'],
  'https://e8funding.com/?affiliate=xyz', 'E8', 'MetaTrader 4/5',
  '$400,000', '2-Step Evaluation', 25.00, 'Czech Republic'
),
(
  'TopStep', 'topstep', (SELECT id FROM public.categories WHERE name = 'intermediate'),
  165.00, 225.00, 'TOP15', 4.6, 9,
  'Established futures trading prop firm with excellent reputation',
  ARRAY['NinjaTrader', 'TradingView', 'Futures Trading', 'Educational Resources'],
  90, 100, '$50K - $150K', 1850,
  ARRAY['Futures specialist', 'Great education', 'High payouts', 'Established firm'],
  ARRAY['Futures only', 'Higher entry cost'],
  'https://topstep.com/?ref=prop123', 'TopStep', 'NinjaTrader',
  '$150,000', 'Trading Combine', 165.00, 'USA (CFTC)'
),
(
  'Lux Trading Firm', 'lux-trading-firm', (SELECT id FROM public.categories WHERE name = 'beginner'),
  49.00, 99.00, 'LUX50', 3.9, 6,
  'Budget-friendly option for new traders',
  ARRAY['MetaTrader 4/5', 'cTrader', 'Basic Support', 'Mobile Trading'],
  75, 85, '$10K - $200K', 280,
  ARRAY['Very affordable', 'Good for testing', 'Multiple platforms'],
  ARRAY['Lower profit splits', 'Basic support', 'Strict rules'],
  'https://luxtrading.com/?ref=budget', 'Lux', 'MetaTrader 4/5',
  '$200,000', '2-Step Evaluation', 49.00, 'Seychelles'
),
(
  'Funded Next', 'funded-next', (SELECT id FROM public.categories WHERE name = 'pro'),
  199.00, 299.00, 'NEXT25', 4.4, 8,
  'Next-generation prop firm with innovative features',
  ARRAY['MetaTrader 4/5', 'TradingView', 'AI Tools', 'Risk Management', 'Social Trading'],
  85, 95, '$10K - $200K', 920,
  ARRAY['Innovative features', 'AI-powered tools', 'Good risk management'],
  ARRAY['Higher fees', 'Complex platform'],
  'https://fundednext.com/?affiliate=next123', 'FundedNext', 'TradingView',
  '$200,000', '2-Step Challenge', 199.00, 'UAE'
),
(
  'Smart Prop Trader', 'smart-prop-trader', (SELECT id FROM public.categories WHERE name = 'beginner'),
  89.00, 120.00, 'SMART15', 4.0, 7,
  'Smart approach to prop trading with educational focus',
  ARRAY['MetaTrader 4/5', 'Educational Content', 'Community Support', 'Mobile App'],
  80, 90, '$10K - $100K', 340,
  ARRAY['Great education', 'Strong community', 'Beginner friendly'],
  ARRAY['Limited funding amounts', 'Slower payouts'],
  'https://smartproptrader.com/?ref=smart', 'SmartProp', 'MetaTrader 4/5',
  '$100,000', '1-Step Evaluation', 89.00, 'UK'
),
(
  'Blue Guardian', 'blue-guardian', (SELECT id FROM public.categories WHERE name = 'intermediate'),
  125.00, 180.00, 'BLUE20', 4.2, 8,
  'Reliable prop firm with solid track record',
  ARRAY['MetaTrader 4/5', 'cTrader', 'Weekend Holding', 'News Trading', 'Hedging'],
  82, 92, '$25K - $200K', 710,
  ARRAY['Reliable payouts', 'Good support', 'Flexible trading rules'],
  ARRAY['Standard profit splits', 'Limited platforms'],
  'https://blueguardian.com/?ref=blue123', 'BlueGuardian', 'MetaTrader 4/5',
  '$200,000', '2-Step Evaluation', 125.00, 'Cyprus'
);
