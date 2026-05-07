
-- Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- New columns
ALTER TABLE public.prop_firms
  ADD COLUMN IF NOT EXISTS platforms text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS asset_classes text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS feature_tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS countries text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS fee_min numeric,
  ADD COLUMN IF NOT EXISTS fee_max numeric,
  ADD COLUMN IF NOT EXISTS account_min numeric,
  ADD COLUMN IF NOT EXISTS account_max numeric,
  ADD COLUMN IF NOT EXISTS profit_split_min numeric,
  ADD COLUMN IF NOT EXISTS profit_split_max numeric,
  ADD COLUMN IF NOT EXISTS year_established int,
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rating_avg numeric(2,1),
  ADD COLUMN IF NOT EXISTS tsv tsvector;

-- Slugify helper
CREATE OR REPLACE FUNCTION public.slugify(input text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT trim(both '-' from regexp_replace(lower(coalesce(input,'')), '[^a-z0-9]+', '-', 'g'))
$$;

-- Trigger: auto-fill slug + tsv
CREATE OR REPLACE FUNCTION public.prop_firms_search_trigger()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  base_slug text;
  candidate text;
  n int := 1;
BEGIN
  -- slug
  IF NEW.slug IS NULL OR length(trim(NEW.slug)) = 0 THEN
    base_slug := public.slugify(NEW.name);
    IF base_slug = '' THEN base_slug := 'firm'; END IF;
    candidate := base_slug;
    WHILE EXISTS (SELECT 1 FROM public.prop_firms WHERE slug = candidate AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)) LOOP
      n := n + 1;
      candidate := base_slug || '-' || n;
    END LOOP;
    NEW.slug := candidate;
  END IF;

  -- tsv
  NEW.tsv :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.brand, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prop_firms_search_trigger ON public.prop_firms;
CREATE TRIGGER prop_firms_search_trigger
BEFORE INSERT OR UPDATE ON public.prop_firms
FOR EACH ROW EXECUTE FUNCTION public.prop_firms_search_trigger();

-- Backfill
UPDATE public.prop_firms SET
  rating_avg = COALESCE(rating_avg, review_score),
  fee_min = COALESCE(fee_min, starting_fee, price),
  fee_max = COALESCE(fee_max, price),
  platforms = CASE
    WHEN (platforms IS NULL OR cardinality(platforms) = 0) AND platform IS NOT NULL AND length(trim(platform)) > 0
      THEN string_to_array(platform, ',')
    ELSE platforms
  END;

-- Force trigger to populate tsv & slug on existing rows
UPDATE public.prop_firms SET name = name;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prop_firms_tsv ON public.prop_firms USING GIN (tsv);
CREATE INDEX IF NOT EXISTS idx_prop_firms_platforms ON public.prop_firms USING GIN (platforms);
CREATE INDEX IF NOT EXISTS idx_prop_firms_asset_classes ON public.prop_firms USING GIN (asset_classes);
CREATE INDEX IF NOT EXISTS idx_prop_firms_feature_tags ON public.prop_firms USING GIN (feature_tags);
CREATE INDEX IF NOT EXISTS idx_prop_firms_countries ON public.prop_firms USING GIN (countries);
CREATE INDEX IF NOT EXISTS idx_prop_firms_market_type ON public.prop_firms USING GIN (market_type);
CREATE INDEX IF NOT EXISTS idx_prop_firms_name_trgm ON public.prop_firms USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_prop_firms_slug_trgm ON public.prop_firms USING GIN (slug gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_prop_firms_fee_min ON public.prop_firms (fee_min);
CREATE INDEX IF NOT EXISTS idx_prop_firms_fee_max ON public.prop_firms (fee_max);
CREATE INDEX IF NOT EXISTS idx_prop_firms_rating_avg ON public.prop_firms (rating_avg);
CREATE INDEX IF NOT EXISTS idx_prop_firms_year_established ON public.prop_firms (year_established);
CREATE INDEX IF NOT EXISTS idx_prop_firms_verified ON public.prop_firms (verified);
