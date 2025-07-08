<<<<<<< HEAD
=======

>>>>>>> 0b83ad0 (Your commit message)
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropFirmCard from "../components/PropFirmCard";
import { usePropFirms } from "../hooks/useSupabaseData";
<<<<<<< HEAD

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
=======
import { useCategories } from "../hooks/useCategories";
import { Loader2 } from "lucide-react";

const AllPropFirms = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { propFirms, loading } = usePropFirms();
  const { categories } = useCategories();

  const filteredFirms = selectedCategory === 'all' 
    ? propFirms 
    : propFirms.filter(firm => firm.category_id === selectedCategory);
>>>>>>> 0b83ad0 (Your commit message)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
<<<<<<< HEAD
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">All Prop Firms</h1>
          <p className="text-xl text-gray-300">Browse and compare the best prop trading firms</p>
=======
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">All Prop Firms</h1>
          <p className="text-xl text-gray-300">Discover the best prop trading firms</p>
>>>>>>> 0b83ad0 (Your commit message)
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
<<<<<<< HEAD
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
=======
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-lg transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20'
            }`}
          >
            All Firms
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-lg transition-all ${
                selectedCategory === category.id
>>>>>>> 0b83ad0 (Your commit message)
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20'
              }`}
            >
<<<<<<< HEAD
              {category.label}
=======
              {category.name}
>>>>>>> 0b83ad0 (Your commit message)
            </button>
          ))}
        </div>

<<<<<<< HEAD
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
=======
        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            Showing {filteredFirms.length} prop firms
            {selectedCategory !== 'all' && ` in selected category`}
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Loading prop firms...</p>
          </div>
        ) : (
          <>
            {/* Prop Firms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFirms.map((firm, index) => (
                <PropFirmCard key={firm.id} firm={firm} index={index} />
              ))}
            </div>

            {filteredFirms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No prop firms found for the selected category.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
>>>>>>> 0b83ad0 (Your commit message)
      <Footer />
    </div>
  );
};

export default AllPropFirms;
