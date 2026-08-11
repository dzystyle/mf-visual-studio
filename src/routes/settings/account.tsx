import { createFileRoute } from '@tanstack/react-router';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { AccountSettings } from '@/components/settings/AccountSettings';

export const Route = createFileRoute('/settings/account')({
  component: () => (
    <SettingsLayout activeTab="settings">
      <AccountSettings />
    </SettingsLayout>
  ),
});
