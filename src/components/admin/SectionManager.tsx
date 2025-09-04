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
      toast.success('Firm added to table review section successfully');
    }
  }, [selectedTableReviewFirm, addFirmToSection]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Section Management</h2>
        <p className="text-gray-300">
          Manage different sections of your website. Changes here will reflect on the live site.
        </p>
      </div>

      <Tabs defaultValue="all-firms" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-6 bg-slate-800/50">
          <TabsTrigger 
            key="all-firms" 
            value="all-firms"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">All Firms</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            key="cheap-firms" 
            value="cheap-firms"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Budget</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            key="top-firms" 
            value="top-firms"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Top</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            key="explore-firms" 
            value="explore-firms"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Explore</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            key="table-review" 
            value="table-review"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <div className="flex flex-col items-center gap-1">
              <Table className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-firms">
          <AllFirmsSection onAddPropFirm={() => {}} />
        </TabsContent>

        <TabsContent value="cheap-firms">
          <CheapFirmsSection />
        </TabsContent>

        <TabsContent value="top-firms">
          <TopFirmsSection />
        </TabsContent>

        <TabsContent value="explore-firms">
          <ExploreFirmsSection propFirms={propFirms} />
        </TabsContent>

        <TabsContent value="table-review">
          <Card className="bg-slate-800/50 border-blue-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Table className="h-5 w-5 text-blue-400" />
                  <div>
                    <CardTitle className="text-white text-xl">Table Review Firms</CardTitle>
                    <p className="text-gray-400 text-sm">
                      Manage firms featured in table review section
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {tableReviewFirms.length} items
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-slate-700/50 p-6 rounded-lg">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Add Firm to Table Review
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Select a firm to feature in the table review section
                </p>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Select a firm to add
                    </label>
                    <Select value={selectedTableReviewFirm} onValueChange={setSelectedTableReviewFirm}>
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
                    disabled={!selectedTableReviewFirm || membershipsLoading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                {/* Current firms in table review section */}
                <div className="mt-6">
                  <h4 className="text-gray-300 text-sm font-medium mb-3">
                    Current firms in table review:
                  </h4>
                  {tableReviewFirms.length === 0 ? (
                    <div className="text-gray-400 text-sm">
                      No firms in table review section yet. Add some firms to get started!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tableReviewFirms.map((firm) => (
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                            onClick={() => removeFirmFromSection(firm.id)}
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
      </Tabs>
    </div>
  );
});

SectionManager.displayName = 'SectionManager';

export default SectionManager;