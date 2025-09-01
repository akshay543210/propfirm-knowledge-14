import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { PropFirm } from "../types/supabase";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { TrendingUp, Shield, Users, DollarSign } from "lucide-react";
import CountUp from "react-countup";
import { useEffect, useState } from "react";

interface HeroProps {
  propFirms?: PropFirm[];
  onSearchResults?: (results: PropFirm[]) => void;
}

const Hero = ({ propFirms, onSearchResults }: HeroProps) => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const navigateToAllFirms = () => {
    navigate('/propfirms', { 
      state: { propFirms } 
    });
  };

  const navigateToCompare = () => {
    navigate('/compare');
  };

  const navigateToCheapFirms = () => {
    navigate('/cheap-firms');
  };

  const navigateToTopFirms = () => {
    navigate('/top-firms');
  };

  const handleSearchResults = (results: PropFirm[]) => {
    if (onSearchResults) {
      onSearchResults(results);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Main heading with gradient text */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 max-w-4xl mx-auto leading-tight"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Find the Perfect Prop Trading Firm
          </span>
        </motion.h1>
        
        {/* Subheading text */}
        <motion.div 
          className="mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <p className="text-xl md:text-2xl text-gray-200 mb-4 font-medium">
            Trade only with paying firms and get your payout.
          </p>
          <p className="text-xl md:text-2xl text-gray-200 mb-4 font-medium">
            If not, our <span className="text-yellow-400 font-bold">PayoutCases</span> will help in it.
          </p>
          <p className="text-xl md:text-2xl text-gray-200 font-medium">
            Trade with only the Best propfirms.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          className="mb-16 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <SearchBar 
            propFirms={propFirms || []}
            onFilteredResults={handleSearchResults}
          />
        </motion.div>

        {/* Action buttons */}
        <motion.div 
          className="flex flex-wrap gap-4 justify-center mb-20"
          variants={containerVariants}
        >
          <motion.div variants={buttonVariants}>
            <Button 
              onClick={navigateToAllFirms}
              size="lg"
              className="text-lg px-8 py-6 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Explore All Firms
            </Button>
          </motion.div>
          
          <motion.div variants={buttonVariants}>
            <Button 
              onClick={navigateToCompare}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-xl font-semibold border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20 transition-all duration-300"
            >
              <Shield className="mr-2 h-5 w-5" />
              Compare Firms
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
            variants={itemVariants}
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
              <CountUp end={15000} duration={2.5} separator="," suffix="+" />
            </div>
            <div className="text-slate-300 text-lg">Active Traders</div>
            <div className="text-sm text-slate-400 mt-1">Successfully funded worldwide</div>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
            variants={itemVariants}
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
              $<CountUp end={2.5} duration={2.5} decimals={1} suffix="B" />
            </div>
            <div className="text-slate-300 text-lg">Capital Deployed</div>
            <div className="text-sm text-slate-400 mt-1">Total funding allocated</div>
          </motion.div>
          
          <motion.div 
            className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
            variants={itemVariants}
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              <CountUp end={87} duration={2.5} suffix="%" />
            </div>
            <div className="text-slate-300 text-lg">Success Rate</div>
            <div className="text-sm text-slate-400 mt-1">Traders achieving profitability</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;