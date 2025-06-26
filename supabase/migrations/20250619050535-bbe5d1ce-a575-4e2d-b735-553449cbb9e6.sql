
-- Create categories table for firm types
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
('beginner', 'Perfect for new traders starting their journey'),
('intermediate', 'For traders with some experience'),
('pro', 'Advanced traders with proven track records');

-- Create prop_firms table
CREATE TABLE public.prop_firms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.categories(id),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  coupon_code TEXT,
  review_score DECIMAL(3,2) DEFAULT 0,
  trust_rating INTEGER DEFAULT 0,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  logo_url TEXT,
  profit_split INTEGER NOT NULL,
  payout_rate INTEGER NOT NULL,
  funding_amount TEXT NOT NULL,
  user_review_count INTEGER DEFAULT 0,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  affiliate_url TEXT,
  brand TEXT,
  platform TEXT,
  max_funding TEXT,
  evaluation_model TEXT,
  starting_fee DECIMAL(10,2),
  regulation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_id UUID REFERENCES public.prop_firms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_name TEXT DEFAULT 'Anonymous',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prop_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Create RLS policies for prop_firms (public read, admin write)
CREATE POLICY "Anyone can view prop firms" ON public.prop_firms
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert prop firms" ON public.prop_firms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update prop firms" ON public.prop_firms
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_prop_firms_category ON public.prop_firms(category_id);
CREATE INDEX idx_prop_firms_price ON public.prop_firms(price);
CREATE INDEX idx_prop_firms_review_score ON public.prop_firms(review_score);
CREATE INDEX idx_reviews_firm_id ON public.reviews(firm_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

-- Insert sample prop firms data
INSERT INTO public.prop_firms (
  name, slug, category_id, price, original_price, coupon_code, review_score, 
  trust_rating, description, features, profit_split, payout_rate, funding_amount,
  user_review_count, pros, cons, affiliate_url, brand, platform, max_funding,
  evaluation_model, starting_fee, regulation
) VALUES
(
  'FTMO', 'ftmo', (SELECT id FROM public.categories WHERE name = 'intermediate'),
  155.00, 200.00, 'PROP20', 4.5, 9, 
  'One of the most popular prop trading firms with excellent track record',
  ARRAY['MetaTrader 4/5', 'cTrader', 'DXTrade', 'News Trading Allowed', 'Weekend Holding'],
  80, 95, '$10K - $200K', 1250,
  ARRAY['High profit splits', 'Multiple platforms', 'Good support', 'Fast payouts'],
  ARRAY['Strict rules', 'High fees for some accounts'],
  'https://ftmo.com/?affiliates=1234', 'FTMO', 'MetaTrader 4/5',
  '$200,000', '2-Step Evaluation', 155.00, 'Czech Republic (CNB)'
),
(
  'The Funded Trader', 'the-funded-trader', (SELECT id FROM public.categories WHERE name = 'beginner'),
  99.00, 150.00, 'FUNDED15', 4.2, 8,
  'Great starting point for new traders with flexible rules',
  ARRAY['MetaTrader 4/5', 'News Trading', 'EA Trading', 'Mobile Trading'],
  80, 90, '$5K - $600K', 890,
  ARRAY['Beginner friendly', 'Flexible rules', 'Good education resources'],
  ARRAY['Lower profit splits', 'Limited platforms'],
  'https://thefundedtrader.com/ref=abc123', 'TFT', 'MetaTrader 4/5',
  '$600,000', '1-Step Evaluation', 99.00, 'USA (CFTC)'
),
(
  'MyForexFunds', 'myforexfunds', (SELECT id FROM public.categories WHERE name = 'pro'),
  299.00, 399.00, 'MFF25', 4.7, 9,
  'Premium prop firm for experienced traders with high funding',
  ARRAY['MetaTrader 4/5', 'cTrader', 'High Leverage', 'Instant Funding', 'Copy Trading'],
  85, 98, '$10K - $300K', 2100,
  ARRAY['High funding amounts', 'Excellent profit splits', 'Professional support'],
  ARRAY['Higher entry costs', 'Strict evaluation'],
  'https://myforexfunds.com/?ref=xyz789', 'MFF', 'MetaTrader 4/5',
  '$300,000', 'Instant Funding', 299.00, 'St. Vincent and Grenadines'
);

-- Insert sample reviews
INSERT INTO public.reviews (firm_id, reviewer_name, rating, title, content, is_verified, helpful_count) VALUES
(
  (SELECT id FROM public.prop_firms WHERE slug = 'ftmo'),
  'TradingPro23', 5, 'Excellent Experience',
  'Been trading with FTMO for 8 months. Great platform, fast payouts, and excellent support team.',
  true, 23
),
(
  (SELECT id FROM public.prop_firms WHERE slug = 'ftmo'),
  'ForexMaster', 4, 'Good but strict rules',
  'Good prop firm overall but the rules are quite strict. Make sure you understand them before starting.',
  true, 15
),
(
  (SELECT id FROM public.prop_firms WHERE slug = 'the-funded-trader'),
  'NewTrader2024', 5, 'Perfect for beginners',
  'Started my prop trading journey here. Very supportive and educational resources are great.',
  false, 31
);
