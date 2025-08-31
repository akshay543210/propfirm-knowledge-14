import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface AllFirmsSectionProps {
  onAddPropFirm: () => void;
}

const AllFirmsSection = ({ onAddPropFirm }: AllFirmsSectionProps) => {
  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-blue-400" />
            <div>
              <CardTitle className="text-white text-xl">All PropFirms</CardTitle>
              <p className="text-gray-400 text-sm">
                Manage all prop firms in the system
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
              onClick={onAddPropFirm}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Add New PropFirm
            </button>
          </div>
          <div className="text-gray-400 text-center py-8">
            All prop firms added through the main form will appear here.<br />
            Use the other tabs to assign firms to specific sections.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllFirmsSection;