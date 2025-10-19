import React from 'react';
import { AdminLayout } from '../../components/shared/AdminLayout';
import { BrandingCustomization } from '../../components/admin/BrandingCustomization';
export const BrandingCustomizationPage: React.FC = () => {
  return <AdminLayout>
      <BrandingCustomization />
    </AdminLayout>;
};