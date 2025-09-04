import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DramaReport, DramaReportInsert, DramaType, DramaSeverity, DramaStatus } from '@/types/dramaReports';

export const useDramaReports = () => {
  const [dramaReports, setDramaReports] = useState<DramaReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDramaReports = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drama_reports')
        .select('*')
        .eq('status', 'Approved' as DramaStatus)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to the correct type
      const typedData = data.map(report => ({
        ...report,
        drama_type: report.drama_type as DramaType,
        severity: report.severity as DramaSeverity,
        status: report.status as DramaStatus
      }));
      
      setDramaReports(typedData || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDramaReports();

    // Set up real-time subscription for approved reports
    const channel = supabase
      .channel('drama-reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drama_reports',
          filter: 'status=eq.Approved'
        },
        () => {
          fetchDramaReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDramaReports]);

  return { dramaReports, loading, error, refetch: fetchDramaReports };
};

export const useUserDramaReports = () => {
  const [dramaReports, setDramaReports] = useState<DramaReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDramaReports = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('drama_reports')
        .select('*')
        .eq('submitted_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to the correct type
      const typedData = data.map(report => ({
        ...report,
        drama_type: report.drama_type as DramaType,
        severity: report.severity as DramaSeverity,
        status: report.status as DramaStatus
      }));
      
      setDramaReports(typedData || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDramaReports();
  }, [fetchUserDramaReports]);

  return { dramaReports, loading, error, refetch: fetchUserDramaReports };
};

export const useAdminDramaReports = () => {
  const [dramaReports, setDramaReports] = useState<DramaReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminDramaReports = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drama_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to the correct type
      const typedData = data.map(report => ({
        ...report,
        drama_type: report.drama_type as DramaType,
        severity: report.severity as DramaSeverity,
        status: report.status as DramaStatus
      }));
      
      setDramaReports(typedData || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminDramaReports();

    // Set up real-time subscription for all reports
    const channel = supabase
      .channel('admin-drama-reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'drama_reports'
        },
        () => {
          fetchAdminDramaReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAdminDramaReports]);

  const updateReportStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('drama_reports')
        .update({ 
          status, 
          admin_approved_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      await fetchAdminDramaReports();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('drama_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchAdminDramaReports();
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return { 
    dramaReports, 
    loading, 
    error, 
    refetch: fetchAdminDramaReports,
    updateReportStatus,
    deleteReport
  };
};

export const submitDramaReport = async (report: DramaReportInsert) => {
  try {
    const { error } = await supabase
      .from('drama_reports')
      .insert({
        ...report,
        status: 'Pending' as DramaStatus
      });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
  }
};