-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prop_firms table
CREATE TABLE IF NOT EXISTS public.prop_firms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id TEXT REFERENCES public.categories(id),
    price NUMERIC NOT NULL,
    original_price NUMERIC NOT NULL,
    coupon_code TEXT,
    review_score NUMERIC,
    trust_rating NUMERIC,
    description TEXT,
    features TEXT[],
    logo_url TEXT,
    profit_split NUMERIC NOT NULL,
    payout_rate NUMERIC NOT NULL,
    funding_amount TEXT NOT NULL,
    user_review_count INTEGER,
    pros TEXT[],
    cons TEXT[],
    affiliate_url TEXT,
    brand TEXT,
    platform TEXT,
    max_funding TEXT,
    evaluation_model TEXT,
    starting_fee NUMERIC,
    regulation TEXT,
    show_on_homepage BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    table_price NUMERIC,
    table_profit_split NUMERIC,
    table_payout_rate NUMERIC,
    table_platform TEXT,
    table_trust_rating NUMERIC,
    table_evaluation_rules TEXT,
    table_fee NUMERIC,
    table_coupon_code TEXT
);

-- Create budget_prop table
CREATE TABLE IF NOT EXISTS public.budget_prop (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    propfirm_id UUID REFERENCES public.prop_firms(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(propfirm_id)
);

-- Create top5_prop table
CREATE TABLE IF NOT EXISTS public.top5_prop (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    propfirm_id UUID REFERENCES public.prop_firms(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(propfirm_id)
);

-- Create table_review_firms table
CREATE TABLE IF NOT EXISTS public.table_review_firms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_id UUID REFERENCES public.prop_firms(id) ON DELETE CASCADE,
    is_approved BOOLEAN DEFAULT false,
    sort_priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(firm_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_id UUID REFERENCES public.prop_firms(id) ON DELETE CASCADE,
    user_id UUID,
    reviewer_name TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drama_reports table
CREATE TABLE IF NOT EXISTS public.drama_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_name TEXT NOT NULL,
    date_reported DATE DEFAULT CURRENT_DATE,
    drama_type TEXT NOT NULL,
    description TEXT NOT NULL,
    source_links TEXT[],
    severity TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    submitted_by UUID,
    admin_approved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create account_sizes table
CREATE TABLE IF NOT EXISTS public.account_sizes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firm_id UUID REFERENCES public.prop_firms(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    discounted_price NUMERIC NOT NULL,
    original_price NUMERIC NOT NULL,
    promo_code TEXT,
    buying_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);