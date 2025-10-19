# AlphaBooking - Appointment Booking System

A modern, full-featured booking system built with React, TypeScript, and Supabase. Designed for South African businesses with ZAR currency support and comprehensive admin features.

---

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Developer Onboarding](#-developer-onboarding)
- [Architecture Overview](#-architecture-overview)
- [Features](#-features)
- [Database Management](#-database-management)
- [API Documentation](#-api-documentation)
- [Testing Guide](#-testing-guide)
- [Enhancement Planning](#-enhancement-planning)
- [Deployment](#-deployment)
- [Tech Stack](#-tech-stack)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

Get up and running in 5 minutes:

```bash
# 1. Install dependencies
npm install

# 2. Start Supabase (one-time setup)
supabase start

# 3. Load test data (optional)
npm run db:seed

# 4. Start development server
npm run dev
```

**Access the application:**
- **Customer Booking**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin (case-sensitive!)
- **Supabase Studio**: http://127.0.0.1:54323

---

## 👨‍💻 Developer Onboarding

### Prerequisites

- **Node.js**: 18+ required
- **npm**: 9+ recommended
- **Docker Desktop**: Required for local Supabase
- **Supabase CLI**: Install via `brew install supabase/tap/supabase` (macOS)

### First-Time Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AlphaBooking-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Supabase**
   ```bash
   supabase start
   ```
   This will:
   - Start 12 Docker containers (PostgreSQL, Auth, API, Studio, etc.)
   - Apply database migrations
   - Provide local URLs and credentials

4. **Verify Supabase is running**
   ```bash
   supabase status
   ```
   You should see:
   ```
   API URL: http://127.0.0.1:54321
   DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
   Studio URL: http://127.0.0.1:54323
   ```

5. **Load test data (optional)**
   ```bash
   npm run db:seed
   ```
   This loads 7 services, 4 staff members, 6 bookings, and business hours.

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Test the application**
   - Open http://localhost:5173 (customer booking flow)
   - Navigate to http://localhost:5173/admin (admin dashboard)
   - Try creating a booking through the customer flow
   - View the booking in the admin dashboard

### Environment Variables

For local development, Supabase runs with default configuration. No `.env` file needed!

For **production deployment**, create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Project Structure

```
AlphaBooking-/
├── src/
│   ├── components/
│   │   ├── admin/              # Admin dashboard components
│   │   │   ├── Dashboard.tsx   # Admin home with metrics
│   │   │   ├── AppointmentsList.tsx
│   │   │   ├── AppointmentDetails.tsx
│   │   │   ├── ServiceManagement.tsx
│   │   │   ├── StaffManagement.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── BrandingCustomization.tsx
│   │   │   └── SystemSettings.tsx
│   │   ├── customer/           # Customer booking flow
│   │   │   ├── BookingFlow.tsx
│   │   │   ├── ServiceSelection.tsx
│   │   │   ├── StaffSelection.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── TimeSlotSelector.tsx
│   │   │   ├── CustomerForm.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── BookingSummary.tsx
│   │   │   └── ConfirmationView.tsx
│   │   └── shared/
│   │       └── AdminLayout.tsx # Admin sidebar and navigation
│   ├── context/
│   │   └── BookingContext.tsx  # Global booking state
│   ├── hooks/
│   │   ├── useAvailabilityRealtime.ts
│   │   ├── useBookingRealtime.ts
│   │   └── useDashboardRealtime.ts
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client configuration
│   │   ├── database.ts         # Database CRUD operations
│   │   └── api.ts              # Edge Functions API calls
│   ├── pages/
│   │   ├── admin/              # Admin page routes
│   │   └── customer/
│   │       └── BookingFlow.tsx
│   ├── App.tsx
│   ├── AppRouter.tsx           # React Router configuration
│   └── index.tsx
├── supabase/
│   ├── config.toml             # Supabase configuration
│   ├── migrations/
│   │   └── 20251019122410_initial_schema.sql  # Schema ONLY
│   ├── seed.sql                # Test data (local only)
│   └── functions/              # Edge Functions
│       ├── check-availability/
│       ├── calculate-price/
│       ├── validate-booking/
│       └── create-booking/
├── scripts/
│   ├── reset-db-clean.sh       # Reset DB without data
│   └── seed-local-db.sh        # Manually load test data
├── .github/
│   └── copilot-instructions.md # AI agent coding guide
└── package.json
```

### Key Conventions

- **Field Naming**: Database uses `snake_case` (e.g., `service_id`, `customer_name`)
- **Currency**: South African Rand (R/ZAR) throughout
- **Phone Format**: +27 prefix for South African numbers
- **Timezone**: Africa/Johannesburg (SAST)
- **Routes**: Case-sensitive (use `/admin` not `/Admin`)
- **IDs**: UUID v4 for all primary keys

---

## 🏗️ Architecture Overview

### Three-Layer Data Access Pattern

AlphaBooking uses a robust three-layer approach for data access:

1. **Edge Functions Layer** (Preferred)
   - Complex logic (availability checking, price calculation)
   - Input validation and business rules
   - Located in `supabase/functions/`
   - Called via `src/lib/api.ts`

2. **Database Layer** (Fallback)
   - Direct Supabase client queries
   - CRUD operations (create, read, update, delete)
   - Located in `src/lib/database.ts`
   - Used when Edge Functions unavailable

3. **Real-time Layer** (Progressive Enhancement)
   - WebSocket subscriptions for live updates
   - Custom hooks in `src/hooks/`
   - Non-blocking, graceful degradation

### Multi-Tenant Data Model

The application supports multiple businesses through a multi-tenant architecture:

```
business (tenant)
├── services (many)
├── staff (many)
│   └── availability (many)
├── bookings (many)
├── business_hours (many)
├── blackout_dates (many)
└── special_dates (many)
```

**Key Tables:**

- **services**: Services offered (haircuts, treatments, etc.)
- **staff**: Team members with schedules and surcharges
- **bookings**: Customer appointments (confirmed, cancelled, completed)
- **availability**: Staff schedules (repeating weekly patterns)
- **business_hours**: Operating hours by day of week
- **blackout_dates**: Closed dates (holidays, vacations)
- **special_dates**: Special hours for specific dates

### Authentication Strategy

Currently using **unauthenticated** mode for rapid development:
- Edge Functions use service role key
- No user login required
- Future: Implement Row Level Security (RLS) for production

### Currency & Localization

- **Primary Currency**: South African Rand (ZAR)
- **Display Format**: `R250.00` (R prefix, 2 decimal places)
- **Tax Rate**: 15% (South African VAT)
- **Timezone**: Africa/Johannesburg (UTC+2)
- **Date Format**: `YYYY-MM-DD` for database, localized for display

### Routing Architecture

- **React Router v6**: Client-side routing (case-sensitive)
- **Customer Flow**: Multi-step booking wizard at `/booking`
- **Admin Dashboard**: Protected routes under `/admin/*`
- **No Browser Dependencies**: All navigation uses `useNavigate` hook

---

## 🎯 Features

### Customer Booking Flow

**8-Step Booking Process:**

1. **Service Selection** - Browse and select service
2. **Staff Selection** - Choose specific staff or "Any Available"
3. **Calendar View** - Pick appointment date
4. **Time Slot Selection** - Choose available time
5. **Customer Information** - Name, email, phone
6. **Payment Form** - Card details (placeholder)
7. **Booking Summary** - Review before confirmation
8. **Confirmation** - Booking number and details

**Features:**
- ✅ Real-time availability checking
- ✅ Dynamic pricing (service + staff surcharge)
- ✅ Mobile-responsive design
- ✅ Progress indicator
- ✅ Back/Forward navigation without browser buttons

### Admin Dashboard

**Key Metrics:**
- Total appointments (today, this week, this month)
- Total revenue (with period comparison)
- Service and staff counts
- Recent bookings list
- Quick action buttons

**Features:**
- ✅ Real-time updates via WebSocket
- ✅ Dashboard-to-page navigation
- ✅ Responsive cards and layouts

### Service Management

- ✅ Create, edit, delete services
- ✅ Set name, description, price (ZAR), duration
- ✅ Active/inactive toggle
- ✅ Visual list with edit/delete actions

### Staff Management

- ✅ Add, update, remove staff members
- ✅ Name, bio, specialties, photo URL
- ✅ Price surcharge (e.g., +R40 for premium stylist)
- ✅ Active/inactive status

### Appointment Management

**List View:**
- Filter by status (all, confirmed, completed, cancelled)
- Search by customer name, confirmation number
- Sort by date, status, price
- Pagination

**Detail View:**
- Full appointment information
- Customer details
- Service and staff information
- Payment status
- Total price breakdown

**Staff Assignment:**
- Identify "Any Available" bookings
- Select staff from dropdown
- One-click assignment

**Cancellation Flow:**
- Cancel appointment with reason
- Process full or partial refund
- Update status to cancelled

### Reports & Analytics

**Key Metrics:**
- Total revenue
- Cancelled orders (count and amount)
- Average rating (star display)
- Average appointments per day
- Average income per week
- Success rate percentage
- Net revenue (revenue minus refunds)

**Visualizations:**
- Revenue & Cancellations bar chart
- Staff Performance line chart
- Service Distribution pie chart
- Detailed breakdown table

**Filtering:**
- By time period (Day, Week, Month, Year, Custom)
- By staff member
- Custom date range picker
- Real-time chart updates

**Customer Reviews Section:**
- Recent reviews with ratings
- Linked to staff and services

### Branding Customization

- ✅ Business name and tagline
- ✅ Primary and secondary color picker
- ✅ Logo upload (file or URL)
- ✅ Business hours configuration
  - Toggle days on/off
  - Set opening/closing times
  - Visual preview
- ✅ Live preview panel
  - Real-time color changes
  - Interactive staff selection
  - Displays actual business hours

### System Settings

- ✅ Default currency (ZAR preselected)
- ✅ Timezone (Africa/Johannesburg preselected)
- ✅ Booking settings
- ✅ Email notifications toggle

---

## 🗄️ Database Management

### Quick Reference

| What You Want | Command |
|---------------|---------|
| **Reset DB (schema only, no data)** | `npm run db:reset:clean` |
| **Add test data manually** | `npm run db:seed` |
| **Reset DB with test data** | `npm run db:reset` |
| **View database** | `npm run db:studio` |

### Common Workflows

#### Starting Fresh (No Data)

Best for testing empty states and real user workflows:

```bash
# Reset to clean schema
npm run db:reset:clean

# Database now has:
# ✅ All tables created
# ❌ No data (empty)
```

Use this when:
- Testing with real data entry via admin UI
- Simulating first-time business setup
- Testing empty state UI components

#### Testing with Sample Data

Best for development with realistic scenarios:

```bash
# Option 1: Reset and seed together
npm run db:reset

# Option 2: Reset clean, then seed
npm run db:reset:clean
npm run db:seed
```

After seeding, you have:
- **7 Services**: Haircuts, coloring, treatments, beard trim
- **4 Staff Members**: Sarah, Michael, Emily, James (with photos and bios)
- **6 Bookings**: Mix of confirmed, completed, cancelled
- **Business Hours**: Monday-Saturday configured
- **Branding**: AlphaBooking preset
- **Availability**: ~24 staff schedules for the week

#### Inspecting Your Database

**Via Supabase Studio (Visual):**
```bash
npm run db:studio
# Opens http://127.0.0.1:54323
```

**Via Command Line:**
```bash
# Quick counts
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "
  SELECT 'services' as table_name, COUNT(*) FROM services
  UNION ALL SELECT 'staff', COUNT(*) FROM staff
  UNION ALL SELECT 'bookings', COUNT(*) FROM bookings
"

# View specific table
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT * FROM services;"
```

### Migration vs Seed Strategy

**Critical Concept for Production Safety:**

#### Migrations (`supabase/migrations/`)
- ✅ Contains ONLY schema (CREATE, ALTER, DROP statements)
- ✅ Runs in ALL environments (local, staging, production)
- ✅ Version-controlled and tracked
- ❌ NO INSERT statements allowed

**Example:**
```sql
-- ✅ Good (in migration)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- ❌ Bad (in migration)
INSERT INTO services (name, price) VALUES ('Haircut', 250.00);
```

#### Seeds (`supabase/seed.sql`)
- ✅ Contains ONLY test data (INSERT statements)
- ✅ Runs ONLY locally via `supabase db reset`
- ❌ NEVER runs in production (Supabase CLI excludes it)
- ✅ Safe to include test customers, bookings, etc.

**Example:**
```sql
-- ✅ Good (in seed.sql)
TRUNCATE services, staff, bookings CASCADE;

INSERT INTO services (name, description, price, duration) VALUES
  ('Basic Haircut', 'Standard haircut', 250.00, 30),
  ('Premium Styling', 'Full styling service', 550.00, 60);
```

### Database Schema

**6 Core Tables:**

1. **services**
   - `id` (UUID, primary key)
   - `name`, `description`, `price`, `duration`
   - `is_active`, `created_at`

2. **staff**
   - `id` (UUID, primary key)
   - `name`, `bio`, `specialties`, `photo_url`
   - `price_surcharge`, `is_active`, `created_at`

3. **bookings**
   - `id` (UUID, primary key)
   - `confirmation_number` (unique)
   - `service_id`, `staff_id` (foreign keys)
   - `customer_name`, `customer_email`, `customer_phone`
   - `date`, `time`, `duration`
   - `total_price`, `status`, `payment_status`
   - `rating`, `review`, `cancellation_reason`, `refund_amount`

4. **availability**
   - `id` (UUID, primary key)
   - `staff_id` (foreign key)
   - `day_of_week` (0-6, Sunday-Saturday)
   - `start_time`, `end_time`
   - `is_available`

5. **business_hours**
   - `id` (UUID, primary key)
   - `day_of_week` (0-6)
   - `is_open`, `open_time`, `close_time`

6. **branding**
   - `id` (UUID, primary key, singleton)
   - `business_name`, `tagline`
   - `primary_color`, `secondary_color`
   - `logo_url`

### Helper Scripts

**`scripts/reset-db-clean.sh`**
```bash
#!/bin/bash
supabase db reset --no-seed
```
Resets database to clean schema without loading test data.

**`scripts/seed-local-db.sh`**
```bash
#!/bin/bash
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/seed.sql
# Shows summary of loaded data
```
Manually loads test data from seed.sql.

### Troubleshooting Database Issues

**Database won't reset:**
```bash
# Stop and restart Supabase
supabase stop
supabase start
```

**Seed script fails:**
```bash
# Check if Supabase is running
supabase status

# Verify seed file exists
ls -la supabase/seed.sql

# Run seed manually
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -f supabase/seed.sql
```

**Migration conflicts:**
```bash
# List applied migrations
supabase migration list --local

# Check migration file
cat supabase/migrations/20251019122410_initial_schema.sql
```

---

## 📡 API Documentation

### Base URLs

- **Local Development**: `http://127.0.0.1:54321/functions/v1`
- **Production**: `https://your-project-id.supabase.co/functions/v1`

### Authentication

All Edge Functions require the Supabase `anon` key in headers:

```typescript
headers: {
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
}
```

### Endpoints

#### 1. Check Availability

**Endpoint**: `POST /check-availability`

**Description**: Check available time slots for a given date, service, and optional staff member.

**Request Body**:
```json
{
  "date": "2025-10-20",
  "service_id": "550e8400-e29b-41d4-a716-446655440001",
  "staff_id": "650e8400-e29b-41d4-a716-446655440001"  // optional
}
```

**Response**:
```json
{
  "data": {
    "available_slots": [
      {
        "time": "09:00",
        "available_staff": ["650e8400-e29b-41d4-a716-446655440001"],
        "available": true
      },
      {
        "time": "09:30",
        "available_staff": [],
        "available": false
      }
    ],
    "business_hours": {
      "is_open": true,
      "open_time": "09:00",
      "close_time": "17:00"
    }
  }
}
```

#### 2. Calculate Price

**Endpoint**: `POST /calculate-price`

**Description**: Calculate total price including service, staff surcharge, and tax.

**Request Body**:
```json
{
  "service_id": "550e8400-e29b-41d4-a716-446655440001",
  "staff_id": "650e8400-e29b-41d4-a716-446655440001",
  "date": "2025-10-20",
  "quantity": 1
}
```

**Response**:
```json
{
  "data": {
    "base_price": 250.00,
    "staff_surcharge": 40.00,
    "subtotal": 290.00,
    "tax": 43.50,
    "total": 333.50,
    "currency": "ZAR",
    "breakdown": {
      "service": "Basic Haircut",
      "staff": "Alex Johnson",
      "tax_rate": 0.15
    }
  }
}
```

#### 3. Validate Booking

**Endpoint**: `POST /validate-booking`

**Description**: Validate booking data before creation.

**Request Body**:
```json
{
  "service_id": "550e8400-e29b-41d4-a716-446655440001",
  "staff_id": "650e8400-e29b-41d4-a716-446655440001",
  "date": "2025-10-20",
  "time": "09:00",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+27123456789",
  "total_price": 333.50
}
```

**Response**:
```json
{
  "data": {
    "valid": true,
    "errors": [],
    "warnings": [],
    "availability_confirmed": true,
    "price_validated": true
  }
}
```

#### 4. Create Booking

**Endpoint**: `POST /create-booking`

**Description**: Create a new booking with validation.

**Request Body**:
```json
{
  "service_id": "550e8400-e29b-41d4-a716-446655440001",
  "staff_id": "650e8400-e29b-41d4-a716-446655440001",
  "date": "2025-10-20",
  "time": "09:00",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+27123456789",
  "total_price": 333.50
}
```

**Response**:
```json
{
  "data": {
    "id": "booking-uuid",
    "confirmation_number": "ABC12345",
    "status": "confirmed",
    "created_at": "2025-10-19T12:30:00.000Z"
  }
}
```

### Real-time Subscriptions

**Booking Notifications:**
```typescript
import { useBookingRealtime } from '../hooks/useBookingRealtime'

const { isConnected, error } = useBookingRealtime({
  onNewBooking: (booking) => console.log('New:', booking),
  onBookingUpdate: (booking) => console.log('Updated:', booking),
  onBookingDelete: (id) => console.log('Deleted:', id)
})
```

**Availability Updates:**
```typescript
import { useAvailabilityRealtime } from '../hooks/useAvailabilityRealtime'

const { isConnected, availableSlots } = useAvailabilityRealtime({
  date: '2025-10-20',
  serviceId: 'service-id',
  onAvailabilityChange: (slots) => console.log('Slots:', slots)
})
```

### Error Handling

All endpoints return consistent error responses:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": "Additional context"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR`: Input validation failed
- `SERVICE_NOT_FOUND`: Service ID not found
- `STAFF_NOT_FOUND`: Staff ID not found
- `SLOT_CONFLICT`: Time slot already booked
- `BLACKOUT_DATE`: Date is blacked out
- `NETWORK_ERROR`: Network connection failed

### Rate Limiting

- **Availability Check**: 100 requests/minute
- **Price Calculation**: 200 requests/minute
- **Booking Validation**: 50 requests/minute
- **Booking Creation**: 20 requests/minute

---

## 🧪 Testing Guide

### Manual Testing Checklist

Use this checklist to verify all features work correctly:

#### Customer Booking Flow

- [ ] **Step 1: Service Selection**
  - [ ] Services load from database
  - [ ] Prices display in ZAR (R prefix)
  - [ ] Service descriptions visible
  - [ ] "Continue" button works

- [ ] **Step 2: Staff Selection**
  - [ ] Staff members load from database
  - [ ] "Any Available" option present
  - [ ] Staff surcharges display correctly (e.g., +R40)
  - [ ] Staff photos and bios show

- [ ] **Step 3: Date Selection**
  - [ ] Calendar displays current month
  - [ ] Past dates are disabled
  - [ ] Can navigate months forward/backward
  - [ ] Selected date highlights

- [ ] **Step 4: Time Slot Selection**
  - [ ] Available slots load based on date/service/staff
  - [ ] Booked slots are disabled
  - [ ] Business hours respected
  - [ ] Can select a time

- [ ] **Step 5: Customer Form**
  - [ ] Name field validation
  - [ ] Email format validation
  - [ ] Phone number validation (+27 format)
  - [ ] Form submits successfully

- [ ] **Step 6: Payment Form**
  - [ ] Card number field (placeholder)
  - [ ] Expiry and CVV fields
  - [ ] Validation works
  - [ ] "Continue" proceeds

- [ ] **Step 7: Booking Summary**
  - [ ] All details display correctly
  - [ ] Total price accurate (service + surcharge)
  - [ ] "Back" and "Confirm" buttons work

- [ ] **Step 8: Confirmation**
  - [ ] Booking created in database
  - [ ] Confirmation number generated
  - [ ] Details display correctly
  - [ ] "Book Another" returns to start

#### Admin Dashboard

- [ ] **Dashboard Page** (http://localhost:5173/admin)
  - [ ] Metrics load (appointments, revenue)
  - [ ] Recent bookings list displays
  - [ ] Service and staff counts accurate
  - [ ] "System Settings" button navigates
  - [ ] "Manage Appointments" button navigates
  - [ ] "View All Reports" button navigates

- [ ] **Services Page**
  - [ ] Services list loads
  - [ ] "Add Service" button opens form
  - [ ] Create new service works
  - [ ] Edit service works
  - [ ] Delete service works (with confirmation)
  - [ ] Active/inactive toggle works

- [ ] **Staff Page**
  - [ ] Staff list loads
  - [ ] "Add Staff" button opens form
  - [ ] Create staff member works
  - [ ] Edit staff works
  - [ ] Delete staff works (with confirmation)
  - [ ] Photo URL displays image

- [ ] **Appointments Page**
  - [ ] Appointments list loads
  - [ ] Filter by status works (all, confirmed, completed, cancelled)
  - [ ] Search by customer name works
  - [ ] "Details" button opens modal
  - [ ] Appointment details display correctly
  - [ ] Staff assignment works (for "Any Available")
  - [ ] Cancel & Refund flow works
  - [ ] Pagination works

- [ ] **Reports Page**
  - [ ] Key metrics display (revenue, cancelled orders, average rating)
  - [ ] Revenue & Cancellations chart renders
  - [ ] Staff Performance chart renders
  - [ ] Service Distribution pie chart renders
  - [ ] Filter by time period works (Day, Week, Month, Year, Custom)
  - [ ] Filter by staff member works
  - [ ] Custom date range picker works
  - [ ] Charts update when filters change
  - [ ] Customer reviews section displays

- [ ] **Branding Page**
  - [ ] Current branding loads
  - [ ] Primary/secondary color pickers work
  - [ ] Logo URL input works
  - [ ] Business hours configuration works
  - [ ] Toggle days on/off works
  - [ ] Change opening/closing times works
  - [ ] Live preview updates in real-time
  - [ ] Staff selection in preview works
  - [ ] "Save" button persists changes

- [ ] **System Settings Page**
  - [ ] Settings load from database
  - [ ] Currency dropdown shows ZAR selected
  - [ ] Timezone shows Africa/Johannesburg selected
  - [ ] Can modify settings
  - [ ] "Save Settings" button works
  - [ ] Confirmation message displays

#### Real-time Features

- [ ] **Dashboard Real-time**
  - [ ] Create booking via customer flow
  - [ ] Dashboard metrics update without refresh
  - [ ] Recent bookings list updates

- [ ] **Availability Real-time**
  - [ ] Book a time slot
  - [ ] Slot becomes unavailable in time selector
  - [ ] Other available slots remain selectable

#### Navigation

- [ ] **Sidebar Navigation**
  - [ ] All menu items work
  - [ ] Active page highlights
  - [ ] No page refreshes (React Router)
  - [ ] Mobile hamburger menu works

- [ ] **Booking Flow Navigation**
  - [ ] "Back" button returns to previous step
  - [ ] "Continue" advances to next step
  - [ ] Progress indicator updates
  - [ ] Can navigate without browser back button

### Test Scenarios

#### Scenario 1: First-Time Customer Booking

**Goal**: Complete a booking from start to finish.

1. Start with fresh database: `npm run db:reset`
2. Navigate to http://localhost:5173
3. Click "Book Now"
4. Select "Basic Haircut" (R250)
5. Select "Alex Johnson" (+R40 surcharge)
6. Choose tomorrow's date
7. Select "09:00" time slot
8. Fill in customer form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "+27123456789"
9. Enter payment details (placeholder)
10. Review summary (total should be R290 + tax)
11. Confirm booking
12. Note confirmation number

**Verify**:
- Booking appears in admin appointments list
- Dashboard shows increased appointment count
- Customer receives confirmation (if email implemented)

#### Scenario 2: Admin Staff Assignment

**Goal**: Assign staff to an "Any Available" booking.

1. Create booking with "Any Available" staff
2. Navigate to /admin/appointments
3. Find booking with "Any Available" staff
4. Click "Details" button
5. Select staff from dropdown
6. Click checkmark to assign
7. Modal should update to show assigned staff
8. Close modal and verify list shows staff name

#### Scenario 3: Cancellation & Refund

**Goal**: Cancel a booking and process refund.

1. Navigate to /admin/appointments
2. Find a confirmed booking
3. Click "Details"
4. Click "Cancel & Refund" button
5. Confirm cancellation
6. Enter refund amount (up to total price)
7. Click "Process Refund"
8. Verify booking status changes to "cancelled"
9. Verify refund amount recorded

#### Scenario 4: Reports Filtering

**Goal**: Test report filters and chart updates.

1. Navigate to /admin/reports
2. Default view shows current month
3. Change time period to "Week"
4. Verify charts update
5. Select specific staff member
6. Verify charts show only that staff's data
7. Select "Custom" date range
8. Pick October 1-15, 2025
9. Verify data filters to range

### Testing with Empty Database

To test empty states:

```bash
# Reset to clean database
npm run db:reset:clean

# Start app
npm run dev
```

**Verify**:
- Admin dashboard shows "0" for all metrics
- Services page shows "No services found"
- Staff page shows "No staff members found"
- Appointments page shows "No appointments found"
- Reports page shows "No data available"

### Testing with Seed Data

To test with realistic data:

```bash
# Reset with seed data
npm run db:reset

# Start app (if not running)
npm run dev
```

**Verify**:
- Dashboard shows correct counts (7 services, 4 staff, 6 bookings)
- Services page lists all 7 services
- Staff page lists all 4 staff members
- Appointments page lists 6 bookings
- Reports show revenue, charts with data

### Browser Compatibility

Test in multiple browsers:
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

Test responsive design:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## 🚀 Enhancement Planning

### Gathering Requirements

Before building new features, follow this process:

#### 1. Understand Current State

- [ ] Review existing features (see [Features](#-features) section)
- [ ] Identify gaps or pain points
- [ ] Check user feedback or business goals

#### 2. Define Requirements

Use this template for each enhancement:

```markdown
## Enhancement: [Feature Name]

### Business Goal
What problem does this solve? Who benefits?

### User Stories
- As a [customer/admin], I want to [action] so that [benefit]
- ...

### Acceptance Criteria
- [ ] User can...
- [ ] System should...
- [ ] Data is...

### Technical Considerations
- Database changes needed?
- New API endpoints?
- UI/UX changes?
- Third-party integrations?

### Dependencies
- Requires Feature X to be completed first
- Blocked by API limitation

### Effort Estimate
- Small (1-2 hours)
- Medium (1-2 days)
- Large (1 week+)

### Priority
- Must Have (MVP)
- Should Have (Important)
- Nice to Have (Future)
```

#### 3. Create Action Plan

1. **Break down into tasks**
   - Database schema changes
   - API endpoint creation
   - UI component development
   - Integration and testing

2. **Sequence tasks**
   - What must be done first?
   - What can be done in parallel?

3. **Assign owners** (if team)

4. **Set deadlines**

#### 4. Implementation Checklist

For each feature:

- [ ] **Database**
  - [ ] Create migration file
  - [ ] Update seed.sql (if needed)
  - [ ] Test migration locally

- [ ] **API**
  - [ ] Create Edge Function (if needed)
  - [ ] Add to `src/lib/api.ts`
  - [ ] Add to `src/lib/database.ts` (fallback)

- [ ] **Components**
  - [ ] Create UI components
  - [ ] Add to appropriate page
  - [ ] Handle loading/error states

- [ ] **Testing**
  - [ ] Manual test all scenarios
  - [ ] Test with empty database
  - [ ] Test with seed data
  - [ ] Test edge cases

- [ ] **Documentation**
  - [ ] Update README.md
  - [ ] Update CHANGELOG.md
  - [ ] Add code comments

### Suggested Enhancements

Here are common feature requests:

#### High Priority

1. **User Authentication**
   - Customer accounts (login/signup)
   - Admin authentication
   - Row Level Security (RLS)
   - Password reset flow

2. **Email Notifications**
   - Booking confirmation emails
   - Appointment reminders (24h before)
   - Cancellation notifications
   - Admin notification for new bookings

3. **Payment Integration**
   - Stripe/PayPal/PayFast integration
   - Payment processing during booking
   - Refund automation
   - Payment history tracking

4. **SMS Notifications**
   - Appointment reminders via SMS
   - Booking confirmation SMS
   - Integration with Twilio or local SA provider

#### Medium Priority

5. **Staff Availability Management**
   - Staff can set their own availability
   - Request time off
   - Swap shifts with other staff
   - Block off personal appointments

6. **Customer History**
   - View past bookings
   - Rebook previous appointments
   - Favorite staff members
   - Saved payment methods

7. **Advanced Reporting**
   - Revenue forecasting
   - Staff utilization reports
   - Customer retention metrics
   - Export to Excel/PDF

8. **Multi-Location Support**
   - Support multiple business locations
   - Location-specific staff and services
   - Location-based availability

#### Nice to Have

9. **Waitlist Management**
   - Add customers to waitlist for booked slots
   - Auto-notify when slot becomes available
   - Waitlist priority

10. **Loyalty Program**
    - Points per booking
    - Rewards and discounts
    - Tier levels (Silver, Gold, Platinum)

11. **Gift Certificates**
    - Purchase gift cards
    - Redeem during booking
    - Track balance

12. **Multi-Language Support**
    - English, Afrikaans, Zulu support
    - Language selector
    - Translated UI and emails

### Development Workflow for Enhancements

1. **Create feature branch**
   ```bash
   git checkout -b feature/user-authentication
   ```

2. **Database first**
   ```bash
   # Create new migration
   supabase migration new add_user_authentication
   
   # Edit migration file
   # Test locally
   supabase db reset
   ```

3. **Build API layer**
   - Add Edge Function if needed
   - Update `src/lib/database.ts`

4. **Build UI components**
   - Create component files
   - Add to routing
   - Style with Tailwind

5. **Test thoroughly**
   - Test with empty DB
   - Test with seed data
   - Test edge cases

6. **Update documentation**
   - Add to README.md
   - Update CHANGELOG.md

7. **Commit and merge**
   ```bash
   git add .
   git commit -m "feat: add user authentication"
   git push origin feature/user-authentication
   ```

---

## 🚢 Deployment

### Production Checklist

Before deploying to production:

- [ ] **Environment Variables**
  - [ ] `VITE_SUPABASE_URL` set to production URL
  - [ ] `VITE_SUPABASE_ANON_KEY` set to production anon key
  - [ ] All secrets secured (not in repo)

- [ ] **Database**
  - [ ] Production Supabase project created
  - [ ] Migrations applied (`supabase db push`)
  - [ ] seed.sql NOT deployed (Supabase excludes it)
  - [ ] Row Level Security enabled (if using auth)

- [ ] **Build**
  - [ ] Run `npm run build` successfully
  - [ ] No TypeScript errors
  - [ ] No console warnings

- [ ] **Testing**
  - [ ] All features tested in production-like environment
  - [ ] Payment integration tested (if implemented)
  - [ ] Email notifications tested (if implemented)

### Deploy to Supabase

1. **Create production project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and region
   - Set strong database password

2. **Link local project to production**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Push migrations**
   ```bash
   # This only pushes schema (migrations/), NOT seed.sql
   supabase db push
   ```

4. **Deploy Edge Functions**
   ```bash
   supabase functions deploy check-availability
   supabase functions deploy calculate-price
   supabase functions deploy validate-booking
   supabase functions deploy create-booking
   ```

5. **Get production credentials**
   - Go to Settings → API in Supabase dashboard
   - Copy Project URL and anon/public key

### Deploy Frontend

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Set environment variables in Netlify dashboard
```

#### Option 3: Static Hosting (AWS S3, DigitalOcean Spaces, etc.)

```bash
# Build
npm run build

# Upload dist/ folder to your static hosting
# Configure environment variables via build process
```

### Post-Deployment

1. **Add initial business data**
   - Use admin UI to add services
   - Add staff members
   - Configure business hours
   - Set up branding

2. **Test production booking flow**
   - Create test booking
   - Verify email notifications (if implemented)
   - Test payment processing (if implemented)

3. **Monitor**
   - Check Supabase logs for errors
   - Monitor Edge Function performance
   - Track customer booking success rate

### Environment-Specific Configuration

**Local Development:**
```env
# No .env needed - uses default local Supabase
```

**Staging:**
```env
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging_anon_key_here
```

**Production:**
```env
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod_anon_key_here
```

---

## 🛠️ Tech Stack

### Frontend

- **React 18.3.1**: UI library with functional components and hooks
- **TypeScript 5.5.4**: Type-safe JavaScript
- **Vite 5.2.0**: Fast build tool and dev server
- **React Router 6.26.2**: Client-side routing
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Recharts 2.12.7**: Charting library for reports
- **Lucide React 0.522.0**: Icon library
- **date-fns 4.0.0**: Date manipulation utilities

### Backend

- **Supabase 2.75.1**: Backend-as-a-Service
  - PostgreSQL 17.6.1: Relational database
  - PostgREST: Auto-generated REST API
  - Realtime: WebSocket subscriptions
  - Edge Functions: Serverless functions (Deno runtime)
  - Auth: User authentication (future)
  - Storage: File uploads (future)

### Development Tools

- **Docker Desktop**: Required for local Supabase
- **Supabase CLI**: Database migrations and local development
- **ESLint**: Code linting
- **PostCSS**: CSS processing

### Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@supabase/supabase-js": "^2.75.1",
    "recharts": "^2.12.7",
    "lucide-react": "^0.522.0",
    "date-fns": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.15",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.2.0",
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47"
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: Admin page shows blank screen

**Causes:**
- Accessing `/Admin` instead of `/admin` (case-sensitive)
- Supabase not running
- No data in database
- Environment variables missing (production)

**Solutions:**
```bash
# 1. Verify correct URL
# ✅ http://localhost:5173/admin
# ❌ http://localhost:5173/Admin

# 2. Check Supabase status
supabase status

# 3. Start Supabase if not running
supabase start

# 4. Check browser console for errors
# Open DevTools (F12) and check Console tab

# 5. Verify data exists
npm run db:studio
# Check services, staff, bookings tables
```

#### Issue: Database won't reset

**Symptoms:**
- `supabase db reset` hangs
- Error: "Could not connect to database"

**Solutions:**
```bash
# Stop all Supabase containers
supabase stop

# Remove volumes
docker volume prune

# Start fresh
supabase start

# Reset database
npm run db:reset
```

#### Issue: Seed data persists after clean reset

**Cause:** Using `supabase db reset` instead of `npm run db:reset:clean`

**Solution:**
```bash
# Use clean reset script
npm run db:reset:clean

# Verify tables are empty
npm run db:studio
```

#### Issue: "Cannot find module '@supabase/supabase-js'"

**Cause:** Dependencies not installed

**Solution:**
```bash
# Install dependencies
npm install

# Verify installation
npm list @supabase/supabase-js
```

#### Issue: Charts not displaying in Reports

**Causes:**
- No data in date range
- Recharts not installed

**Solutions:**
```bash
# 1. Check date filter
# Default shows current month
# Sample data is in October 2025

# 2. Verify Recharts installed
npm list recharts

# 3. Install if missing
npm install recharts
```

#### Issue: "Network Error" when creating booking

**Causes:**
- Supabase API not reachable
- CORS issue
- Invalid data

**Solutions:**
```bash
# 1. Verify Supabase is running
supabase status

# 2. Check browser console for specific error

# 3. Verify API URL
# Should be http://127.0.0.1:54321 locally

# 4. Test API directly
curl http://127.0.0.1:54321/rest/v1/services \
  -H "apikey: YOUR_ANON_KEY"
```

#### Issue: Real-time updates not working

**Causes:**
- WebSocket connection failed
- Realtime not enabled in Supabase

**Solutions:**
```bash
# 1. Check browser console for WebSocket errors

# 2. Verify Supabase config
cat supabase/config.toml
# Ensure [api] section has:
# enabled = true

# 3. Restart Supabase
supabase stop
supabase start
```

#### Issue: TypeScript errors in editor

**Causes:**
- Missing type definitions
- Incorrect imports

**Solutions:**
```bash
# 1. Restart TypeScript server in VS Code
# Command Palette > TypeScript: Restart TS Server

# 2. Check tsconfig.json
cat tsconfig.json

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

#### Issue: Docker containers not starting

**Solutions:**
```bash
# 1. Check Docker Desktop is running
# Open Docker Desktop app

# 2. Check Docker resources
# Docker Desktop > Settings > Resources
# Ensure sufficient CPU/Memory allocated

# 3. Restart Docker Desktop

# 4. Clean Docker
docker system prune -a --volumes
```

#### Issue: Port already in use

**Symptoms:**
- Error: "Port 54321 already allocated"

**Solutions:**
```bash
# 1. Find process using port
lsof -i :54321

# 2. Kill process
kill -9 <PID>

# 3. Or use different port in supabase/config.toml
# [api]
# port = 54325  # Change port
```

### Performance Issues

#### Issue: Slow database queries

**Solutions:**
```bash
# 1. Check query performance in Supabase Studio
# Go to SQL Editor
# Run EXPLAIN ANALYZE on slow queries

# 2. Add indexes (via migration)
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_staff_id ON bookings(staff_id);

# 3. Limit query results
# Use pagination in admin lists
```

#### Issue: Slow page load

**Solutions:**
```bash
# 1. Check Network tab in browser DevTools
# Identify slow requests

# 2. Optimize component renders
# Use React.memo for expensive components
# Use useMemo for expensive calculations

# 3. Build and test production bundle
npm run build
npm run preview
# Production builds are much faster
```

### Getting Help

If you're still stuck:

1. **Check Supabase Logs**
   ```bash
   supabase logs
   ```

2. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Verify Environment**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 9+
   docker --version
   supabase --version
   ```

4. **Review Documentation**
   - [Supabase Docs](https://supabase.com/docs)
   - [React Router Docs](https://reactrouter.com/)
   - [Tailwind CSS Docs](https://tailwindcss.com/)

5. **Community Support**
   - Supabase Discord: https://discord.supabase.com
   - Stack Overflow: Tag with `supabase`, `react`, `typescript`

---

## 📚 Additional Resources

- **[CHANGELOG.md](./CHANGELOG.md)**: Version history and changes
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)**: AI agent coding guide
- **Supabase Documentation**: https://supabase.com/docs
- **React Documentation**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## 📝 License

This project was generated by [Magic Patterns](https://magicpatterns.com).

---

## ✨ Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or tooling changes

---

**Built with ❤️ for South African businesses**

