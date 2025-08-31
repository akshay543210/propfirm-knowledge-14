import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PropFirm } from '@/types/supabase';

interface SectionFirm extends PropFirm {
  membership_id: string;
}

// Helper function to fetch section data
const fetchSectionData = async (tableName: string, selectQuery: string, additionalFilters: string = '') => {
  try {
    let query = supabase
      .from(tableName)
      .select(selectQuery);
    
    if (additionalFilters) {
      // Apply additional filters if provided
      const [column, value] = additionalFilters.split('=');
      query = query.eq(column, value);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`${tableName} fetch error:`, error);
      return [];
    }
    
    return data
      ?.map((item: any) => ({
        ...(item.prop_firms || {}),
        membership_id: item.id,
        ...(item.is_approved !== undefined && { is_approved: item.is_approved }),
        ...(item.sort_priority !== undefined && { sort_priority: item.sort_priority }),
      }))
      .filter((firm: any) => firm && firm.id) || [];
  } catch (error) {
    console.error(`Error fetching ${tableName}:`, error);
    return [];
  }
};

// Helper function to add firm to section
const addFirmToSectionHelper = async (tableName: string, firmIdField: string, firmId: string, additionalData: Record<string, any> = {}) => {
  try {
    const insertData = { 
      [firmIdField]: firmId,
      ...additionalData
    };
    
    const { error } = await supabase
      .from(tableName)
      .insert([insertData]);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error(`Error adding firm to ${tableName}:`, error);
    return { success: false, error: error.message };
  }
};

// Helper function to remove firm from section
const removeFirmFromSectionHelper = async (tableName: string, membershipId: string) => {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', membershipId);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error(`Error removing firm from ${tableName}:`, error);
    return { success: false, error: error.message };
  }
};

export const useSectionMemberships = () => {
  const [budgetFirms, setBudgetFirms] = useState<SectionFirm[]>([]);
  const [topFirms, setTopFirms] = useState<SectionFirm[]>([]);
  const [tableReviewFirms, setTableReviewFirms] = useState<SectionFirm[]>([]);
  const [exploreFirms, setExploreFirms] = useState<SectionFirm[]>([]);
  const [loading, setLoading] = useState(false);

  const commonSelectQuery = `
    id,
    propfirm_id,
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
  `;

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      
      // Fetch all sections in parallel
      const [
        budgetData,
        topData,
        tableData,
        exploreData
      ] = await Promise.all([
        fetchSectionData('budget_prop', commonSelectQuery),
        fetchSectionData('top5_prop', commonSelectQuery),
        fetchSectionData('table_review_firms', commonSelectQuery, 'is_approved=true'),
        fetchSectionData('explore_firms', commonSelectQuery)
      ]);
      
      setBudgetFirms(budgetData);
      setTopFirms(topData);
      setTableReviewFirms(tableData);
      setExploreFirms(exploreData);
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
      const result = await addFirmToSectionHelper('budget_prop', 'propfirm_id', firmId);
      
      if (result.success) {
        await fetchMemberships();
        toast.success('Firm added to budget section successfully');
      } else {
        if (result.error.includes('duplicate')) {
          toast.error('Firm is already in budget section');
        } else {
          toast.error('Failed to add firm to budget section');
        }
      }
      
      return result;
    } catch (error: any) {
      console.error('Error adding firm to budget section:', error);
      toast.error('Failed to add firm to budget section');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFirmFromBudget = async (membershipId: string) => {
    try {
      setLoading(true);
      const result = await removeFirmFromSectionHelper('budget_prop', membershipId);
      
      if (result.success) {
        await fetchMemberships();
        toast.success('Firm removed from budget section successfully');
      } else {
        toast.error('Failed to remove firm from budget section');
      }
      
      return result;
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
      const result = await addFirmToSectionHelper('top5_prop', 'propfirm_id', firmId);
      
      if (result.success) {
        await fetchMemberships();
        toast.success('Firm added to top 5 section successfully');
      } else {
        if (result.error.includes('duplicate')) {
          toast.error('Firm is already in top 5 section');
        } else {
          toast.error('Failed to add firm to top 5 section');
        }
      }
      
      return result;
    } catch (error: any) {
      console.error('Error adding firm to top 5 section:', error);
      toast.error('Failed to add firm to top 5 section');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFirmFromTop = async (membershipId: string) => {
    try {
      setLoading(true);
      const result = await removeFirmFromSectionHelper('top5_prop', membershipId);
      
      if (result.success) {
        await fetchMemberships();
        toast.success('Firm removed from top 5 section successfully');
      } else {
        toast.error('Failed to remove firm from top 5 section');
      }
      
      return result;
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

      let result;
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('table_review_firms')
          .update({ 
            is_approved: true,
            sort_priority: sortPriority
          })
          .eq('id', existingData.id);
        result = { success: !updateError, error: updateError?.message };
      } else {
        // Create new record
        result = await addFirmToSectionHelper('table_review_firms', 'firm_id', firmId, { 
          is_approved: true,
          sort_priority: sortPriority
        });
      }

      if (result.success) {
        await fetchMemberships();
        toast.success('Firm added to table review section successfully');
      } else {
        toast.error('Failed to add firm to table review section');
      }
      
      return result;
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

  const addFirmToExplore = async (firmId: string) => {
    try {
      setLoading(true);
      const result = await addFirmToSectionHelper('explore_firms', 'firm_id', firmId);
      
      if (result.success) {
        await fetchMemberships();
        toast.success('Firm added to explore section successfully');
      } else {
        if (result.error.includes('duplicate')) {
          toast.error('Firm is already in explore section');
        } else {
          toast.error('Failed to add firm to explore section');
        }
      }
      
      return result;
    } catch (error: any) {
      console.error('Error adding firm to explore section:', error);
      toast.error('Failed to add firm to explore section');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFirmFromExplore = async (membershipId: string) => {
    try {
      setLoading(true);
      const result = await removeFirmFromSectionHelper('explore_firms', membershipId);
      
      if (result.success) {
        await fetchMemberships();
        toast.success('Firm removed from explore section successfully');
      } else {
        toast.error('Failed to remove firm from explore section');
      }
      
      return result;
    } catch (error: any) {
      console.error('Error removing firm from explore section:', error);
      toast.error('Failed to remove firm from explore section');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const addFirmToSection = async (section: string, firmId: string, rank: number = 1) => {
    try {
      setLoading(true);
      
      switch (section) {
        case 'budget-firms':
          return await addFirmToBudget(firmId);
        case 'top-firms':
          return await addFirmToTop(firmId);
        case 'table-review':
          return await addFirmToTableReview(firmId, rank);
        case 'explore-firms':
          return await addFirmToExplore(firmId);
        default:
          throw new Error('Invalid section');
      }
    } catch (error: any) {
      console.error(`Error adding firm to ${section} section:`, error);
      toast.error(`Failed to add firm to ${section} section`);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFirmFromSection = async (membershipId: string, section?: string) => {
    try {
      setLoading(true);
      
      // If section is specified, use specific function
      if (section) {
        switch (section) {
          case 'budget-firms':
            return await removeFirmFromBudget(membershipId);
          case 'top-firms':
            return await removeFirmFromTop(membershipId);
          case 'table-review':
            return await removeFirmFromTableReview(membershipId);
          case 'explore-firms':
            return await removeFirmFromExplore(membershipId);
        }
      }
      
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
    addFirmToExplore,
    removeFirmFromExplore,
    addFirmToSection,
    removeFirmFromSection,
    getMembershipsBySection,
    updateTableReviewPriority,
    refetch: fetchMemberships
  };
};