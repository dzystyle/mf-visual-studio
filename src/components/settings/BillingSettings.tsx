import React, { useState } from 'react';
import { Search, RotateCcw, Gift, Info, FileText, ExternalLink, RefreshCw, HelpCircle, LayoutGrid, Trash2, Mail, FileCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


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

  const [showManageInvoice, setShowManageInvoice] = useState(false);

  const renderInvoices = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center relative">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-2xl font-bold text-white">订单发票</h2>
          <HelpCircle className="h-4 w-4 text-white/20 cursor-help" />
        </div>
        <p className="mt-2 text-sm text-white/40">查看订阅和积分充值购买记录，管理常用发票信息，并为符合条件的订单开发票。</p>
        
        <Button 
          variant="ghost" 
          onClick={() => setShowManageInvoice(true)}
          className="absolute right-0 top-0 h-9 rounded-lg border border-[#FFD700]/20 bg-[#FFD700]/5 text-[#FFD700] hover:bg-[#FFD700]/10 hover:text-[#FFD700]"
        >
          <LayoutGrid className="mr-2 h-4 w-4" />
          发票信息管理
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">购买记录明细</h3>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-white/40 border border-white/5">
              1 条记录
            </div>
            <button className="p-1.5 rounded-full bg-white/5 text-white/40 hover:text-white transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-white/20 uppercase tracking-[0.1em] border-b border-white/5">
                <th className="text-left py-4 font-medium">购买类型</th>
                <th className="text-left py-4 font-medium">具体商品</th>
                <th className="text-left py-4 font-medium">支付金额</th>
                <th className="text-left py-4 font-medium">购买时间</th>
                <th className="text-right py-4 font-medium">开发票</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={idx} className="group border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                  <td className="py-6 text-sm text-white font-medium">订阅</td>
                  <td className="py-6 text-sm text-white font-medium">{inv.plan}</td>
                  <td className="py-6 text-sm text-white font-medium">{inv.amount}</td>
                  <td className="py-6 text-sm text-white/40">{inv.date} 20:23</td>
                  <td className="py-6 text-right">
                    <Button 
                      variant="outline" 
                      className="h-8 rounded-full bg-white text-black hover:bg-white/90 border-none px-4 text-xs font-bold"
                    >
                      <FileCheck className="mr-1.5 h-3.5 w-3.5" />
                      开发票
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceManagementDialog open={showManageInvoice} onOpenChange={setShowManageInvoice} />
    </div>
  );

  function InvoiceManagementDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const [type, setType] = useState<'individual' | 'company'>('company');
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[680px] bg-[#1a1a1e] border-white/5 text-white p-0 overflow-hidden rounded-[32px]">
          <DialogHeader className="p-8 pb-0 flex flex-row items-center justify-center relative">
            <DialogTitle className="text-2xl font-bold">发票信息管理</DialogTitle>
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute right-8 top-8 p-1.5 rounded-full bg-white/5 text-white/40 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogHeader>
          
          <div className="p-8 pt-4 space-y-8 overflow-y-auto max-h-[80vh] scrollbar-hide">
            <p className="text-sm text-white/40 text-center">最多可保存 5 个发票信息。发票收取邮箱默认使用 Artrail 账号邮箱，可自行修改。</p>
            
            <div className="space-y-6 rounded-[24px] bg-white/[0.02] p-6 border border-white/5">
              <div className="space-y-2">
                <Label className="text-xs text-white/40">开票类型</Label>
                <div className="flex p-1 rounded-xl bg-white/5">
                  <button 
                    onClick={() => setType('company')}
                    className="flex-1 py-2 text-sm font-medium rounded-lg transition-all bg-white text-black text-center"
                  >
                    公司
                  </button>
                </div>
              </div>

              {type === 'company' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs text-white/40">企业全称</Label>
                    <Input placeholder="请输入企业全称" className="h-12 bg-white/5 border-white/5 rounded-xl text-white placeholder:text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-white/40">统一社会信用代码</Label>
                    <Input placeholder="请输入统一社会信用代码" className="h-12 bg-white/5 border-white/5 rounded-xl text-white placeholder:text-white/20" />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label className="text-xs text-white/40">发票收取邮箱</Label>
                <Input defaultValue="yangdu776@gmail.com" className="h-12 bg-white/5 border-white/5 rounded-xl text-white" />
              </div>

              <Button className="w-full h-12 rounded-full bg-white/10 text-white hover:bg-white/15 transition-all text-sm font-bold">
                新增发票信息
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-sm font-medium text-white/60">已保存发票信息</h4>
                <span className="text-xs text-white/20">2/5</span>
              </div>

              <div className="space-y-3">
                <div className="group relative rounded-[20px] bg-white/[0.02] p-5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">北京国王互娱文化科技有限公司</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/20 uppercase tracking-wider">公司</span>
                      </div>
                      <div className="space-y-1 text-xs text-white/40">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" /> yangdu776@gmail.com
                        </div>
                        <div className="flex items-center gap-2 pl-5">
                          税号：91110108MADK217N5G
                        </div>
                        <div className="flex items-center gap-2 pl-5">
                          保存时间：2026年7月1日 17:02
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/5 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="group relative rounded-[20px] bg-white/[0.02] p-5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">杜致阳</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/20 uppercase tracking-wider">个人</span>
                      </div>
                      <div className="space-y-1 text-xs text-white/40">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" /> yangdu776@gmail.com
                        </div>
                        <div className="flex items-center gap-2 pl-5">
                          保存时间：2026年6月27日 13:02
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/5 transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
