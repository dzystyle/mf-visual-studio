import React from 'react';
import { Search, RotateCcw, Gift, Info, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type BillingSection = 'credits' | 'invoices' | 'pricing';

interface BillingSettingsProps {
  activeSection?: BillingSection;
}

export function BillingSettings({ activeSection = 'credits' }: BillingSettingsProps) {
  const transactions = [
    { name: '赛博朋克主角登场', type: 'video', time: '2026.08.10 20:49', amount: -329 },
    { name: '探索奖励积分已添加', type: 'reward', time: '2026.08.10 20:28', amount: 10, isPositive: true },
    { name: 'Subscription Bonus Credits', type: 'bonus', time: '2026.08.10 20:23', amount: 400, isPositive: true },
    { name: 'Starter', type: 'purchase', time: '2026.08.10 20:23', amount: 2000, isPositive: true },
    { name: 'Weekly Credits expired', type: 'expiry', time: '2026.06.22 00:00', amount: -200 },
    { name: 'Weekly Credits refreshed', type: 'refresh', time: '2026.06.18 15:35', amount: 200, isPositive: true },
  ];

  const invoices = [
    { id: 'INV-2026-001', date: '2026.08.10', amount: '¥140.00', status: '已支付', plan: 'Starter' },
    { id: 'INV-2026-002', date: '2026.07.10', amount: '¥140.00', status: '已支付', plan: 'Starter' },
  ];

  const renderCredits = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center relative">
        <h2 className="text-2xl font-bold text-white">积分详情</h2>
        <Button variant="ghost" className="absolute right-0 top-0 h-9 rounded-lg border border-[#FFB800]/20 bg-[#FFB800]/5 text-[#FFB800] hover:bg-[#FFB800]/10 hover:text-[#FFB800]">
          <Gift className="mr-2 h-4 w-4" />
          兑换码
        </Button>
      </div>

      <div className="flex items-center justify-center gap-16 py-8">
        <div className="text-center space-y-2">
          <div className="text-sm text-white/40">积分余额</div>
          <div className="text-3xl font-bold text-white">2,081</div>
        </div>
        <div className="text-2xl text-white/20">=</div>
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-sm text-white/40">
            会员积分 <Info className="h-3 w-3" />
          </div>
          <div className="text-3xl font-bold text-white">2,081</div>
        </div>
        <div className="text-2xl text-white/20">+</div>
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-sm text-white/40">
            奖励积分 <Info className="h-3 w-3" />
          </div>
          <div className="text-3xl font-bold text-white">0</div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-white/5 p-1">
          <button className="rounded-lg bg-white/10 px-8 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200">全部</button>
          <button className="px-8 py-2 text-sm font-medium text-white/40 hover:text-white/60 transition-all duration-200">已消耗</button>
          <button className="px-8 py-2 text-sm font-medium text-white/40 hover:text-white/60 transition-all duration-200">已获得</button>
        </div>
      </div>

      <div className="space-y-1">
        {transactions.map((t, idx) => (
          <div key={idx} className="flex items-center justify-between border-b border-white/5 py-5 group hover:bg-white/[0.02] px-4 -mx-4 transition-all duration-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                {t.name}
                {t.type === 'video' && <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Video</span>}
              </div>
              <div className="text-xs text-white/20">{t.time}</div>
            </div>
            <div className={cn(
              "text-sm font-bold",
              t.isPositive ? "text-green-400" : "text-white/60"
            )}>
              {t.isPositive ? '+' : ''} {t.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">订单发票</h2>
        <p className="mt-2 text-sm text-white/40">查看并下载您的历史支付订单和发票。</p>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-4 px-4 py-3 text-xs font-medium text-white/20 uppercase tracking-wider border-b border-white/5">
          <div>日期</div>
          <div>套餐类型</div>
          <div>金额</div>
          <div className="text-right">状态 / 操作</div>
        </div>
        {invoices.map((inv, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-4 items-center px-4 py-5 group hover:bg-white/[0.02] transition-all duration-200 border-b border-white/5">
            <div className="text-sm text-white/80">{inv.date}</div>
            <div className="text-sm text-white/80 font-medium">{inv.plan}</div>
            <div className="text-sm text-white/80">{inv.amount}</div>
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400">{inv.status}</span>
              <button className="text-white/40 hover:text-white transition-colors">
                <FileText className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">价格详情</h2>
        <p className="mt-2 text-sm text-white/40">了解 Artrail 的积分消耗规则和各模型定价。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">视频生成</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Seedance 2.5 (480p)</span>
              <span className="text-white">约 2 积分 / 秒</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Seedance 2.5 (720p)</span>
              <span className="text-white">约 5 积分 / 秒</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Seedance 2.5 (1080p)</span>
              <span className="text-white">约 10 积分 / 秒</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">图像生成</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Standard 模型</span>
              <span className="text-white">5 积分 / 张</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">High Quality 模型</span>
              <span className="text-white">15 积分 / 张</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center">
        <p className="text-sm text-white/40 mb-4">更多详细定价规则请查阅官方完整文档。</p>
        <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white">
          查看完整模型价格表
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl">
      {activeSection === 'credits' && renderCredits()}
      {activeSection === 'invoices' && renderInvoices()}
      {activeSection === 'pricing' && renderPricing()}
    </div>
  );
}
