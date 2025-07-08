
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
<<<<<<< HEAD
=======
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WriteReviewForm from "@/components/WriteReviewForm";
>>>>>>> 0b83ad0 (Your commit message)
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
<<<<<<< HEAD
  Trash2
} from "lucide-react";
=======
  Trash2,
  Table
} from "lucide-react";
import AccountSizesManager from "./admin/AccountSizesManager";
import AdminFormPanel from "./AdminFormPanel";
import { useAdminOperations } from "../hooks/useAdminOperations";
import { usePropFirms } from "../hooks/useSupabaseData";
import { PropFirm } from "../types/supabase";
>>>>>>> 0b83ad0 (Your commit message)

interface SectionData {
  id: string;
  name: string;
  type: string;
  items: any[];
}

const AdminSectionManager = () => {
<<<<<<< HEAD
=======
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingFirm, setEditingFirm] = useState<PropFirm | null>(null);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [selectedReviewFirmId, setSelectedReviewFirmId] = useState<string>("");
  const [selectedReviewFirmName, setSelectedReviewFirmName] = useState<string>("");
  const [selectedFirmId, setSelectedFirmId] = useState<string>("");
  const [currentSection, setCurrentSection] = useState<string>("");
  const { addFirm, updateFirm, deleteFirm, loading } = useAdminOperations();
  const { propFirms } = usePropFirms();
>>>>>>> 0b83ad0 (Your commit message)
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
      id: "reviews",
      name: "Reviews Section",
      type: "reviews",
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
<<<<<<< HEAD
=======
    },
    {
      id: "account-sizes",
      name: "Account Sizes",
      type: "account-sizes",
      items: []
>>>>>>> 0b83ad0 (Your commit message)
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
      case "reviews":
        return <MessageSquare className="h-5 w-5" />;
      case "beginners":
        return <GraduationCap className="h-5 w-5" />;
      case "intermediates":
        return <Users className="h-5 w-5" />;
      case "pro-traders":
        return <Award className="h-5 w-5" />;
<<<<<<< HEAD
=======
      case "account-sizes":
        return <Table className="h-5 w-5" />;
>>>>>>> 0b83ad0 (Your commit message)
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
      case "reviews":
        return "Manage expert reviews and user feedback";
      case "beginners":
        return "Manage firms suitable for beginner traders";
      case "intermediates":
        return "Manage firms for intermediate-level traders";
      case "pro-traders":
        return "Manage firms for professional traders";
<<<<<<< HEAD
=======
      case "account-sizes":
        return "Manage account sizes and pricing for prop firms";
>>>>>>> 0b83ad0 (Your commit message)
      default:
        return "Manage section content";
    }
  };

<<<<<<< HEAD
=======
  const handleAddPropFirm = () => {
    setEditingFirm(null);
    setIsAddFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsAddFormOpen(false);
    setEditingFirm(null);
  };

>>>>>>> 0b83ad0 (Your commit message)
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Section Management</h2>
        <p className="text-gray-300">
          Manage different sections of your website. Changes here will reflect on the live site.
        </p>
      </div>

      <Tabs defaultValue="all-firms" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-6 bg-slate-800/50">
          {sections.map((section) => (
            <TabsTrigger 
              key={section.id} 
              value={section.id}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs p-2"
            >
              <div className="flex flex-col items-center gap-1">
                {getSectionIcon(section.id)}
                <span className="hidden sm:inline">{section.name.split(' ')[0]}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
<<<<<<< HEAD
            <Card className="bg-slate-800/50 border-blue-500/20">
=======
            {section.id === 'account-sizes' ? (
              <AccountSizesManager />
            ) : (
              <Card className="bg-slate-800/50 border-blue-500/20">
>>>>>>> 0b83ad0 (Your commit message)
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
                    {section.items.length} items
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
<<<<<<< HEAD
                <div className="flex gap-2 mb-4">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add {section.type === 'reviews' ? 'Review' : 'PropFirm'}
                  </Button>
                  <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900">
                    <Edit className="h-4 w-4 mr-2" />
                    Bulk Edit
                  </Button>
                </div>

                {/* Section-specific content */}
                {section.items.length === 0 ? (
=======
                {/* Add Firm Selection for Cheap/Top Firms */}
                {(section.id === 'cheap-firms' || section.id === 'top-firms') ? (
                  <div className="bg-slate-700/50 p-6 rounded-lg">
                    <h3 className="text-white text-lg font-semibold mb-4">
                      Add Firm to {section.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Select a firm and set its rank in the {section.name.toLowerCase()} section
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
                        <Select>
                          <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                            <SelectValue placeholder="1" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {[1,2,3,4,5].map((rank) => (
                              <SelectItem key={rank} value={rank.toString()} className="text-white hover:bg-slate-600">
                                {rank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to {section.name}
                      </Button>
                    </div>
                    
                    {/* Current firms in this category */}
                    <div className="mt-6">
                      <div className="text-gray-300 text-sm mb-3">No firms in {section.name.toLowerCase()} category yet.</div>
                    </div>
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
                      <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900">
                        <Edit className="h-4 w-4 mr-2" />
                        Bulk Edit
                      </Button>
                    </div>
                    <div className="text-gray-400 text-center py-8">
                      Create new prop firms that will be available in all sections
                    </div>
                  </div>
                ) : section.id === 'reviews' ? (
                  <div className="bg-slate-700/50 p-6 rounded-lg">
                    <h3 className="text-white text-lg font-semibold mb-4">Add New Review</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Prop Firm *
                        </label>
                        <Select
                          value={selectedReviewFirmId}
                          onValueChange={(val) => {
                            setSelectedReviewFirmId(val);
                            const firm = propFirms.find(f => f.id === val);
                            setSelectedReviewFirmName(firm ? firm.name : "");
                          }}
                        >
                          <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                            <SelectValue placeholder="Select a firm" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            {propFirms.map((firm) => (
                              <SelectItem key={firm.id} value={firm.id} className="text-white hover:bg-slate-600">
                                {firm.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Category
                        </label>
                        <Select disabled>
                          <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                            <SelectValue placeholder="e.g. Big, Medium, Small" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="big" className="text-white hover:bg-slate-600">Big</SelectItem>
                            <SelectItem value="medium" className="text-white hover:bg-slate-600">Medium</SelectItem>
                            <SelectItem value="small" className="text-white hover:bg-slate-600">Small</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white mt-4"
                      disabled={!selectedReviewFirmId}
                      onClick={() => setIsAddReviewOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Review
                    </Button>

                    {/* Add Review Dialog */}
                    <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
                      <DialogContent className="max-w-lg bg-slate-800 border-blue-500/20">
                        <DialogHeader>
                          <DialogTitle className="text-white text-xl">
                            Add New User Review
                          </DialogTitle>
                        </DialogHeader>
                        {selectedReviewFirmId && (
                          <WriteReviewForm
                            firmId={selectedReviewFirmId}
                            firmName={selectedReviewFirmName}
                            onClose={() => setIsAddReviewOpen(false)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
>>>>>>> 0b83ad0 (Your commit message)
                  <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                    <div className="text-gray-400 mb-4">
                      {getSectionIcon(section.id)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
<<<<<<< HEAD
                      No {section.type === 'reviews' ? 'reviews' : 'prop firms'} in this section
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Start by adding your first {section.type === 'reviews' ? 'review' : 'prop firm'} to this section.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add {section.type === 'reviews' ? 'Review' : 'PropFirm'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* This would be populated with actual items */}
                    <div className="text-gray-400 text-center py-8">
                      Items will appear here when added
                    </div>
=======
                      {section.name} Management
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Configure {section.name.toLowerCase()} settings and content.
                    </p>
>>>>>>> 0b83ad0 (Your commit message)
                  </div>
                )}
              </CardContent>
            </Card>
<<<<<<< HEAD
          </TabsContent>
        ))}
      </Tabs>
=======
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
            onUpdate={updateFirm}
            editingFirm={editingFirm}
            setEditingFirm={setEditingFirm}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
>>>>>>> 0b83ad0 (Your commit message)
    </div>
  );
};

export default AdminSectionManager;
