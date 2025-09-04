import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { PropFirm } from "../types/supabase";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import CountUp from "react-countup";
import { useEffect, useState, useRef } from "react";
import { TrendingUp, Shield, DollarSign, Star } from "lucide-react";

interface HeroProps {
  propFirms?: PropFirm[];
  onSearchResults?: (results: PropFirm[]) => void;
}

const Hero = ({ propFirms, onSearchResults }: HeroProps) => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({ 
          x: ((e.clientX - rect.left) / rect.width) * 100, 
          y: ((e.clientY - rect.top) / rect.height) * 100 
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
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
      transition: { 
        duration: 0.6
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5
      }
    }
  };

  return (
    <motion.section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Mouse-follow glow and animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mouse-follow glow */}
        <div 
          className="absolute w-[800px] h-[800px] bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent blur-3xl rounded-full transition-all duration-700 ease-out"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
        
        {/* Static background glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse mix-blend-screen"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse mix-blend-screen"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl animate-pulse mix-blend-screen"></div>
        
        {/* Subtle trading pattern SVGs */}
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute top-20 left-20 w-32 h-32" viewBox="0 0 100 100" fill="none">
            <path d="M10 80 L30 60 L50 70 L70 40 L90 20" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="30" cy="60" r="3" fill="currentColor"/>
            <circle cx="50" cy="70" r="3" fill="currentColor"/>
            <circle cx="70" cy="40" r="3" fill="currentColor"/>
          </svg>
          <svg className="absolute bottom-20 right-20 w-32 h-32" viewBox="0 0 100 100" fill="none">
            <rect x="10" y="40" width="4" height="30" fill="currentColor"/>
            <rect x="20" y="30" width="4" height="40" fill="currentColor"/>
            <rect x="30" y="50" width="4" height="20" fill="currentColor"/>
            <rect x="40" y="20" width="4" height="50" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Main heading with premium gradient text */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 max-w-5xl mx-auto leading-tight tracking-tight"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Find the Perfect
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Prop Trading Firm
          </span>
        </motion.h1>
        
        {/* Subheading text with premium typography */}
        <motion.div 
          className="mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
            Compare top proprietary trading firms, read verified reviews,
            and discover the best funding opportunities for your trading
            journey.
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

        {/* Premium action buttons with compact layout */}
        <motion.div 
          className="flex flex-wrap gap-4 justify-center mb-20"
          variants={containerVariants}
        >
          <motion.div variants={buttonVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                onClick={navigateToAllFirms}
                size="lg"
                className="group relative text-white font-medium px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 border-0 text-sm"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Explore All Firms
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div variants={buttonVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                onClick={navigateToCompare}
                size="lg"
                className="group relative text-slate-300 font-medium px-6 py-3 rounded-xl bg-slate-700/80 hover:bg-slate-600/80 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/70 shadow-lg backdrop-blur-sm text-sm"
              >
                <Shield className="mr-2 h-4 w-4" />
                Compare Firms
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div variants={buttonVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                onClick={navigateToCheapFirms}
                size="lg"
                className="group relative text-slate-300 font-medium px-6 py-3 rounded-xl bg-slate-700/80 hover:bg-slate-600/80 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/70 shadow-lg backdrop-blur-sm text-sm"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Budget Options
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div variants={buttonVariants}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button 
                onClick={navigateToTopFirms}
                size="lg"
                className="group relative text-slate-300 font-medium px-6 py-3 rounded-xl bg-slate-700/80 hover:bg-slate-600/80 transition-all duration-300 border border-slate-600/50 hover:border-slate-500/70 shadow-lg backdrop-blur-sm text-sm"
              >
                <Star className="mr-2 h-4 w-4" />
                Top Rated
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Premium Stats Section with Glassmorphism */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
        >
          <motion.div 
            className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 shadow-2xl hover:shadow-emerald-500/10"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              rotateY: 5,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-5xl font-bold text-emerald-400 mb-3">
                <CountUp end={15000} duration={2.5} separator="," suffix="+" />
              </div>
              <div className="text-white text-xl font-semibold mb-2">Active Traders</div>
              <div className="text-slate-400 text-sm leading-relaxed">Successfully funded worldwide</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-amber-400/30 transition-all duration-500 shadow-2xl hover:shadow-amber-500/10"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              rotateY: 5,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-5xl font-bold text-amber-400 mb-3">
                $<CountUp end={2.5} duration={2.5} decimals={1} suffix="B" />
              </div>
              <div className="text-white text-xl font-semibold mb-2">Capital Deployed</div>
              <div className="text-slate-400 text-sm leading-relaxed">Total funding allocated</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-400/30 transition-all duration-500 shadow-2xl hover:shadow-purple-500/10"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              rotateY: 5,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-5xl font-bold text-purple-400 mb-3">
                <CountUp end={87} duration={2.5} suffix="%" />
              </div>
              <div className="text-white text-xl font-semibold mb-2">Success Rate</div>
              <div className="text-slate-400 text-sm leading-relaxed">Traders achieving profitability</div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;