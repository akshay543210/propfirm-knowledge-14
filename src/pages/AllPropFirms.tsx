
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FilmProfileCard from "../components/FilmProfileCard";

// Dummy film profile data
const dummyFilmProfiles = [
  {
    id: "1",
    name: "Trading Fundamentals Masterclass",
    rating: 5,
    category: "Beginner" as const,
    description: "Perfect introduction to prop trading concepts and strategies."
  },
  {
    id: "2",
    name: "Advanced Risk Management",
    rating: 4,
    category: "Intermediate" as const,
    description: "Deep dive into professional risk management techniques."
  },
  {
    id: "3",
    name: "High-Frequency Trading Secrets",
    rating: 5,
    category: "Pro" as const,
    description: "Master the art of algorithmic and high-frequency trading."
  },
  {
    id: "4",
    name: "Market Psychology Essentials",
    rating: 4,
    category: "Beginner" as const,
    description: "Understanding market sentiment and trader psychology."
  },
  {
    id: "5",
    name: "Options Trading Strategies",
    rating: 5,
    category: "Intermediate" as const,
    description: "Comprehensive guide to advanced options strategies."
  },
  {
    id: "6",
    name: "Institutional Trading Tactics",
    rating: 5,
    category: "Pro" as const,
    description: "Learn how institutional traders approach the markets."
  },
  {
    id: "7",
    name: "Technical Analysis Basics",
    rating: 4,
    category: "Beginner" as const,
    description: "Master chart patterns and technical indicators."
  },
  {
    id: "8",
    name: "Swing Trading Mastery",
    rating: 4,
    category: "Intermediate" as const,
    description: "Perfect your swing trading timing and execution."
  },
  {
    id: "9",
    name: "Quantitative Trading Models",
    rating: 5,
    category: "Pro" as const,
    description: "Build and deploy sophisticated trading algorithms."
  }
];

const AllPropFirms = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Beginner' | 'Intermediate' | 'Pro'>('all');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const filteredProfiles = selectedCategory === 'all' 
    ? dummyFilmProfiles 
    : dummyFilmProfiles.filter(profile => profile.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Trading Film Profiles</h1>
          <p className="text-xl text-gray-300">Discover educational content tailored to your trading level</p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { key: 'all', label: 'All Levels' },
            { key: 'Beginner', label: 'Beginner' },
            { key: 'Intermediate', label: 'Intermediate' },
            { key: 'Pro', label: 'Pro' }
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

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-400">
            Showing {filteredProfiles.length} film profiles
            {selectedCategory !== 'all' && ` for ${selectedCategory} level`}
          </p>
        </div>
        
        {/* Film Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile, index) => (
            <FilmProfileCard key={profile.id} profile={profile} index={index} />
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No film profiles found for the selected category.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AllPropFirms;
