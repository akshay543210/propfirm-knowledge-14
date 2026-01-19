import { motion } from 'framer-motion';
import { useMarket, MARKET_OPTIONS, MarketType } from '@/contexts/MarketContext';
import { toast } from 'sonner';

interface MarketToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MarketToggle = ({ className = '', size = 'md' }: MarketToggleProps) => {
  const { market, setMarket } = useMarket();

  const handleMarketChange = (newMarket: MarketType) => {
    if (newMarket !== market) {
      setMarket(newMarket);
      const marketLabel = MARKET_OPTIONS.find(opt => opt.value === newMarket)?.label;
      toast.success(`Switched to ${marketLabel} Firms`, {
        duration: 2000,
        icon: MARKET_OPTIONS.find(opt => opt.value === newMarket)?.icon,
      });
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const containerClasses = {
    sm: 'p-1 gap-1',
    md: 'p-1.5 gap-1',
    lg: 'p-2 gap-2',
  };

  // Filter to only show active markets (forex and futures for now)
  const activeMarkets = MARKET_OPTIONS.filter(opt => 
    opt.value === 'forex' || opt.value === 'futures'
  );

  return (
    <div className={`inline-flex ${className}`}>
      <div 
        className={`relative flex ${containerClasses[size]} rounded-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 shadow-lg`}
      >
        {activeMarkets.map((option) => {
          const isActive = market === option.value;
          
          return (
            <motion.button
              key={option.value}
              onClick={() => handleMarketChange(option.value)}
              className={`relative ${sizeClasses[size]} font-semibold rounded-full transition-colors duration-200 z-10 flex items-center gap-2`}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: isActive ? 1 : 1.02 }}
            >
              {isActive && (
                <motion.div
                  layoutId="market-toggle-bg"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 shadow-lg shadow-cyan-500/30"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}>
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MarketToggle;
