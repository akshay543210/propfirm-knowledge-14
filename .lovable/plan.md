
# Fix Mobile Spacing for Banner + Navbar

## Problem
The fixed header (banner + navbar) is taller on mobile because the banner content stacks vertically. The current `pt-36` (144px) is not enough on mobile screens, causing content to be hidden behind the header. Additionally, several pages are completely missing the top padding fix.

## Solution
1. Increase mobile top padding from `pt-36` to `pt-44` (on mobile) while keeping `pt-36` on desktop using responsive classes: `pt-44 sm:pt-36`
2. Add the missing padding to pages that were never fixed: DramaSubmit, WriteReview, ReviewDetail, FirmReviewDetail

## Files to Modify

### Pages already using `pt-36` -- change to `pt-44 sm:pt-36`:
- `src/components/Hero.tsx` (line 43)
- `src/pages/AllPropFirms.tsx` (line 25)
- `src/pages/Reviews.tsx` (line 66)
- `src/pages/TableReview.tsx` (line 114)
- `src/pages/Comparison.tsx` (2 occurrences)
- `src/pages/CheapFirms.tsx` (3 occurrences)
- `src/pages/DramaTracker.tsx` (3 occurrences)
- `src/pages/PropFirmDetail.tsx`
- `src/pages/TopFirms.tsx` (3 occurrences)

### Pages missing padding entirely -- add `pt-44 sm:pt-36`:
- `src/pages/DramaSubmit.tsx` -- change `py-20` to `pt-44 sm:pt-36 pb-20` on container divs (lines 146, 161)
- `src/pages/WriteReview.tsx` -- change `py-12` to `pt-44 sm:pt-36 pb-12` on container divs (lines 51, 63, 75)
- `src/pages/ReviewDetail.tsx` -- add padding to container divs
- `src/pages/FirmReviewDetail.tsx` -- change `py-12`/`py-6` to include top padding on container divs (lines 93, 105, 117)

## Technical Approach
- Use Tailwind responsive prefix: `pt-44 sm:pt-36`
  - Mobile (default): `pt-44` = 176px (enough for stacked banner + navbar)
  - Desktop (`sm:` and up): `pt-36` = 144px (banner is single row, needs less space)
- This is a CSS-only fix with no structural changes
