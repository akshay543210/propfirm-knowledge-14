import { useState, useEffect } from 'react';
import { AccountSize } from '../types/supabaseTypes';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useAccountSizes = () => {
  const [accountSizes, setAccountSizes] = useState<AccountSize[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAccountSizes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('account_sizes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccountSizes(data || []);
    } catch (error) {
      console.error('Error fetching account sizes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch account sizes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addAccountSize = async (accountSize: Omit<AccountSize, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('account_sizes')
        .insert([accountSize])
        .select()
        .single();

      if (error) throw error;
      
      setAccountSizes(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Account size added successfully!"
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error adding account size:', error);
      toast({
        title: "Error",
        description: "Failed to add account size",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateAccountSize = async (id: string, updates: Partial<AccountSize>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('account_sizes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAccountSizes(prev => prev.map(size => 
        size.id === id ? data : size
      ));
      toast({
        title: "Success",
        description: "Account size updated successfully!"
      });
      return { success: true, data };
    } catch (error) {
      console.error('Error updating account size:', error);
      toast({
        title: "Error",
        description: "Failed to update account size",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccountSize = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('account_sizes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAccountSizes(prev => prev.filter(size => size.id !== id));
      toast({
        title: "Success",
        description: "Account size deleted successfully!"
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting account size:', error);
      toast({
        title: "Error",
        description: "Failed to delete account size",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountSizes();
  }, []);

  return {
    accountSizes,
    loading,
    addAccountSize,
    updateAccountSize,
    deleteAccountSize,
    refetch: fetchAccountSizes
  };
};