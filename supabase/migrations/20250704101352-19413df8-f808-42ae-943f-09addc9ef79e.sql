-- Create account_sizes table
CREATE TABLE IF NOT EXISTS public.account_sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_id UUID NOT NULL REFERENCES public.prop_firms(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  discounted_price NUMERIC NOT NULL,
  original_price NUMERIC NOT NULL,
  promo_code TEXT,
  buying_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.account_sizes ENABLE ROW LEVEL SECURITY;

-- Create policies for account_sizes
CREATE POLICY "Anyone can view account sizes" 
ON public.account_sizes 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert account sizes" 
ON public.account_sizes 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update account sizes" 
ON public.account_sizes 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Admins can delete account sizes" 
ON public.account_sizes 
FOR DELETE 
USING (is_admin());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_account_sizes_updated_at
BEFORE UPDATE ON public.account_sizes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();