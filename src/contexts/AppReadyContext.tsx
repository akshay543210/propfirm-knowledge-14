import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AppReadyContextType {
  appReady: boolean;
  authReady: boolean;
  marketReady: boolean;
  allReady: boolean;
}

const AppReadyContext = createContext<AppReadyContextType | undefined>(undefined);

export const AppReadyProvider = ({ children }: { children: ReactNode }) => {
  // All states start true for immediate readiness - we don't want to block rendering
  // The key insight: we should NOT wait for auth, just ensure Supabase client exists
  const [appReady] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [marketReady] = useState(true); // Market is sync from localStorage

  // Check auth session once on mount - but don't block on it for too long
  useEffect(() => {
    let isMounted = true;
    let timeoutTriggered = false;

    // Set a short timeout - if auth takes too long, proceed anyway
    const authTimeout = setTimeout(() => {
      if (isMounted && !timeoutTriggered) {
        console.log('AppReadyContext: Auth timeout, proceeding without waiting');
        timeoutTriggered = true;
        setAuthReady(true);
      }
    }, 500); // 500ms max wait for auth

    const checkAuth = async () => {
      try {
        await supabase.auth.getSession();
      } catch (error) {
        console.warn('Auth session check failed:', error);
      } finally {
        if (isMounted && !timeoutTriggered) {
          clearTimeout(authTimeout);
          setAuthReady(true);
        }
      }
    };

    // Start auth check immediately
    checkAuth();

    return () => {
      isMounted = false;
      clearTimeout(authTimeout);
    };
  }, []);

  // All systems ready when all three are true
  const allReady = appReady && authReady && marketReady;

  const contextValue = useMemo(() => ({
    appReady,
    authReady,
    marketReady,
    allReady,
  }), [appReady, authReady, marketReady, allReady]);

  return (
    <AppReadyContext.Provider value={contextValue}>
      {children}
    </AppReadyContext.Provider>
  );
};

export const useAppReady = () => {
  const context = useContext(AppReadyContext);
  if (context === undefined) {
    throw new Error('useAppReady must be used within an AppReadyProvider');
  }
  return context;
};
