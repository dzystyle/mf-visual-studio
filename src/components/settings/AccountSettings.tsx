import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function AccountSettings() {
  return (
    <div className="mx-auto max-w-2xl space-y-12 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">设置</h2>
      </div>

      <div className="space-y-8">
        {/* Notifications */}
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <div className="space-y-1">
            <div className="text-sm font-medium text-white">任务完成通知:</div>
            <div className="text-xs text-white/40">当 Artrail 的项目文件切换到后台时，允许 Artrail 在任务完成后向用户发送通知。</div>
          </div>
          <Switch className="data-[state=checked]:bg-primary" />
        </div>

        {/* Credit Alert */}
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <div className="space-y-1">
            <div className="text-sm font-medium text-white">大额积分消耗提醒:</div>
            <div className="text-xs text-white/40">单次任务超过 1000 积分，将提醒是否继续。</div>
          </div>
          <Switch defaultChecked className="data-[state=checked]:bg-primary" />
        </div>

        {/* Platform Usage */}
        <div className="flex items-center justify-between border-b border-white/5 pb-8">
          <div className="space-y-1">
            <div className="text-sm font-medium text-white">Seedance 2.0 4K&1080p 平台使用提醒:</div>
            <div className="text-xs text-white/40">配置平台识别到会使用 Seedance 2.0 4K&1080p 时的默认处理方式。</div>
          </div>
          <Select defaultValue="ask">
            <SelectTrigger className="w-[160px] border-white/10 bg-white/5 text-xs text-white">
              <SelectValue placeholder="选择方式" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#18181b] text-white">
              <SelectItem value="ask">每个项目都询问</SelectItem>
              <SelectItem value="always">始终允许</SelectItem>
              <SelectItem value="never">从不允许</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hotkeys */}
        <div className="space-y-4 pt-4">
          <div className="text-sm font-medium text-white">快捷键设置:</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/40">消息发送操作</span>
              <div className="flex h-10 w-32 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-white/60">
                ⌘ + Enter
              </div>
            </div>
            <Button variant="outline" className="h-10 rounded-full border-white/10 bg-white text-black hover:bg-white/90">
              重置该快捷键
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
