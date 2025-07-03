-- Create account_sizes table
CREATE TABLE IF NOT EXISTS account_sizes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_id UUID REFERENCES prop_firms(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    discounted_price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) NOT NULL,
    promo_code TEXT,
    buying_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_account_sizes_firm_id ON account_sizes(firm_id);
CREATE INDEX IF NOT EXISTS idx_account_sizes_created_at ON account_sizes(created_at);

-- Enable RLS
ALTER TABLE account_sizes ENABLE ROW LEVEL SECURITY;

-- Create policies for account_sizes
CREATE POLICY "Allow public read access to account_sizes" ON account_sizes
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert to account_sizes" ON account_sizes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update to account_sizes" ON account_sizes
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete to account_sizes" ON account_sizes
    FOR DELETE USING (true);

-- Create reviews table if not exists
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_id UUID REFERENCES prop_firms(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    reviewer_name TEXT NOT NULL DEFAULT 'Anonymous',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_firm_id ON reviews(firm_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Enable RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Allow public read access to reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to reviews" ON reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update to reviews" ON reviews
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete to reviews" ON reviews
    FOR DELETE USING (true);

-- Insert sample account sizes data
INSERT INTO account_sizes (firm_id, size, discounted_price, original_price, promo_code, buying_link) 
SELECT 
    pf.id,
    '5K',
    155.00,
    175.00,
    'SAVE20',
    'https://example.com/buy-5k'
FROM prop_firms pf
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO account_sizes (firm_id, size, discounted_price, original_price, promo_code, buying_link) 
SELECT 
    pf.id,
    '10K',
    345.00,
    385.00,
    'SAVE20',
    'https://example.com/buy-10k'
FROM prop_firms pf
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO account_sizes (firm_id, size, discounted_price, original_price, promo_code, buying_link) 
SELECT 
    pf.id,
    '25K',
    540.00,
    600.00,
    'SAVE20',
    'https://example.com/buy-25k'
FROM prop_firms pf
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO account_sizes (firm_id, size, discounted_price, original_price, promo_code, buying_link) 
SELECT 
    pf.id,
    '50K',
    780.00,
    870.00,
    'SAVE20',
    'https://example.com/buy-50k'
FROM prop_firms pf
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO account_sizes (firm_id, size, discounted_price, original_price, promo_code, buying_link) 
SELECT 
    pf.id,
    '100K',
    1080.00,
    1200.00,
    'SAVE20',
    'https://example.com/buy-100k'
FROM prop_firms pf
LIMIT 1
ON CONFLICT DO NOTHING;