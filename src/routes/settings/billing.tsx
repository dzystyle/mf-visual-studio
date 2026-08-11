import { createFileRoute } from '@tanstack/react-router';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { BillingSettings } from '@/components/settings/BillingSettings';

export const Route = createFileRoute('/settings/billing')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      tab: (search.tab as string) || 'credits',
    }
  },
  component: BillingRoute,
});

function BillingRoute() {
  const { tab } = Route.useSearch();
  return (
    <SettingsLayout activeTab={tab}>
      <BillingSettings activeSection={tab as any} />
    </SettingsLayout>
  );
}
