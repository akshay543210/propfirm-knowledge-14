import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import MarketToggle from "./MarketToggle";
import { PropFirm } from "../types/supabase";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { TrendingUp, Shield, DollarSign, Star, ChevronDown } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";
import { AnimatedCounter } from "./ui/animated-counter";

interface HeroProps {
  propFirms?: PropFirm[];
  onSearchResults?: (results: PropFirm[]) => void;
}

const Hero = ({ propFirms, onSearchResults }: HeroProps) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => { setIsVisible(true); }, []);

  const handleSearchResults = (results: PropFirm[]) => {
    onSearchResults?.(results);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
  };

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-44 sm:pt-36 pb-20 overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(225_38%_9%)] to-background" />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-[500px] h-[500px] rounded-full bg-[hsl(292_91%_73%/0.08)] blur-[100px] animate-float-orb" />
        <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full bg-[hsl(217_92%_69%/0.08)] blur-[100px] animate-float-orb" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(255_92%_76%/0.05)] blur-[120px] animate-glow-pulse" />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[1.05] tracking-tight font-heading"
          variants={itemVariants}
        >
          <span className="gradient-text-animated">
            Find the Perfect
          </span>
          <br />
          <span className="gradient-text-animated" style={{ animationDelay: "1s" }}>
            Prop Trading Firm
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 font-body"
          variants={itemVariants}
        >
          Compare top proprietary trading firms, read verified reviews,
          and discover the best funding opportunities for your trading journey.
        </motion.p>

        {/* Market Toggle */}
        <motion.div className="mb-10 flex justify-center" variants={itemVariants}>
          <MarketToggle size="lg" />
        </motion.div>

        {/* Search */}
        <motion.div className="mb-12 max-w-2xl mx-auto" variants={itemVariants}>
          <SearchBar
            propFirms={propFirms || []}
            onFilteredResults={handleSearchResults}
          />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div className="flex flex-wrap gap-3 justify-center mb-16" variants={itemVariants}>
          <MagneticButton
            onClick={() => navigate("/propfirms", { state: { propFirms } })}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl text-sm px-6"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Explore All Firms
          </MagneticButton>
          <MagneticButton
            onClick={() => navigate("/compare")}
            size="lg"
            variant="outline"
            className="border-border hover:bg-muted/50 text-foreground rounded-xl text-sm px-6"
          >
            <Shield className="mr-2 h-4 w-4" />
            Compare Firms
          </MagneticButton>
          <MagneticButton
            onClick={() => navigate("/cheap-firms")}
            size="lg"
            variant="outline"
            className="border-border hover:bg-muted/50 text-foreground rounded-xl text-sm px-6"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Budget Options
          </MagneticButton>
          <MagneticButton
            onClick={() => navigate("/top-firms")}
            size="lg"
            variant="outline"
            className="border-border hover:bg-muted/50 text-foreground rounded-xl text-sm px-6"
          >
            <Star className="mr-2 h-4 w-4" />
            Top Rated
          </MagneticButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          {[
            { end: 15000, suffix: "+", label: "Active Traders", sub: "Successfully funded worldwide", color: "text-success" },
            { end: 2.5, suffix: "B", prefix: "$", decimals: 1, label: "Capital Deployed", sub: "Total funding allocated", color: "text-warning" },
            { end: 87, suffix: "%", label: "Success Rate", sub: "Traders achieving profitability", color: "text-primary" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="glass-card-premium rounded-2xl p-6 text-center group"
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 30 } }}
            >
              <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2 font-heading`}>
                <AnimatedCounter
                  end={stat.end}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </div>
              <div className="text-foreground text-lg font-semibold mb-1">{stat.label}</div>
              <div className="text-muted-foreground text-sm">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <ChevronDown className="h-6 w-6" style={{ animation: "scroll-hint 2s ease-in-out infinite" }} />
      </motion.div>
    </motion.section>
  );
};

export default Hero;
