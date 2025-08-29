# AI Contribution Guidelines

## Tech Stack Overview

- **Core Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with custom theming and shadcn/ui components
- **State Management**: React Context + Zustand for complex state
- **Routing**: React Router v6 for all navigation
- **API Client**: Supabase JS v2 for database operations
- **Animation**: Framer Motion for complex animations, CSS transitions for simple effects
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Primarily shadcn/ui with custom extensions
- **Authentication**: Supabase Auth with custom hooks
- **Real-time**: Supabase subscriptions for live data

## Library Usage Rules

### 1. State Management
- **Simple State**: Use React `useState` for component-local state
- **Cross-component State**: Use Zustand when state needs to be shared across multiple components
- **Never Use**: Redux, MobX, or other heavy state solutions

### 2. Styling
- **Primary**: Tailwind utility classes (prefer over CSS/SASS)
- **Complex Cases**: CSS modules only when absolutely necessary
- **Avoid**: Inline styles, styled-components, or emotion

### 3. Data Fetching
- **CRUD Operations**: Supabase client directly
- **Complex Queries**: Use Supabase's query builder
- **Caching**: React Query for expensive queries only
- **Never Use**: axios, fetch directly, or other HTTP clients

### 4. Animations
- **Micro-interactions**: Framer Motion (spring physics preferred)
- **Page Transitions**: Built-in router animations
- **Avoid**: GSAP, Anime.js, or other animation libraries

### 5. Forms
- **All Forms**: React Hook Form
- **Validation**: Zod schemas
- **Avoid**: Formik, custom form solutions

### 6. UI Components
- **First Choice**: shadcn/ui components
- **Custom Components**: Build on top of Radix primitives
- **Icons**: Only lucide-react (no other icon libraries)

### 7. Error Handling
- **UI Errors**: Toast notifications via sonner
- **API Errors**: Supabase error handling patterns
- **Monitoring**: Sentry (when implemented)

### 8. Performance
- **Lazy Loading**: React.lazy for routes
- **Images**: Next.js Image component patterns
- **Memoization**: React.memo and useMemo only when proven necessary

### 9. Testing
- **Unit Tests**: Vitest + React Testing Library
- **E2E**: Playwright (when implemented)
- **Avoid**: Enzyme, Cypress component tests

### 10. New Dependencies
- **Requires**: Team discussion before adding any new npm package
- **Criteria**: Must solve problem not solvable with current stack
- **Document**: Add to this file with justification