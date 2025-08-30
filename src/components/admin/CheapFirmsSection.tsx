import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { PropFirm } from "@/types/supabase";

interface CheapFirmsSectionProps {
  propFirms: PropFirm[];
}

const CheapFirmsSection = ({ propFirms }: CheapFirmsSectionProps) => {
  const getCheapFirms = () => {
    return propFirms.filter(firm => firm.price < 200);
  };

  const cheapFirms = getCheapFirms();

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-green-400" />
            <div>
              <CardTitle className="text-white text-xl">Cheap Cost Firms</CardTitle>
              <p className="text-gray-400 text-sm">
                Manage cost-effective prop firms (under $200)
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
            Cheap Cost Firms (Under $200)
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            These firms are automatically selected based on price
          </p>
          
          {cheapFirms.length === 0 ? (
            <div className="text-gray-400 text-sm">No cheap firms found.</div>
          ) : (
            <div className="space-y-2">
              {cheapFirms.map((firm) => (
                <div 
                  key={firm.id} 
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
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Cheap
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