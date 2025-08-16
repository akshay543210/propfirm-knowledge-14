
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
      <Card className="bg-card border-border shadow-soft">
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Search</h3>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search prop firms..."
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-md text-foreground placeholder-muted-foreground"
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card className="bg-card border-border shadow-soft">
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Sort By</h3>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={(value: 'price' | 'review' | 'trust' | 'payout') => setSortBy(value)}>
            <SelectTrigger className="bg-muted border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="price" className="text-foreground hover:bg-muted">Price (Low to High)</SelectItem>
              <SelectItem value="review" className="text-foreground hover:bg-muted">Review Score</SelectItem>
              <SelectItem value="trust" className="text-foreground hover:bg-muted">Trust Rating</SelectItem>
              <SelectItem value="payout" className="text-foreground hover:bg-muted">Payout Rate</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card className="bg-card border-border shadow-soft">
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Category</h3>
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
                    ? 'bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {category === 'all' ? 'All Levels' : `${category} Traders`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="bg-card border-border shadow-soft">
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Price Range</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground"
                value={filters.priceRange[0]}
                onChange={(e) => updateFilters({ 
                  priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]] 
                })}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground"
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
      <Card className="bg-card border-border shadow-soft">
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Minimum Rating</h3>
        </CardHeader>
        <CardContent>
          <Select 
            value={filters.minRating.toString()} 
            onValueChange={(value) => updateFilters({ minRating: parseFloat(value) })}
          >
            <SelectTrigger className="bg-muted border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="0" className="text-foreground hover:bg-muted">Any Rating</SelectItem>
              <SelectItem value="3" className="text-foreground hover:bg-muted">3+ Stars</SelectItem>
              <SelectItem value="4" className="text-foreground hover:bg-muted">4+ Stars</SelectItem>
              <SelectItem value="4.5" className="text-foreground hover:bg-muted">4.5+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar;
