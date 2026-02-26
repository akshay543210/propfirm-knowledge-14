
Goal: permanently stabilize prop-firm loading without changing UI layout/components, by hardening session handling + fetch behavior.

What I found from your current code/logs:
- `persistSession` and `autoRefreshToken` are already enabled in `src/integrations/supabase/client.ts`.
- Repeated timeouts are happening in `useSupabaseData.ts` even when Supabase later returns data; the timeout wrapper currently rejects after 10s but does not abort the underlying request.
- Recovery exists, but storage clearing is selective (not full), and health checks are defined but not consistently used before data fetches.
- Some prop-firm related hooks still use separate timeout logic (6s, no retry standardization), which creates inconsistent behavior across pages.

Implementation plan (no UI breakage, logic-only changes):

1) Harden Supabase client fetch behavior (cache busting globally)
- File: `src/integrations/supabase/client.ts`
- Keep auth config as-is (`persistSession: true`, `autoRefreshToken: true`).
- Add `global.fetch` wrapper to force `cache: 'no-store'` on all Supabase HTTP calls.
- Add `Cache-Control: no-cache, no-store, max-age=0` and `Pragma: no-cache` headers in the wrapper for stronger browser/proxy bypass.

2) Strengthen invalid-session reset behavior
- File: `src/utils/sessionRecovery.ts`
- Expand recovery to clear both `localStorage` and `sessionStorage` when session is invalid, while safely preserving only the internal recovery-attempt guard key.
- Add a recovery lock (module-level flag/promise) so multiple hooks cannot trigger overlapping recoveries/reloads.
- Ensure recovery path also clears service worker caches before reload.
- Keep max-attempt protection (2) to prevent infinite reload loops.

3) Make auth-state listener actively clean stale sessions
- File: `src/contexts/AppReadyContext.tsx`
- Update `onAuthStateChange` callback signature to use both `event` and `session`.
- On invalid states (e.g., signed out unexpectedly with stale auth artifacts), trigger the hardened recovery reset once.
- Keep fast boot timeout behavior so app never hangs waiting for auth readiness.
- Use existing health check as part of startup readiness gate before data-heavy operations proceed.

4) Replace timeout helper with abortable resilient query runner
- File: `src/hooks/useSupabaseData.ts`
- Refactor `fetchWithTimeout` to:
  - use `AbortController`,
  - pass `.abortSignal(signal)` into every Supabase query,
  - timeout at 10s,
  - retry exactly once,
  - increment a shared consecutive-failure counter only after final failure.
- Add pre-fetch health check (lightweight) before main prop-firm queries; if unhealthy, run recovery path early instead of waiting for hanging queries.
- On 2 consecutive final failures, trigger safe app recovery/reload once.
- Keep all existing `finally { setLoading(false) }` guards and mounted checks to avoid UI regressions.

5) Standardize all prop-firm related hooks to same resilient logic
- Files:
  - `src/hooks/useSupabaseData.ts` (all prop firm/review fetches),
  - `src/hooks/useSectionMemberships.ts`,
  - `src/hooks/useTableReviewFirms.ts`.
- Move 6s custom timeout flows to the shared 10s + one retry + abort-signal pattern.
- Ensure each async fetch path always ends loading state in `finally`.
- Keep current data shape/state contracts unchanged so components render exactly as now.

6) Remove loop risks while keeping existing behavior
- Audit effect dependencies in touched hooks:
  - ensure fetch callbacks are stable,
  - avoid re-trigger loops from state updates inside same effect chain,
  - keep one-time initialization guards where needed.
- Do not alter navigation/routes/UI structure.

Validation checklist (end-to-end):
- Normal browser with stale old session: app recovers and loads firms automatically.
- Incognito and normal both load consistently.
- Direct open and hard refresh on `/propfirms`, `/`, `/top-firms`, `/cheap-firms`, `/table-review`.
- Network throttling: request aborts at ~10s, retries once, loading ends.
- After 2 consecutive failures: safe recovery + reload happens once (no loop).
- Auth events (sign out/token refresh) do not leave app stuck in loading.
- Mobile and desktop flows unchanged visually.

Files to modify:
- `src/integrations/supabase/client.ts`
- `src/utils/sessionRecovery.ts`
- `src/contexts/AppReadyContext.tsx`
- `src/hooks/useSupabaseData.ts`
- `src/hooks/useSectionMemberships.ts`
- `src/hooks/useTableReviewFirms.ts`
