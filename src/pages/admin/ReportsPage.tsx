import React from 'react';
import { AdminLayout } from '../../components/shared/AdminLayout';
import { Reports } from '../../components/admin/Reports';
export const ReportsPage: React.FC = () => {
  return <AdminLayout>
      <Reports />
    </AdminLayout>;
};