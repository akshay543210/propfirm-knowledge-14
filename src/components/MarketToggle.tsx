import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMarket, MARKET_OPTIONS, MarketType } from '@/contexts/MarketContext';
import { toast } from 'sonner';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface MarketToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MarketToggle = ({ className = '', size = 'md' }: MarketToggleProps) => {
  const { market, setMarket } = useMarket();
  const [isHovered, setIsHovered] = useState<MarketType | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring-smoothed values for tilt
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), springConfig);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / rect.width);
    mouseY.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(null);
  };

  const handleMarketChange = (newMarket: MarketType) => {
    if (newMarket !== market) {
      setMarket(newMarket);
      const marketLabel = MARKET_OPTIONS.find(opt => opt.value === newMarket)?.label;
      toast.success(`Switched to ${marketLabel} Firms`, {
        duration: 2000,
        icon: newMarket === 'forex' ? '📈' : '📊',
      });
    }
  };

  const sizeClasses = {
    sm: { button: 'px-4 py-2 text-sm gap-1.5', icon: 'w-3.5 h-3.5' },
    md: { button: 'px-6 py-3 text-base gap-2', icon: 'w-4 h-4' },
    lg: { button: 'px-8 py-4 text-lg gap-2.5', icon: 'w-5 h-5' },
  };

  const containerPadding = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  // Filter to only show active markets
  const activeMarkets = MARKET_OPTIONS.filter(opt => 
    opt.value === 'forex' || opt.value === 'futures'
  );

  const getIcon = (marketType: MarketType, isActive: boolean) => {
    const iconClass = `${sizeClasses[size].icon} transition-all duration-300 ${
      isActive ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]' : ''
    }`;
    
    if (marketType === 'forex') {
      return <TrendingUp className={iconClass} />;
    }
    return <BarChart3 className={iconClass} />;
  };

  const getGradient = (marketType: MarketType) => {
    if (marketType === 'forex') {
      return 'from-cyan-400 via-blue-500 to-indigo-500';
    }
    return 'from-orange-400 via-pink-500 to-rose-500';
  };

  const getGlowColor = (marketType: MarketType) => {
    if (marketType === 'forex') {
      return 'shadow-cyan-500/40';
    }
    return 'shadow-orange-500/40';
  };

  return (
    <div className={`inline-flex perspective-1000 ${className}`}>
      <motion.div
        ref={containerRef}
        className={`relative flex ${containerPadding[size]} rounded-full 
          bg-gradient-to-b from-slate-800/80 to-slate-900/90
          backdrop-blur-xl 
          border border-slate-600/30
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.3),0_8px_32px_rgba(0,0,0,0.4)]
          overflow-hidden
        `}
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Ambient glow pulse animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"
          animate={{
            opacity: prefersReducedMotion ? 0.1 : [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Glass reflection highlight */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex gap-1">
          {activeMarkets.map((option) => {
            const isActive = market === option.value;
            const isOptionHovered = isHovered === option.value;
            
            return (
              <motion.button
                key={option.value}
                onClick={() => handleMarketChange(option.value)}
                onMouseEnter={() => setIsHovered(option.value)}
                onMouseLeave={() => setIsHovered(null)}
                className={`relative ${sizeClasses[size].button} font-semibold rounded-full transition-colors duration-200 z-10 flex items-center tracking-wide`}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}
                style={{ transformStyle: 'preserve-3d' }}
                aria-pressed={isActive}
                role="switch"
              >
                {/* Active background indicator */}
                {isActive && (
                  <motion.div
                    layoutId="market-toggle-indicator"
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${getGradient(option.value)}
                      shadow-lg ${getGlowColor(option.value)}
                      before:absolute before:inset-0 before:rounded-full 
                      before:bg-gradient-to-b before:from-white/20 before:via-transparent before:to-black/10
                      after:absolute after:inset-[1px] after:rounded-full 
                      after:bg-gradient-to-b after:from-white/10 after:to-transparent after:opacity-50
                    `}
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 35,
                      mass: 1,
                    }}
                    style={{
                      boxShadow: `
                        0 4px 15px -2px ${option.value === 'forex' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(251, 146, 60, 0.4)'},
                        inset 0 1px 2px rgba(255,255,255,0.3),
                        inset 0 -1px 2px rgba(0,0,0,0.2)
                      `,
                    }}
                  />
                )}

                {/* Inactive recessed background */}
                {!isActive && (
                  <div 
                    className={`absolute inset-0 rounded-full transition-all duration-300
                      bg-slate-800/30
                      shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_-1px_1px_rgba(255,255,255,0.05)]
                      ${isOptionHovered ? 'bg-slate-700/40' : ''}
                    `}
                  />
                )}

                {/* Hover glow effect for active button */}
                {isActive && isOptionHovered && !prefersReducedMotion && (
                  <motion.div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${getGradient(option.value)} opacity-0`}
                    animate={{ opacity: 0.2 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* Ripple effect on click */}
                <motion.div
                  className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                  initial={false}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full"
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      key={market}
                    />
                  )}
                </motion.div>

                {/* Content */}
                <motion.span 
                  className={`relative z-10 flex items-center ${sizeClasses[size].button.split(' ').find(c => c.startsWith('gap')) || 'gap-2'}`}
                  animate={{
                    color: isActive ? '#ffffff' : '#94a3b8',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.span
                    className={isActive ? `bg-gradient-to-r ${getGradient(option.value)} bg-clip-text` : ''}
                    animate={{
                      scale: isOptionHovered && !prefersReducedMotion ? 1.05 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {getIcon(option.value, isActive)}
                  </motion.span>
                  <span className={`${isActive ? 'text-white font-bold' : 'text-slate-400 font-medium'} transition-all duration-200`}>
                    {option.label}
                  </span>
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default MarketToggle;
