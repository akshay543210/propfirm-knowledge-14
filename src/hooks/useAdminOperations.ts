import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PropFirm } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

export const useAdminOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addFirm = async (firmData: Partial<PropFirm>) => {
    setLoading(true);
    try {
      
      // Validate required fields
      if (!firmData.name || !firmData.funding_amount) {
        throw new Error('Name and funding amount are required');
      }

      // Create complete data object with all required fields
      const completeData = {
        name: firmData.name,
        slug: firmData.slug || firmData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        funding_amount: firmData.funding_amount,
        price: firmData.price || 0,
        original_price: firmData.original_price || 0,
        profit_split: firmData.profit_split || 0,
        payout_rate: firmData.payout_rate || 0,
        category_id: firmData.category_id || null,
        coupon_code: firmData.coupon_code || null,
        review_score: firmData.review_score || 0,
        trust_rating: firmData.trust_rating || 0,
        description: firmData.description || null,
        features: firmData.features || [],
        logo_url: firmData.logo_url || '/placeholder.svg',
        user_review_count: firmData.user_review_count || 0,
        pros: firmData.pros || [],
        cons: firmData.cons || [],
        affiliate_url: firmData.affiliate_url || null,
        brand: firmData.brand || null,
        platform: firmData.platform || null,
        max_funding: firmData.max_funding || null,
        evaluation_model: firmData.evaluation_model || null,
        starting_fee: firmData.starting_fee || 0,
        regulation: firmData.regulation || null,
        show_on_homepage: firmData.show_on_homepage || false,
        market_type: firmData.market_type || ['forex'],
        table_price: firmData.table_price || null,
        table_profit_split: firmData.table_profit_split || null,
        table_payout_rate: firmData.table_payout_rate || null,
        table_platform: firmData.table_platform || null,
        table_trust_rating: firmData.table_trust_rating || null,
        table_evaluation_rules: firmData.table_evaluation_rules || null,
        table_fee: firmData.table_fee || null,
        table_coupon_code: firmData.table_coupon_code || null,
        platforms: firmData.platforms || [],
        asset_classes: firmData.asset_classes || [],
        feature_tags: firmData.feature_tags || [],
        countries: firmData.countries || [],
        fee_min: firmData.fee_min ?? null,
        fee_max: firmData.fee_max ?? null,
        account_min: firmData.account_min ?? null,
        account_max: firmData.account_max ?? null,
        profit_split_min: firmData.profit_split_min ?? null,
        profit_split_max: firmData.profit_split_max ?? null,
        year_established: firmData.year_established ?? null,
        verified: firmData.verified ?? false,
        rating_avg: firmData.rating_avg ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('prop_firms')
        .insert(completeData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Automatically add to explore section
      const { error: exploreError } = await supabase
        .from('explore_firms' as any)
        .insert({
          firm_id: data.id
        });

      if (exploreError) {
        // Non-fatal error, just log it
      }

      toast({
        title: "Success",
        description: "Prop firm added successfully!",
      });

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add prop firm";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateFirm = async (id: string, updates: Partial<PropFirm>) => {
    setLoading(true);
    try {
      // Strip server-managed/computed/relation fields that should never be sent
      const {
        id: _id,
        tsv,
        created_at,
        rating_avg, // computed elsewhere; updating manually is fine but skip if undefined
        ...rest
      } = updates as any;

      // Helper: ensure value is a clean array (handles arrays, comma strings, null)
      const toArr = (v: any): string[] => {
        if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
        if (typeof v === 'string') return v.split(',').map((f) => f.trim()).filter(Boolean);
        return [];
      };

      const formattedUpdates: any = {
        ...rest,
        features: toArr(rest.features),
        pros: toArr(rest.pros),
        cons: toArr(rest.cons),
        platforms: toArr(rest.platforms),
        asset_classes: toArr(rest.asset_classes),
        feature_tags: toArr(rest.feature_tags),
        countries: toArr(rest.countries),
        slug: rest.slug || (rest.name ? rest.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined),
        updated_at: new Date().toISOString(),
      };

      // Only include rating_avg if explicitly provided (number)
      if (typeof rating_avg === 'number') {
        formattedUpdates.rating_avg = rating_avg;
      }

      // Drop undefined keys so PostgREST doesn't reject them
      Object.keys(formattedUpdates).forEach((k) => {
        if (formattedUpdates[k] === undefined) delete formattedUpdates[k];
      });

      console.log('[updateFirm] payload keys:', Object.keys(formattedUpdates));

      // 15s timeout so the UI never gets stuck on "Updating..."
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      let data: any, error: any;
      try {
        const res = await supabase
          .from('prop_firms')
          .update(formattedUpdates)
          .eq('id', id)
          .abortSignal(controller.signal)
          .select()
          .single();
        data = res.data;
        error = res.error;
      } finally {
        clearTimeout(timeoutId);
      }

      if (error) {
        console.error('[updateFirm] supabase error:', error);
        if (error.name === 'AbortError' || /aborted/i.test(error.message || '')) {
          throw new Error('Update timed out after 15 seconds. Please try again.');
        }
        throw error;
      }

      // Bust prop_firms cache so the list reflects the new values immediately
      try {
        Object.keys(sessionStorage).forEach((k) => {
          if (k.startsWith('propfirm-cache-')) sessionStorage.removeItem(k);
        });
      } catch {}

      toast({
        title: "Success",
        description: "Prop firm updated successfully!",
      });

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update prop firm";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteFirm = async (id: string) => {
    setLoading(true);
    try {

      const { data, error } = await supabase
        .from('prop_firms')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Prop firm deleted successfully!",
      });

      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete prop firm";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    addFirm,
    updateFirm,
    deleteFirm,
    loading
  };
};