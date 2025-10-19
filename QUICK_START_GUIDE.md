# Alpha Bookings - Quick Start Guide

## Running the Application

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

## Testing the New Features

### 1. Currency (ZAR)
**Where to Check:**
- Customer booking flow: Select any service to see prices in R (Rand)
- Admin → Appointments: View the "Price" column
- Admin → Reports: All financial metrics display in ZAR
- Admin → System Settings: Default currency set to ZAR

**Expected Result:** All prices display with "R" prefix (e.g., R250.00)

---

### 2. Enhanced Reports
**How to Test:**
1. Navigate to Admin Dashboard
2. Click "View All Reports" button (bottom right)
3. Try different filters:
   - Change time period (Day, Week, Month, Year, Custom)
   - Filter by staff member
   - Select custom date range
4. Observe:
   - Total Revenue, Cancelled Orders, Average Rating
   - Revenue & Cancellations bar chart
   - Staff Performance line chart
   - Service Distribution pie chart
   - Customer Reviews section
   - Detailed breakdown table

**Expected Result:** All charts update dynamically, metrics recalculate based on filters

---

### 3. Branding Page Enhancements
**How to Test:**
1. Navigate to Admin → Branding
2. **Business Hours:**
   - Toggle days on/off
   - Change opening/closing times
   - View changes in "Business Hours Preview" section
3. **Logo Upload:**
   - Click "Upload from device" button
   - OR enter a URL in the URL input field
   - See logo update in preview immediately
4. **Live Preview:**
   - Change primary color
   - Click on different staff members in preview
   - See staff selection work like customer view

**Expected Result:** 
- Real-time preview updates
- Logo displays properly
- Business hours show configured times
- Staff selection works interactively

---

### 4. Appointment Details Drill-Down
**How to Test:**
1. Navigate to Admin → Appointments
2. Click "Details" button on any appointment
3. View full appointment information:
   - Customer details
   - Service information
   - Staff member (or assignment option)
   - Payment status
   - Total price in ZAR
4. **For appointments with "Any Available" staff:**
   - Select a staff member from dropdown
   - Click checkmark to assign
5. **For confirmed appointments:**
   - Click "Cancel & Refund" button
   - Confirm cancellation
   - Enter refund amount (up to total price)
   - Click "Process Refund"

**Expected Result:** 
- Modal opens with complete details
- Staff assignment works
- Cancellation flow completes with refund

---

### 5. Navigation
**How to Test:**
1. **From Dashboard:**
   - Click "System Settings" button → Goes to System Settings page
   - Click "Manage Appointments" button → Goes to Appointments page
   - Click "View All Reports" button → Goes to Reports page
2. **Sidebar Navigation:**
   - Click any menu item in sidebar
   - Page changes without browser navigation
   - Active page is highlighted
3. **Mobile Navigation:**
   - Resize browser to mobile width
   - Click hamburger menu icon
   - Navigate to different pages
4. **Customer Booking:**
   - Go to /booking
   - Use "Back" and "Continue" buttons
   - Progress through booking steps

**Expected Result:** 
- All navigation works without browser back button
- Sidebar highlights active page
- Mobile menu works properly
- Booking flow navigation is smooth

---

### 6. System Settings
**How to Test:**
1. Navigate to Admin → Settings (or click "System Settings" from Dashboard)
2. Check currency dropdown - ZAR should be selected by default
3. Check timezone - "South Africa (SAST)" should be selected
4. Modify any settings
5. Click "Save Settings"

**Expected Result:** 
- ZAR and South African timezone are defaults
- Settings save successfully
- Confirmation message appears

---

## Test Data Overview

### Services
- Basic Haircut: R250.00 (30 min)
- Premium Styling: R550.00 (60 min)
- Beard Trim: R120.00 (15 min)

### Staff Members
- Alex Johnson: +R40 surcharge
- Sam Rivera: +R20 surcharge
- Jordan Taylor: +R60 surcharge

### Sample Bookings
The app includes 6 sample bookings:
- 4 confirmed appointments
- 2 cancelled appointments (with refunds)
- Some with reviews and ratings
- One with "Any Available" staff (for testing assignment)

### Mock Reviews
- Booking 1: 5 stars, "Excellent service! Very professional."
- Booking 2: 4 stars, "Great styling, will come back!"
- Booking 5: 5 stars, "Amazing experience! Highly recommend Alex."

---

## Key Pages to Test

| Page | URL | What to Test |
|------|-----|--------------|
| Landing | `/` | Links to booking and admin |
| Customer Booking | `/booking` | Full booking flow with ZAR prices |
| Admin Dashboard | `/admin` | Navigation buttons, recent bookings |
| Appointments | `/admin/appointments` | List, filters, details modal, staff assignment |
| Reports | `/admin/reports` | All metrics, charts, filters, reviews |
| Branding | `/admin/branding` | Logo upload, business hours, live preview |
| System Settings | `/admin/system-settings` | ZAR currency, SA timezone |
| Services | `/admin/services` | Service management |
| Staff | `/admin/staff` | Staff management |

---

## Troubleshooting

### Issue: Charts not displaying
**Solution:** Ensure recharts is installed: `npm install recharts`

### Issue: Date picker not working
**Solution:** Ensure date-fns is installed: `npm install date-fns`

### Issue: Icons not showing
**Solution:** Ensure lucide-react is installed: `npm install lucide-react`

### Issue: Logo upload preview shows broken image
**Solution:** This is expected if URL is invalid. Use a valid image URL or upload a file.

### Issue: Reports showing "No data"
**Solution:** Adjust date filter to include current dates (October 2025)

---

## Quick Navigation Shortcuts

- **Customer Booking:** Click "Book Now" from landing page
- **Admin Dashboard:** Click "Admin" from landing page or navigate to `/admin`
- **Reports:** Dashboard → "View All Reports" button
- **System Settings:** Dashboard → "System Settings" button
- **Appointments:** Dashboard → "Manage Appointments" or sidebar → "Appointments"

---

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Development Notes

- All prices are in ZAR (South African Rand)
- Phone numbers use SA format (+27)
- Timezone defaults to Africa/Johannesburg
- Mock data includes realistic booking scenarios
- All navigation uses React Router (no hard refreshes)

---

## Questions or Issues?

If you encounter any issues or have questions about the new features:
1. Check the IMPLEMENTATION_SUMMARY.md file
2. Review the code comments in modified components
3. Verify all dependencies are installed (`npm install`)
4. Clear browser cache and restart dev server

**Happy Testing! 🎉**
