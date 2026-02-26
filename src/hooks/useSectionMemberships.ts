import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PropFirm } from '@/types/supabase';
import { useMarket, MarketType } from '@/contexts/MarketContext';
import { useAppReady } from '@/contexts/AppReadyContext';
import { clearRecoveryCounter } from '@/utils/sessionRecovery';

interface SectionFirm extends PropFirm {
  membership_id: string;
  sort_priority?: number;
}

// Timeout for failsafe
const FETCH_TIMEOUT = 10000;

// Helper function to filter firms by market
const filterByMarket = (firms: SectionFirm[], market: MarketType): SectionFirm[] => {
  return firms.filter(firm => {
    const marketTypes = firm.market_type || ['forex'];
    return marketTypes.includes(market);
  });
};

export const useSectionMemberships = () => {
  const [budgetFirms, setBudgetFirms] = useState<SectionFirm[]>([]);
  const [topFirms, setTopFirms] = useState<SectionFirm[]>([]);
  const [tableReviewFirms, setTableReviewFirms] = useState<SectionFirm[]>([]);
  const [exploreFirms, setExploreFirms] = useState<SectionFirm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { allReady } = useAppReady();
  const isMountedRef = useRef(true);
  const hasFetchedRef = useRef(false);

  const fetchMemberships = useCallback(async () => {
    // Guard: Don't fetch until app is ready
    if (!allReady) {
      console.log('useSectionMemberships: Not ready yet, skipping fetch');
      return;
    }

    hasFetchedRef.current = true;

    try {
      setLoading(true);
      setError(null);
      
      console.log('useSectionMemberships: Starting to fetch memberships...');

      const fetchSection = async (sectionType: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
        try {
          const { data, error } = await supabase
            .from('section_memberships')
            .select(`
              id,
              firm_id,
              rank,
              prop_firms:firm_id (*)
            `)
            .eq('section_type', sectionType)
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

      // Fetch all four sections in parallel with retry
      const fetchWithRetry = async (sectionType: string) => {
        try {
          return await fetchSection(sectionType);
        } catch (firstErr) {
          console.warn(`useSectionMemberships: ${sectionType} first attempt failed, retrying...`);
          return await fetchSection(sectionType);
        }
      };

      const [budgetData, topData, tableData, exploreData] = await Promise.all([
        fetchWithRetry('budget-firms').catch(e => { console.error('Budget firms fetch error:', e); return null; }),
        fetchWithRetry('top-firms').catch(e => { console.error('Top firms fetch error:', e); return null; }),
        fetchWithRetry('table-review').catch(e => { console.error('Table review fetch error:', e); return null; }),
        fetchWithRetry('explore-firms').catch(e => { console.error('Explore firms fetch error:', e); return null; }),
      ]);

      const mapFirms = (data: any[] | null, withRank = false) =>
        (data || [])
          .map((item: any) => ({
            ...(item.prop_firms || {}),
            membership_id: item.id,
            ...(withRank ? { sort_priority: item.rank } : {}),
          }))
          .filter((firm: any) => firm && firm.id);

      setBudgetFirms(mapFirms(budgetData));
      setTopFirms(mapFirms(topData));
      setTableReviewFirms(mapFirms(tableData, true));
      setExploreFirms(mapFirms(exploreData));
      clearRecoveryCounter();
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
      // Get the highest rank and add 1
      const { data: maxRankData } = await supabase
        .from('section_memberships')
        .select('rank')
        .eq('section_type', 'explore-firms')
        .order('rank', { ascending: false })
        .limit(1)
        .single();
      
      const nextRank = (maxRankData?.rank || 0) + 1;
      
      const { error } = await supabase
        .from('section_memberships')
        .insert([{ 
          section_type: 'explore-firms',
          firm_id: firmId,
          rank: nextRank
        }]);
      
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
      
      const { error, data } = await supabase
        .from('section_memberships')
        .delete()
        .eq('id', membershipId)
        .eq('section_type', 'explore-firms')
        .select();
      const count = data?.length ?? 0;
      
      console.log('Delete operation result:', { error, count });
      
      if (error) {
        console.error('Error deleting from section_memberships:', error);
        throw error;
      }
      
      // Check if any rows were actually deleted
      if (!count || count === 0) {
        const errorMsg = `No matching firm found in explore section. Membership ID: ${membershipId}`;
        console.warn(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log(`Successfully deleted ${count} rows from section_memberships`);
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
      
      // Map section names to section_type values
      const sectionTypeMap: Record<string, string> = {
        'budget-firms': 'budget-firms',
        'cheap-firms': 'budget-firms',
        'top-firms': 'top-firms',
        'table-review': 'table-review',
        'explore-firms': 'explore-firms'
      };
      
      const sectionType = sectionTypeMap[section];
      if (!sectionType) {
        throw new Error('Invalid section');
      }
      
      // Get the highest rank and add 1
      const { data: maxRankData } = await supabase
        .from('section_memberships')
        .select('rank')
        .eq('section_type', sectionType)
        .order('rank', { ascending: false })
        .limit(1)
        .single();
      
      const nextRank = (maxRankData?.rank || 0) + 1;
      
      const { error } = await supabase
        .from('section_memberships')
        .insert([{ 
          section_type: sectionType,
          firm_id: firmId,
          rank: rank || nextRank
        }]);

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
      
      const { error, data } = await supabase
        .from('section_memberships')
        .delete()
        .eq('id', membershipId)
        .select();
      const count = data?.length ?? 0;
        
      console.log('Delete operation result:', { error, count });
      
      if (error) {
        console.error('Error deleting from section_memberships:', error);
        throw error;
      }
      
      if (!count || count === 0) {
        const errorMsg = `No matching record found. Membership ID: ${membershipId}`;
        console.warn(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log(`Successfully deleted ${count} rows from section_memberships`);
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
    isMountedRef.current = true;
    
    if (allReady && !hasInitialized) {
      fetchMemberships();
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [allReady, hasInitialized]);

  // Fallback timer to ensure loading always ends
  useEffect(() => {
    if (!allReady) return;
    
    const fallbackTimer = setTimeout(() => {
      if (loading && hasFetchedRef.current && isMountedRef.current) {
        console.log('useSectionMemberships: Fallback timer triggered, ending loading state');
        setLoading(false);
        setHasInitialized(true);
      }
    }, FETCH_TIMEOUT + 1000);

    return () => clearTimeout(fallbackTimer);
  }, [loading, allReady]);

  // Get market from context
  const { market } = useMarket();
  
  // Filter firms by current market
  const filteredBudgetFirms = filterByMarket(budgetFirms, market);
  const filteredTopFirms = filterByMarket(topFirms, market);
  const filteredTableReviewFirms = filterByMarket(tableReviewFirms, market);
  const filteredExploreFirms = filterByMarket(exploreFirms, market);

  return {
    budgetFirms: filteredBudgetFirms,
    topFirms: filteredTopFirms,
    tableReviewFirms: filteredTableReviewFirms,
    exploreFirms: filteredExploreFirms,
    // Also expose unfiltered data for admin panel
    allBudgetFirms: budgetFirms,
    allTopFirms: topFirms,
    allTableReviewFirms: tableReviewFirms,
    allExploreFirms: exploreFirms,
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