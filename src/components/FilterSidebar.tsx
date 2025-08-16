
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  sortBy: 'price' | 'review' | 'trust' | 'payout';
  setSortBy: (sort: 'price' | 'review' | 'trust' | 'payout') => void;
}

const FilterSidebar = ({ onFilterChange, sortBy, setSortBy }: FilterSidebarProps) => {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000],
    minRating: 0,
    minTrust: 0,
    searchTerm: ''
  });

  const updateFilters = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Search</h3>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search prop firms..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400"
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Sort By</h3>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={(value: 'price' | 'review' | 'trust' | 'payout') => setSortBy(value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="price" className="text-white hover:bg-slate-700">Price (Low to High)</SelectItem>
              <SelectItem value="review" className="text-white hover:bg-slate-700">Review Score</SelectItem>
              <SelectItem value="trust" className="text-white hover:bg-slate-700">Trust Rating</SelectItem>
              <SelectItem value="payout" className="text-white hover:bg-slate-700">Payout Rate</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Category</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['all', 'beginner', 'intermediate', 'pro'].map((category) => (
              <Button
                key={category}
                variant={filters.category === category ? "default" : "outline"}
                onClick={() => updateFilters({ category })}
                className={`w-full justify-start capitalize ${
                  filters.category === category
                    ? 'bg-blue-600 text-white'
                    : 'border-slate-600 text-gray-300 hover:bg-slate-700'
                }`}
              >
                {category === 'all' ? 'All Levels' : `${category} Traders`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Price Range</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                value={filters.priceRange[0]}
                onChange={(e) => updateFilters({ 
                  priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]] 
                })}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilters({ 
                  priceRange: [filters.priceRange[0], parseInt(e.target.value) || 1000] 
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Filter */}
      <Card className="bg-slate-800/50 border-blue-500/20">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Minimum Rating</h3>
        </CardHeader>
        <CardContent>
          <Select 
            value={filters.minRating.toString()} 
            onValueChange={(value) => updateFilters({ minRating: parseFloat(value) })}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="0" className="text-white hover:bg-slate-700">Any Rating</SelectItem>
              <SelectItem value="3" className="text-white hover:bg-slate-700">3+ Stars</SelectItem>
              <SelectItem value="4" className="text-white hover:bg-slate-700">4+ Stars</SelectItem>
              <SelectItem value="4.5" className="text-white hover:bg-slate-700">4.5+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar;
