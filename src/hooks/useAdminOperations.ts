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
        table_price: firmData.table_price || null,
        table_profit_split: firmData.table_profit_split || null,
        table_payout_rate: firmData.table_payout_rate || null,
        table_platform: firmData.table_platform || null,
        table_trust_rating: firmData.table_trust_rating || null,
        table_evaluation_rules: firmData.table_evaluation_rules || null,
        table_fee: firmData.table_fee || null,
        table_coupon_code: firmData.table_coupon_code || null,
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
      
      // Ensure arrays are properly formatted
      const formattedUpdates: any = {
        ...updates,
        features: Array.isArray(updates.features) ? updates.features : (updates.features ? (updates.features as string).split(',').map(f => f.trim()).filter(f => f) : []),
        pros: Array.isArray(updates.pros) ? updates.pros : (updates.pros ? (updates.pros as string).split(',').map(f => f.trim()).filter(f => f) : []),
        cons: Array.isArray(updates.cons) ? updates.cons : (updates.cons ? (updates.cons as string).split(',').map(f => f.trim()).filter(f => f) : []),
        slug: updates.slug || (updates.name ? updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('prop_firms')
        .update(formattedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

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