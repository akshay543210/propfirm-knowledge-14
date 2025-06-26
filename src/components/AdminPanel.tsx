
import { useState, useEffect } from "react";
import AdminFormPanel from "./AdminFormPanel";
import AdminFirmsList from "./AdminFirmsList";
import AdminSectionManager from "./AdminSectionManager";
import { PropFirm } from "../types/supabase";
import { useAdminOperations } from "../hooks/useAdminOperations";
import { usePropFirms } from "../hooks/useSupabaseData";
import { useCategories } from "../hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, RefreshCw, Settings, List, Users } from "lucide-react";

const AdminPanel = () => {
  const [editingFirm, setEditingFirm] = useState<PropFirm | null>(null);
  const [operationStatus, setOperationStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const { propFirms, loading: dataLoading, refetch } = usePropFirms();
  const { addFirm, updateFirm, deleteFirm, loading: operationLoading } = useAdminOperations();
  const { categories, loading: categoriesLoading } = useCategories();

  // Clear status after 5 seconds
  useEffect(() => {
    if (operationStatus.type) {
      const timer = setTimeout(() => {
        setOperationStatus({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [operationStatus]);

  const handleAdd = async (firmData: Partial<PropFirm>) => {
    console.log('AdminPanel: Adding firm with data:', firmData);
    setOperationStatus({ type: null, message: '' });
    
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
      setOperationStatus({ type: 'error', message: errorMessage });
      return { success: false, error };
    }
  };

  const handleUpdate = async (id: string, updates: Partial<PropFirm>) => {
    console.log('AdminPanel: Updating firm with id:', id, 'and data:', updates);
    setOperationStatus({ type: null, message: '' });
    
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
      setOperationStatus({ type: 'error', message: errorMessage });
      return { success: false, error };
    }
  };

  const handleDelete = async (id: string) => {
    console.log('AdminPanel: Deleting firm with id:', id);
    setOperationStatus({ type: null, message: '' });
    
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
      setOperationStatus({ type: 'error', message: errorMessage });
      return { success: false, error };
    }
  };

  const handleEdit = (firm: PropFirm) => {
    console.log('AdminPanel: Editing firm:', firm);
    setEditingFirm(firm);
    setOperationStatus({ type: null, message: '' });
  };

  const handleRefresh = async () => {
    console.log('AdminPanel: Manual refresh requested');
    setOperationStatus({ type: null, message: '' });
    await refetch();
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-300">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-300">
            Manage prop firms, sections, and website content
          </p>
          <div className="text-sm text-gray-400 mt-2 flex items-center justify-center gap-4">
            <span>Categories loaded: {categories.length}</span>
            <span>•</span>
            <span>Prop firms: {propFirms.length}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="ml-2 text-blue-400 hover:text-blue-300"
              disabled={dataLoading}
            >
              <RefreshCw className={`h-4 w-4 ${dataLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Operation Status */}
        {operationStatus.type && (
          <Card className="mb-6 border-0">
            <CardContent className={`p-4 ${
              operationStatus.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-red-500/10 border-red-500/20'
            } rounded-lg border`}>
              <div className="flex items-center gap-2">
                {operationStatus.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <span className={`${
                  operationStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                } font-medium`}>
                  {operationStatus.message}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="sections" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800/50">
            <TabsTrigger 
              value="sections" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Section Management
            </TabsTrigger>
            <TabsTrigger 
              value="firms" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <List className="h-4 w-4 mr-2" />
              PropFirm Management
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sections">
            <AdminSectionManager />
          </TabsContent>

          <TabsContent value="firms">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AdminFormPanel 
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                editingFirm={editingFirm}
                setEditingFirm={setEditingFirm}
                loading={operationLoading}
              />
              
              <AdminFirmsList 
                propFirms={propFirms}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={dataLoading || operationLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-slate-800/50 border-blue-500/20">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">User Management</h3>
                <p className="text-gray-400 mb-4">
                  User management features will be available in future updates
                </p>
                <div className="text-sm text-gray-500">
                  Features coming soon: User roles, permissions, activity logs
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
