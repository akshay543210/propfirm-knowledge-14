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
  const [tableReviewFirms, setTableReviewFirms] = useState<SectionFirm[]>([]);
  const [exploreFirms, setExploreFirms] = useState<SectionFirm[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      
      // Fetch budget firms
      const { data: budgetData, error: budgetError } = await supabase
        .from('budget_prop')
        .select(`
          id,
          propfirm_id,
          created_at,
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
        `);

      if (budgetError) {
        console.error('Budget firms fetch error:', budgetError);
        // Don't throw error, just continue with empty array
      }
      
      const budgetFirms = budgetData
        ?.map((item: any) => ({
          ...(item.prop_firms || {}),
          membership_id: item.id
        }))
        .filter((firm: any) => firm && firm.id) || [];
      
      setBudgetFirms(budgetFirms);

      // Fetch top firms
      const { data: topData, error: topError } = await supabase
        .from('top5_prop')
        .select(`
          id,
          propfirm_id,
          created_at,
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
        `);

      if (topError) {
        console.error('Top firms fetch error:', topError);
        // Don't throw error, just continue with empty array
      }
      
      const topFirms = topData
        ?.map((item: any) => ({
          ...(item.prop_firms || {}),
          membership_id: item.id
        }))
        .filter((firm: any) => firm && firm.id) || [];
      
      setTopFirms(topFirms);

      // Fetch table review firms
      const { data: tableData, error: tableError } = await supabase
        .from('table_review_firms')
        .select(`
          id,
          firm_id,
          is_approved,
          sort_priority,
          created_at,
          updated_at,
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

      if (tableError) {
        console.error('Table review firms fetch error:', tableError);
        // Don't throw error, just continue with empty array
      }
      
      const tableReviewFirms = tableData
        ?.map((item: any) => ({
          ...(item.prop_firms || {}),
          membership_id: item.id,
          is_approved: item.is_approved,
          sort_priority: item.sort_priority
        }))
        .filter((firm: any) => firm && firm.id) || [];
      
      setTableReviewFirms(tableReviewFirms);

      // Fetch explore firms
      const { data: exploreData, error: exploreError } = await supabase
        .from('explore_firms')
        .select(`
          id,
          firm_id,
          created_at,
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
        .order('created_at', { ascending: false });

      if (exploreError) {
        console.error('Explore firms fetch error:', exploreError);
        // Don't throw error, just continue with empty array
      }
      
      const exploreFirms = exploreData
        ?.map((item: any) => ({
          ...(item.prop_firms || {}),
          membership_id: item.id
        }))
        .filter((firm: any) => firm && firm.id) || [];
      
      setExploreFirms(exploreFirms);
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

  const addFirmToTableReview = async (firmId: string, sortPriority: number = 0) => {
    try {
      setLoading(true);
      
      // Check if firm is already in table review
      const { data: existingData, error: existingError } = await supabase
        .from('table_review_firms')
        .select('id')
        .eq('firm_id', firmId)
        .single();

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }

      let error;
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('table_review_firms')
          .update({ 
            is_approved: true,
            sort_priority: sortPriority
          })
          .eq('id', existingData.id);
        error = updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('table_review_firms')
          .insert([{ 
            firm_id: firmId,
            is_approved: true,
            sort_priority: sortPriority
          }]);
        error = insertError;
      }

      if (error) throw error;
      
      await fetchMemberships();
      toast.success('Firm added to table review section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error adding firm to table review section:', error);
      toast.error('Failed to add firm to table review section');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFirmFromTableReview = async (membershipId: string) => {
    try {
      setLoading(true);
      
      // Instead of deleting, we'll set is_approved to false
      const { error } = await supabase
        .from('table_review_firms')
        .update({ is_approved: false })
        .eq('id', membershipId);

      if (error) throw error;
      
      await fetchMemberships();
      toast.success('Firm removed from table review section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error removing firm from table review section:', error);
      toast.error('Failed to remove firm from table review section');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const addFirmToSection = async (section: string, firmId: string, rank: number = 1) => {
    try {
      setLoading(true);
      let error;
      
      switch (section) {
        case 'budget-firms':
          const { error: budgetError } = await supabase
            .from('budget_prop')
            .insert([{ propfirm_id: firmId }]);
          error = budgetError;
          break;
          
        case 'top-firms':
          const { error: topError } = await supabase
            .from('top5_prop')
            .insert([{ propfirm_id: firmId }]);
          error = topError;
          break;
          
        case 'table-review':
          const { error: tableError } = await supabase
            .from('table_review_firms')
            .insert([{ 
              firm_id: firmId,
              is_approved: true,
              sort_priority: rank
            }]);
          error = tableError;
          break;
          
        case 'explore-firms':
          const { error: exploreError } = await supabase
            .from('explore_firms')
            .insert([{ firm_id: firmId }]);
          error = exploreError;
          break;
          
        default:
          throw new Error('Invalid section');
      }

      if (error) throw error;
      
      await fetchMemberships();
      toast.success(`Firm added to ${section} section successfully`);
      return { success: true };
    } catch (error: any) {
      console.error(`Error adding firm to ${section} section:`, error);
      if (error.code === '23505') {
        toast.error('Firm is already in this section');
      } else {
        toast.error(`Failed to add firm to ${section} section`);
      }
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFirmFromSection = async (membershipId: string) => {
    try {
      setLoading(true);
      
      // Try to delete from each possible table
      const tables = ['budget_prop', 'top5_prop', 'table_review_firms', 'explore_firms'];
      let deleted = false;
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', membershipId);
          
        if (!error) {
          deleted = true;
          break;
        }
      }
      
      if (!deleted) {
        throw new Error('Failed to remove firm from section');
      }
      
      await fetchMemberships();
      toast.success('Firm removed from section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error removing firm from section:', error);
      toast.error('Failed to remove firm from section');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getMembershipsBySection = (section: string) => {
    switch (section) {
      case 'budget-firms':
        return budgetFirms.map(firm => ({
          id: firm.membership_id,
          firm_id: firm.id,
          rank: 0,
          prop_firms: firm
        }));
      case 'top-firms':
        return topFirms.map(firm => ({
          id: firm.membership_id,
          firm_id: firm.id,
          rank: 0,
          prop_firms: firm
        }));
      case 'table-review':
        return tableReviewFirms.map(firm => ({
          id: firm.membership_id,
          firm_id: firm.id,
          rank: firm.sort_priority || 0,
          prop_firms: firm
        }));
      case 'explore-firms':
        return exploreFirms.map(firm => ({
          id: firm.membership_id,
          firm_id: firm.id,
          rank: 0,
          prop_firms: firm
        }));
      default:
        return [];
    }
  };

  const updateTableReviewPriority = async (membershipId: string, sortPriority: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('table_review_firms')
        .update({ sort_priority: sortPriority })
        .eq('id', membershipId);

      if (error) throw error;
      
      await fetchMemberships();
      return { success: true };
    } catch (error: any) {
      console.error('Error updating table review priority:', error);
      toast.error('Failed to update table review priority');
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
    tableReviewFirms,
    exploreFirms,
    loading,
    addFirmToBudget,
    removeFirmFromBudget,
    addFirmToTop,
    removeFirmFromTop,
    addFirmToTableReview,
    removeFirmFromTableReview,
    addFirmToSection,
    removeFirmFromSection,
    getMembershipsBySection,
    updateTableReviewPriority,
    refetch: fetchMemberships
  };
};