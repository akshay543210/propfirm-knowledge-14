import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropFirmCard from "../components/PropFirmCard";
import { usePropFirms } from "../hooks/useSupabaseData";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">All Prop Firms</h1>
          <p className="text-xl text-gray-300">Discover the best prop trading firms</p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            Showing {filteredFirms.length} prop firms
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name || selectedCategory} category`}
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
      
      <Footer />
    </div>
  );
};

export default AllPropFirms;