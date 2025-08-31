-- Create admin policies for prop_firms
CREATE POLICY "Admins can manage prop firms" ON public.prop_firms
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create admin policies for categories
CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create admin policies for reviews
CREATE POLICY "Admins can manage reviews" ON public.reviews
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create admin policies for drama_reports
CREATE POLICY "Admins can manage drama reports" ON public.drama_reports
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create admin policies for account_sizes
CREATE POLICY "Admins can manage account sizes" ON public.account_sizes
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create admin policies for section tables
CREATE POLICY "Admins can manage budget prop" ON public.budget_prop
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage top5 prop" ON public.top5_prop
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage table review firms" ON public.table_review_firms
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));