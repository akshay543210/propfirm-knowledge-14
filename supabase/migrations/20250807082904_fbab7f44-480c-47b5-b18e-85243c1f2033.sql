-- Create enum types for drama reports
CREATE TYPE public.drama_type AS ENUM (
  'Payout Delay',
  'Account Ban', 
  'Rule Change',
  'Suspicious Activity',
  'Shutdown',
  'Other'
);

CREATE TYPE public.drama_severity AS ENUM (
  'Low',
  'Medium', 
  'High',
  'Scam Alert'
);

CREATE TYPE public.drama_status AS ENUM (
  'Pending',
  'Approved',
  'Rejected'
);

-- Create drama_reports table
CREATE TABLE public.drama_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_name TEXT NOT NULL,
  date_reported DATE NOT NULL DEFAULT CURRENT_DATE,
  drama_type drama_type NOT NULL,
  description TEXT NOT NULL,
  source_links TEXT[],
  severity drama_severity NOT NULL,
  status drama_status NOT NULL DEFAULT 'Pending',
  submitted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.drama_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view approved drama reports" 
ON public.drama_reports 
FOR SELECT 
USING (status = 'Approved');

CREATE POLICY "Authenticated users can insert drama reports" 
ON public.drama_reports 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = submitted_by AND status = 'Pending');

CREATE POLICY "Users can view their own drama reports" 
ON public.drama_reports 
FOR SELECT 
TO authenticated
USING (auth.uid() = submitted_by);

CREATE POLICY "Admins can view all drama reports" 
ON public.drama_reports 
FOR SELECT 
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can update drama reports" 
ON public.drama_reports 
FOR UPDATE 
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete drama reports" 
ON public.drama_reports 
FOR DELETE 
TO authenticated
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_drama_reports_updated_at
BEFORE UPDATE ON public.drama_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_drama_reports_status ON public.drama_reports(status);
CREATE INDEX idx_drama_reports_firm_name ON public.drama_reports(firm_name);
CREATE INDEX idx_drama_reports_created_at ON public.drama_reports(created_at DESC);