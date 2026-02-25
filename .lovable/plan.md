

# SEO-Friendly Slug-Based URLs for All Prop Firm Pages

## Overview
Replace all UUID-based URLs with clean, slug-based URLs across the entire site. The `slug` column already exists in the `prop_firms` table, so no database migration is needed. The work is primarily routing and link updates.

## Current State
- `slug` column already exists in `prop_firms` (TEXT, NOT NULL)
- `PropFirmDetail` already fetches by slug (`eq('slug', id)`)
- But `FirmReviewDetail` and `WriteReview` still fetch by UUID (`eq('id', firmId)`)
- All links in cards/reviews point to UUID-based routes (`/firm-reviews/{id}`, `/write-review/{id}`)

## New URL Structure

```text
OLD                          NEW
/firms/:id                   /:slug
/firm-reviews/:firmId         /:slug/reviews
/write-review/:firmId         /:slug/write-review
```

Static pages remain unchanged: `/propfirms`, `/compare`, `/reviews`, `/table-review`, etc.

---

## Implementation Steps

### Step 1 -- Update Routes in App.tsx

Replace the three ID-based routes with slug-based equivalents:

```text
/firms/:id           -->  /:slug
/firm-reviews/:firmId -->  /:slug/reviews
/write-review/:firmId -->  /:slug/write-review
```

The `/:slug` route must be placed AFTER all static routes to avoid conflicts (e.g., `/propfirms`, `/compare`, `/login` must match before the catch-all `/:slug`).

### Step 2 -- Update PropFirmDetail Page

- Change `useParams` from `{ id }` to `{ slug }`
- Already fetches by slug -- just rename the param variable

### Step 3 -- Update FirmReviewDetail Page

- Change `useParams` from `{ firmId }` to `{ slug }`
- Change query from `.eq('id', firmId)` to `.eq('slug', slug)`
- Update the `useReviews` hook call: first fetch firm by slug, then use `firm.id` for reviews
- Update realtime subscription to use `firm.id` (after fetching)

### Step 4 -- Update WriteReview Page

- Change `useParams` from `{ firmId }` to `{ slug }`
- Change query from `.eq('id', firmId)` to `.eq('slug', slug)`
- Update navigation on submit: `navigate(`/${slug}/reviews`)`
- Update back link: `to={`/${slug}/reviews`}`

### Step 5 -- Update All Internal Links

**PropFirmCard.tsx** (used everywhere -- cards on home, all firms, top firms, cheap firms, table review):
- `navigate(`/firm-reviews/${firm.id}`)` --> `navigate(`/${firm.slug}/reviews`)`
- `navigate(`/write-review/${firm.id}`)` --> `navigate(`/${firm.slug}/write-review`)`

**Reviews.tsx** (firm review cards):
- `to={`/firm-reviews/${firm.id}`}` --> `to={`/${firm.slug}/reviews`}`
- `to={`/write-review/${firm.id}`}` --> `to={`/${firm.slug}/write-review`}`

**FirmReviewDetail.tsx** (back link):
- `to="/reviews"` stays the same (goes to reviews listing)

### Step 6 -- Legacy Redirect Support

Add a small component/logic in the `/:slug` route to detect if the param looks like a UUID. If so, fetch the firm by ID, get its slug, and redirect to `/${slug}` with `replace`.

Same logic for `/:slug/reviews` -- if slug looks like a UUID, fetch and redirect.

### Step 7 -- Improve 404 Page

Update `NotFound.tsx` to match the site's dark theme and include a link back to `/propfirms` (All Firms).

### Step 8 -- SEO Meta Tags

Add a reusable `useDocumentTitle` hook or inline `document.title` updates in:
- `PropFirmDetail`: `{firm.name} | PropFirm Knowledge`
- `FirmReviewDetail`: `{firm.name} Reviews | PropFirm Knowledge`
- `WriteReview`: `Write Review for {firm.name} | PropFirm Knowledge`

---

## Files to Modify

| File | Change |
|------|--------|
| `src/App.tsx` | Update route paths |
| `src/pages/PropFirmDetail.tsx` | Rename param to `slug` |
| `src/pages/FirmReviewDetail.tsx` | Fetch by slug, fix useReviews |
| `src/pages/WriteReview.tsx` | Fetch by slug, update links |
| `src/components/PropFirmCard.tsx` | Update nav links to slug |
| `src/pages/Reviews.tsx` | Update link hrefs to slug |
| `src/pages/NotFound.tsx` | Improve styling |

## Risks and Mitigations
- **Route conflict**: `/:slug` could match static routes like `/login`. Mitigation: place `/:slug` routes AFTER all static routes in the Routes list. React Router matches in order, so static routes take priority.
- **Bookmarked UUID URLs**: Legacy redirect logic handles this gracefully.
- **Reviews hook**: `useReviews` takes a `firm_id` (UUID). We still pass `firm.id` after fetching the firm by slug -- no hook changes needed.

