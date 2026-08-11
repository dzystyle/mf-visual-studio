import { createFileRoute } from '@tanstack/react-router';
import { SettingsLayout } from '@/components/settings/SettingsLayout';

export const Route = createFileRoute('/settings/account')({
  component: () => (
    <SettingsLayout activeTab="settings">
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>通用设置页面建设中...</p>
      </div>
    </SettingsLayout>
  ),
});
