import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

// Extensible market types - add more as needed
export type MarketType = 'forex' | 'futures' | 'crypto' | 'stocks' | 'options';

export const MARKET_OPTIONS: { value: MarketType; label: string; icon: string }[] = [
  { value: 'forex', label: 'Forex', icon: '💱' },
  { value: 'futures', label: 'Futures', icon: '📈' },
  // Future markets can be added here:
  // { value: 'crypto', label: 'Crypto', icon: '₿' },
  // { value: 'stocks', label: 'Stocks', icon: '📊' },
  // { value: 'options', label: 'Options', icon: '⚖️' },
];

interface MarketContextType {
  market: MarketType;
  setMarket: (market: MarketType) => void;
  isReady: boolean; // Indicates market state is hydrated and ready
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const STORAGE_KEY = 'propfirm-market-selection';

// Synchronously read from localStorage to avoid hydration issues
const getInitialMarket = (): MarketType => {
  if (typeof window === 'undefined') return 'forex';
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && MARKET_OPTIONS.some(opt => opt.value === stored)) {
      return stored as MarketType;
    }
  } catch (e) {
    console.warn('Failed to read market from localStorage:', e);
  }
  return 'forex';
};

export const MarketProvider = ({ children }: { children: ReactNode }) => {
  // Initialize synchronously from localStorage - set isReady immediately
  const [market, setMarketState] = useState<MarketType>(getInitialMarket);
  const [isReady] = useState(true); // Set immediately - no useEffect delay

  const setMarket = (newMarket: MarketType) => {
    setMarketState(newMarket);
    try {
      localStorage.setItem(STORAGE_KEY, newMarket);
    } catch (e) {
      console.warn('Failed to save market to localStorage:', e);
    }
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    market,
    setMarket,
    isReady,
  }), [market, isReady]);

  return (
    <MarketContext.Provider value={contextValue}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
