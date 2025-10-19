import React from 'react';
import { AdminLayout } from '../../components/shared/AdminLayout';
import { StaffManagement } from '../../components/admin/StaffManagement';
export const StaffManagementPage: React.FC = () => {
  return <AdminLayout>
      <StaffManagement />
    </AdminLayout>;
};