/**
 * Resilient fetch helper shared by all data hooks.
 *  - AbortController-based 10s timeout
 *  - Retries exactly once on failure
 *  - After 2 consecutive final failures, triggers session recovery
 */
import { recoverSession, clearRecoveryCounter } from './sessionRecovery';

export const FETCH_TIMEOUT = 10000;

let consecutiveFailures = 0;

export async function fetchWithTimeout<T>(
  fetchFn: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number = FETCH_TIMEOUT,
): Promise<T> {
  const attempt = async (): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const result = await fetchFn(controller.signal);
      clearTimeout(timeoutId);
      consecutiveFailures = 0;
      clearRecoveryCounter();
      return result;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  try {
    return await attempt();
  } catch (firstError) {
    console.warn('Fetch failed, retrying once...', firstError);
    try {
      return await attempt();
    } catch (retryError) {
      consecutiveFailures++;
      if (consecutiveFailures >= 2) {
        console.error('Multiple fetch failures detected, recovering session');
        consecutiveFailures = 0;
        await recoverSession();
      }
      throw retryError;
    }
  }
}
