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
        
        // Fetch firms from section_memberships table
        const { data, error } = await supabase
          .from('section_memberships')
          .select(`
            id,
            firm_id,
            rank,
            prop_firms:firm_id (
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
              created_at,
              updated_at
            )
          `)
          .eq('section_type', 'table-review')
          .order('rank', { ascending: true });

        if (error) throw error;
        
        // Extract the prop_firms data from the section_memberships result
        const firms = data
          .map((item: any) => ({
            ...item.prop_firms,
            sort_priority: item.rank
          }))
          .filter((firm: any) => firm !== null && firm.id);
        
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