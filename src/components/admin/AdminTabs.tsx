import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, List, Users, AlertTriangle } from "lucide-react";
import AdminSectionManager from "../AdminSectionManager";
import AdminFormPanel from "../AdminFormPanel";
import AdminFirmsList from "../AdminFirmsList";
import UserManagement from "./UserManagement";
import DramaModerationPanel from "./DramaModerationPanel";
import { PropFirm } from "../../types/supabase";

interface AdminTabsProps {
  propFirms: PropFirm[];
  editingFirm: PropFirm | null;
  setEditingFirm: (firm: PropFirm | null) => void;
  onAdd: (firmData: Partial<PropFirm>) => Promise<any>;
  onUpdate: (id: string, updates: Partial<PropFirm>) => Promise<any>;
  onEdit: (firm: PropFirm) => void;
  onDelete: (id: string) => Promise<any>;
  dataLoading: boolean;
  operationLoading: boolean;
}

const AdminTabs = ({
  propFirms,
  editingFirm,
  setEditingFirm,
  onAdd,
  onUpdate,
  onEdit,
  onDelete,
  dataLoading,
  operationLoading
}: AdminTabsProps) => {
  return (
    <Tabs defaultValue="sections" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/50">
        <TabsTrigger 
          value="sections" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <Settings className="h-4 w-4 mr-2" />
          Section Management
        </TabsTrigger>
        <TabsTrigger 
          value="drama" 
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Drama Reports
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

      <TabsContent value="drama">
        <DramaModerationPanel />
      </TabsContent>

      <TabsContent value="firms">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdminFormPanel 
            onAdd={onAdd}
            onUpdate={onUpdate}
            editingFirm={editingFirm}
            setEditingFirm={setEditingFirm}
            loading={operationLoading}
          />
          
          <AdminFirmsList 
            propFirms={propFirms}
            onEdit={onEdit}
            onDelete={onDelete}
            loading={dataLoading || operationLoading}
          />
        </div>
      </TabsContent>

      <TabsContent value="users">
        <UserManagement />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;