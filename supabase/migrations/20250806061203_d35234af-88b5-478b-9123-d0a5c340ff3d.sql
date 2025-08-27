-- Create sections table if it doesn't exist (but it already exists, so we'll just ensure it has the right structure)
-- The sections table already exists, so let's create a table to track which firms are in which sections

-- Create section_memberships table to track which firms belong to which sections
CREATE TABLE IF NOT EXISTS public.section_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL, -- 'cheap-firms', 'top-firms', etc.
  firm_id UUID NOT NULL REFERENCES public.prop_firms(id) ON DELETE CASCADE,
  rank INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(section_type, firm_id)
);

-- Enable RLS
ALTER TABLE public.section_memberships ENABLE ROW LEVEL SECURITY;

-- Create policies for section_memberships
CREATE POLICY "Anyone can view section memberships" 
ON public.section_memberships 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert section memberships" 
ON public.section_memberships 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update section memberships" 
ON public.section_memberships 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete section memberships" 
ON public.section_memberships 
FOR DELETE 
USING (is_admin());

-- Create trigger for updating timestamps
CREATE TRIGGER update_section_memberships_updated_at
BEFORE UPDATE ON public.section_memberships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();