# AlphaBooking

A premium, full-featured appointment booking system built with React, TypeScript, and Tailwind CSS. Designed for small service businesses — salons, barbershops, spas, and studios.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment & Configuration](#environment--configuration)
- [Design System](#design-system)
- [Routing](#routing)
- [Data Layer](#data-layer)
- [Contributing](#contributing)
- [Roadmap](#roadmap)

---

## Overview

AlphaBooking is a client-side React SPA that provides:

- A **multi-step customer booking wizard** (service → date/time → stylist → details → payment)
- A **full admin portal** for managing services, staff, appointments, branding, and reports
- **localStorage persistence** so completed bookings survive page refresh
- **ICS calendar export** so customers can add appointments to any calendar app

---

## Features

| Area | What's included |
|---|---|
| Customer flow | 5-step booking wizard with progress bar, validation, and ICS download on confirmation |
| Calendar | Interactive monthly calendar — past dates and blackout dates auto-blocked |
| Services | Selectable service cards with price & duration |
| Staff | Optional stylist selection with photo, bio, and price surcharge |
| Payment form | Card-type detection (Visa / Mastercard / Amex), inline validation |
| Admin dashboard | KPI cards, recent bookings table, quick-action buttons |
| Service management | Full CRUD — add, edit, delete services |
| Staff management | Full CRUD — add, edit, delete staff with service assignments |
| Appointments | Filter by status, month navigation, view details modal, cancel + refund flow, staff assignment |
| Branding | Live-preview colour picker with presets, logo upload/URL, per-day business hours |
| System settings | Notification toggles, payment gateway, currency, cancellation policy, timezone |
| Reports | Revenue bar chart, staff performance line chart, service-mix pie chart, monthly trend table |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev) + [TypeScript 5](https://www.typescriptlang.org) |
| Bundler | [Vite 5](https://vitejs.dev) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) with custom design tokens |
| Routing | [React Router v6](https://reactrouter.com) |
| Charts | [Recharts](https://recharts.org) |
| Icons | [Lucide React](https://lucide.dev) |
| Date utils | [date-fns](https://date-fns.org) |
| State | React Context API |

---

## Project Structure

```
AlphaBooking/
├── public/
├── src/
│   ├── App.tsx                  # Landing page
│   ├── AppRouter.tsx            # Route definitions
│   ├── index.tsx                # Entry point
│   ├── index.css                # Global styles & design-system component classes
│   │
│   ├── context/
│   │   └── BookingContext.tsx   # Global booking state (services, staff, selection, submit)
│   │
│   ├── data/
│   │   ├── mockServices.json
│   │   ├── mockStaff.json
│   │   ├── mockAvailability.json
│   │   └── mockBookings.json
│   │
│   ├── pages/
│   │   ├── customer/
│   │   │   └── BookingFlow.tsx  # Multi-step booking wizard
│   │   └── admin/
│   │       ├── AdminDashboardPage.tsx
│   │       ├── ServiceManagementPage.tsx
│   │       ├── StaffManagementPage.tsx
│   │       ├── AppointmentsPage.tsx
│   │       ├── BrandingCustomizationPage.tsx
│   │       ├── SystemSettingsPage.tsx
│   │       └── ReportsPage.tsx
│   │
│   └── components/
│       ├── customer/
│       │   ├── ServiceSelection.tsx
│       │   ├── CalendarView.tsx
│       │   ├── TimeSlotSelector.tsx
│       │   ├── StaffSelection.tsx
│       │   ├── CustomerForm.tsx
│       │   ├── PaymentForm.tsx
│       │   ├── ConfirmationView.tsx   # includes ICS download
│       │   └── BookingSummary.tsx
│       │
│       ├── admin/
│       │   ├── Dashboard.tsx
│       │   ├── ServiceManagement.tsx
│       │   ├── StaffManagement.tsx
│       │   ├── AppointmentsList.tsx
│       │   ├── AppointmentDetails.tsx
│       │   ├── BrandingCustomization.tsx
│       │   ├── SystemSettings.tsx
│       │   └── Reports.tsx
│       │
│       └── shared/
│           └── AdminLayout.tsx        # Dark sidebar navigation wrapper
│
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (ships with Node 18)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/crespo21/AlphaBooking.git
cd AlphaBooking

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over all `.ts` / `.tsx` files |

---

## Environment & Configuration

AlphaBooking is currently **fully client-side** — no environment variables or backend server are required to run it. All data is loaded from the JSON files in `src/data/`.

### Availability configuration

Edit `src/data/mockAvailability.json` to change:

- `blackoutDates` — ISO date strings (`YYYY-MM-DD`) on which no bookings are available
- `weeklySchedule` — time slots per day of week (`"0"` = Sunday … `"6"` = Saturday)
- `specialDates` — override slots for specific dates (e.g. holiday half-days)

### Services & Staff

Edit `src/data/mockServices.json` and `src/data/mockStaff.json` directly, or use the admin UI at `/admin/services` and `/admin/staff` (changes are in-memory per session).

---

## Design System

AlphaBooking uses a custom **beige & olive** design system built on top of Tailwind CSS.

### Colour tokens

| Token | Hex | Usage |
|---|---|---|
| `venus-600` | `#5F6F2E` | Primary action / olive dark |
| `venus-500` | `#7A8E3B` | Hover / medium olive |
| `venus-400` | `#9BAD55` | Light olive — muted text on dark |
| `venus-50`  | `#F5F0E4` | Page background (customer) |
| `gold-500`  | `#B5944A` | Prices, warm tan accents |
| Admin dark bg | `#151508` | Page background (admin) |
| Admin card    | `#1C1F0A` | Card background (admin) |

### Component classes

Reusable classes defined in `src/index.css` via `@layer components`:

| Class | Description |
|---|---|
| `.btn-venus` | Primary olive gradient button |
| `.btn-venus-pink` | Olive-to-gold gradient button |
| `.btn-outline-venus` | Outlined olive button |
| `.btn-ghost-light` | Transparent button for dark backgrounds |
| `.card-venus` | Light card (customer pages) |
| `.card-dark` | Dark glass card (admin pages) |
| `.input-venus` | Light input field |
| `.input-dark` | Dark input field (admin) |
| `.label-venus` / `.label-dark` | Styled form labels |
| `.section-dark` | Dark section container |
| `.nav-item` / `.nav-item-active` | Admin sidebar nav links |
| `.toggle-venus` | Toggle switch wrapper |

---

## Routing

| Path | Component | Description |
|---|---|---|
| `/` | `App` | Public landing page |
| `/booking` | `BookingFlow` | Customer booking wizard |
| `/admin` | `AdminDashboardPage` | Admin overview |
| `/admin/services` | `ServiceManagementPage` | CRUD services |
| `/admin/staff` | `StaffManagementPage` | CRUD staff |
| `/admin/appointments` | `AppointmentsPage` | View & manage bookings |
| `/admin/branding` | `BrandingCustomizationPage` | Colours, logo, hours |
| `/admin/system-settings` | `SystemSettingsPage` | Notifications, payments, timezone |
| `/admin/reports` | `ReportsPage` | Revenue & performance charts |

---

## Data Layer

All data is mocked client-side. Completed bookings are saved to `localStorage` under the key `alphabooking_bookings` and merged into the admin Appointments list automatically.

To connect a real backend, replace the mock calls in `BookingContext.tsx` (`submitBooking`, `isDateAvailable`, etc.) with `fetch` / `axios` calls and replace JSON imports in admin components with API-fetched state.

---

## Contributing

1. Fork the repo and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and verify the build passes:
   ```bash
   npm run build && npm run lint
   ```
3. Commit with a descriptive message and open a pull request against `main`.

### Code style

- TypeScript strict mode is on — avoid `any` where possible
- Use function components with explicit `React.FC` types
- Inline styles only for dynamic values (e.g. brand colour picker); static design via Tailwind classes
- Comments only when the *why* is non-obvious

---

## Roadmap

- [ ] Backend API integration (Node/Express or Supabase)
- [ ] Customer login portal — lookup & cancel by confirmation number
- [ ] Email confirmations via SendGrid / Resend
- [ ] Stripe payment integration
- [ ] Google Calendar / Outlook OAuth export
- [ ] PWA manifest for mobile home-screen install
- [ ] Print/PDF booking receipt
- [ ] Multi-location support
