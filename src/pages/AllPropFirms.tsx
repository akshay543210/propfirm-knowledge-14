import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropFirmCard from "../components/PropFirmCard";
import { usePropFirms } from "../hooks/useSupabaseData";

const AllPropFirms = () => {
  const [sortBy, setSortBy] = useState<'price' | 'review' | 'trust'>('review');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beginner' | 'intermediate' | 'pro'>('all');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { propFirms, loading } = usePropFirms();

  // Filter by category
  const filteredFirms = selectedCategory === 'all'
    ? propFirms
    : propFirms.filter(firm => {
        if (selectedCategory === 'beginner') return firm.price < 200;
        if (selectedCategory === 'intermediate') return firm.price >= 200 && firm.price <= 500;
        if (selectedCategory === 'pro') return firm.price > 500;
        return true;
      });

  // Sort
  const sortedFirms = [...filteredFirms].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'review':
        return b.review_score - a.review_score;
      case 'trust':
        return b.trust_rating - a.trust_rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">All Prop Firms</h1>
          <p className="text-xl text-gray-300">Browse and compare the best prop trading firms</p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { key: 'all', label: 'All' },
            { key: 'beginner', label: 'Beginner' },
            { key: 'intermediate', label: 'Intermediate' },
            { key: 'pro', label: 'Pro' }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedCategory === category.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-48 bg-slate-800 border-blue-500/20 text-white rounded px-2 py-1"
            >
              <option value="price">Price (Low to High)</option>
              <option value="review">Review Score</option>
              <option value="trust">Trust Rating</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            Showing {sortedFirms.length} of {propFirms.length} prop firms
            {selectedCategory !== 'all' && ` (filtered by category)`}
          </p>
        </div>

        {/* Prop Firm Cards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-lg">Loading prop firms...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedFirms.map((firm, index) => (
              <PropFirmCard key={firm.id} firm={firm} index={index} />
            ))}
          </div>
        )}

        {!loading && sortedFirms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No prop firms found for the selected category.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AllPropFirms;
