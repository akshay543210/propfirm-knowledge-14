import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PropFirm } from '@/types/supabase';

interface SectionFirm extends PropFirm {
  membership_id: string;
  sort_priority?: number;
}

export const useSectionMemberships = () => {
  const [budgetFirms, setBudgetFirms] = useState<SectionFirm[]>([]);
  const [topFirms, setTopFirms] = useState<SectionFirm[]>([]);
  const [tableReviewFirms, setTableReviewFirms] = useState<SectionFirm[]>([]);
  const [exploreFirms, setExploreFirms] = useState<SectionFirm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchMemberships = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useSectionMemberships: Starting to fetch memberships...');
      
      // Fetch budget firms
      console.log('useSectionMemberships: Fetching budget firms...');
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
        // If we get a permission error, it's likely due to RLS policies
        if (budgetError.code === '42501' || budgetError.message?.includes('permission denied') || budgetError.message?.includes('policy')) {
          console.warn('🚨 Budget firms RLS policy issue detected. Using empty result for now.');
          console.warn('💡 To fix: Run the SQL in EMERGENCY_FIX_RLS_POLICIES.sql in Supabase SQL Editor');
          toast.error('❌ Budget firms data access restricted. Admin needs to fix RLS policies.');
          setError('Budget firms access denied: Missing public read policy for budget_prop table');
        } else {
          setError(`Budget firms error: ${budgetError.message}`);
        }
      }
      
      const budgetFirms = budgetData
        ?.map((item: any) => ({
          ...(item.prop_firms || {}),
          membership_id: item.id
        }))
        .filter((firm: any) => firm && firm.id) || [];
      
      console.log('useSectionMemberships: Budget firms found:', budgetFirms.length);
      setBudgetFirms(budgetFirms);

      // Fetch top firms
      console.log('useSectionMemberships: Fetching top firms...');
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
        // If we get a permission error, it's likely due to RLS policies
        if (topError.code === '42501' || topError.message?.includes('permission denied') || topError.message?.includes('policy')) {
          console.warn('🚨 Top firms RLS policy issue detected. Using empty result for now.');
          console.warn('💡 To fix: Run the SQL in EMERGENCY_FIX_RLS_POLICIES.sql in Supabase SQL Editor');
          toast.error('❌ Top firms data access restricted. Admin needs to fix RLS policies.');
          setError('Top firms access denied: Missing public read policy for top5_prop table');
        } else {
          setError(`Top firms error: ${topError.message}`);
        }
      }
      
      const topFirms = topData
        ?.map((item: any) => ({
          ...(item.prop_firms || {}),
          membership_id: item.id
        }))
        .filter((firm: any) => firm && firm.id) || [];
      
      console.log('useSectionMemberships: Top firms found:', topFirms.length);
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
      }
      
      const tableReviewFirms = tableData
        ?.map((item: any) => ({
          ...(item.prop_firms || {}),
          membership_id: item.id,
          sort_priority: item.sort_priority
        }))
        .filter((firm: any) => firm && firm.id) || [];
      
      setTableReviewFirms(tableReviewFirms);
      
      // Fetch explore firms from the actual table
      const { data: exploreData, error: exploreError } = await supabase
        .from('explore_firms' as any)
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
        `);
      
      if (exploreError) {
        console.error('Explore firms fetch error:', exploreError);
      }
      
      const exploreFirms = exploreData
        ?.map((item: any) => ({
          ...(item.prop_firms || {}),
          membership_id: item.id
        }))
        .filter((firm: any) => firm && firm.id) || [];
      
      setExploreFirms(exploreFirms);
    } catch (error: any) {
      console.error('Error fetching section memberships:', error);
      setError(error.message || 'Failed to fetch section memberships');
      
      // Check if this is a policy/permission error
      if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('policy')) {
        console.warn('RLS policy error detected. This likely means public read policies are missing.');
        console.warn('SOLUTION: Run the SQL script in EMERGENCY_FIX_RLS_POLICIES.sql in your Supabase SQL editor');
        
        toast.error('Database access restricted. Admin needs to fix RLS policies. Check console for details.');
        
        // Set empty arrays as fallback
        setBudgetFirms([]);
        setTopFirms([]);
        setTableReviewFirms([]);
        setExploreFirms([]);
      } else {
        toast.error('Failed to fetch section memberships');
      }
    } finally {
      setLoading(false);
      setHasInitialized(true);
    }
  }, []);

  const addFirmToExplore = async (firmId: string) => {
    try {
      const { error } = await supabase
        .from('explore_firms' as any)
        .insert([{ firm_id: firmId }]);
      
      if (error) throw error;
      
      await fetchMemberships();
      toast.success('Firm added to explore section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error adding firm to explore section:', error);
      if (error.code === '23505') {
        toast.error('Firm is already in explore section');
      } else {
        toast.error('Failed to add firm to explore section');
      }
      return { success: false, error: error.message };
    }
  };

  const removeFirmFromExplore = async (membershipId: string) => {
    try {
      console.log('Attempting to remove firm from explore section with membership ID:', membershipId);
      
      const { error, count } = await supabase
        .from('explore_firms' as any)
        .delete()
        .eq('id', membershipId)
        .select('*', { count: 'exact', head: true });
      
      console.log('Delete operation result:', { error, count });
      
      if (error) {
        console.error('Error deleting from explore_firms:', error);
        throw error;
      }
      
      // Check if any rows were actually deleted
      if (!count || count === 0) {
        const errorMsg = `No matching firm found in explore section. Membership ID: ${membershipId}`;
        console.warn(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log(`Successfully deleted ${count} rows from explore_firms`);
      await fetchMemberships();
      toast.success('Firm removed from explore section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error removing firm from explore section:', error);
      toast.error(`Failed to remove firm from explore section: ${error.message}`);
      return { success: false, error: error.message };
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
          return await addFirmToExplore(firmId);
          
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
      console.log('Attempting to remove firm from section with membership ID:', membershipId);
      
      // Try to delete from each possible table
      const tables = ['budget_prop', 'top5_prop', 'table_review_firms'];
      let deleted = false;
      let deletionCount = 0;
      let errorTable = '';
      
      for (const table of tables) {
        console.log(`Attempting to delete from ${table} with ID: ${membershipId}`);
        const { error, count } = await supabase
          .from(table as any)
          .delete()
          .eq('id', membershipId)
          .select('*', { count: 'exact', head: true });
          
        console.log(`Delete operation result for ${table}:`, { error, count });
        
        if (error) {
          console.error(`Error deleting from ${table}:`, error);
          errorTable = table;
          continue;
        }
        
        if (count && count > 0) {
          deleted = true;
          deletionCount = count;
          console.log(`Successfully deleted ${count} rows from ${table}`);
          break;
        } else {
          console.log(`No rows deleted from ${table} (count: ${count})`);
        }
      }
      
      if (!deleted) {
        const errorMsg = `Failed to remove firm from section - no matching record found in any table. Membership ID: ${membershipId}`;
        console.warn(errorMsg);
        throw new Error(errorMsg);
      }
      
      await fetchMemberships();
      toast.success('Firm removed from section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error removing firm from section:', error);
      toast.error(`Failed to remove firm from section: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getMembershipsBySection = (section: string) => {
    switch (section) {
      case 'budget-firms':
      case 'cheap-firms':
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

  useEffect(() => {
    if (!hasInitialized) {
      fetchMemberships();
    }
  }, [fetchMemberships, hasInitialized]);

  return {
    budgetFirms,
    topFirms,
    tableReviewFirms,
    exploreFirms,
    loading,
    error,
    hasInitialized,
    addFirmToExplore,
    removeFirmFromExplore,
    addFirmToSection,
    removeFirmFromSection,
    getMembershipsBySection,
    refetch: fetchMemberships
  };
};