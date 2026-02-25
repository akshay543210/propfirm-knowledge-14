import { supabase } from '@/integrations/supabase/client';

const RECOVERY_KEY = 'session-recovery-attempts';
const MAX_RECOVERY_ATTEMPTS = 2;

/**
 * Check if the current Supabase session is valid by pinging the DB.
 * Returns true if healthy, false if stale/broken.
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const { error } = await supabase
      .from('prop_firms')
      .select('id')
      .limit(1)
      .abortSignal(controller.signal);

    clearTimeout(timeout);
    return !error;
  } catch {
    return false;
  }
};

/**
 * Recover from a stale session by signing out, clearing storage, and reloading.
 */
export const recoverSession = async (): Promise<void> => {
  const attempts = parseInt(sessionStorage.getItem(RECOVERY_KEY) || '0', 10);

  if (attempts >= MAX_RECOVERY_ATTEMPTS) {
    console.warn('Session recovery: Max attempts reached, clearing everything');
    sessionStorage.removeItem(RECOVERY_KEY);
    clearAllStorage();
    window.location.replace('/');
    return;
  }

  sessionStorage.setItem(RECOVERY_KEY, String(attempts + 1));
  console.log(`Session recovery: Attempt ${attempts + 1}`);

  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    // Ignore sign-out errors
  }

  clearAllStorage();
  window.location.reload();
};

/**
 * Clear all cached data but preserve non-auth items the user might want.
 */
const clearAllStorage = (): void => {
  // Clear all supabase-related localStorage keys
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sb-') || key.startsWith('supabase'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));

  // Clear session storage caches (prop firm data caches)
  const sessionKeysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith('propfirm-cache')) {
      sessionKeysToRemove.push(key);
    }
  }
  sessionKeysToRemove.forEach((key) => sessionStorage.removeItem(key));
};

/**
 * Clear service worker caches if they exist.
 */
export const clearServiceWorkerCaches = async (): Promise<void> => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      console.log('Service worker caches cleared');
    } catch {
      // Ignore cache clearing errors
    }
  }

  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    } catch {
      // Ignore
    }
  }
};

/**
 * Reset recovery counter (call on successful data load).
 */
export const clearRecoveryCounter = (): void => {
  sessionStorage.removeItem(RECOVERY_KEY);
};
