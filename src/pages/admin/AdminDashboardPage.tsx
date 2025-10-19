import React from 'react';
import { AdminLayout } from '../../components/shared/AdminLayout';
import { Dashboard } from '../../components/admin/Dashboard';
export const AdminDashboardPage: React.FC = () => {
  return <AdminLayout>
      <Dashboard />
    </AdminLayout>;
};