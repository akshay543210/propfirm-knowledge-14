-- Add market_type column to prop_firms table
ALTER TABLE public.prop_firms 
ADD COLUMN IF NOT EXISTS market_type TEXT[] DEFAULT ARRAY['forex'];

-- Update existing records to have forex as default
UPDATE public.prop_firms 
SET market_type = ARRAY['forex'] 
WHERE market_type IS NULL;

-- Add market_type to reviews table
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS market_type TEXT DEFAULT 'forex';

-- Update existing reviews
UPDATE public.reviews 
SET market_type = 'forex' 
WHERE market_type IS NULL;

-- Add market_type to drama_reports table  
ALTER TABLE public.drama_reports 
ADD COLUMN IF NOT EXISTS market_type TEXT DEFAULT 'forex';

-- Update existing drama reports
UPDATE public.drama_reports 
SET market_type = 'forex' 
WHERE market_type IS NULL;

-- Create index for faster market_type queries
CREATE INDEX IF NOT EXISTS idx_prop_firms_market_type ON public.prop_firms USING GIN(market_type);
CREATE INDEX IF NOT EXISTS idx_reviews_market_type ON public.reviews(market_type);
CREATE INDEX IF NOT EXISTS idx_drama_reports_market_type ON public.drama_reports(market_type);