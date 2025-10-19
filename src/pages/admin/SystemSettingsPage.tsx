import React from 'react';
import { AdminLayout } from '../../components/shared/AdminLayout';
import { SystemSettings } from '../../components/admin/SystemSettings';
export const SystemSettingsPage: React.FC = () => {
  return <AdminLayout>
      <SystemSettings />
    </AdminLayout>;
};