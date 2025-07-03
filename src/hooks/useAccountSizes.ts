import { useState, useEffect } from 'react';
import { AccountSize } from '../types/supabaseTypes';
import { useToast } from '@/hooks/use-toast';
import { dummyAccountSizes } from '../data/accountSizes';

export const useAccountSizes = () => {
  const [accountSizes, setAccountSizes] = useState<AccountSize[]>(dummyAccountSizes);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAccountSizes = async () => {
    // For now, using dummy data since Supabase table doesn't exist yet
    setAccountSizes(dummyAccountSizes);
  };

  const addAccountSize = async (accountSize: Omit<AccountSize, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newAccountSize: AccountSize = {
        id: Date.now().toString(),
        ...accountSize,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setAccountSizes(prev => [newAccountSize, ...prev]);
      toast({
        title: "Success",
        description: "Account size added successfully!"
      });
      return { success: true, data: newAccountSize };
    } catch (error) {
      console.error('Error adding account size:', error);
      toast({
        title: "Error",
        description: "Failed to add account size",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const updateAccountSize = async (id: string, updates: Partial<AccountSize>) => {
    try {
      const updatedAccountSize = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      setAccountSizes(prev => prev.map(size => 
        size.id === id ? { ...size, ...updatedAccountSize } : size
      ));
      toast({
        title: "Success",
        description: "Account size updated successfully!"
      });
      return { success: true, data: updatedAccountSize };
    } catch (error) {
      console.error('Error updating account size:', error);
      toast({
        title: "Error",
        description: "Failed to update account size",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deleteAccountSize = async (id: string) => {
    try {
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