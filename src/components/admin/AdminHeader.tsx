import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface AdminHeaderProps {
  categoriesCount: number;
  propFirmsCount: number;
  onRefresh: () => Promise<void>;
  loading: boolean;
}

const AdminHeader = ({ categoriesCount, propFirmsCount, onRefresh, loading }: AdminHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
      <p className="text-gray-300">
        Manage prop firms, sections, and website content
      </p>
      <div className="text-sm text-gray-400 mt-2 flex items-center justify-center gap-4">
        <span>Categories loaded: {categoriesCount}</span>
        <span>•</span>
        <span>Prop firms: {propFirmsCount}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="ml-2 text-blue-400 hover:text-blue-300"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;