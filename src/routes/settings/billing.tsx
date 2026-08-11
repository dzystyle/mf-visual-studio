import { createFileRoute } from '@tanstack/react-router';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { BillingSettings } from '@/components/settings/BillingSettings';

export const Route = createFileRoute('/settings/billing')({
  component: () => (
    <SettingsLayout activeTab="credits">
      <BillingSettings />
    </SettingsLayout>
  ),
});
