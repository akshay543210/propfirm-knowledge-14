import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { PropFirm } from "@/types/supabase";

interface TopFirmsSectionProps {
  propFirms: PropFirm[];
}

const TopFirmsSection = ({ propFirms }: TopFirmsSectionProps) => {
  const getTopFirms = () => {
    return [...propFirms]
      .sort((a, b) => (b.review_score || 0) - (a.review_score || 0))
      .slice(0, 5);
  };

  const topFirms = getTopFirms();

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-purple-400" />
            <div>
              <CardTitle className="text-white text-xl">Top Rated Firms</CardTitle>
              <p className="text-gray-400 text-sm">
                Manage the top 5 highest-rated firms
              </p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            {topFirms.length} items
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-slate-700/50 p-6 rounded-lg">
          <h3 className="text-white text-lg font-semibold mb-4">
            Top 5 Rated Firms
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            These firms are automatically selected based on review score
          </p>
          
          {topFirms.length === 0 ? (
            <div className="text-gray-400 text-sm">No firms found.</div>
          ) : (
            <div className="space-y-2">
              {topFirms.map((firm, index) => (
                <div 
                  key={firm.id} 
                  className="flex items-center justify-between bg-slate-600/50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="text-white font-medium">
                        {firm.name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {firm.review_score}/5 stars
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Top Rated
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

export default TopFirmsSection;