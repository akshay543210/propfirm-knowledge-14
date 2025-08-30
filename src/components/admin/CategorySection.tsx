import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, Award } from "lucide-react";
import { PropFirm } from "@/types/supabase";

interface CategorySectionProps {
  categoryId: string;
  categoryName: string;
  propFirms: PropFirm[];
}

const CategorySection = ({ categoryId, categoryName, propFirms }: CategorySectionProps) => {
  const getFirmsByCategory = (categoryId: string) => {
    return propFirms.filter(firm => firm.category_id === categoryId);
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "beginners":
        return <GraduationCap className="h-5 w-5" />;
      case "intermediates":
        return <Users className="h-5 w-5" />;
      case "pro-traders":
        return <Award className="h-5 w-5" />;
      default:
        return <GraduationCap className="h-5 w-5" />;
    }
  };

  const firmsInCategory = getFirmsByCategory(categoryId);

  return (
    <Card className="bg-slate-800/50 border-blue-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getCategoryIcon(categoryId)}
            <div>
              <CardTitle className="text-white text-xl">{categoryName} Category</CardTitle>
              <p className="text-gray-400 text-sm">
                Manage firms suitable for {categoryName.toLowerCase()} traders
              </p>
            </div>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {firmsInCategory.length} items
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-slate-700/50 p-6 rounded-lg">
          <h3 className="text-white text-lg font-semibold mb-4">
            Firms in {categoryName} Category
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            These firms are automatically categorized based on their category_id: {categoryId}
          </p>
          
          {firmsInCategory.length === 0 ? (
            <div className="text-gray-400 text-sm">No firms in this category yet.</div>
          ) : (
            <div className="space-y-2">
              {firmsInCategory.map((firm) => (
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
      </CardContent>
    </Card>
  );
};

export default CategorySection;