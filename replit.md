# Waypoint - Student Ski Carpooling Platform

## Overview

Waypoint is a Progressive Web App (PWA) that connects college students in Colorado for carpooling to ski resorts. The platform allows users to post rides as drivers or request to join rides as passengers, facilitating cost-sharing and community building around ski trips.

Core features include:
- User authentication with email verification
- Ride posting and discovery with resort-specific filtering
- Ride request/accept/decline workflow
- Real-time messaging between ride participants
- User profiles with ratings and vehicle information
- Push notifications for ride updates
- PWA support for mobile app-like experience

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Routing**: React Router DOM v6 for client-side navigation
- **State Management**: React Context API (AppContext for global state, NotificationContext for push notifications)
- **Data Fetching**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with custom design tokens (powder, snow, evergreen, sunset theme colors)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **PWA**: vite-plugin-pwa for service worker and manifest generation

### Component Structure
- `/src/components/ui/` - Reusable shadcn/ui components (buttons, cards, dialogs, etc.)
- `/src/components/` - Feature-specific components (Header, RideCard, StarRating, etc.)
- `/src/components/RideLifecycle/` - Components for ride status management (pickup confirmation, timers)
- `/src/pages/` - Route-level page components

### Authentication & Authorization
- **Provider**: Supabase Auth with email/password authentication
- **Email Verification**: Required before accessing protected routes
- **Protected Routes**: Implemented via ProtectedRoute wrapper component that redirects unauthenticated users
- **Session Management**: Handled through Supabase client with automatic token refresh

### Data Layer
- **Backend**: Supabase (PostgreSQL database with Row Level Security)
- **Client**: @supabase/supabase-js for database queries and real-time subscriptions
- **Data Types**: Defined in `/src/types/index.ts` (User, Ride, Vehicle, RideRequest, Message)

### Key Design Patterns
- **Context Providers**: AppContext wraps the entire app to provide authentication state, user data, and CRUD operations
- **Custom Hooks**: Reusable logic extracted into hooks (`usePushNotifications`, `useInstallPrompt`, `use-toast`)
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers
- **Path Aliases**: `@/` maps to `./src/` for clean imports

### Ride Cost Calculation
- Gas costs are auto-calculated based on resort distance from Denver
- Uses constants for gas price per gallon and average MPG defined in `/src/types/index.ts`

## External Dependencies

### Backend Services
- **Supabase**: Primary backend providing PostgreSQL database, authentication, and file storage (for avatar uploads)
- **Supabase Realtime**: Used for live message updates in ride group chats

### Third-Party Integrations
- **Vercel Speed Insights**: Performance monitoring via @vercel/speed-insights
- **Push Notifications**: Web Push API for browser notifications (handled client-side)

### Key npm Dependencies
- `@supabase/supabase-js` - Supabase client SDK
- `@tanstack/react-query` - Server state management
- `react-router-dom` - Client-side routing
- `date-fns` - Date manipulation utilities
- `react-day-picker` - Calendar component for date selection
- `embla-carousel-react` - Carousel functionality
- `vaul` - Drawer component
- `cmdk` - Command menu component
- `lucide-react` - Icon library
- `sonner` - Toast notifications

### Development Tools
- TypeScript with relaxed strict mode (noImplicitAny: false)
- ESLint with React Hooks and React Refresh plugins
- PostCSS with Tailwind CSS and Autoprefixer