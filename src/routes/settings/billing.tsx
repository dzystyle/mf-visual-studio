import { createFileRoute } from '@tanstack/react-router';
import { SettingsLayout } from '@/components/settings/SettingsLayout';

export const Route = createFileRoute('/settings/billing')({
  component: () => (
    <SettingsLayout activeTab="credits">
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>积分详情与账单页面建设中...</p>
      </div>
    </SettingsLayout>
  ),
});
