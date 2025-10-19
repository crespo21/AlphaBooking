import React from 'react';
import { AdminLayout } from '../../components/shared/AdminLayout';
import { ServiceManagement } from '../../components/admin/ServiceManagement';
export const ServiceManagementPage: React.FC = () => {
  return <AdminLayout>
      <ServiceManagement />
    </AdminLayout>;
};