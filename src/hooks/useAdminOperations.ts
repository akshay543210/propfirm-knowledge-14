
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
      console.log('Adding firm with data:', firmData);
      
      // Validate required fields
      if (!firmData.name || !firmData.funding_amount) {
        throw new Error('Name and funding amount are required');
      }

      // Create complete data object with all required fields
      const completeData = {
        name: firmData.name,
        slug: firmData.slug || firmData.name.toLowerCase().replace(/\s+/g, '-'),
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
        starting_fee: firmData.starting_fee || null,
        regulation: firmData.regulation || null,
      };

      console.log('Inserting data:', completeData);

      const { data, error } = await supabase
        .from('prop_firms')
        .insert(completeData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully inserted:', data);

      toast({
        title: "Success",
        description: "Prop firm added successfully!",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error adding firm:', error);
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
      console.log('Updating firm with id:', id, 'and data:', updates);
      
      // Ensure arrays are properly formatted
      const formattedUpdates = {
        ...updates,
        features: Array.isArray(updates.features) ? updates.features : [],
        pros: Array.isArray(updates.pros) ? updates.pros : [],
        cons: Array.isArray(updates.cons) ? updates.cons : [],
      };

      console.log('Formatted updates:', formattedUpdates);

      const { data, error } = await supabase
        .from('prop_firms')
        .update(formattedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully updated:', data);

      toast({
        title: "Success",
        description: "Prop firm updated successfully!",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error updating firm:', error);
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
      console.log('Deleting firm with id:', id);

      const { data, error } = await supabase
        .from('prop_firms')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully deleted:', data);

      toast({
        title: "Success",
        description: "Prop firm deleted successfully!",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error deleting firm:', error);
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
