import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, X, Plus } from "lucide-react";
import { useSectionMemberships } from "@/hooks/useSectionMemberships";
import { PropFirm } from "@/types/supabase";
import { toast } from "sonner";

interface ExploreFirmsSectionProps {
  propFirms: PropFirm[];
}

const ExploreFirmsSection = ({ propFirms }: ExploreFirmsSectionProps) => {
  const [selectedFirmId, setSelectedFirmId] = useState<string>("");
  const [selectedRank, setSelectedRank] = useState<string>("1");
  const { 
    exploreFirms,
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
    
    const result = await addFirmToSection("explore-firms", selectedFirmId, parseInt(selectedRank));
    if (result.success) {
      setSelectedFirmId("");
      setSelectedRank("1");
      refetch(); // Refresh to show the new membership
    }
  };

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-blue-400" />
            <div>
              <CardTitle className="text-white text-xl">Explore Firms</CardTitle>
              <p className="text-gray-400 text-sm">
                Manage firms featured in exploration section
              </p>
            </div>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {exploreFirms?.length || 0} items
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-slate-700/50 p-6 rounded-lg">
          <h3 className="text-white text-lg font-semibold mb-4">
            Add Firm to Explore Section
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Select a firm to feature in the explore section
          </p>
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
            <div className="w-24">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Rank
              </label>
              <Select value={selectedRank} onValueChange={setSelectedRank}>
                <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {[1,2,3,4,5,6,7,8,9,10].map((rank) => (
                    <SelectItem key={rank} value={rank.toString()} className="text-white hover:bg-slate-600">
                      {rank}
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
          
          {/* Current firms in explore section */}
          <div className="mt-6">
            <h4 className="text-gray-300 text-sm font-medium mb-3">
              Current firms in explore section:
            </h4>
            {!exploreFirms || exploreFirms.length === 0 ? (
              <div className="text-gray-400 text-sm">
                No firms in explore section yet. Add some firms to get started!
              </div>
            ) : (
              <div className="space-y-2">
                {exploreFirms.map((firm) => (
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
                      onClick={() => removeFirmFromSection(firm.membership_id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExploreFirmsSection;