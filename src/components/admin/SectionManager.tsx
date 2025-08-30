import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Building2, 
  DollarSign, 
  Trophy, 
  Globe, 
  Users, 
  GraduationCap,
  Award,
  Plus,
  Table
} from "lucide-react";
import AccountSizesManager from "./AccountSizesManager";
import AdminFormPanel from "../AdminFormPanel";
import { useAdminOperations } from "@/hooks/useAdminOperations";
import { usePropFirms } from "@/hooks/useSupabaseData";
import { useSectionMemberships } from "@/hooks/useSectionMemberships";
import { useCategories } from "@/hooks/useCategories";
import { PropFirm } from "@/types/supabase";
import CategorySection from "./CategorySection";
import CheapFirmsSection from "./CheapFirmsSection";
import TopFirmsSection from "./TopFirmsSection";
import ExploreFirmsSection from "./ExploreFirmsSection";
import AllFirmsSection from "./AllFirmsSection";

interface SectionData {
  id: string;
  name: string;
  type: string;
  items: any[];
}

const SectionManager = () => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingFirm, setEditingFirm] = useState<PropFirm | null>(null);
  const { addFirm, updateFirm, deleteFirm, loading } = useAdminOperations();
  const { propFirms } = usePropFirms();
  const { categories } = useCategories();
  const { refetch } = useSectionMemberships();

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
            ) : section.id === 'beginners' || section.id === 'intermediates' || section.id === 'pro-traders' ? (
              <CategorySection 
                categoryId={section.id} 
                categoryName={section.name} 
                propFirms={propFirms} 
              />
            ) : section.id === 'cheap-firms' ? (
              <CheapFirmsSection propFirms={propFirms} />
            ) : section.id === 'top-firms' ? (
              <TopFirmsSection propFirms={propFirms} />
            ) : section.id === 'explore-firms' ? (
              <ExploreFirmsSection propFirms={propFirms} />
            ) : section.id === 'all-firms' ? (
              <AllFirmsSection onAddPropFirm={handleAddPropFirm} />
            ) : (
              <Card className="bg-slate-800/50 border-blue-500/20">
                <CardContent className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                  <div className="text-gray-400 mb-4">
                    {getSectionIcon(section.id)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    {section.name} Management
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Configure {section.name.toLowerCase()} settings and content.
                  </p>
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