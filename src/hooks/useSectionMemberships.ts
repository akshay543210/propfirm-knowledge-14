import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PropFirm } from '@/types/supabase';

interface SectionFirm extends PropFirm {
  membership_id: string;
}

export const useSectionMemberships = () => {
  const [budgetFirms, setBudgetFirms] = useState<SectionFirm[]>([]);
  const [topFirms, setTopFirms] = useState<SectionFirm[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      
      // Fetch budget firms
      const { data: budgetData, error: budgetError } = await supabase
        .from('budget_prop')
        .select(`
          id,
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
            created_at,
            updated_at
          )
        `);

      if (budgetError) throw budgetError;
      
      const budgetFirms = budgetData
        .map((item: any) => ({
          ...item.prop_firms,
          membership_id: item.id
        }))
        .filter((firm: any) => firm !== null);
      
      setBudgetFirms(budgetFirms);

      // Fetch top firms
      const { data: topData, error: topError } = await supabase
        .from('top5_prop')
        .select(`
          id,
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
            created_at,
            updated_at
          )
        `);

      if (topError) throw topError;
      
      const topFirms = topData
        .map((item: any) => ({
          ...item.prop_firms,
          membership_id: item.id
        }))
        .filter((firm: any) => firm !== null);
      
      setTopFirms(topFirms);
    } catch (error) {
      console.error('Error fetching section memberships:', error);
      toast.error('Failed to fetch section memberships');
    } finally {
      setLoading(false);
    }
  };

  const addFirmToBudget = async (firmId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('budget_prop')
        .insert([{ propfirm_id: firmId }]);

      if (error) throw error;
      
      await fetchMemberships();
      toast.success('Firm added to budget section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error adding firm to budget section:', error);
      if (error.code === '23505') {
        toast.error('Firm is already in budget section');
      } else {
        toast.error('Failed to add firm to budget section');
      }
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFirmFromBudget = async (membershipId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('budget_prop')
        .delete()
        .eq('id', membershipId);

      if (error) throw error;
      
      await fetchMemberships();
      toast.success('Firm removed from budget section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error removing firm from budget section:', error);
      toast.error('Failed to remove firm from budget section');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const addFirmToTop = async (firmId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('top5_prop')
        .insert([{ propfirm_id: firmId }]);

      if (error) throw error;
      
      await fetchMemberships();
      toast.success('Firm added to top 5 section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error adding firm to top 5 section:', error);
      if (error.code === '23505') {
        toast.error('Firm is already in top 5 section');
      } else {
        toast.error('Failed to add firm to top 5 section');
      }
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFirmFromTop = async (membershipId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('top5_prop')
        .delete()
        .eq('id', membershipId);

      if (error) throw error;
      
      await fetchMemberships();
      toast.success('Firm removed from top 5 section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error removing firm from top 5 section:', error);
      toast.error('Failed to remove firm from top 5 section');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  return {
    budgetFirms,
    topFirms,
    loading,
    addFirmToBudget,
    removeFirmFromBudget,
    addFirmToTop,
    removeFirmFromTop,
    refetch: fetchMemberships
  };
};