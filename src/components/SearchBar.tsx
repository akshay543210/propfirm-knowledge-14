import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PropFirm } from "@/types/supabase";
import { motion } from "framer-motion";

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
    <motion.div 
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 transition-colors group-focus-within:text-purple-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-12 py-4 text-lg bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-slate-400 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/10 focus:bg-white/15"
        />
        {searchTerm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>
      
      {showResults && searchTerm && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute top-full left-0 right-0 mt-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto"
        >
          {propFirms.filter(firm => 
            firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (firm.brand && firm.brand.toLowerCase().includes(searchTerm.toLowerCase()))
          ).slice(0, 5).map((firm, index) => (
            <motion.div
              key={firm.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="px-6 py-4 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-all duration-200 hover:backdrop-blur-xl"
            >
              <div className="font-semibold text-white">{firm.name}</div>
              {firm.brand && (
                <div className="text-sm text-slate-400 mt-1">{firm.brand}</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchBar;