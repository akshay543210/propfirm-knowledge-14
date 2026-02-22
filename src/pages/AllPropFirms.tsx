import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropFirmCard from "../components/PropFirmCard";
import { usePropFirms } from "../hooks/useSupabaseData";
import { useCategories } from "../hooks/useCategories";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";

const AllPropFirms = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { propFirms, loading } = usePropFirms();
  const { categories } = useCategories();

  const filteredFirms = selectedCategory === 'all'
    ? propFirms
    : propFirms.filter(firm => firm.category_id === selectedCategory);

  return (
    <div className="min-h-screen bg-background font-body noise-overlay">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />

      <SectionWrapper divider={false} className="pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 font-heading">All Prop Firms</h1>
            <p className="text-lg text-muted-foreground">Discover the best prop trading firms</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? "default" : "outline"}
              onClick={() => setSelectedCategory('all')}
              className={`text-xs rounded-full px-5 ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              All Firms
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                size="sm"
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`text-xs rounded-full px-5 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mb-6">
            <p className="text-muted-foreground text-sm">
              Showing {filteredFirms.length} prop firms
              {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name || selectedCategory}`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFirms.map((firm, index) => (
                  <PropFirmCard key={firm.id} firm={firm} index={index} />
                ))}
              </div>

              {filteredFirms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No prop firms found for the selected category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
};

export default AllPropFirms;
