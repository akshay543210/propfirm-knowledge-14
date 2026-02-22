import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropFirmCard from "./PropFirmCard";
import { PropFirm } from "@/types/supabase";
import { RefreshCw, AlertCircle } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { SectionWrapper } from "@/components/ui/section-wrapper";

interface PropFirmSectionProps {
  propFirms: PropFirm[];
  sortBy: 'price' | 'review' | 'trust';
  setSortBy: (sort: 'price' | 'review' | 'trust') => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  searchResults?: PropFirm[];
}

const PropFirmSection = ({
  propFirms,
  sortBy,
  setSortBy,
  loading,
  error,
  onRetry,
  searchResults
}: PropFirmSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beginners' | 'intermediates' | 'pro-traders'>('all');
  const [displayFirms, setDisplayFirms] = useState<PropFirm[]>([]);

  const baseFirms = searchResults || propFirms;

  useEffect(() => {
    let filteredFirms = [...baseFirms];

    if (selectedCategory !== 'all') {
      filteredFirms = filteredFirms.filter(firm => firm.category_id === selectedCategory);
    }

    filteredFirms.sort((a, b) => {
      switch (sortBy) {
        case 'price': return a.price - b.price;
        case 'review': return (b.review_score || 0) - (a.review_score || 0);
        case 'trust': return (b.trust_rating || 0) - (a.trust_rating || 0);
        default: return 0;
      }
    });

    setDisplayFirms(filteredFirms);
  }, [baseFirms, selectedCategory, sortBy]);

  if (loading) {
    return (
      <SectionWrapper id="firms">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">Choose Your Trading Level</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Find the perfect prop firm for your experience level</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (error) {
    return (
      <SectionWrapper id="firms">
        <div className="max-w-7xl mx-auto text-center">
          <div className="glass-card-premium rounded-2xl p-12 max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <div className="text-foreground text-lg font-semibold mb-2">Failed to load prop firms</div>
            <p className="text-muted-foreground text-sm mb-6">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="firms">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-heading">
            Choose Your Trading Level
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect prop firm based on your experience level and trading goals
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { key: 'all', label: 'All Levels' },
            { key: 'beginners', label: 'Beginner' },
            { key: 'intermediates', label: 'Intermediate' },
            { key: 'pro-traders', label: 'Pro' }
          ].map((category) => (
            <Button
              key={category.key}
              size="sm"
              variant={selectedCategory === category.key ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`text-xs rounded-full px-5 ${
                selectedCategory === category.key
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">Sort by:</span>
            <Select value={sortBy} onValueChange={(value: 'price' | 'review' | 'trust') => setSortBy(value)}>
              <SelectTrigger className="w-44 bg-card border-border text-foreground text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="price">Price (Low to High)</SelectItem>
                <SelectItem value="review">Review Score</SelectItem>
                <SelectItem value="trust">Trust Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground text-sm">
            Showing {displayFirms.length} of {baseFirms.length} prop firms
            {searchResults && ` (filtered by search)`}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {displayFirms.map((firm, index) => (
            <PropFirmCard key={firm.id} firm={firm} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {displayFirms.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {baseFirms.length === 0 && !searchResults
                ? "No prop firms available for this market."
                : "No prop firms found for the selected category."
              }
            </p>
            {baseFirms.length === 0 && onRetry && (
              <Button onClick={onRetry} variant="outline" className="mt-4 border-border text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default PropFirmSection;
