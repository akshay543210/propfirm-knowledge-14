-- Add show_on_homepage column to prop_firms table
ALTER TABLE public.prop_firms 
ADD COLUMN show_on_homepage BOOLEAN NOT NULL DEFAULT false;

-- Create index for better performance on homepage queries
CREATE INDEX idx_prop_firms_show_on_homepage ON public.prop_firms(show_on_homepage);

-- Update RLS policies to allow public read access to show_on_homepage field
-- (The existing policies already allow public read access, so no changes needed)

-- Set some initial firms to show on homepage for testing
UPDATE public.prop_firms 
SET show_on_homepage = true 
WHERE id IN (
  SELECT id FROM public.prop_firms 
  ORDER BY review_score DESC NULLS LAST 
  LIMIT 3
);