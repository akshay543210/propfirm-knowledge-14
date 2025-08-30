import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { useSectionMemberships } from "@/hooks/useSectionMemberships";
import { PropFirm } from "@/types/supabase";

interface CheapFirmsSectionProps {
  propFirms: PropFirm[];
}

const CheapFirmsSection = ({ propFirms }: CheapFirmsSectionProps) => {
  const { getMembershipsBySection } = useSectionMemberships();
  const cheapFirmsMemberships = getMembershipsBySection("cheap-firms");

  // Get firm details for each membership
  const cheapFirms = cheapFirmsMemberships
    .map(membership => {
      const firm = propFirms.find(f => f.id === membership.firm_id);
      return firm ? { ...firm, rank: membership.rank || 0 } : null;
    })
    .filter((firm): firm is PropFirm & { rank: number } => firm !== null)
    .sort((a, b) => a.rank - b.rank);

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
            {cheapFirms.length} items
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-slate-700/50 p-6 rounded-lg">
          <h3 className="text-white text-lg font-semibold mb-4">
            Budget Firms
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            These firms are manually selected for the budget section
          </p>
          
          {cheapFirms.length === 0 ? (
            <div className="text-gray-400 text-sm">No firms in this section yet.</div>
          ) : (
            <div className="space-y-2">
              {cheapFirms.map((firm, index) => (
                <div 
                  key={firm.id} 
                  className="flex items-center justify-between bg-slate-600/50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {firm.rank}
                    </Badge>
                    <div>
                      <div className="text-white font-medium">
                        {firm.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        ${firm.price}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Budget
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CheapFirmsSection;