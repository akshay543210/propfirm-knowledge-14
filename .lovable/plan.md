

# PropFirm Knowledge -- World-Class UI/UX Redesign

This is a comprehensive visual and UX overhaul to bring PropFirm Knowledge to the level of Stripe, Linear, and Vercel. The plan is broken into **4 implementation phases** to keep changes manageable and avoid breaking existing functionality.

---

## Phase 1: Design System Foundation

### 1A. Global Theme & CSS Variables
- Update `src/index.css` with new background gradient (`#0B1020 -> #121A2F -> #0D1224`)
- Update CSS custom properties for the new primary gradient (`#E879F9 -> #A78BFA -> #60A5FA`)
- Update success colors (`#22C55E -> #06B6D4`)
- Add glass panel utility classes (`rgba(255,255,255,0.06)` backgrounds, `rgba(255,255,255,0.1)` borders)
- Add CSS noise texture overlay (inline SVG data URI for subtle grain)
- Add new animation keyframes: `glow-pulse`, `float-orb`, `shimmer-sweep`, `magnetic-hover`, `number-tick`

### 1B. Typography
- Add Google Fonts import for Inter + Space Grotesk in `index.html`
- Update `tailwind.config.ts` to include `font-heading` (Space Grotesk 700-800) and `font-body` (Inter 400-500)
- Add tabular-nums utility for stat displays

### 1C. Reusable UI Primitives
- Create `src/components/ui/glass-card.tsx` -- glassmorphism card with gradient border on hover, lift + shadow, and light sweep animation
- Create `src/components/ui/section-wrapper.tsx` -- section container with own background shade, gradient dividers, and animated entry (IntersectionObserver)
- Create `src/components/ui/magnetic-button.tsx` -- button with magnetic hover effect (cursor-follow offset via Framer Motion)
- Create `src/components/ui/verified-badge.tsx` -- shimmer-animated "Verified by FPK" badge
- Create `src/components/ui/skeleton-card.tsx` -- skeleton loader shaped like prop firm cards
- Create `src/components/ui/animated-counter.tsx` -- number counter with spring animation for stats

---

## Phase 2: Core Page Redesign

### 2A. Navbar Upgrade (`src/components/Navbar.tsx`)
- Add auto-hide on scroll down, show on scroll up (using a `useScrollDirection` hook)
- Stronger backdrop blur (`backdrop-blur-xl`)
- Active link indicator: animated underline using `layoutId` from Framer Motion
- Admin badge with subtle glow animation
- "Table Review" styled as a premium gradient pill with shimmer
- Mobile menu: slide-in from right with overlay backdrop

### 2B. Hero Section Rebuild (`src/components/Hero.tsx`)
- New background: floating gradient orbs (3-4 large blurred circles) with slow drift animation
- Subtle parallax glow that shifts on scroll
- Headline: animated gradient that shifts colors slowly (CSS `background-size: 200%` with animation)
- Market toggle already integrated (keep as-is, it looks great)
- Search bar: add focus glow ring animation
- CTA buttons: convert to magnetic buttons
- Add scroll-down indicator (animated chevron at bottom)
- Stagger all elements on entry with Framer Motion `staggerChildren`

### 2C. PropFirmCard Redesign (`src/components/PropFirmCard.tsx`)
- Adopt glass-card component as the base
- Fixed 3-zone layout: Header (logo + brand badge + verified), Content (stats grid), Footer (action buttons)
- Gradient border on hover (using `before` pseudo-element)
- Light sweep effect on hover (diagonal white gradient that slides across)
- Use verified badge component for firms with high trust rating

### 2D. Homepage Section Structure (`src/pages/Index.tsx`)
- Wrap sections in `section-wrapper` for consistent spacing and animated entry
- Add section order: Hero -> Featured Firms -> Category Filters + Cards -> Footer
- Each section gets its own subtle background shade variation
- Add gradient dividers between sections (thin horizontal line with gradient)

---

## Phase 3: Page-Level Polish

### 3A. Reviews Page (`src/pages/Reviews.tsx`)
- Split into Expert Reviews (cards with firm data) and User Reviews (timeline-style list)
- Add sorting controls: Newest, Highest Rated, Most Helpful
- Star rating animation (fill with gold on hover)
- Add verified reviewer badge for authenticated users
- Expandable review cards with smooth height animation

### 3B. All Firms Directory (`src/pages/AllPropFirms.tsx`)
- Add sidebar filter panel with:
  - Price range slider (using existing Slider component)
  - Payout % filter
  - Platform multi-select
  - Market type filter
  - Rating filter
- Live filtering (no page reload) -- already partially implemented
- Results count with animation
- Grid/List view toggle

### 3C. Table Review Enterprise Upgrade (`src/pages/TableReview.tsx`)
- Sticky header row
- Column highlight on hover (subtle background color change)
- Improved glass-card styling for filters
- Better mobile experience with horizontal scroll indicators

### 3D. Footer Redesign (`src/components/Footer.tsx`)
- Match new dark theme gradient
- Add gradient divider at top
- Logo glow effect
- Social icons with hover glow

---

## Phase 4: Motion, Mobile & Performance

### 4A. Page Transitions
- Create `src/components/PageTransition.tsx` wrapper using Framer Motion `AnimatePresence`
- Wrap route content with fade + slight slide animation
- Preserve scroll position on back navigation

### 4B. Micro-Animations
- Hover tilt on all cards (subtle `rotateX`/`rotateY` based on cursor position) via reusable hook `useTilt`
- Toast animations (already using Sonner, just style them to match theme)
- Skeleton loaders during data fetch transitions
- Number counters in stats sections (already using CountUp, ensure consistent usage)

### 4C. Mobile Experience
- Bottom CTA bar on mobile (sticky at bottom with key actions)
- Slide-in mobile menu (replace current dropdown)
- Touch-friendly filter controls
- Disable heavy 3D tilt effects on mobile (respect `prefers-reduced-motion`)
- Larger touch targets (minimum 44px)

### 4D. Performance
- Existing lazy loading is good (keep it)
- Add `loading="lazy"` to all images (already done in most places)
- Memoize expensive filter computations
- Ensure no layout shift from skeleton -> content transitions (match dimensions)

---

## Technical Details

### Files to Create (New)
- `src/components/ui/glass-card.tsx`
- `src/components/ui/section-wrapper.tsx`
- `src/components/ui/magnetic-button.tsx`
- `src/components/ui/verified-badge.tsx`
- `src/components/ui/skeleton-card.tsx`
- `src/components/ui/animated-counter.tsx`
- `src/components/PageTransition.tsx`
- `src/hooks/useScrollDirection.ts`
- `src/hooks/useTilt.ts`

### Files to Modify
- `index.html` -- add Google Fonts
- `src/index.css` -- new CSS variables, utilities, noise texture, keyframes
- `tailwind.config.ts` -- new font families, colors, animations
- `src/components/Navbar.tsx` -- auto-hide, active links, premium styling
- `src/components/Hero.tsx` -- floating orbs, animated gradient, scroll indicator
- `src/components/PropFirmCard.tsx` -- glass-card base, 3-zone layout, light sweep
- `src/components/PropFirmSection.tsx` -- section wrapper, skeleton loaders
- `src/components/Footer.tsx` -- theme alignment, gradient divider
- `src/pages/Index.tsx` -- section structure, page transition wrapper
- `src/pages/AllPropFirms.tsx` -- sidebar filters, live filtering
- `src/pages/Reviews.tsx` -- split sections, sorting, expandable cards
- `src/pages/TableReview.tsx` -- sticky headers, column hover, mobile scroll
- `src/App.tsx` -- page transition wrapper around routes

### What Will NOT Change
- No backend/database changes
- No Supabase schema modifications
- No changes to data fetching hooks (except adding skeleton states)
- No changes to auth flow
- SEO meta tags preserved
- All existing routes and functionality preserved
- Admin panel logic untouched (only visual upgrades)

