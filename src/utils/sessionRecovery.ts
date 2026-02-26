import { supabase } from '@/integrations/supabase/client';

const RECOVERY_KEY = 'session-recovery-attempts';
const MAX_RECOVERY_ATTEMPTS = 2;

// Module-level lock to prevent overlapping recoveries
let recoveryInProgress = false;

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
 * Fully clear both localStorage and sessionStorage of Supabase/cache artefacts.
 * Preserves only the recovery-attempt counter to prevent infinite loops.
 */
const clearAllStorage = (): void => {
  // Save recovery counter
  const recoveryAttempts = sessionStorage.getItem(RECOVERY_KEY);

  // Clear all supabase-related localStorage keys
  const lsKeysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sb-') || key.startsWith('supabase'))) {
      lsKeysToRemove.push(key);
    }
  }
  lsKeysToRemove.forEach((key) => localStorage.removeItem(key));

  // Clear ALL sessionStorage (prop firm caches + anything else)
  sessionStorage.clear();

  // Restore recovery counter so we don't lose loop protection
  if (recoveryAttempts) {
    sessionStorage.setItem(RECOVERY_KEY, recoveryAttempts);
  }
};

/**
 * Clear service worker caches if they exist.
 */
export const clearServiceWorkerCaches = async (): Promise<void> => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
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
 * Recover from a stale session by signing out, clearing storage, and reloading.
 * Uses a module-level lock so multiple callers cannot trigger overlapping recoveries.
 */
export const recoverSession = async (): Promise<void> => {
  if (recoveryInProgress) return;
  recoveryInProgress = true;

  const attempts = parseInt(sessionStorage.getItem(RECOVERY_KEY) || '0', 10);

  if (attempts >= MAX_RECOVERY_ATTEMPTS) {
    console.warn('Session recovery: Max attempts reached, clearing everything');
    sessionStorage.removeItem(RECOVERY_KEY);
    clearAllStorage();
    await clearServiceWorkerCaches();
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
  await clearServiceWorkerCaches();
  window.location.reload();
};

/**
 * Reset recovery counter (call on successful data load).
 */
export const clearRecoveryCounter = (): void => {
  sessionStorage.removeItem(RECOVERY_KEY);
};
