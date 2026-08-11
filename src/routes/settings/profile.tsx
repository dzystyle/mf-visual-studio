import { createFileRoute } from '@tanstack/react-router';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { ProfileSettings } from '@/components/settings/ProfileSettings';

export const Route = createFileRoute('/settings/profile')({
  component: () => (
    <SettingsLayout activeTab="profile">
      <ProfileSettings />
    </SettingsLayout>
  ),
});
