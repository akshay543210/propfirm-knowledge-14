import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { PropFirm } from "../types/supabase";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { TrendingUp, Shield, Users, DollarSign } from "lucide-react";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { usePropFirms } from "@/hooks/useSupabaseData";

interface HeroProps {
  propFirms?: PropFirm[];
  onSearchResults?: (results: PropFirm[]) => void;
}

const Hero = ({ propFirms, onSearchResults }: HeroProps) => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const { propFirms: topFirms } = usePropFirms();

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
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center hero-bg px-6 font-poppins overflow-hidden">
      {/* Mouse-follow glow effect */}
      <motion.div 
        className="pointer-events-none absolute w-[500px] h-[500px] bg-primary/20 blur-3xl rounded-full mix-blend-screen"
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-accent/10 blur-3xl rounded-full -top-40 -right-40 mix-blend-screen"></div>
        <div className="absolute w-[400px] h-[400px] bg-warning/10 blur-3xl rounded-full -bottom-40 -left-40 mix-blend-screen"></div>
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight"
          variants={itemVariants}
        >
          Find the Perfect<br />
          Prop Trading Firm
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto font-light leading-relaxed"
          variants={itemVariants}
        >
          Compare top proprietary trading firms, read verified reviews, 
          and discover the best funding opportunities for your trading journey.
        </motion.p>

        <motion.div
          className="mb-12 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          <SearchBar 
            propFirms={propFirms || []}
            onFilteredResults={handleSearchResults}
          />
        </motion.div>

        <motion.div 
          className="flex flex-wrap gap-4 justify-center mb-16"
          variants={containerVariants}
        >
          <motion.div variants={buttonVariants}>
            <Button 
              onClick={navigateToAllFirms}
              variant="gradient"
              size="lg"
              className="text-lg px-8 py-4 rounded-2xl font-medium"
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              Explore All Firms
            </Button>
          </motion.div>
          
          <motion.div variants={buttonVariants}>
            <Button 
              onClick={navigateToCompare}
              variant="glassmorphism"
              size="lg"
              className="text-lg px-8 py-4 rounded-2xl font-medium"
            >
              <Shield className="mr-2 h-5 w-5" />
              Compare Firms
            </Button>
          </motion.div>
          
          <motion.div variants={buttonVariants}>
            <Button 
              onClick={navigateToCheapFirms}
              variant="glassmorphism"
              size="lg"
              className="text-lg px-8 py-4 rounded-2xl font-medium"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Budget Options
            </Button>
          </motion.div>
          
          <motion.div variants={buttonVariants}>
            <Button 
              onClick={navigateToTopFirms}
              variant="glassmorphism"
              size="lg"
              className="text-lg px-8 py-4 rounded-2xl font-medium"
            >
              <Users className="mr-2 h-5 w-5" />
              Top Rated
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          <motion.div 
            className="glass-card p-6 rounded-2xl hover-glow"
            variants={itemVariants}
          >
            <div className="text-4xl font-bold text-success mb-2">
              <CountUp end={15000} duration={2.5} separator="," suffix="+" />
            </div>
            <div className="text-slate-300 text-lg">Active Traders</div>
            <div className="text-sm text-muted-foreground mt-1">Successfully funded worldwide</div>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-2xl hover-glow"
            variants={itemVariants}
          >
            <div className="text-4xl font-bold text-warning mb-2">
              $<CountUp end={2.5} duration={2.5} decimals={1} suffix="B" />
            </div>
            <div className="text-slate-300 text-lg">Capital Deployed</div>
            <div className="text-sm text-muted-foreground mt-1">Total funding allocated</div>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-2xl hover-glow"
            variants={itemVariants}
          >
            <div className="text-4xl font-bold text-primary mb-2">
              <CountUp end={87} duration={2.5} suffix="%" />
            </div>
            <div className="text-slate-300 text-lg">Success Rate</div>
            <div className="text-sm text-muted-foreground mt-1">Traders achieving profitability</div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;