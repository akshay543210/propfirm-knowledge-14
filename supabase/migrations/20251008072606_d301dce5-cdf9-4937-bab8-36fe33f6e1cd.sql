-- 1) Ensure FK from section_memberships.firm_id -> prop_firms.id and helpful indexes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'section_memberships' AND c.conname = 'section_memberships_firm_id_fkey'
  ) THEN
    ALTER TABLE public.section_memberships
    ADD CONSTRAINT section_memberships_firm_id_fkey
    FOREIGN KEY (firm_id) REFERENCES public.prop_firms(id)
    ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;
  END IF;
END$$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_section_memberships_section_type ON public.section_memberships(section_type);
CREATE INDEX IF NOT EXISTS idx_section_memberships_rank ON public.section_memberships(rank);
CREATE INDEX IF NOT EXISTS idx_section_memberships_firm_id ON public.section_memberships(firm_id);

-- 2) Seed section memberships so pages have content
-- Top firms: highest review_score
INSERT INTO public.section_memberships (section_type, firm_id, rank)
SELECT 'top-firms', pf.id, ROW_NUMBER() OVER (ORDER BY pf.review_score DESC NULLS LAST)
FROM public.prop_firms pf
WHERE pf.review_score IS NOT NULL
ON CONFLICT DO NOTHING;

-- Budget firms: lowest price first
INSERT INTO public.section_memberships (section_type, firm_id, rank)
SELECT 'budget-firms', pf.id, ROW_NUMBER() OVER (ORDER BY pf.price ASC NULLS LAST)
FROM public.prop_firms pf
ON CONFLICT DO NOTHING;

-- Explore firms: arbitrary, use created_at desc
INSERT INTO public.section_memberships (section_type, firm_id, rank)
SELECT 'explore-firms', pf.id, ROW_NUMBER() OVER (ORDER BY pf.created_at DESC NULLS LAST)
FROM public.prop_firms pf
ON CONFLICT DO NOTHING;

-- Table review: use trust_rating desc
INSERT INTO public.section_memberships (section_type, firm_id, rank)
SELECT 'table-review', pf.id, ROW_NUMBER() OVER (ORDER BY pf.trust_rating DESC NULLS LAST)
FROM public.prop_firms pf
ON CONFLICT DO NOTHING;
