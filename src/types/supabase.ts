
export interface PropFirm {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  price: number;
  original_price: number;
  coupon_code: string | null;
  review_score: number;
  trust_rating: number;
  description: string | null;
  features: string[];
  logo_url: string | null;
  profit_split: number;
  payout_rate: number;
  funding_amount: string;
  user_review_count: number;
  pros: string[];
  cons: string[];
  affiliate_url: string | null;
  brand: string | null;
  platform: string | null;
  max_funding: string | null;
  evaluation_model: string | null;
  starting_fee: number | null;
  regulation: string | null;
  show_on_homepage?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  firm_id: string;
  user_id: string | null;
  reviewer_name: string;
  rating: number;
  title: string | null;
  content: string;
  is_verified: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  prop_firms?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}
