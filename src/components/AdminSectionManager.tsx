
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Trash2
} from "lucide-react";

interface SectionData {
  id: string;
  name: string;
  type: string;
  items: any[];
}

const AdminSectionManager = () => {
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
      default:
        return "Manage section content";
    }
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
                    {section.items.length} items
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
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
                  <div className="text-center py-12 border-2 border-dashed border-gray-600 rounded-lg">
                    <div className="text-gray-400 mb-4">
                      {getSectionIcon(section.id)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminSectionManager;
