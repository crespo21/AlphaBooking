```

```

# AlphaBooking AI Agent Instructions

## Project Overview

AlphaBooking is a React + TypeScript multi-tenant booking platform built with Vite, Supabase, and React Router v6. The app supports two user types:

- **Customers**: Create accounts, browse services, and book appointments with specific providers
- **Service Providers**: Create accounts, manage their services, and handle customer bookings

The platform is business-type agnostic (salons, barbershops, spas, consultants, etc.) with real-time updates and provider-specific booking management.

## Architecture & Data Flow

### Three-Layer Data Access Pattern

1. **API Layer** (`src/lib/api.ts`): Supabase Edge Functions with automatic fallback
2. **Database Layer** (`src/lib/database.ts`): Direct Supabase queries as fallback
3. **Real-time Layer** (`src/hooks/use*Realtime.ts`): Supabase real-time subscriptions

**Critical Pattern**: All data operations use try/catch with Edge Function first, then fallback to direct database:

```typescript
try {
  const response = await calculatePrice(serviceId, staffId);
  if (response.data) return response.data.price_breakdown.total;
} catch (error) {
  return await calculatePriceFallback(serviceId, staffId);
}
```

### State Management

- **Global**: `BookingContext` (`src/context/BookingContext.tsx`) manages customer booking flow state
- **Real-time**: Three custom hooks (`useBookingRealtime`, `useAvailabilityRealtime`, `useDashboardRealtime`) for live updates
- **Local**: React hooks (`useState`, `useMemo`) for component state and derived data

### Navigation Architecture

- React Router v6 with programmatic navigation (`useNavigate` hook)
- Persistent `AdminLayout` sidebar across all admin pages
- Booking flow has internal step navigation (never relies on browser back button)
- All routes defined in `src/AppRouter.tsx`

## Currency & Localization (CRITICAL)

- **Currency**: All prices must display with "R" prefix (South African Rand, e.g., R250.00)
- **Phone Format**: +27 prefix for South African numbers
- **Timezone**: Africa/Johannesburg (SAST)
- **Tax Rate**: 15% (0.15) hardcoded in price calculations

## Development Workflows

### Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (port 3000)
supabase start       # Local Supabase (if using database)
npm run setup-db     # Initialize mock data
```

### Key npm Scripts

- `dev`: Vite development server
- `build`: Production build with type checking
- `preview`: Preview production build
- `setup-db`: Run database setup script

### Local Development URLs

- App: `http://localhost:3000`
- Supabase Studio: `http://127.0.0.1:54323`
- Edge Functions: `http://127.0.0.1:54321/functions/v1`

## File Naming & Organization Conventions

### Component Structure

- **Admin components**: `src/components/admin/` - PascalCase with descriptive names (e.g., `AppointmentDetails.tsx`)
- **Customer components**: `src/components/customer/` - PascalCase flow steps (e.g., `ServiceSelection.tsx`)
- **Shared components**: `src/components/shared/` - Reusable across customer/admin (e.g., `AdminLayout.tsx`)
- **Pages**: `src/pages/admin/` and `src/pages/customer/` - PascalCase with "Page" suffix (e.g., `AdminDashboardPage.tsx`)

### Data Files

- Mock data in `src/data/mock*.json` - Used when Supabase unavailable
- Includes: `mockServices.json`, `mockStaff.json`, `mockBookings.json`, `mockAvailability.json`

### Database

- Schema: `supabase/schema.sql` - PostgreSQL with UUID primary keys
- Edge Functions: `supabase/functions/{function-name}/index.ts`
- Shared utilities: `supabase/functions/_shared/` (cors.ts, db.ts, validation.ts)

## Critical Patterns & Anti-Patterns

### ✅ DO: Null-Safe Staff ID Handling

```typescript
// Edge Functions expect undefined, database expects null
const apiBookingData = {
  ...bookingData,
  staff_id: bookingData.staff_id || undefined  // Convert null to undefined
};
```

### ✅ DO: Real-time Hook Usage

```typescript
const { isConnected } = useBookingRealtime({
  onNewBooking: (booking) => {
    // Handle new booking
  }
});
```

### ✅ DO: Price Display Formatting

```typescript
`R${price.toFixed(2)}`  // Always use R prefix and 2 decimals
```

### ❌ DON'T: Browser Navigation

Never use `window.location`, `history.back()`, or hard links. Always use React Router:

```typescript
const navigate = useNavigate();
navigate('/admin/appointments');
```

### ❌ DON'T: Direct Supabase Calls Without Fallback

Always wrap Edge Function calls with fallback to direct database access.

## Key Integration Points

### Supabase Configuration

- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Client initialization in `src/lib/supabase.ts`
- Real-time enabled with `eventsPerSecond: 10`

### Authentication (Implementation Planned)

- **Auth Provider**: Supabase Auth (native, no external providers)
- **User Types**:
  - Customers: Can browse and book appointments
  - Service Providers: Can manage their services and customer bookings
- **Provider Booking Logic**: When customers select a specific provider, only that provider can manage their booking
- **Pattern to Follow**: Use Supabase `auth.signUp()`, `auth.signIn()`, and Row Level Security (RLS) policies
- **Session Management**: Supabase handles JWT tokens automatically via `auth.getSession()`

### Real-time Subscriptions

- Table: `bookings` - Subscribe to INSERT/UPDATE/DELETE
- Channel pattern: `supabase.channel('name').on('postgres_changes', ...)`
- Always include cleanup in `useEffect` return

### Charts & Visualization

- Library: Recharts (`recharts` package)
- Components: `BarChart`, `LineChart`, `PieChart` from Recharts
- Pattern: Wrap in `ResponsiveContainer` for mobile compatibility
- Location: Admin Reports page (`src/components/admin/Reports.tsx`)

## Database Schema Essentials

### Core Tables

- `services`: Service catalog (name, price, duration)
- `staff`: Staff members (services array, price_surcharge)
- `bookings`: Appointments (includes rating, review, refund_amount)
- `availability`: Staff schedules (day_of_week 0-6, time ranges)
- `blackout_dates`: Business closed dates
- `special_dates`: Different hours on specific dates

### Important Fields

- All IDs are UUIDs (`uuid_generate_v4()`)
- `staff.services`: Array of service UUIDs (`UUID[]`)
- `bookings.status`: Enum ('pending', 'confirmed', 'cancelled', 'completed')
- `bookings.payment_status`: Enum ('pending', 'paid', 'refunded')

## Testing & Debugging

### Testing Strategy

- **Manual Testing**: Read code logic and test through UI workflows
- **No Automated Tests**: Project does not currently use testing frameworks
- **Validation**: Test new features by running the app and verifying behavior matches requirements

### Mock Data Locations

- Services, staff, bookings in `src/data/mock*.json`
- Sample data includes realistic South African context (dates in Oct 2025)

### Common Issues

1. **Edge Functions unavailable**: Fallback pattern auto-handles this
2. **Real-time not connecting**: Check Supabase URL and `isConnected` state
3. **Price calculations wrong**: Verify 15% tax rate and staff surcharge inclusion
4. **Auth issues**: Verify Supabase project has Email Auth enabled in dashboard

## Common Tasks

### Adding a New Admin Page

1. Create component in `src/components/admin/`
2. Create page wrapper in `src/pages/admin/`
3. Add route in `src/AppRouter.tsx`
4. Add sidebar link in `src/components/shared/AdminLayout.tsx`

### Adding a New Booking Step

1. Create component in `src/components/customer/`
2. Add to `BookingFlow.tsx` step array
3. Update `BookingContext` if state changes needed

### Modifying Database Schema

1. Update `supabase/schema.sql`
2. Create migration in `supabase/migrations/`
3. Update TypeScript types in `src/lib/supabase.ts`
4. Update related data access functions in `src/lib/database.ts`

## Production Deployment

### Build Process

```bash
npm run build  # Generates production build in dist/
```

### Deployment Checklist

1. Set environment variables on hosting platform:
   - `VITE_SUPABASE_URL` (production Supabase URL)
   - `VITE_SUPABASE_ANON_KEY` (production anon key)
2. Deploy Edge Functions: `supabase functions deploy`
3. Apply database migrations to production Supabase project
4. Configure Supabase Auth settings (Email Auth enabled)
5. Set up Row Level Security (RLS) policies for production

### Hosting Options

- **Cloud Provider**: Not yet selected - any static site host will work
- **Requirements**:
  - Static site hosting (Vite generates static files)
  - Environment variable support
  - HTTPS enabled
- **Recommended**: Vercel, Netlify, Cloudflare Pages (all support Vite out-of-the-box)

### Security Considerations

- Enable RLS on all Supabase tables before production
- Use Supabase service role key only in secure Edge Functions, never in frontend
- Configure CORS for production domain in Supabase Edge Functions

## Documentation References

- **Setup**: See `SUPABASE_SETUP.md` for database configuration
- **API**: See `API_DOCUMENTATION.md` for Edge Function endpoints
- **Testing**: See `QUICK_START_GUIDE.md` for feature testing
- **Changes**: See `IMPLEMENTATION_SUMMARY.md` for recent updates and currency conversion details
