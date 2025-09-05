import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Trash2, Edit, ExternalLink, Loader2 } from "lucide-react";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import { usePropFirms } from "@/hooks/useSupabaseData";
import { PropFirm } from "@/types/supabase";
import { toast } from "sonner";

interface AllFirmsSectionProps {
  onAddPropFirm: () => void;
  onEditFirm: (firm: PropFirm) => void;
}

const AllFirmsSection = ({ onAddPropFirm, onEditFirm }: AllFirmsSectionProps) => {
  const { propFirms, loading: firmsLoading, refetch } = usePropFirms();
  const { deleteFirm, loading: deleteLoading } = useAdminOperations();

  const handleDeleteFirm = async (firm: PropFirm) => {
    if (window.confirm(`Are you sure you want to permanently delete "${firm.name}"?\n\nThis action cannot be undone and will remove the firm from all sections.`)) {
      const result = await deleteFirm(firm.id);
      if (result.success) {
        await refetch();
        toast.success('PropFirm deleted successfully');
      }
    }
  };
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
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {propFirms?.length || 0} firms
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={onAddPropFirm}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Add New PropFirm
            </Button>
          </div>
          
          {firmsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-300">Loading firms...</span>
            </div>
          ) : !propFirms || propFirms.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No prop firms found. Add your first prop firm to get started!
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {propFirms.map((firm) => (
                <div key={firm.id} className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-semibold">{firm.name}</h4>
                        {firm.brand && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            {firm.brand}
                          </span>
                        )}
                        {firm.show_on_homepage && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            Homepage
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {firm.description || 'No description available'}
                      </p>
                    </div>
                    {firm.affiliate_url && (
                      <a 
                        href={firm.affiliate_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-xs text-gray-300">
                    <div>
                      <span className="text-gray-400">Price:</span> ${firm.price}
                      {firm.original_price !== firm.price && (
                        <span className="line-through text-gray-500 ml-1">${firm.original_price}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400">Funding:</span> {firm.funding_amount}
                    </div>
                    <div>
                      <span className="text-gray-400">Rating:</span> ⭐ {firm.review_score}/5 ({firm.user_review_count} reviews)
                    </div>
                    <div>
                      <span className="text-gray-400">Trust:</span> {firm.trust_rating}/10
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Created: {new Date(firm.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditFirm(firm)}
                        className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900"
                        disabled={deleteLoading}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteFirm(firm)}
                        className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                        disabled={deleteLoading}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AllFirmsSection;