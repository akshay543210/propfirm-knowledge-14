# PropFirm Knowledge — Advanced Search & Filtering

Adapted to this project's stack: **Vite + React + Supabase** (no Next.js). Server-side work runs in **Supabase Edge Functions**. SEO via `react-helmet-async` + a generated `sitemap.xml`. Meta Pixel client-side only (no CAPI).

---

## Phase 1 — Schema upgrades & slug hardening

`prop_firms` already has `slug`. We will add the missing search/filter columns and indexes via one migration.

New columns on `prop_firms`:
- `platforms text[]` (e.g. `{MT4,MT5,cTrader,DXtrade}`)
- `asset_classes text[]` (e.g. `{Forex,Futures,Crypto,Indices}`)
- `feature_tags text[]` (e.g. `{scaling,lifetime,no-time-limit}`)
- `countries text[]` (ISO codes; empty = global)
- `fee_min numeric`, `fee_max numeric`
- `account_min numeric`, `account_max numeric`
- `profit_split_min numeric`, `profit_split_max numeric`
- `year_established int`
- `verified boolean default false`
- `rating_avg numeric(2,1)` (mirror of `review_score` for sort/filter)
- `tsv tsvector` (generated from name + brand + description)

Indexes:
- `GIN` on `platforms`, `asset_classes`, `feature_tags`, `countries`, `tsv`
- `pg_trgm` extension + trigram GIN on `name` and `slug` (fuzzy match)
- B-tree on `fee_min`, `fee_max`, `rating_avg`, `year_established`, `verified`

Triggers:
- BEFORE INSERT/UPDATE trigger maintains `tsv = to_tsvector('english', coalesce(name,'')||' '||coalesce(brand,'')||' '||coalesce(description,''))`
- BEFORE INSERT trigger auto-fills `slug` from `name` if null, ensuring uniqueness with `-2`, `-3` suffixes

Backfill:
- Populate `slug` for any null rows
- Default `platforms` from existing single `platform` text column where present
- Default `fee_min/fee_max` from `price`/`starting_fee`
- Default `rating_avg` from `review_score`

RLS: keep existing public-read / admin-write policies (no change).

Acceptance: every firm has a unique slug, `tsv` populated, all GIN/trgm/B-tree indexes exist, admin form can edit the new fields.

---

## Phase 2 — Search Edge Function

Create `supabase/functions/search-firms/index.ts`.

Inputs (POST JSON):
```
{
  search?: string,
  platforms?: string[],
  asset_classes?: string[],
  feature_tags?: string[],
  countries?: string[],
  market_type?: string[],
  min_fee?: number, max_fee?: number,
  min_account?: number, max_account?: number,
  min_profit_split?: number,
  min_rating?: number,
  verified?: boolean,
  year_from?: number,
  sort?: 'rating'|'price_asc'|'price_desc'|'newest'|'relevance',
  page?: number, page_size?: number  // default 20, max 60
}
```

Implementation:
- Zod-validate body, return 400 on bad input
- Build a `supabase.from('prop_firms').select('*', { count: 'exact', head: false })`
- Apply: `.textSearch('tsv', q, { type: 'websearch', config: 'english' })` when `search` present; fallback to trigram `ilike` if short query
- `.contains('platforms', platforms)` etc. for arrays
- `.gte`/`.lte` for numeric ranges, `.eq('verified', true)` when set
- `.order(...)` for sort, `.range(from, to)` for pagination
- Return `{ firms, total, page, page_size }` with CORS headers
- Public anon-key callable (read-only), no JWT required

Acceptance: function returns correct filtered results + accurate `total`; covered by a Deno test that exercises 3 filter combos.

---

## Phase 3 — Frontend hook + filter UI (Vite)

New files:
- `src/hooks/usePropFirmsSearch.ts` — wraps `supabase.functions.invoke('search-firms', { body })` with:
  - 300ms debounce on `search`
  - `AbortController` + 10s timeout (reuses pattern from `useSupabaseData`)
  - one retry on failure
  - `loading` always cleared in `finally`
  - returns `{ firms, total, page, setPage, loading, error, retry }`
- `src/components/search/FilterPanel.tsx` — sidebar with:
  - search input (icon + clear)
  - multi-select chips: platforms, asset classes, feature tags, market types, countries
  - dual-handle slider for fee range and account size (shadcn `Slider`)
  - star selector for min rating
  - toggle for "Verified only"
  - "Clear all" button + active-filter count badge
- `src/components/search/SearchResults.tsx` — grid of `PropFirmCard` with framer-motion `layout` reorder, skeletons while loading, empty + error states with retry, pagination footer
- `src/pages/AllPropFirms.tsx` — refactored to host `FilterPanel` + `SearchResults`; mobile shows filter as a `Sheet` drawer

State lives in the page; URL is kept in sync via `useSearchParams` so filters are shareable/bookmarkable.

Acceptance: every filter works individually and in combination; URL reflects state; mobile drawer works; no infinite loaders; live-updating result count.

---

## Phase 4 — Caching, timeouts, error recovery

- All search calls go through a shared `withTimeout(promise, 10_000)` + 1 retry helper (already exists in `useSupabaseData.ts` — extract to `src/utils/resilientFetch.ts` and reuse)
- `loading=false` enforced in `finally`
- Edge function responses sent with `Cache-Control: no-store`
- Client query includes `ts` cache-buster only on retry (not first call) to avoid CDN cache hit on stale errors
- On 2 consecutive total failures, trigger existing `recoverSession()` — do NOT loop
- Stale-while-revalidate: cache last result set in `sessionStorage` keyed by filter hash so the UI shows previous results instantly while fresh ones load

Acceptance: throttled network → request aborts at ~10s → retries once → either succeeds or shows error+retry; no infinite spinner.

---

## Phase 5 — SEO + Meta Pixel (no CAPI)

SEO:
- Install `react-helmet-async`, wrap `<App>` in `HelmetProvider`
- Add `<SEO>` component used on `Index`, `AllPropFirms`, `PropFirmDetail`, `FirmReviewDetail`, `TopFirms`, `CheapFirms`, `TableReview`, `Reviews` with: dynamic title (<60 chars), meta description (<160), canonical, `og:` and `twitter:` tags, and JSON-LD (`Organization`, `Product` for firms with `aggregateRating`, `BreadcrumbList`)
- Generate `public/sitemap.xml` at build time via `scripts/generate-sitemap.mjs` (reads slugs from Supabase using anon key); add as a `prebuild` npm script
- Existing `public/robots.txt` updated to reference sitemap

Meta Pixel (client only):
- Inject Pixel base snippet in `index.html` `<head>` guarded by `VITE_META_PIXEL_ID`
- New `src/components/PixelTracker.tsx` listens to React Router `useLocation()` and fires `fbq('track','PageView')` on every navigation
- Helper `trackPixelEvent(name, params)` for future custom events (no CAPI route)
- Pixel ID stored as `VITE_META_PIXEL_ID` env var (publishable, safe in client)

Acceptance: Lighthouse SEO ≥ 90; sitemap contains every slug; Meta Pixel Helper extension shows PageView on every route change.

---

## Technical details

**Migration order:** Phase 1 SQL (one migration: extension + columns + triggers + indexes + backfill). User must approve migration before code changes referencing new columns are deployed. The Supabase types file regenerates automatically.

**Edge Function deployment:** automatic on push. Uses anon key from client; no service role needed. CORS headers + OPTIONS handler included.

**Hook contract:** `usePropFirmsSearch` mirrors the shape of existing `usePropFirms` so other pages keep working. The old `usePropFirms` stays for the homepage.

**URL params format:** comma-joined arrays (`?platforms=MT4,MT5&min_rating=4`); ranges as `fee=100-500`. Decoded once in the page.

**Files to add:**
- `supabase/functions/search-firms/index.ts` + `index_test.ts`
- `src/hooks/usePropFirmsSearch.ts`
- `src/utils/resilientFetch.ts`
- `src/components/search/FilterPanel.tsx`
- `src/components/search/SearchResults.tsx`
- `src/components/SEO.tsx`
- `src/components/PixelTracker.tsx`
- `scripts/generate-sitemap.mjs`

**Files to modify:**
- `src/pages/AllPropFirms.tsx` (use new hook + panel)
- `src/components/admin/*` (form fields for new columns)
- `src/types/supabase.ts` (extend `PropFirm`)
- `src/App.tsx` (HelmetProvider, PixelTracker)
- `index.html` (Pixel base snippet)
- `package.json` (deps + prebuild script)
- `public/robots.txt` (add sitemap line)

**Risks / mitigations:**
- New columns null on existing rows → backfill in migration; UI filters treat null as "unspecified" (don't exclude)
- `tsv` trigger conflicts with existing rows → `UPDATE` after column add to populate
- Sitemap script needs network at build → uses public anon key; fails soft (logs warning, ships old sitemap)
- Pixel ID missing → tracker no-ops silently
