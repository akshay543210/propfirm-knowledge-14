export interface PropFirm {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  price: number;
  original_price: number;
  coupon_code: string | null;
  review_score: number | null;
  trust_rating: number | null;
  description: string | null;
  features: string[] | null;
  logo_url: string | null;
  profit_split: number;
  payout_rate: number;
  funding_amount: string;
  user_review_count: number | null;
  pros: string[] | null;
  cons: string[] | null;
  affiliate_url: string | null;
  brand: string | null;
  platform: string | null;
  max_funding: string | null;
  evaluation_model: string | null;
  starting_fee: number | null;
  regulation: string | null;
  show_on_homepage: boolean;
  created_at: string | null;
  updated_at: string | null;
  // Table review fields
  table_price: number | null;
  table_profit_split: number | null;
  table_payout_rate: number | null;
  table_platform: string | null;
  table_trust_rating: number | null;
  table_evaluation_rules: string | null;
  table_fee: number | null;
  table_coupon_code: string | null;
}

export interface Review {
  id: string;
  firm_id: string | null;
  user_id: string | null;
  reviewer_name: string | null;
  rating: number;
  title: string | null;
  content: string;
  is_verified: boolean | null;
  helpful_count: number | null;
  created_at: string | null;
  updated_at: string | null;
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
  created_at: string | null;
}