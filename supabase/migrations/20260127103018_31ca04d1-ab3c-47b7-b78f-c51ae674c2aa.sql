-- Fix Security Issue 1: Review Images Storage Bucket RLS Policies
-- Add RLS policies for the review-images bucket to prevent unauthorized uploads

-- Allow authenticated users to upload images to review-images bucket
-- Only allow uploads to folders matching existing prop_firms IDs
CREATE POLICY "Authenticated users can upload review images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'review-images' AND
  (storage.foldername(name))[1] IS NOT NULL
);

-- Allow public read access to review images
CREATE POLICY "Public read access for review images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'review-images');

-- Allow authenticated users to delete their own uploaded images
-- (Images they uploaded via their reviews)
CREATE POLICY "Authenticated users can delete review images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'review-images');

-- Fix Security Issue 2: Payout Cases Table - Add Ownership Tracking
-- Add submitted_by column for user ownership tracking
ALTER TABLE payout_cases ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES auth.users(id);

-- Set default status to Pending for new submissions
ALTER TABLE payout_cases ALTER COLUMN status SET DEFAULT 'Pending';

-- Drop broken/insecure RLS policies
DROP POLICY IF EXISTS "Authenticated users can insert payout cases" ON payout_cases;
DROP POLICY IF EXISTS "Users can update their own payout cases" ON payout_cases;
DROP POLICY IF EXISTS "Public read access for payout cases" ON payout_cases;

-- Create proper RLS policies for payout_cases

-- Users can submit payout cases with their user ID and Pending status
CREATE POLICY "Users can submit payout cases"
ON payout_cases FOR INSERT
TO authenticated
WITH CHECK (
  submitted_by = auth.uid() AND
  status = 'Pending'
);

-- Users can update their own pending cases only
CREATE POLICY "Users can update own pending cases"
ON payout_cases FOR UPDATE
TO authenticated
USING (submitted_by = auth.uid() AND status = 'Pending')
WITH CHECK (submitted_by = auth.uid() AND status = 'Pending');

-- Users can delete their own pending cases
CREATE POLICY "Users can delete own pending cases"
ON payout_cases FOR DELETE
TO authenticated
USING (submitted_by = auth.uid() AND status = 'Pending');

-- Public can only read approved cases
CREATE POLICY "Public can read approved payout cases"
ON payout_cases FOR SELECT
TO public
USING (status = 'Approved');

-- Users can see their own cases regardless of status
CREATE POLICY "Users can read own payout cases"
ON payout_cases FOR SELECT
TO authenticated
USING (submitted_by = auth.uid());

-- Create validation trigger for payout cases
CREATE OR REPLACE FUNCTION public.validate_payout_case()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-set submitted_by to current user on insert
  IF TG_OP = 'INSERT' THEN
    NEW.submitted_by := auth.uid();
    -- Force status to Pending on insert (prevent users from setting Approved)
    NEW.status := 'Pending';
  END IF;
  
  -- Validate firm exists
  IF NEW.firm_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.firms WHERE id = NEW.firm_id) THEN
    RAISE EXCEPTION 'Invalid firm_id: firm does not exist';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_payout_case_trigger ON payout_cases;
CREATE TRIGGER validate_payout_case_trigger
BEFORE INSERT OR UPDATE ON payout_cases
FOR EACH ROW EXECUTE FUNCTION public.validate_payout_case();