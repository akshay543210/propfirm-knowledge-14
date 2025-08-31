-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prop_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_review_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drama_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_sizes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Public read access for prop firms" ON public.prop_firms
    FOR SELECT USING (true);

CREATE POLICY "Public read access for reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Public read access for account sizes" ON public.account_sizes
    FOR SELECT USING (true);

-- Create policies for table_review_firms (only approved records)
CREATE POLICY "Public read access for approved table reviews" ON public.table_review_firms
    FOR SELECT USING (is_approved = true);

-- Create policies for drama_reports (only approved records)
CREATE POLICY "Public read access for approved drama reports" ON public.drama_reports
    FOR SELECT USING (status = 'Approved');