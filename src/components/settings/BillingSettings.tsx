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

  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <div className="text-center relative">
        <h2 className="text-2xl font-bold text-white">积分详情</h2>
        <Button variant="ghost" className="absolute right-0 top-0 h-9 rounded-lg border border-[#FFB800]/20 bg-[#FFB800]/5 text-[#FFB800] hover:bg-[#FFB800]/10 hover:text-[#FFB800]">
          <Gift className="mr-2 h-4 w-4" />
          兑换码
        </Button>
      </div>

      {/* Credit Overview */}
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

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-white/5 p-1">
          <button className="rounded-lg bg-white/10 px-8 py-2 text-sm font-medium text-white shadow-sm">全部</button>
          <button className="px-8 py-2 text-sm font-medium text-white/40 hover:text-white/60">已消耗</button>
          <button className="px-8 py-2 text-sm font-medium text-white/40 hover:text-white/60">已获得</button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-1">
        {transactions.map((t, idx) => (
          <div key={idx} className="flex items-center justify-between border-b border-white/5 py-5 group hover:bg-white/[0.02] px-4 -mx-4 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                {t.name}
                {t.type === 'video' && <span className="text-[10px] text-white/20">v</span>}
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
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
