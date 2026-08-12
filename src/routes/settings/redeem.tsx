import { createFileRoute } from '@tanstack/react-router';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { RedeemCode } from '@/components/settings/RedeemCode';

export const Route = createFileRoute('/settings/redeem')({
  component: () => (
    <SettingsLayout activeTab="redeem">
      <RedeemCode />
    </SettingsLayout>
  ),
});
