
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import { PropFirm } from "@/types/supabase";

interface HeroProps {
  propFirms?: PropFirm[];
  onSearchResults?: (results: PropFirm[]) => void;
}

const Hero = ({ propFirms = [], onSearchResults }: HeroProps) => {
  const navigateToAllFirms = () => {
    window.location.href = '/propfirms';
  };

  const navigateToCompare = () => {
    window.location.href = '/compare';
  };

  const navigateToCheapFirms = () => {
    window.location.href = '/cheap-firms';
  };

  const navigateToTopFirms = () => {
    window.location.href = '/top-firms';
  };

  const handleSearchResults = (results: PropFirm[]) => {
    if (onSearchResults) {
      onSearchResults(results);
    }
  };

  return (
    <section id="home" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find the
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Perfect Prop Trading Firm
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Compare top proprietary trading firms, read verified reviews, and discover the 
            best funding opportunities. Make informed decisions with our comprehensive 
            prop firm directory.
          </p>

          {/* Functional Search Bar */}
          <div className="mb-8">
            <SearchBar 
              propFirms={propFirms}
              onFilteredResults={handleSearchResults}
              placeholder="Search prop firms by name, brand, or features..."
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center max-w-4xl mx-auto">
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg transition-all hover:scale-105"
              onClick={navigateToAllFirms}
            >
              Explore All Firms
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-slate-900 px-6 py-3 text-lg transition-all hover:scale-105"
              onClick={navigateToCompare}
            >
              Compare Firms
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900 px-6 py-3 text-lg transition-all hover:scale-105"
              onClick={navigateToCheapFirms}
            >
              💰 Cheap Cost PropFirms
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-slate-900 px-6 py-3 text-lg transition-all hover:scale-105"
              onClick={navigateToTopFirms}
            >
              🔥 Top 5 PropFirms
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-blue-400 mb-2">50K+</div>
            <div className="text-gray-300">Active Traders</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-3xl font-bold text-purple-400 mb-2">$2.5B+</div>
            <div className="text-gray-300">Funded Capital</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
            <div className="text-gray-300">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
