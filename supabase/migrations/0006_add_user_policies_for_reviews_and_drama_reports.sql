-- Create policies for users to manage their own reviews
CREATE POLICY "Users can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (user_id = auth.uid());

-- Create policies for users to submit drama reports
CREATE POLICY "Users can insert drama reports" ON public.drama_reports
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for users to manage their own drama reports
CREATE POLICY "Users can update their own drama reports" ON public.drama_reports
    FOR UPDATE USING (submitted_by = auth.uid());

CREATE POLICY "Users can delete their own drama reports" ON public.drama_reports
    FOR DELETE USING (submitted_by = auth.uid());