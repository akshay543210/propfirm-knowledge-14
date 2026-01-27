import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropFirmCard from "./PropFirmCard";
import { PropFirm } from "@/types/supabase";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";

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

  // Use search results if available, otherwise use all prop firms
  const baseFirms = searchResults || propFirms;

  useEffect(() => {
    let filteredFirms = [...baseFirms];

    // Apply category filtering based on category_id
    if (selectedCategory !== 'all') {
      switch (selectedCategory) {
        case 'beginners':
          filteredFirms = filteredFirms.filter(firm => firm.category_id === 'beginners');
          break;
        case 'intermediates':
          filteredFirms = filteredFirms.filter(firm => firm.category_id === 'intermediates');
          break;
        case 'pro-traders':
          filteredFirms = filteredFirms.filter(firm => firm.category_id === 'pro-traders');
          break;
      }
    }

    // Apply sorting
    filteredFirms.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'review':
          return (b.review_score || 0) - (a.review_score || 0);
        case 'trust':
          return (b.trust_rating || 0) - (a.trust_rating || 0);
        default:
          return 0;
      }
    });

    setDisplayFirms(filteredFirms);
  }, [baseFirms, selectedCategory, sortBy]);

  // Loading state with timeout indicator
  if (loading) {
    return (
      <section id="firms" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <div className="text-white text-lg">Loading prop firms...</div>
            <p className="text-gray-400 text-sm">This should only take a moment</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <section id="firms" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <div className="text-white text-lg">Failed to load prop firms</div>
            <p className="text-gray-400 text-sm">{error}</p>
            {onRetry && (
              <Button 
                onClick={onRetry}
                variant="outline"
                className="mt-4 border-blue-500 text-blue-400 hover:bg-blue-600/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="firms" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your Trading Level
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find the perfect prop firm based on your experience level and trading goals
          </p>
        </div>

        {/* Category Filters - Now Functional */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { key: 'all', label: 'All Levels' },
            { key: 'beginners', label: 'Beginner Traders' },
            { key: 'intermediates', label: 'Intermediate Traders' },
            { key: 'pro-traders', label: 'Pro Traders' }
          ].map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`px-6 py-2 capitalize transition-all ${
                selectedCategory === category.key
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Category Info */}
        {selectedCategory !== 'all' && (
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">
              {selectedCategory === 'beginners' && 'Showing firms for beginner traders'}
              {selectedCategory === 'intermediates' && 'Showing firms for intermediate traders'}
              {selectedCategory === 'pro-traders' && 'Showing firms for professional traders'}
            </p>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Sort by:</span>
            <Select value={sortBy} onValueChange={(value: 'price' | 'review' | 'trust') => setSortBy(value)}>
              <SelectTrigger className="w-48 bg-slate-800 border-blue-500/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-blue-500/20">
                <SelectItem value="price" className="text-white hover:bg-slate-700">Price (Low to High)</SelectItem>
                <SelectItem value="review" className="text-white hover:bg-slate-700">Review Score</SelectItem>
                <SelectItem value="trust" className="text-white hover:bg-slate-700">Trust Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            Showing {displayFirms.length} of {baseFirms.length} prop firms
            {searchResults && ` (filtered by search)`}
          </p>
        </div>

        {/* Prop Firm Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {displayFirms.map((firm, index) => (
            <PropFirmCard 
              key={firm.id} 
              firm={firm} 
              index={index}
            />
          ))}
        </div>

        {/* Empty State */}
        {displayFirms.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {baseFirms.length === 0 && !searchResults 
                ? "No prop firms available for this market." 
                : "No prop firms found for the selected category."
              }
            </p>
            {baseFirms.length === 0 && onRetry && (
              <Button 
                onClick={onRetry}
                variant="outline"
                className="mt-4 border-blue-500 text-blue-400 hover:bg-blue-600/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropFirmSection;
