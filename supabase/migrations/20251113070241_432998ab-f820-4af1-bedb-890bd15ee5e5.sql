-- Add images column to reviews table
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT NULL;