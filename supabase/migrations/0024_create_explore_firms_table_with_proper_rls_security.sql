-- Create explore_firms table
CREATE TABLE public.explore_firms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_id UUID REFERENCES public.prop_firms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.explore_firms ENABLE ROW LEVEL SECURITY;

-- Create secure policies for each operation
CREATE POLICY "explore_firms_select_policy" ON public.explore_firms 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "explore_firms_insert_policy" ON public.explore_firms 
FOR INSERT TO authenticated WITH CHECK (EXISTS (
  SELECT 1 FROM public.prop_firms WHERE id = firm_id
));

CREATE POLICY "explore_firms_update_policy" ON public.explore_firms 
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "explore_firms_delete_policy" ON public.explore_firms 
FOR DELETE TO authenticated USING (true);