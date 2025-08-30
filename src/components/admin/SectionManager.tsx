import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  DollarSign, 
  Trophy, 
  Globe, 
  MessageSquare, 
  Users, 
  GraduationCap,
  Award,
  Plus,
  Edit,
  Trash2,
  Table,
  X
} from "lucide-react";
import AccountSizesManager from "./AccountSizesManager";
import AdminFormPanel from "../AdminFormPanel";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import { usePropFirms } from "@/hooks/useSupabaseData";
import { useSectionMemberships } from "@/hooks/useSectionMemberships";
import { useCategories } from "@/hooks/useCategories";
import { PropFirm } from "@/types/supabase";

interface SectionData {
  id: string;
  name: string;
  type: string;
  items: any[];
}

const SectionManager = () => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingFirm, setEditingFirm] = useState<PropFirm | null>(null);
  const [selectedFirmId, setSelectedFirmId] = useState<string>("");
  const [selectedRank, setSelectedRank] = useState<string>("1");
  const { addFirm, updateFirm, deleteFirm, loading } = useAdminOperations();
  const { propFirms } = usePropFirms();
  const { categories } = useCategories();
  const { 
    memberships, 
    loading: membershipsLoading, 
    addFirmToSection, 
    removeFirmFromSection, 
    getMembershipsBySection,
    refetch
  } = useSectionMemberships();

  // Sections configuration
  const [sections] = useState<SectionData[]>([
    {
      id: "all-firms",
      name: "All PropFirms",
      type: "propfirms",
      items: []
    },
    {
      id: "cheap-firms",
      name: "Cheap Cost PropFirms",
      type: "propfirms",
      items: []
    },
    {
      id: "top-firms",
      name: "Top 5 PropFirms",
      type: "propfirms",
      items: []
    },
    {
      id: "explore-firms",
      name: "Explore All PropFirms",
      type: "propfirms",
      items: []
    },
    {
      id: "beginners",
      name: "Beginners",
      type: "category",
      items: []
    },
    {
      id: "intermediates",
      name: "Intermediates",
      type: "category",
      items: []
    },
    {
      id: "pro-traders",
      name: "Pro Traders",
      type: "category",
      items: []
    },
    {
      id: "account-sizes",
      name: "Account Sizes",
      type: "account-sizes",
      items: []
    }
  ]);

  const getSectionIcon = (sectionId: string) => {
    switch (sectionId) {
      case "all-firms":
        return <Building2 className="h-5 w-5" />;
      case "cheap-firms":
        return <DollarSign className="h-5 w-5" />;
      case "top-firms":
        return <Trophy className="h-5 w-5" />;
      case "explore-firms":
        return <Globe className="h-5 w-5" />;
      case "beginners":
        return <GraduationCap className="h-5 w-5" />;
      case "intermediates":
        return <Users className="h-5 w-5" />;
      case "pro-traders":
        return <Award className="h-5 w-5" />;
      case "account-sizes":
        return <Table className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  const getSectionDescription = (sectionId: string) => {
    switch (sectionId) {
      case "all-firms":
        return "Manage all prop firms in the system";
      case "cheap-firms":
        return "Manage cost-effective prop firms (under $200)";
      case "top-firms":
        return "Manage the top 5 highest-rated firms";
      case "explore-firms":
        return "Manage firms featured in exploration section";
      case "beginners":
        return "Manage firms suitable for beginner traders";
      case "intermediates":
        return "Manage firms for intermediate-level traders";
      case "pro-traders":
        return "Manage firms for professional traders";
      case "account-sizes":
        return "Manage account sizes and pricing for prop firms";
      default:
        return "Manage section content";
    }
  };

  const handleAddPropFirm = () => {
    setEditingFirm(null);
    setIsAddFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsAddFormOpen(false);
    setEditingFirm(null);
    // Refresh section memberships after adding/updating a firm
    refetch();
  };

  const handleAddToSection = async (sectionId: string) => {
    if (!selectedFirmId) {
      return;
    }
    
    const result = await addFirmToSection(sectionId, selectedFirmId, parseInt(selectedRank));
    if (result.success) {
      setSelectedFirmId("");
      setSelectedRank("1");
      // Refresh section memberships after adding to section
      refetch();
    }
  };

  const handleRemoveFromSection = async (membershipId: string) => {
    await removeFirmFromSection(membershipId);
    // Refresh section memberships after removing from section
    refetch();
  };

  // Get firms by category for category sections
  const getFirmsByCategory = (categoryId: string) => {
    return propFirms.filter(firm => firm.category_id === categoryId);
  };

  // Get cheap firms (under $200)
  const getCheapFirms = () => {
    return propFirms.filter(firm => firm.price < 200);
  };

  // Get top rated firms (top 5 by review score)
  const getTopFirms = () => {
    return [...propFirms]
      .sort((a, b) => (b.review_score || 0) - (a.review_score || 0))
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Section Management</h2>
        <p className="text-gray-300">
          Manage different sections of your website. Changes here will reflect on the live site.
        </p>
      </div>

      <Tabs defaultValue="all-firms" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-6 bg-slate-800/50">
          {sections.map((section) => (
            <TabsTrigger 
              key={section.id} 
              value={section.id}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs p-2"
            >
              <div className="flex flex-col items-center gap-1">
                {getSectionIcon(section.id)}
                <span className="hidden sm:inline text-xs">{section.name.split(' ')[0]}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            {section.id === 'account-sizes' ? (
              <AccountSizesManager />
            ) : (
              <Card className="bg-slate-800/50 border-blue-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getSectionIcon(section.id)}
                      <div>
                        <CardTitle className="text-white text-xl">{section.name}</CardTitle>
                        <p className="text-gray-400 text-sm">{getSectionDescription(section.id)}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {section.id === 'beginners' || section.id === 'intermediates' || section.id === 'pro-traders'
                        ? getFirmsByCategory(section.id).length
                        : section.id === 'cheap-firms'
                        ? getCheapFirms().length
                        : section.id === 'top-firms'
                        ? getTopFirms().length
                        : getMembershipsBySection(section.id).length} items
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Add Firm Selection for Category Sections */}
                  {(section.id === 'beginners' || section.id === 'intermediates' || section.id === 'pro-traders') ? (
                    <div className="bg-slate-700/50 p-6 rounded-lg">
                      <h3 className="text-white text-lg font-semibold mb-4">
                        Firms in {section.name} Category
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        These firms are automatically categorized based on their category_id: {section.id}
                      </p>
                      
                      {getFirmsByCategory(section.id).length === 0 ? (
                        <div className="text-gray-400 text-sm">No firms in this category yet.</div>
                      ) : (
                        <div className="space-y-2">
                          {getFirmsByCategory(section.id).map((firm) => (
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
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                {firm.category_id}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : section.id === 'cheap-firms' ? (
                    <div className="bg-slate-700/50 p-6 rounded-lg">
                      <h3 className="text-white text-lg font-semibold mb-4">
                        Cheap Cost Firms (Under $200)
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        These firms are automatically selected based on price
                      </p>
                      
                      {getCheapFirms().length === 0 ? (
                        <div className="text-gray-400 text-sm">No cheap firms found.</div>
                      ) : (
                        <div className="space-y-2">
                          {getCheapFirms().map((firm) => (
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
                  ) : section.id === 'top-firms' ? (
                    <div className="bg-slate-700/50 p-6 rounded-lg">
                      <h3 className="text-white text-lg font-semibold mb-4">
                        Top 5 Rated Firms
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">
                        These firms are automatically selected based on review score
                      </p>
                      
                      {getTopFirms().length === 0 ? (
                        <div className="text-gray-400 text-sm">No firms found.</div>
                      ) : (
                        <div className="space-y-2">
                          {getTopFirms().map((firm, index) => (
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
                  ) : section.id === 'all-firms' ? (
                    <div className="space-y-4">
                      <div className="flex gap-2 mb-4">
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleAddPropFirm}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New PropFirm
                        </Button>
                      </div>
                      <div className="text-gray-400 text-center py-8">
                        All prop firms in the system will appear in the main listing
                      </div>
                    </div>
                  ) : section.id === 'explore-firms' ? (
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
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleAddToSection(section.id)}
                          disabled={!selectedFirmId || loading || membershipsLoading}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Explore
                        </Button>
                      </div>
                      
                      {/* Current firms in explore section */}
                      <div className="mt-6">
                        <h4 className="text-gray-300 text-sm font-medium mb-3">
                          Current firms in explore section:
                        </h4>
                        {getMembershipsBySection(section.id).length === 0 ? (
                          <div className="text-gray-400 text-sm">No firms in explore section yet.</div>
                        ) : (
                          <div className="space-y-2">
                            {getMembershipsBySection(section.id)
                              .map((membership) => (
                                <div 
                                  key={membership.id} 
                                  className="flex items-center justify-between bg-slate-600/50 p-3 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <div className="text-white font-medium">
                                        {membership.prop_firms?.name || 'Unknown Firm'}
                                      </div>
                                      <div className="text-gray-400 text-sm">
                                        ${membership.prop_firms?.price || 'N/A'}
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                                    onClick={() => handleRemoveFromSection(membership.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                      <div className="text-gray-400 mb-4">
                        {getSectionIcon(section.id)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">
                        {section.name} Management
                      </h3>
                      <p className="text-gray-400 mb-4">
                        Configure {section.name.toLowerCase()} settings and content.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Add PropFirm Dialog */}
      <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-blue-500/20">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Add New PropFirm
            </DialogTitle>
          </DialogHeader>
          <AdminFormPanel
            onAdd={async (firmData) => {
              const result = await addFirm(firmData);
              if (result.success) {
                handleFormSuccess();
              }
              return result;
            }}
            onUpdate={async (id, firmData) => {
              const result = await updateFirm(id, firmData);
              if (result.success) {
                handleFormSuccess();
              }
              return result;
            }}
            editingFirm={editingFirm}
            setEditingFirm={setEditingFirm}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SectionManager;