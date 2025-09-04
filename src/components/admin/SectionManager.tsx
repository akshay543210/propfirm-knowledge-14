import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  DollarSign, 
  Trophy, 
  Table,
  Globe,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  Loader2
} from "lucide-react";
import { usePropFirms } from "@/hooks/useSupabaseData";
import { useSectionMemberships } from "@/hooks/useSectionMemberships";
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AllFirmsSection from "./AllFirmsSection";
import CheapFirmsSection from "./CheapFirmsSection";
import TopFirmsSection from "./TopFirmsSection";
import ExploreFirmsSection from "./ExploreFirmsSection";

import { toast } from "sonner";
import { memo } from "react";

const SectionManager = memo(() => {
  const { propFirms, loading: firmsLoading } = usePropFirms();
  const { 
    budgetFirms, 
    topFirms, 
    tableReviewFirms,
    loading: membershipsLoading, 
    addFirmToSection, 
    removeFirmFromSection,
    refetch,
    error,
    hasInitialized
  } = useSectionMemberships();
  
  const [selectedBudgetFirm, setSelectedBudgetFirm] = useState<string>("");
  const [selectedTopFirm, setSelectedTopFirm] = useState<string>("");
  const [selectedTableReviewFirm, setSelectedTableReviewFirm] = useState<string>("");

  // Memoized refetch function to prevent unnecessary re-renders
  const memoizedRefetch = useCallback(() => {
    if (!firmsLoading && propFirms.length > 0 && hasInitialized) {
      refetch();
    }
  }, [propFirms.length, firmsLoading, refetch, hasInitialized]);

  // Only refetch when propFirms actually change
  useEffect(() => {
    memoizedRefetch();
  }, [memoizedRefetch]);

  const handleAddToBudget = useCallback(async () => {
    if (!selectedBudgetFirm) {
      toast.error('Please select a firm to add');
      return;
    }
    const result = await addFirmToSection("budget-firms", selectedBudgetFirm);
    if (result.success) {
      setSelectedBudgetFirm("");
      toast.success('Firm added to budget section successfully');
    }
  }, [selectedBudgetFirm, addFirmToSection]);

  const handleAddToTop = useCallback(async () => {
    if (!selectedTopFirm) {
      toast.error('Please select a firm to add');
      return;
    }
    const result = await addFirmToSection("top-firms", selectedTopFirm);
    if (result.success) {
      setSelectedTopFirm("");
      toast.success('Firm added to top firms successfully');
    }
  }, [selectedTopFirm, addFirmToSection]);

  const handleAddToTableReview = useCallback(async () => {
    if (!selectedTableReviewFirm) {
      toast.error('Please select a firm to add');
      return;
    }
    const result = await addFirmToSection("table-review", selectedTableReviewFirm);
    if (result.success) {
      setSelectedTableReviewFirm("");
      toast.success('Firm added to table review successfully');
    }
  }, [selectedTableReviewFirm, addFirmToSection]);

  const updateTableReviewPriority = async (membershipId: string, newPriority: number) => {
    try {
      const { error } = await supabase
        .from('table_review_firms')
        .update({ sort_priority: newPriority })
        .eq('id', membershipId);
      
      if (error) throw error;
      
      await refetch();
      toast.success('Firm priority updated successfully');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to update firm priority');
      return { success: false, error: error.message };
    }
  };

  const moveTableReviewFirm = async (firmId: string, direction: 'up' | 'down') => {
    const firm = tableReviewFirms.find(f => f.id === firmId);
    if (!firm) return;
    
    const currentIndex = tableReviewFirms.findIndex(f => f.id === firmId);
    let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Ensure newIndex is within bounds
    newIndex = Math.max(0, Math.min(newIndex, tableReviewFirms.length - 1));
    
    if (newIndex === currentIndex) return;
    
    // Update the moved firm
    await updateTableReviewPriority(firm.membership_id, newIndex);
    
    // Update the firm that was swapped
    const swappedFirm = tableReviewFirms[newIndex];
    if (swappedFirm) {
      await updateTableReviewPriority(swappedFirm.membership_id, currentIndex);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">Error loading section data</div>
        <div className="text-gray-400 text-sm mb-4">{error}</div>
        <Button onClick={refetch} className="bg-blue-600 hover:bg-blue-700 text-white">
          Retry
        </Button>
      </div>
    );
  }

  const loading = firmsLoading || membershipsLoading;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Section Management</h2>
        <p className="text-gray-300">
          Manage which prop firms appear in each section
        </p>
      </div>



      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-slate-800/50">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Building2 className="h-4 w-4 mr-2" />
            All Firms
          </TabsTrigger>
          <TabsTrigger 
            value="explore" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Globe className="h-4 w-4 mr-2" />
            Explore Firms
          </TabsTrigger>
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
            value="table" 
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Table className="h-4 w-4 mr-2" />
            Table Review
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AllFirmsSection onAddPropFirm={() => {}} />
        </TabsContent>

        <TabsContent value="explore">
          <ExploreFirmsSection propFirms={propFirms} />
        </TabsContent>

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
                {loading ? (
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
                        <Select 
                          value={selectedBudgetFirm} 
                          onValueChange={setSelectedBudgetFirm}
                          disabled={loading || propFirms.length === 0}
                        >
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
                                onClick={() => removeFirmFromSection(firm.membership_id)}
                                disabled={loading}
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
                {loading ? (
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
                        <Select 
                          value={selectedTopFirm} 
                          onValueChange={setSelectedTopFirm}
                          disabled={loading || propFirms.length === 0}
                        >
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
                                onClick={() => removeFirmFromSection(firm.membership_id)}
                                disabled={loading}
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
        </TabsContent>

        <TabsContent value="table">
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Table className="h-5 w-5" />
                Table Review Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Add Firm to Table Review
                </h3>
                {loading ? (
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
                        <Select 
                          value={selectedTableReviewFirm} 
                          onValueChange={setSelectedTableReviewFirm}
                          disabled={loading || propFirms.length === 0}
                        >
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
                        onClick={handleAddToTableReview}
                        disabled={!selectedTableReviewFirm || loading}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Table Review
                      </Button>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-gray-300 text-sm font-medium mb-3">
                        Current table review firms:
                      </h4>
                      {tableReviewFirms.length === 0 ? (
                        <div className="text-gray-400 text-sm">No firms in table review section yet.</div>
                      ) : (
                        <div className="space-y-2">
                          {tableReviewFirms.map((firm, index) => (
                            <div 
                              key={firm.id} 
                              className="flex items-center justify-between bg-slate-600/50 p-3 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white h-6 w-6 p-0"
                                    onClick={() => moveTableReviewFirm(firm.id, 'up')}
                                    disabled={index === 0 || loading}
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white h-6 w-6 p-0"
                                    onClick={() => moveTableReviewFirm(firm.id, 'down')}
                                    disabled={index === tableReviewFirms.length - 1 || loading}
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </Button>
                                </div>
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
                                disabled={loading}
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
        </TabsContent>
      </Tabs>
    </div>
  );
});

SectionManager.displayName = 'SectionManager';

export default SectionManager;