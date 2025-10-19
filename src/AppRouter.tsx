import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { BookingProvider } from './context/BookingContext';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AppointmentsPage } from './pages/admin/AppointmentsPage';
import { BrandingCustomizationPage } from './pages/admin/BrandingCustomizationPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { ServiceManagementPage } from './pages/admin/ServiceManagementPage';
import { StaffManagementPage } from './pages/admin/StaffManagementPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';
import { BookingFlow } from './pages/customer/BookingFlow';
export function AppRouter() {
  return <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/booking" element={<BookingFlow />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/services" element={<ServiceManagementPage />} />
          <Route path="/admin/staff" element={<StaffManagementPage />} />
          <Route path="/admin/appointments" element={<AppointmentsPage />} />
          <Route path="/admin/branding" element={<BrandingCustomizationPage />} />
          <Route path="/admin/system-settings" element={<SystemSettingsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
        </Routes>
      </BookingProvider>
    </BrowserRouter>;
}