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

      // Separate table review data
      const {
        show_in_table_review,
        table_review_priority,
        table_price,
        table_profit_split,
        table_payout_rate,
        table_platform,
        table_trust_rating,
        table_evaluation_rules,
        table_fee,
        table_coupon_code,
        ...firmFields
      } = firmData;

      // Create complete data object with all required fields
      const completeData = {
        name: firmFields.name,
        slug: firmFields.slug || firmFields.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        funding_amount: firmFields.funding_amount,
        price: firmFields.price || 0,
        original_price: firmFields.original_price || 0,
        profit_split: firmFields.profit_split || 0,
        payout_rate: firmFields.payout_rate || 0,
        category_id: firmFields.category_id || null,
        coupon_code: firmFields.coupon_code || null,
        review_score: firmFields.review_score || 0,
        trust_rating: firmFields.trust_rating || 0,
        description: firmFields.description || null,
        features: firmFields.features || [],
        logo_url: firmFields.logo_url || '/placeholder.svg',
        user_review_count: firmFields.user_review_count || 0,
        pros: firmFields.pros || [],
        cons: firmFields.cons || [],
        affiliate_url: firmFields.affiliate_url || null,
        brand: firmFields.brand || null,
        platform: firmFields.platform || null,
        max_funding: firmFields.max_funding || null,
        evaluation_model: firmFields.evaluation_model || null,
        starting_fee: firmFields.starting_fee || 0,
        regulation: firmFields.regulation || null,
        show_on_homepage: firmFields.show_on_homepage || false,
        table_price: table_price || null,
        table_profit_split: table_profit_split || null,
        table_payout_rate: table_payout_rate || null,
        table_platform: table_platform || null,
        table_trust_rating: table_trust_rating || null,
        table_evaluation_rules: table_evaluation_rules || null,
        table_fee: table_fee || null,
        table_coupon_code: table_coupon_code || null,
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

      // Insert table review data if needed
      if (show_in_table_review !== undefined || table_review_priority !== undefined) {
        const { error: tableError } = await supabase
          .from('table_review_firms')
          .insert({
            firm_id: data.id,
            is_approved: show_in_table_review || false,
            sort_priority: table_review_priority || 0
          });

        if (tableError) {
          console.error('Error inserting table review data:', tableError);
        }
      }

      // Automatically add to explore section
      const { error: exploreError } = await supabase
        .from('explore_firms')
        .insert({
          firm_id: data.id
        });

      if (exploreError) {
        console.error('Error adding firm to explore section:', exploreError);
      }

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
      
      // Separate table review data
      const {
        show_in_table_review,
        table_review_priority,
        table_price,
        table_profit_split,
        table_payout_rate,
        table_platform,
        table_trust_rating,
        table_evaluation_rules,
        table_fee,
        table_coupon_code,
        ...firmUpdates
      } = updates;

      // Ensure arrays are properly formatted
      const formattedUpdates: any = {
        ...firmUpdates,
        features: Array.isArray(firmUpdates.features) ? firmUpdates.features : (firmUpdates.features ? firmUpdates.features.split(',').map(f => f.trim()).filter(f => f) : []),
        pros: Array.isArray(firmUpdates.pros) ? firmUpdates.pros : (firmUpdates.pros ? firmUpdates.pros.split(',').map(f => f.trim()).filter(f => f) : []),
        cons: Array.isArray(firmUpdates.cons) ? firmUpdates.cons : (firmUpdates.cons ? firmUpdates.cons.split(',').map(f => f.trim()).filter(f => f) : []),
        slug: firmUpdates.slug || (firmUpdates.name ? firmUpdates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined),
      };

      // Handle table review fields
      if (table_price !== undefined) formattedUpdates.table_price = table_price;
      if (table_profit_split !== undefined) formattedUpdates.table_profit_split = table_profit_split;
      if (table_payout_rate !== undefined) formattedUpdates.table_payout_rate = table_payout_rate;
      if (table_platform !== undefined) formattedUpdates.table_platform = table_platform;
      if (table_trust_rating !== undefined) formattedUpdates.table_trust_rating = table_trust_rating;
      if (table_evaluation_rules !== undefined) formattedUpdates.table_evaluation_rules = table_evaluation_rules;
      if (table_fee !== undefined) formattedUpdates.table_fee = table_fee;
      if (table_coupon_code !== undefined) formattedUpdates.table_coupon_code = table_coupon_code;

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

      // Update table review data if needed
      if (show_in_table_review !== undefined || table_review_priority !== undefined) {
        const { data: tableData, error: tableError } = await supabase
          .from('table_review_firms')
          .select('*')
          .eq('firm_id', id)
          .single();

        if (tableError && tableError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error checking table review data:', tableError);
        } else if (tableData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('table_review_firms')
            .update({
              is_approved: show_in_table_review,
              sort_priority: table_review_priority
            })
            .eq('firm_id', id);

          if (updateError) {
            console.error('Error updating table review data:', updateError);
          }
        } else {
          // Create new record
          const { error: insertError } = await supabase
            .from('table_review_firms')
            .insert({
              firm_id: id,
              is_approved: show_in_table_review || false,
              sort_priority: table_review_priority || 0
            });

          if (insertError) {
            console.error('Error inserting table review data:', insertError);
          }
        }
      }

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