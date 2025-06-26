
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PropFirm } from "@/types/supabase";

interface SearchBarProps {
  propFirms: PropFirm[];
  onFilteredResults: (results: PropFirm[]) => void;
  placeholder?: string;
}

const SearchBar = ({ propFirms, onFilteredResults, placeholder = "Search prop firms..." }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() === "") {
        onFilteredResults(propFirms);
        setShowResults(false);
        return;
      }

      const filtered = propFirms.filter(firm => 
        firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (firm.brand && firm.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        firm.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      onFilteredResults(filtered);
      setShowResults(true);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, propFirms, onFilteredResults]);

  const clearSearch = () => {
    setSearchTerm("");
    onFilteredResults(propFirms);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 py-3 text-lg bg-white/10 backdrop-blur-sm border-blue-500/20 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {showResults && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-sm border border-blue-500/20 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          {propFirms.filter(firm => 
            firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (firm.brand && firm.brand.toLowerCase().includes(searchTerm.toLowerCase()))
          ).slice(0, 5).map((firm) => (
            <div
              key={firm.id}
              className="px-4 py-3 hover:bg-blue-600/20 cursor-pointer border-b border-blue-500/10 last:border-b-0"
            >
              <div className="font-medium text-white">{firm.name}</div>
              {firm.brand && (
                <div className="text-sm text-gray-400">{firm.brand}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
