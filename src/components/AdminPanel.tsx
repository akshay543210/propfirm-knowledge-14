import { useState, useEffect } from "react";
import { PropFirm } from "@/types/supabase";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import { usePropFirms } from "@/hooks/useSupabaseData";
import { useCategories } from "@/hooks/useCategories";
import { RefreshCw } from "lucide-react";
import OperationStatus from "./admin/OperationStatus";
import AdminHeader from "./admin/AdminHeader";
import AdminTabs from "./admin/AdminTabs";

const AdminPanel = () => {
  const [editingFirm, setEditingFirm] = useState<PropFirm | null>(null);
  const [operationStatus, setOperationStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: ''
  });
  const {
    propFirms,
    loading: dataLoading,
    refetch
  } = usePropFirms();
  const {
    addFirm,
    updateFirm,
    deleteFirm,
    loading: operationLoading
  } = useAdminOperations();
  const {
    categories,
    loading: categoriesLoading
  } = useCategories();

  // Clear status after 5 seconds
  useEffect(() => {
    if (operationStatus.type) {
      const timer = setTimeout(() => {
        setOperationStatus({
          type: null,
          message: ''
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [operationStatus]);

  const handleAdd = async (firmData: Partial<PropFirm>) => {
    console.log('AdminPanel: Adding firm with data:', firmData);
    setOperationStatus({
      type: null,
      message: ''
    });
    try {
      const result = await addFirm(firmData);
      console.log('AdminPanel: Add result:', result);
      if (result.success) {
        setOperationStatus({
          type: 'success',
          message: `Successfully added "${firmData.name}"`
        });
        setTimeout(async () => {
          await refetch();
        }, 500);
      } else {
        setOperationStatus({
          type: 'error',
          message: result.error?.message || 'Failed to add prop firm'
        });
      }
      return result;
    } catch (error) {
      console.error('AdminPanel: Add error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setOperationStatus({
        type: 'error',
        message: errorMessage
      });
      return {
        success: false,
        error
      };
    }
  };

  const handleUpdate = async (id: string, updates: Partial<PropFirm>) => {
    console.log('AdminPanel: Updating firm with id:', id, 'and data:', updates);
    setOperationStatus({
      type: null,
      message: ''
    });
    try {
      const result = await updateFirm(id, updates);
      console.log('AdminPanel: Update result:', result);
      if (result.success) {
        setEditingFirm(null);
        setOperationStatus({
          type: 'success',
          message: `Successfully updated "${updates.name || 'prop firm'}"`
        });
        setTimeout(async () => {
          await refetch();
        }, 500);
      } else {
        setOperationStatus({
          type: 'error',
          message: result.error?.message || 'Failed to update prop firm'
        });
      }
      return result;
    } catch (error) {
      console.error('AdminPanel: Update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setOperationStatus({
        type: 'error',
        message: errorMessage
      });
      return {
        success: false,
        error
      };
    }
  };

  const handleDelete = async (id: string) => {
    console.log('AdminPanel: Deleting firm with id:', id);
    setOperationStatus({
      type: null,
      message: ''
    });
    try {
      const result = await deleteFirm(id);
      console.log('AdminPanel: Delete result:', result);
      if (result.success) {
        setOperationStatus({
          type: 'success',
          message: 'Successfully deleted prop firm'
        });
        setTimeout(async () => {
          await refetch();
        }, 500);
      } else {
        setOperationStatus({
          type: 'error',
          message: result.error?.message || 'Failed to delete prop firm'
        });
      }
      return result;
    } catch (error) {
      console.error('AdminPanel: Delete error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setOperationStatus({
        type: 'error',
        message: errorMessage
      });
      return {
        success: false,
        error
      };
    }
  };

  const handleEdit = (firm: PropFirm) => {
    console.log('AdminPanel: Editing firm:', firm);
    setEditingFirm(firm);
    setOperationStatus({
      type: null,
      message: ''
    });
  };

  const handleRefresh = async () => {
    console.log('AdminPanel: Manual refresh requested');
    setOperationStatus({
      type: null,
      message: ''
    });
    await refetch();
  };

  if (categoriesLoading) {
    return <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-300">Loading admin panel...</p>
          </div>
        </div>
      </div>;
  }

  return <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#253770]">
      <div className="max-w-7xl mx-auto">
        <AdminHeader categoriesCount={categories.length} propFirmsCount={propFirms.length} onRefresh={handleRefresh} loading={dataLoading} />

        <OperationStatus status={operationStatus} />

        <AdminTabs 
          propFirms={propFirms} 
          editingFirm={editingFirm} 
          setEditingFirm={setEditingFirm} 
          onAdd={handleAdd} 
          onUpdate={handleUpdate} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          dataLoading={dataLoading} 
          operationLoading={operationLoading} 
        />
      </div>
    </div>;
};

export default AdminPanel;