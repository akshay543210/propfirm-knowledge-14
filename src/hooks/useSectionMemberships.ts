import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SectionMembership {
  id: string;
  section_type: string;
  firm_id: string;
  rank: number;
  created_at: string;
  updated_at: string;
  prop_firms?: {
    id: string;
    name: string;
    price: number;
  };
}

export const useSectionMemberships = () => {
  const [memberships, setMemberships] = useState<SectionMembership[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('section_memberships')
        .select(`
          *,
          prop_firms (
            id,
            name,
            price
          )
        `)
        .order('rank', { ascending: true });

      if (error) throw error;
      setMemberships(data || []);
    } catch (error) {
      console.error('Error fetching section memberships:', error);
      toast.error('Failed to fetch section memberships');
    } finally {
      setLoading(false);
    }
  };

  const addFirmToSection = async (sectionType: string, firmId: string, rank: number = 1) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('section_memberships')
        .insert([{
          section_type: sectionType,
          firm_id: firmId,
          rank: rank
        }]);

      if (error) throw error;
      
      await fetchMemberships();
      toast.success('Firm added to section successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error adding firm to section:', error);
      if (error.code === '23505') {
        toast.error('Firm is already in this section');
      } else {
        toast.error('Failed to add firm to section');
      }
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFirmFromSection = async (membershipId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('section_memberships')
        .delete()
        .eq('id', membershipId);

      if (error) throw error;
      
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

  const updateFirmRank = async (membershipId: string, newRank: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('section_memberships')
        .update({ rank: newRank })
        .eq('id', membershipId);

      if (error) throw error;
      
      await fetchMemberships();
      toast.success('Firm rank updated successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error updating firm rank:', error);
      toast.error('Failed to update firm rank');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getMembershipsBySection = (sectionType: string) => {
    return memberships.filter(m => m.section_type === sectionType);
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  return {
    memberships,
    loading,
    addFirmToSection,
    removeFirmFromSection,
    updateFirmRank,
    getMembershipsBySection,
    refetch: fetchMemberships
  };
};