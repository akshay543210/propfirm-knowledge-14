import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Grid, Table as TableIcon, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { useSectionMemberships } from "@/hooks/useSectionMemberships";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PropFirm } from "@/types/supabase";

const TableReview = () => {
  const { tableReviewFirms, loading } = useSectionMemberships();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [filters, setFilters] = useState({
    minPayoutRate: 0,
    maxFee: 1000,
    minTrustRating: 0,
  });
  const [filteredFirms, setFilteredFirms] = useState<PropFirm[]>([]);

  useEffect(() => {
    let result = [...tableReviewFirms];
    
    // Apply filters
    result = result.filter(firm => {
      const payoutRate = (firm as any).table_payout_rate ?? firm.payout_rate;
      const fee = (firm as any).table_fee ?? firm.price;
      const trustRating = (firm as any).table_trust_rating ?? firm.trust_rating;
      
      return (
        payoutRate >= filters.minPayoutRate &&
        fee <= filters.maxFee &&
        trustRating >= filters.minTrustRating
      );
    });
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case "price":
            aValue = (a as any).table_fee ?? a.price;
            bValue = (b as any).table_fee ?? b.price;
            break;
          case "profitSplit":
            aValue = (a as any).table_profit_split ?? a.profit_split;
            bValue = (b as any).table_profit_split ?? b.profit_split;
            break;
          case "payoutRate":
            aValue = (a as any).table_payout_rate ?? a.payout_rate;
            bValue = (b as any).table_payout_rate ?? b.payout_rate;
            break;
          case "trustRating":
            aValue = (a as any).table_trust_rating ?? a.trust_rating;
            bValue = (b as any).table_trust_rating ?? b.trust_rating;
            break;
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          default:
            aValue = (a as any)[sortConfig.key];
            bValue = (b as any)[sortConfig.key];
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredFirms(result);
  }, [tableReviewFirms, sortConfig, filters]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName: string) => {
    if (!sortConfig || sortConfig.key !== columnName) {
      return <Minus className="h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleFilterChange = (filterName: string, value: number) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center text-white">Loading table review...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <Link 
              to="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white">Table Review</h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              onClick={() => setViewMode("table")}
              className="flex items-center gap-2"
            >
              <TableIcon className="h-4 w-4" />
              Table View
            </Button>
            <Button
              variant={viewMode === "card" ? "default" : "outline"}
              onClick={() => setViewMode("card")}
              className="flex items-center gap-2"
            >
              <Grid className="h-4 w-4" />
              Card View
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-blue-500/20 mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Min Payout Rate (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minPayoutRate}
                onChange={(e) => handleFilterChange("minPayoutRate", Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-white">{filters.minPayoutRate}%</div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Max Fee (USD)</label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={filters.maxFee}
                onChange={(e) => handleFilterChange("maxFee", Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-white">${filters.maxFee}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Min Trust Rating</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.minTrustRating}
                onChange={(e) => handleFilterChange("minTrustRating", Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center text-white">{filters.minTrustRating}/10</div>
            </div>
          </div>
        </Card>

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-slate-800/50 rounded-lg overflow-hidden">
              <thead className="bg-slate-700 sticky top-0">
                <tr>
                  <th 
                    className="text-left p-4 text-white font-semibold cursor-pointer hover:bg-slate-600"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center">
                      Firm Name
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 text-white font-semibold cursor-pointer hover:bg-slate-600"
                    onClick={() => requestSort("price")}
                  >
                    <div className="flex items-center">
                      Price (USD)
                      {getSortIcon("price")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 text-white font-semibold cursor-pointer hover:bg-slate-600"
                    onClick={() => requestSort("profitSplit")}
                  >
                    <div className="flex items-center">
                      Profit Split (%)
                      {getSortIcon("profitSplit")}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 text-white font-semibold cursor-pointer hover:bg-slate-600"
                    onClick={() => requestSort("payoutRate")}
                  >
                    <div className="flex items-center">
                      Payout Rate (%)
                      {getSortIcon("payoutRate")}
                    </div>
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Platforms
                  </th>
                  <th 
                    className="text-left p-4 text-white font-semibold cursor-pointer hover:bg-slate-600"
                    onClick={() => requestSort("trustRating")}
                  >
                    <div className="flex items-center">
                      Trust Rating
                      {getSortIcon("trustRating")}
                    </div>
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Evaluation Rules
                  </th>
                  <th className="text-left p-4 text-white font-semibold">
                    Coupon Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFirms.map((firm) => (
                  <tr key={firm.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                    <td className="p-4 text-white font-medium">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          {firm.name.charAt(0)}
                        </div>
                        <div>
                          <div>{firm.name}</div>
                          {firm.brand && (
                            <Badge className="mt-1 bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {firm.brand}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-green-400 font-semibold">
                      ${(firm as any).table_fee ?? firm.price}
                      {((firm as any).table_fee !== null && (firm as any).table_fee !== firm.price) && firm.price && (
                        <div className="text-gray-400 text-sm line-through">${firm.price}</div>
                      )}
                    </td>
                    <td className="p-4 text-blue-400 font-semibold">
                      {(firm as any).table_profit_split ?? firm.profit_split}%
                    </td>
                    <td className="p-4 text-purple-400 font-semibold">
                      {(firm as any).table_payout_rate ?? firm.payout_rate}%
                    </td>
                    <td className="p-4 text-white">
                      {(firm as any).table_platform ?? firm.platform ?? "N/A"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                          <span className="text-green-400 font-bold">
                            {(firm as any).table_trust_rating ?? firm.trust_rating}
                          </span>
                        </div>
                        <span className="text-white">
                          /10
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-white">
                      {(firm as any).table_evaluation_rules ?? "Standard"}
                    </td>
                    <td className="p-4">
                      {((firm as any).table_coupon_code ?? firm.coupon_code) ? (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          {(firm as any).table_coupon_code ?? firm.coupon_code}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredFirms.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No firms match the current filters.
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFirms.map((firm, index) => (
              <div key={firm.id} className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{firm.name}</h3>
                  {firm.brand && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {firm.brand}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-white font-semibold">
                      ${(firm as any).table_fee ?? firm.price}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Profit Split:</span>
                    <span className="text-blue-400 font-semibold">
                      {(firm as any).table_profit_split ?? firm.profit_split}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payout Rate:</span>
                    <span className="text-purple-400 font-semibold">
                      {(firm as any).table_payout_rate ?? firm.payout_rate}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform:</span>
                    <span className="text-white">
                      {(firm as any).table_platform ?? firm.platform ?? "N/A"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Trust Rating:</span>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-1">
                        <span className="text-green-400 text-xs font-bold">
                          {(firm as any).table_trust_rating ?? firm.trust_rating}
                        </span>
                      </div>
                      <span className="text-white">/10</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Evaluation:</span>
                    <span className="text-white">
                      {(firm as any).table_evaluation_rules ?? "Standard"}
                    </span>
                  </div>
                  
                  {((firm as any).table_coupon_code ?? firm.coupon_code) && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coupon:</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        {(firm as any).table_coupon_code ?? firm.coupon_code}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredFirms.length === 0 && viewMode === "card" && (
          <div className="text-center py-12 text-gray-400">
            No firms match the current filters.
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TableReview;