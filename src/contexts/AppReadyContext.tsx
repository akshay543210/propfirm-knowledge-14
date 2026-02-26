import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { healthCheck, recoverSession, clearServiceWorkerCaches } from '@/utils/sessionRecovery';

interface AppReadyContextType {
  appReady: boolean;
  authReady: boolean;
  marketReady: boolean;
  allReady: boolean;
}

const AppReadyContext = createContext<AppReadyContextType | undefined>(undefined);

export const AppReadyProvider = ({ children }: { children: ReactNode }) => {
  const [appReady] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [marketReady] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let timeoutTriggered = false;

    // Clear old service worker caches on mount
    clearServiceWorkerCaches();

    // Fast-boot timeout – never wait longer than 500ms for auth
    const authTimeout = setTimeout(() => {
      if (isMounted && !timeoutTriggered) {
        console.log('AppReadyContext: Auth timeout, proceeding without waiting');
        timeoutTriggered = true;
        setAuthReady(true);
      }
    }, 500);

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        // If session exists but has auth errors, try to refresh
        if (session && error) {
          console.warn('AppReadyContext: Session error, attempting refresh');
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.warn('AppReadyContext: Refresh failed, recovering session');
            await recoverSession();
            return;
          }
        }

        // Run a lightweight health check to confirm DB connectivity
        const healthy = await healthCheck();
        if (!healthy && session) {
          console.warn('AppReadyContext: Health check failed with existing session, recovering');
          await recoverSession();
          return;
        }
      } catch (error) {
        console.warn('Auth session check failed:', error);
      } finally {
        if (isMounted && !timeoutTriggered) {
          clearTimeout(authTimeout);
          setAuthReady(true);
        }
      }
    };

    checkAuth();

    // Listen for auth state changes and actively clean stale sessions
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('AppReadyContext: Token refreshed successfully');
        }
        if (event === 'SIGNED_OUT') {
          // Full cache purge on sign-out
          for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);
            if (key?.startsWith('propfirm-cache')) {
              sessionStorage.removeItem(key);
            }
          }
        }
        // If we get a SIGNED_IN event with no valid session, something is stale
        if (event === 'SIGNED_IN' && !session) {
          console.warn('AppReadyContext: SIGNED_IN with null session, recovering');
          await recoverSession();
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, []);

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
