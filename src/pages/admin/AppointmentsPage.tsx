import React from 'react';
import { AdminLayout } from '../../components/shared/AdminLayout';
import { AppointmentsList } from '../../components/admin/AppointmentsList';
export const AppointmentsPage: React.FC = () => {
  return <AdminLayout>
      <AppointmentsList />
    </AdminLayout>;
};