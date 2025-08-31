import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  DollarSign, 
  Trophy, 
  Table,
  Plus,
  X
} from "lucide-react";
import { usePropFirms } from "@/hooks/useSupabaseData";
import { useSectionMemberships } from "@/hooks/useSectionMemberships";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SectionManager = () => {
  const { propFirms } = usePropFirms();
  const { 
    budgetFirms, 
    topFirms, 
    loading, 
    addFirmToBudget, 
    removeFirmFromBudget, 
    addFirmToTop, 
    removeFirmFromTop,
    refetch 
  } = useSectionMemberships();
  
  const [selectedBudgetFirm, setSelectedBudgetFirm] = useState<string>("");
  const [selectedTopFirm, setSelectedTopFirm] = useState<string>("");

  const handleAddToBudget = async () => {
    if (!selectedBudgetFirm) return;
    await addFirmToBudget(selectedBudgetFirm);
    setSelectedBudgetFirm("");
    refetch();
  };

  const handleAddToTop = async () => {
    if (!selectedTopFirm) return;
    await addFirmToTop(selectedTopFirm);
    setSelectedTopFirm("");
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Section Management</h2>
        <p className="text-gray-300">
          Manage which prop firms appear in each section
        </p>
      </div>

      <Tabs defaultValue="budget" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-800/50">
          <TabsTrigger 
            value="budget" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Budget Firms
          </TabsTrigger>
          <TabsTrigger 
            value="top" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Top 5 Firms
          </TabsTrigger>
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Building2 className="h-4 w-4 mr-2" />
            All Firms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budget">
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Firms Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Add Firm to Budget Section
                </h3>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Select a firm to add
                    </label>
                    <Select value={selectedBudgetFirm} onValueChange={setSelectedBudgetFirm}>
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
                    onClick={handleAddToBudget}
                    disabled={!selectedBudgetFirm || loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Budget
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-gray-300 text-sm font-medium mb-3">
                    Current budget firms:
                  </h4>
                  {budgetFirms.length === 0 ? (
                    <div className="text-gray-400 text-sm">No firms in budget section yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {budgetFirms.map((firm) => (
                        <div 
                          key={firm.id} 
                          className="flex items-center justify-between bg-slate-600/50 p-3 rounded-lg"
                        >
                          <div>
                            <div className="text-white font-medium">
                              {firm.name}
                            </div>
                            <div className="text-gray-400 text-sm">
                              ${firm.price}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                            onClick={() => removeFirmFromBudget(firm.id)}
                            disabled={loading}
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
        </TabsContent>

        <TabsContent value="top">
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top 5 Firms Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Add Firm to Top 5 Section
                </h3>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Select a firm to add
                    </label>
                    <Select value={selectedTopFirm} onValueChange={setSelectedTopFirm}>
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
                    onClick={handleAddToTop}
                    disabled={!selectedTopFirm || loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Top 5
                  </Button>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-gray-300 text-sm font-medium mb-3">
                    Current top 5 firms:
                  </h4>
                  {topFirms.length === 0 ? (
                    <div className="text-gray-400 text-sm">No firms in top 5 section yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {topFirms.map((firm) => (
                        <div 
                          key={firm.id} 
                          className="flex items-center justify-between bg-slate-600/50 p-3 rounded-lg"
                        >
                          <div>
                            <div className="text-white font-medium">
                              {firm.name}
                            </div>
                            <div className="text-gray-400 text-sm">
                              ${firm.price}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                            onClick={() => removeFirmFromTop(firm.id)}
                            disabled={loading}
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
        </TabsContent>

        <TabsContent value="all">
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                All PropFirms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400 text-center py-8">
                <p className="mb-2">All prop firms added through the main form will appear here.</p>
                <p>Use the other tabs to assign firms to specific sections.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SectionManager;