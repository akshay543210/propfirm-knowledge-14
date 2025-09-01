-- Enable RLS on all section tables
ALTER TABLE public.budget_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top5_prop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.explore_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_review_firms ENABLE ROW LEVEL SECURITY;