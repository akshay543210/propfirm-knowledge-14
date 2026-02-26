import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropFirm } from '@/types/supabase';
import { useAppReady } from '@/contexts/AppReadyContext';
import { recoverSession, clearRecoveryCounter } from '@/utils/sessionRecovery';

const FETCH_TIMEOUT = 10000;

export const useTableReviewFirms = () => {
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { allReady } = useAppReady();
  const isMountedRef = useRef(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    if (!allReady) {
      return;
    }

    hasFetchedRef.current = true;

    const fetchTableReviewFirms = async () => {
      const attempt = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
        
        try {
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
            .order('rank', { ascending: true })
            .abortSignal(controller.signal);

          clearTimeout(timeoutId);
          if (error) throw error;
          return data;
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        }
      };

      try {
        setLoading(true);

        let data: any;
        try {
          data = await attempt();
        } catch (firstError) {
          console.warn('useTableReviewFirms: First attempt failed, retrying...', firstError);
          data = await attempt();
        }

        if (!isMountedRef.current) return;
        
        const firms = data
          .map((item: any) => ({
            ...item.prop_firms,
            sort_priority: item.rank
          }))
          .filter((firm: any) => firm !== null && firm.id);
        
        setFirms(firms);
        setError(null);
        clearRecoveryCounter();
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchTableReviewFirms();

    return () => {
      isMountedRef.current = false;
    };
  }, [allReady]);

  // Fallback timer
  useEffect(() => {
    if (!allReady) return;
    
    const fallbackTimer = setTimeout(() => {
      if (loading && hasFetchedRef.current && isMountedRef.current) {
        setLoading(false);
      }
    }, FETCH_TIMEOUT + 1000);

    return () => clearTimeout(fallbackTimer);
  }, [loading, allReady]);

  return { firms, loading, error };
};
