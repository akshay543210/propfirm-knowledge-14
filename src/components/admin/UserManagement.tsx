import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const UserManagement = () => {
  return (
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
  );
};

export default UserManagement;