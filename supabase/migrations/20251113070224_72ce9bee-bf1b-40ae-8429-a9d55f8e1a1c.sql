-- Create section_memberships table
CREATE TABLE IF NOT EXISTS public.section_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_id UUID REFERENCES public.prop_firms(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.section_memberships ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for section memberships"
ON public.section_memberships
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage section memberships"
ON public.section_memberships
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Create index for better performance
CREATE INDEX idx_section_memberships_section_type ON public.section_memberships(section_type);
CREATE INDEX idx_section_memberships_rank ON public.section_memberships(section_type, rank);

-- Migrate existing data from old tables
INSERT INTO public.section_memberships (firm_id, section_type, rank)
SELECT propfirm_id, 'top-firms', 0 FROM public.top5_prop WHERE propfirm_id IS NOT NULL;

INSERT INTO public.section_memberships (firm_id, section_type, rank)
SELECT propfirm_id, 'budget-firms', 0 FROM public.budget_prop WHERE propfirm_id IS NOT NULL;

INSERT INTO public.section_memberships (firm_id, section_type, rank)
SELECT firm_id, 'explore-firms', 0 FROM public.explore_firms WHERE firm_id IS NOT NULL;

INSERT INTO public.section_memberships (firm_id, section_type, rank, created_at, updated_at)
SELECT firm_id, 'table-review', COALESCE(sort_priority, 0), created_at, updated_at 
FROM public.table_review_firms WHERE firm_id IS NOT NULL AND is_approved = true;