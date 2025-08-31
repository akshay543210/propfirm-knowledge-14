import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropFirm } from '@/types/supabase';

export const useTableReviewFirms = () => {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTableReviewFirms = async () => {
      try {
        setLoading(true);
        
        // Fetch approved firms for table review with their table-specific data
        const { data, error } = await supabase
          .from('table_review_firms')
          .select(`
            sort_priority,
            prop_firms (
              id,
              name,
              slug,
              category_id,
              price,
              original_price,
              coupon_code,
              review_score,
              trust_rating,
              description,
              features,
              logo_url,
              profit_split,
              payout_rate,
              funding_amount,
              user_review_count,
              pros,
              cons,
              affiliate_url,
              brand,
              platform,
              max_funding,
              evaluation_model,
              starting_fee,
              regulation,
              show_on_homepage,
              table_price,
              table_profit_split,
              table_payout_rate,
              table_platform,
              table_trust_rating,
              table_evaluation_rules,
              table_fee,
              table_coupon_code,
              created_at,
              updated_at
            )
          `)
          .eq('is_approved', true)
          .order('sort_priority', { ascending: true });

        if (error) throw error;
        
        // Extract the prop_firms data from the table_review_firms result
        const firms = data
          .map((item: any) => ({
            ...item.prop_firms,
            sort_priority: item.sort_priority
          }))
          .filter((firm: any) => firm !== null);
        
        setFirms(firms);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTableReviewFirms();
  }, []);

  return { firms, loading, error };
};