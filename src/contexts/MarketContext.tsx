import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  isLoading: boolean;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const STORAGE_KEY = 'propfirm-market-selection';

export const MarketProvider = ({ children }: { children: ReactNode }) => {
  const [market, setMarketState] = useState<MarketType>('forex');
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && MARKET_OPTIONS.some(opt => opt.value === stored)) {
      setMarketState(stored as MarketType);
    }
    setIsLoading(false);
  }, []);

  const setMarket = (newMarket: MarketType) => {
    setMarketState(newMarket);
    localStorage.setItem(STORAGE_KEY, newMarket);
  };

  return (
    <MarketContext.Provider value={{ market, setMarket, isLoading }}>
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
