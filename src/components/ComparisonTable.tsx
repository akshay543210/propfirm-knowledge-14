
import { X, Star, Shield, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PropFirm } from "../types/supabase";

interface ComparisonTableProps {
  selectedFirms: PropFirm[];
  onRemoveFirm: (firmId: string) => void;
}

const ComparisonTable = ({ selectedFirms, onRemoveFirm }: ComparisonTableProps) => {
  const categoryColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    pro: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  return (
    <div className="mt-8">
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <h2 className="text-2xl font-bold text-white">Comparison Table</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-2 text-gray-400">Criteria</th>
                  {selectedFirms.map((firm) => (
                    <th key={firm.id} className="text-center py-4 px-2 min-w-48">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-white font-bold">{firm.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveFirm(firm.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className={categoryColors[firm.brand as keyof typeof categoryColors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                        {firm.brand || 'N/A'}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="py-4 px-2 text-gray-300 font-medium">Price</td>
                  {selectedFirms.map((firm) => (
                    <td key={firm.id} className="py-4 px-2 text-center">
                      <div className="text-blue-400 font-bold">${firm.price}</div>
                      <div className="text-sm text-gray-400 line-through">${firm.original_price}</div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-slate-700">
                  <td className="py-4 px-2 text-gray-300 font-medium">Review Score</td>
                  {selectedFirms.map((firm) => (
                    <td key={firm.id} className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-white font-semibold">{firm.review_score || 0}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-slate-700">
                  <td className="py-4 px-2 text-gray-300 font-medium">Trust Rating</td>
                  {selectedFirms.map((firm) => (
                    <td key={firm.id} className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Shield className="h-4 w-4 text-green-400" />
                        <span className="text-white font-semibold">{firm.trust_rating || 0}/10</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-slate-700">
                  <td className="py-4 px-2 text-gray-300 font-medium">Profit Split</td>
                  {selectedFirms.map((firm) => (
                    <td key={firm.id} className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="h-4 w-4 text-blue-400" />
                        <span className="text-white font-semibold">{firm.profit_split}%</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-slate-700">
                  <td className="py-4 px-2 text-gray-300 font-medium">Payout Rate</td>
                  {selectedFirms.map((firm) => (
                    <td key={firm.id} className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4 text-purple-400" />
                        <span className="text-white font-semibold">{firm.payout_rate}%</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-slate-700">
                  <td className="py-4 px-2 text-gray-300 font-medium">Funding Amount</td>
                  {selectedFirms.map((firm) => (
                    <td key={firm.id} className="py-4 px-2 text-center">
                      <span className="text-white font-semibold">{firm.funding_amount}</span>
                    </td>
                  ))}
                </tr>

                <tr className="border-b border-slate-700">
                  <td className="py-4 px-2 text-gray-300 font-medium">Coupon Code</td>
                  {selectedFirms.map((firm) => (
                    <td key={firm.id} className="py-4 px-2 text-center">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded px-2 py-1">
                        <span className="text-blue-400 font-semibold text-sm">{firm.coupon_code || 'N/A'}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="py-4 px-2 text-gray-300 font-medium">Actions</td>
                  {selectedFirms.map((firm) => (
                    <td key={firm.id} className="py-4 px-2 text-center">
                      <div className="space-y-2">
                        <Button 
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => firm.affiliate_url && window.open(firm.affiliate_url, '_blank')}
                        >
                          Get Started
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900"
                          onClick={() => window.location.href = `/propfirm/${firm.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonTable;
