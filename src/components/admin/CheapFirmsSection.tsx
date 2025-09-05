import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, X, Plus, Loader2 } from "lucide-react";
import { useSectionMemberships } from "@/hooks/useSectionMemberships";
import { PropFirm } from "@/types/supabase";
import { toast } from "sonner";

interface CheapFirmsSectionProps {
  propFirms: PropFirm[];
}

const CheapFirmsSection = ({ propFirms }: CheapFirmsSectionProps) => {
  const [selectedFirmId, setSelectedFirmId] = useState<string>("");
  const { 
    budgetFirms,
    loading: membershipsLoading, 
    addFirmToSection, 
    removeFirmFromSection,
    refetch
  } = useSectionMemberships();

  const handleAddToSection = async () => {
    if (!selectedFirmId) {
      toast.error('Please select a firm to add');
      return;
    }
    
    const result = await addFirmToSection("budget-firms", selectedFirmId);
    if (result.success) {
      setSelectedFirmId("");
      refetch(); // Refresh to show the new membership
      toast.success('Firm added to budget section successfully');
    }
  };

  const handleRemoveFromSection = async (membershipId: string) => {
    const result = await removeFirmFromSection(membershipId);
    if (result.success) {
      refetch(); // Refresh to remove the firm from display
      toast.success('Firm removed from budget section successfully');
    }
  };

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-green-400" />
            <div>
              <CardTitle className="text-white text-xl">Cheap Cost Firms</CardTitle>
              <p className="text-gray-400 text-sm">
                Manage cost-effective prop firms
              </p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            {budgetFirms?.length || 0} items
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-slate-700/50 p-6 rounded-lg">
          <h3 className="text-white text-lg font-semibold mb-4">
            Add Firm to Budget Section
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Select a firm to feature in the budget/cheap section
          </p>
          {membershipsLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
              <span className="ml-2 text-gray-300">Loading...</span>
            </div>
          ) : (
            <>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Select a firm to add
                  </label>
                  <Select value={selectedFirmId} onValueChange={setSelectedFirmId}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue placeholder="Select a firm" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {propFirms.map((firm) => (
                        <SelectItem key={firm.id} value={firm.id} className="text-white hover:bg-slate-600">
                          {firm.name} - ${firm.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAddToSection}
                  disabled={!selectedFirmId || membershipsLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {/* Current firms in budget section */}
              <div className="mt-6">
                <h4 className="text-gray-300 text-sm font-medium mb-3">
                  Current budget firms:
                </h4>
                {!budgetFirms || budgetFirms.length === 0 ? (
                  <div className="text-gray-400 text-sm">
                    No firms in budget section yet. Add some budget-friendly firms to get started!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {budgetFirms.map((firm) => (
                      <div 
                        key={firm.membership_id} 
                        className="flex items-center justify-between bg-slate-600/50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-white font-medium">
                              {firm.name}
                            </div>
                            <div className="text-gray-400 text-sm">
                              ${firm.price}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                          onClick={() => handleRemoveFromSection(firm.membership_id)}
                          disabled={membershipsLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CheapFirmsSection;