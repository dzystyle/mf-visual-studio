import { createFileRoute } from '@tanstack/react-router';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { ApiKeysSettings } from '@/components/settings/ApiKeysSettings';
import { z } from 'zod';

export const Route = createFileRoute('/settings/account')({
  validateSearch: z.object({
    tab: z.string().optional()
  }),
  component: AccountPageComponent,
});

function AccountPageComponent() {
  const { tab } = Route.useSearch();
  const activeTabId = tab === 'api' ? 'api' : 'settings';

  return (
    <SettingsLayout activeTab={activeTabId}>
      {activeTabId === 'api' ? <ApiKeysSettings /> : <AccountSettings />}
    </SettingsLayout>
  );
}
