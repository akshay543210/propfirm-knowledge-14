export interface AccountSize {
  id: string;
  firm_id: string;
  size: string;
  discounted_price: number;
  original_price: number;
  promo_code?: string;
  buying_link?: string;
  created_at: string;
  updated_at: string;
}