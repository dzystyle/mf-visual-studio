import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Check, Play, Info, ChevronDown, Minus, Plus as PlusIcon, HelpCircle, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CreditPurchaseDialog } from "./subscription/CreditPurchaseDialog";

export function SubscriptionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [activeTab, setActiveTab] = React.useState<"personal" | "team">("team");
  const [personalCycle, setPersonalCycle] = React.useState<"month" | "year">("month");
  const [teamCycle, setTeamCycle] = React.useState<"1month" | "3month" | "1year">("1month");
  const [showCreditPurchase, setShowCreditPurchase] = React.useState(false);

  const personalPlans = React.useMemo(() => {
    const multiplier = personalCycle === "year" ? 10 : 1; // Simplify for demo
    const discount = personalCycle === "year" ? 0.83 : 1;
    
    return [
      { name: "Starter", basePrice: 140, baseCredits: 2000, extra: 400, bonus: "多送20%", concurrency: 10 },
      { name: "Basic", basePrice: 350, baseCredits: 5000, extra: 1500, bonus: "多送30%", concurrency: 20 },
      { name: "Plus", basePrice: 700, baseCredits: 10000, extra: 4000, bonus: "多送40%", concurrency: 50, vip: true },
      { name: "Pro", basePrice: 1400, baseCredits: 20000, extra: 10000, bonus: "多送50%", concurrency: 80, vip: true },
    ].map(plan => ({
      ...plan,
      price: Math.round(plan.basePrice * discount),
      credits: `${plan.baseCredits * (personalCycle === "year" ? 2 : 1.5)} + ${plan.extra}`
    }));
  }, [personalCycle]);

  const teamPlans = React.useMemo(() => {
    let multiplier = 1;
    let discount = 1;
    
    if (teamCycle === "3month") {
      multiplier = 3.5; // Demo values
      discount = 0.95;
    } else if (teamCycle === "1year") {
      multiplier = 14;
      discount = 0.83;
    }

    const plans: any[] = [
      { name: "Starter Team", basePrice: 160, baseCredits: 2000, extra: 400, bonus: "多送20%", concurrency: 20, single: 7, avatars: 5 },
      { name: "Basic Team", basePrice: 400, baseCredits: 5000, extra: 1500, bonus: "多送30%", concurrency: 40, single: 10, avatars: 10 },
      { name: "Plus Team", basePrice: 800, baseCredits: 10000, extra: 4000, bonus: "多送40%", concurrency: 80, single: 15, avatars: 20 },
      { name: "Pro Team", basePrice: 1600, baseCredits: 20000, extra: 10000, bonus: "多送50%", concurrency: 100, single: 20, avatars: 30 },
    ];

    if (teamCycle === "1month") {
      return plans.map(plan => ({
        ...plan,
        price: plan.basePrice,
        credits: `${plan.baseCredits} + ${plan.extra}`,
        bonus: plan.bonus
      }));
    } else if (teamCycle === "3month") {
      return plans.map(plan => ({
        ...plan,
        price: plan.basePrice * 3,
        credits: `${plan.baseCredits} + ${plan.extra}`,
        bonus: plan.bonus
      }));
    } else {
      // 1year
      const yearBonus = ["多送40%", "多送60%", "多送80%", "多送100%"];
      const yearExtra = [800, 3000, 8000, 20000];
      return plans.map((plan, idx) => ({
        ...plan,
        price: plan.basePrice * 10,
        credits: `${plan.baseCredits} + ${yearExtra[idx]}`,
        bonus: yearBonus[idx]
      }));
    }
  }, [teamCycle]);

  return (
    <>
    <CreditPurchaseDialog open={showCreditPurchase} onOpenChange={setShowCreditPurchase} />
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto border-border bg-[#0D0D0D] p-0 text-foreground scrollbar-hide">
        <div className="relative pb-20">
          {/* Header Section */}
          <div className="mx-auto max-w-[1100px] px-6 pt-10">
            <div className="mb-12 rounded-3xl bg-gradient-to-r from-[#1A1A1A] to-[#0D0D0D] p-8 border border-white/5 flex items-center justify-between shadow-2xl">
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-[#E6B380]">Seedance 2.5 满血版上线，积分限时买一送一</h2>
                  <p className="text-lg font-bold text-white">480p 再享 5.3 折，低至 ¥ 0.23/秒</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">解锁完整的视频 Agent:</span>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-white/60 border border-white/10 flex items-center gap-1.5"><Users className="h-3 w-3" /> 团队版</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-white/60 border border-white/10 flex items-center gap-1.5"><LayoutGrid className="h-3 w-3" /> Agent Skills</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-white/60 border border-white/10 flex items-center gap-1.5"><Monitor className="h-3 w-3" /> Agent 画布</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-white/60 border border-white/10 flex items-center gap-1.5"><Key className="h-3 w-3" /> CLI</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <CountdownItem value="05" label="日" />
                <CountdownItem value="01" label="时" />
                <CountdownItem value="07" label="分" />
                <CountdownItem value="28" label="秒" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-center mb-10 tracking-tight">Artrail - 价格与套餐</h1>

            <div className="flex justify-center mb-12">
              <div className="flex border-b border-white/10 w-full max-w-md relative">
                <button 
                  onClick={() => setActiveTab("personal")}
                  className={cn(
                    "flex-1 pb-4 text-sm font-bold transition-all relative",
                    activeTab === "personal" ? "text-white" : "text-white/40"
                  )}
                >
                  个人版
                  {activeTab === "personal" && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#E6B380] shadow-[0_0_10px_rgba(230,179,128,0.5)]" />}
                </button>
                <button 
                  onClick={() => setActiveTab("team")}
                  className={cn(
                    "flex-1 pb-4 text-sm font-bold transition-all relative",
                    activeTab === "team" ? "text-white" : "text-white/40"
                  )}
                >
                  团队版 <span className="text-[10px] opacity-40 font-normal ml-1">(均支持真人合规生成)</span>
                  {activeTab === "team" && <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#E6B380] shadow-[0_0_10px_rgba(230,179,128,0.5)]" />}
                </button>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-[1100px] px-6">
            {activeTab === "personal" ? (
              <>
                {/* Personal Toggle */}
                <div className="mb-8 flex justify-center items-center gap-6">
                  <div className="flex items-center gap-4 rounded-full bg-white/5 p-1">
                    <button 
                      onClick={() => setPersonalCycle("month")}
                      className={cn("rounded-full px-4 py-1.5 text-xs transition", personalCycle === "month" ? "bg-white/10 text-white" : "text-white/40")}
                    >
                      连续包月 <span className="text-[#E6B380] ml-1">(赠50%积分)</span>
                    </button>
                    <button 
                      onClick={() => setPersonalCycle("year")}
                      className={cn("rounded-full px-4 py-1.5 text-xs transition", personalCycle === "year" ? "bg-white/10 text-white" : "text-white/40")}
                    >
                      连续包年 <span className="text-[#E6B380] ml-1">(赠100%积分·省17%)</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowCreditPurchase(true)}
                    className="flex items-center gap-2 text-xs text-white/60 hover:text-white"
                  >
                    <div className="h-4 w-4 rounded bg-white/10 flex items-center justify-center">
                      <PlusIcon className="h-2 w-2" />
                    </div>
                    个人版会员积分购买
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {personalPlans.map(plan => (
                    <PersonalCard 
                      key={plan.name}
                      name={plan.name} 
                      price={plan.price} 
                      credits={plan.credits} 
                      bonus={plan.bonus} 
                      features={getPersonalFeatures(plan.concurrency, plan.vip)} 
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Team Cycle Toggle */}
                <div className="mb-8 flex justify-center items-center gap-6">
                  <div className="flex items-center gap-4 rounded-full bg-white/5 p-1">
                    <button 
                      onClick={() => setTeamCycle("1month")}
                      className={cn("rounded-full px-4 py-1.5 text-xs transition", teamCycle === "1month" ? "bg-white/10 text-white" : "text-white/40")}
                    >
                      1个月 <span className="text-[#E6B380] ml-1">(赠50%积分)</span>
                    </button>
                    <button 
                      onClick={() => setTeamCycle("3month")}
                      className={cn("rounded-full px-4 py-1.5 text-xs transition", teamCycle === "3month" ? "bg-white/10 text-white" : "text-white/40")}
                    >
                      3个月 <span className="text-[#E6B380] ml-1">(赠50%积分)</span>
                    </button>
                    <button 
                      onClick={() => setTeamCycle("1year")}
                      className={cn("rounded-full px-4 py-1.5 text-xs transition", teamCycle === "1year" ? "bg-white/10 text-white" : "text-white/40")}
                    >
                      1年 <span className="text-[#E6B380] ml-1">(赠100%积分·省17%)</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowCreditPurchase(true)}
                    className="flex items-center gap-2 text-xs text-white/60 hover:text-white"
                  >
                    <div className="h-4 w-4 rounded bg-white/10 flex items-center justify-center">
                      <PlusIcon className="h-2 w-2" />
                    </div>
                    团队版会员积分购买
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {teamPlans.map(plan => (
                    <TeamCard 
                      key={plan.name}
                      name={plan.name} 
                      price={plan.price} 
                      credits={plan.credits} 
                      bonus={plan.bonus} 
                      features={getTeamFeatures(plan.concurrency, plan.single, plan.avatars)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* FAQ Section */}
          <div className="mx-auto mt-24 max-w-4xl px-6">
            <h2 className="mb-10 text-center text-xl font-bold text-foreground">Artrail 订阅与积分常见问题</h2>
            <Accordion type="single" collapsible className="w-full space-y-4 border-none">
              <FaqItem 
                id="q1" 
                num="1" 
                title="什么是积分（credits），我如何获得？" 
                content={
                  <div className="space-y-3 text-white/60 text-xs">
                    <p>• 积分是 Artrail 平台的标准计量单位。当你通过对话、故事板或其他创作工具开始创作时，系统会根据所使用的模型类型、生成时长、分辨率及其他相关参数自动扣除相应积分。</p>
                    <p>• 你可以通过两种方式获取积分：</p>
                    <div className="pl-4 space-y-2">
                      <p>• <span className="text-white">订阅获取积分</span> 订阅任意会员后，可获取固定额度的月度积分，有效期为 30 天；</p>
                      <p>• <span className="text-white">免费与奖励积分</span></p>
                      <ul className="pl-4 space-y-1">
                        <li>• 邀请奖励积分（Invite Bonus Credits）：成功邀请用户注册后获取，有效期 7 天；</li>
                        <li>• 探索使用奖励（Exploration Bonus Credits）：使用 Artrail 制作视频，在中间步骤可获得探索使用奖励，有效期 30 天；</li>
                        <li>• 超创奖励积分与活动奖励积分（Super Creator / Event Bonus Credits）：其发放数量及有效期将根据具体的社区计划及运营活动规则进行设置。</li>
                      </ul>
                    </div>
                    <p className="mt-2 text-[10px] italic">⚠️ 积分规则、奖励政策及相关活动机制可能会根据运营需要进行调整，调整可在提前通知或不提前通知的情况下进行。在法律允许范围内，Artrail 保留相关规则的最终解释权。</p>
                  </div>
                } 
              />
              <FaqItem 
                id="q2" 
                num="2" 
                title="积分在使用过程中如何扣除？" 
                content={
                  <div className="space-y-3 text-white/60 text-xs">
                    <p>• <span className="text-white">积分计费规则：</span>积分的具体消耗以《模型价格表》为准。</p>
                    <p>• <span className="text-white">访问方式：</span>鼠标悬停在右上角 → 管理账号 → 价格详情 → 模型价格表</p>
                    <p>• <span className="text-white">积分扣除顺序：</span>系统将优先扣除更快到期的积分，以最大程度保障你的积分使用权益。</p>
                    <p>• <span className="text-white">积分规则详情见“价格详情”，访问路径：</span></p>
                    <ul className="pl-4 space-y-1">
                      <li>• 右上角hover-查看用量-价格详情；</li>
                      <li>• 右上角hover-管理账号-价格详情；</li>
                    </ul>
                    <p className="mt-2 text-[10px] italic">⚠️ 免费使用期间将启用防刷与防自动化滥用机制，相关使用规则可能会根据平台稳定性与公平性需求进行动态调整。</p>
                  </div>
                } 
              />
              <FaqItem 
                id="q3" 
                num="3" 
                title="订阅是如何运作的？" 
                content={
                  <div className="space-y-3 text-white/60 text-xs">
                    <p>Artrail 提供灵活的月度与年度订阅方案，每个方案都包含一定数量的积分，可用于对话、图像生成、视频生成、音乐与旁白生成、编辑等功能。</p>
                    <p><span className="text-white">当你升级订阅时：</span></p>
                    <ul className="pl-4 space-y-1">
                      <li>• 旧套餐仅按已使用积分比例计费；</li>
                      <li>• 剩余未使用的余额将自动扣抵至新套餐；</li>
                      <li>• 你仅需支付补齐差价；</li>
                      <li>• 新的订阅周期将从升级当日重新计算。</li>
                    </ul>
                  </div>
                } 
              />
              <FaqItem 
                id="q4" 
                num="4" 
                title="订阅会自动续费吗？" 
                content={<div className="text-xs text-white/60">会的。订阅将在每个计费周期结束时自动续费，除非你在续费日前主动取消。</div>} 
              />
              <FaqItem 
                id="q5" 
                num="5" 
                title="限时优惠活动如何生效？" 
                content={
                  <div className="space-y-3 text-white/60 text-xs">
                    <ul className="pl-4 space-y-1">
                      <li>• 在促销期间订阅，优惠权益会立即生效；</li>
                      <li>• 若你取消订阅，相关促销权益将同步失效；</li>
                      <li>• 如果你在同一促销期内重新订阅，剩余优惠权益将在符合规则的情况下予以恢复。</li>
                    </ul>
                  </div>
                } 
              />
              <FaqItem 
                id="q6" 
                num="6" 
                title="如何修改或取消订阅？" 
                content={
                  <div className="space-y-3 text-white/60 text-xs">
                    <p>• <span className="text-white">你可以随时进行升级：</span>Starter → Basic → Pro；按月付费 → 按年付费；</p>
                    <p>• <span className="text-white">取消订阅方式：</span></p>
                    <ul className="pl-4 space-y-1">
                      <li>1. 进入订阅页面；</li>
                      <li>2. 点击 "Manage Subscription（管理订阅）"；</li>
                      <li>3. 选择 "Cancel Subscription（取消订阅）"。</li>
                    </ul>
                    <p>取消后，你仍可在当前订阅周期内继续使用订阅权益；周期结束后订阅将自动失效，并不再进行自动续费。</p>
                  </div>
                } 
              />
              <FaqItem 
                id="q7" 
                num="7" 
                title="我如何申请退款？" 
                content={
                  <div className="space-y-3 text-white/60 text-xs">
                    <p>• 如果你在最近一次付款后未有任何生成行为（包括大语言模型、图生成、视频生成、音乐和旁白生成等），可在购买后 7天内申请全额退款。</p>
                    <p>• 若因系统问题导致生成失败，我们将自动进行相应积分退还。</p>
                    <p>• 若需申请退款，请联系 <span className="text-white">support@artrail.ai</span>。</p>
                    <p>• 退款通常会在 5–10 个工作日内退回原支付方式。</p>
                  </div>
                } 
              />
            </Accordion>

            <div className="mt-16 border-t border-white/5 pt-10">
              <div className="text-sm font-bold mb-4 text-foreground">免责声明与联系方式</div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <MessageSquare className="h-3 w-3" />
                如有关于订阅或积分的问题，欢迎联系 support@artrail.ai
              </div>
              <div className="mt-2 text-[10px] leading-relaxed text-white/20">
                <span className="text-yellow-500/50">⚠️</span> Artrail 会根据产品优化与用户体验需要，不断调整功能、价格、订阅方案及积分政策。上述内容仅供参考，可能会在提前通知或不提前通知的情况下进行变更。如出现争议或不一致情况，以官方服务条款、系统记录与实际账单数据为准。
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

function CountdownItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg font-bold text-white">
        {value}
      </div>
      <div className="mt-1 text-[10px] text-white/40">{label}</div>
    </div>
  );
}

function PersonalCard({ name, price, credits, bonus, features, highlight }: any) {
  return (
    <div className="relative flex flex-col rounded-3xl border border-border bg-card p-6 text-left transition hover:border-accent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B]" />
          <span className="text-sm font-semibold">{name}</span>
        </div>
        <div className="rounded-full bg-[#E6B380]/10 px-2 py-0.5 text-[10px] font-medium text-[#E6B380]">{bonus}</div>
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-lg font-bold">¥</span>
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-xs text-foreground/40">/月</span>
      </div>

      <div className="mt-2 text-lg font-medium">{credits} 积分</div>
      
      <div className="mt-4 flex gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={cn("h-1.5 w-1.5 rounded-full", i < (name === "Starter" ? 3 : name === "Basic" ? 5 : 8) ? "bg-[#E6B380]" : "bg-white/10")} />
        ))}
      </div>

      <Link to="/checkout">
        <button className="mt-6 w-full rounded-full bg-white py-2.5 text-sm font-bold text-black hover:bg-white/90 transition-colors">
          立即订阅
        </button>
      </Link>

      <div className="mt-8 space-y-6 overflow-hidden">
        {features.map((group: any) => (
          <div key={group.title}>
            <div className="mb-3 text-[10px] font-medium text-foreground/40 uppercase tracking-wider">{group.title}</div>
            <div className="space-y-2.5">
              {group.items.map((item: any) => (
                <div key={item.label} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#E6B380]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-foreground/80">{item.label}</span>
                      {item.info && <Info className="h-2.5 w-2.5 text-foreground/20" />}
                      {item.tag && <span className="rounded bg-white/10 px-1 py-0.5 text-[8px] text-foreground/60">{item.tag}</span>}
                    </div>
                    {item.sub && <div className="mt-0.5 text-[9px] text-foreground/40">{item.sub}</div>}
                  </div>
                  {item.value && <div className="text-[10px] text-foreground/40">{item.value}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamCard({ name, price, credits, bonus, features }: any) {
  const [seats, setSeats] = React.useState(2);
  return (
    <div className="relative flex flex-col rounded-3xl border border-border bg-card p-6 text-left transition hover:border-accent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B]" />
          <span className="text-sm font-semibold">{name}</span>
        </div>
        <div className="rounded-full bg-[#E6B380]/10 px-2 py-0.5 text-[10px] font-medium text-[#E6B380]">{bonus}</div>
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-lg font-bold">¥</span>
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-[10px] text-foreground/40 ml-1">/席/月</span>
      </div>

      <div className="mt-2 text-lg font-medium">{credits} 积分</div>
      
      <div className="mt-4 flex gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={cn("h-1.5 w-1.5 rounded-full", i < (name.includes("Starter") ? 3 : name.includes("Basic") ? 5 : 8) ? "bg-[#E6B380]" : "bg-white/10")} />
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-white/5 p-3">
        <div className="flex items-center justify-between text-[11px] text-foreground/60">
          <span>席位</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setSeats(Math.max(2, seats - 1))} className="h-5 w-5 rounded bg-white/5 flex items-center justify-center hover:bg-white/10"><Minus className="h-3 w-3" /></button>
            <span className="text-foreground font-medium">{seats} 席</span>
            <button onClick={() => setSeats(seats + 1)} className="h-5 w-5 rounded bg-white/5 flex items-center justify-center hover:bg-white/10"><PlusIcon className="h-3 w-3" /></button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="text-[9px] text-foreground/30">总积分 {(parseInt(credits.split(' ')[0]) + parseInt(credits.split(' ')[2])) * seats}/月</div>
          <div className="text-[9px] text-foreground/30">总价 ¥{price * seats}/月</div>
        </div>
      </div>

      <Link to="/checkout">
        <button className="mt-4 w-full rounded-full bg-white py-2.5 text-sm font-bold text-black hover:bg-white/90 transition-colors">
          购买 {seats} 席位
        </button>
      </Link>

      <div className="mt-8 space-y-6 overflow-hidden">
        {features.map((group: any) => (
          <div key={group.title}>
            <div className="mb-3 text-[10px] font-medium text-foreground/40 uppercase tracking-wider">{group.title}</div>
            <div className="space-y-2.5">
              {group.items.map((item: any) => (
                <div key={item.label} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#E6B380]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-foreground/80">{item.label}</span>
                      {item.tag && <span className="rounded bg-green-500/20 px-1 py-0.5 text-[8px] text-green-500">新</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqItem({ id, num, title, content }: any) {
  return (
    <AccordionItem value={id} className="border-border">
      <AccordionTrigger className="hover:no-underline py-4 group">
        <div className="flex items-center gap-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-[10px] text-foreground/40 group-data-[state=open]:border-accent group-data-[state=open]:text-foreground">
            {num}
          </div>
          <span className="text-sm font-medium text-foreground/60 group-data-[state=open]:text-foreground">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-10 text-foreground/60">
        {content}
      </AccordionContent>
    </AccordionItem>
  );
}

const getPersonalFeatures = (concurrency: number, vipStyle: boolean = false) => [
  {
    title: "创作补贴",
    items: [
      { label: "注册奖励：100 积分" },
      { label: "探索使用奖励：200 积分" },
    ]
  },
  {
    title: "模型权益",
    items: [
      { label: "大语言模型", tag: "无限免费" },
      { label: "图生成模型", sub: "包含 Nano Banana 2 / GPT Image 2", value: "5-25 积分/张" },
      { label: "视频模型(480P/720P/1080P/4K)", sub: "包含 Seedance 2.5 SOTA", value: "5-135 积分/秒" },
      { label: "视频模型", sub: "包含 MiniMax H3", value: "8-39 积分/秒" },
      { label: "音乐/旁白", value: "1-5 积分/生成" },
    ]
  },
  {
    title: "使用权益",
    items: [
      { label: `专享 Seedance 2.5 & 2.0 高并发：${concurrency}`, tag: "新" },
      { label: "资产库单素材快速生成", tag: "新" },
      { label: `单模型并发：${Math.floor(concurrency / 5 + 3)}` },
      { label: `授权人像容量：${concurrency / 5 + 2} 个` },
      { label: "去水印导出" },
      { label: "商用授权" },
      { label: "图片视频HD超清增强", tag: "新" },
      ...(vipStyle ? [{ label: "尊享真人画风合规生成", tag: "新" }] : []),
    ]
  }
];

const getTeamFeatures = (concurrency: number, singleModel: number, avatars: number) => [
  {
    title: "团队权益",
    items: [
      { label: "创建并管理团队成员", tag: "新" },
      { label: "项目及资产管控", tag: "新" },
      { label: "积分用量管控", tag: "新" },
      { label: "极速开发票", tag: "新" },
    ]
  },
  {
    title: "模型权益",
    items: [
      { label: "大语言模型", tag: "无限免费" },
      { label: "图生成模型", sub: "包含 Nano Banana 2 / GPT Image 2", value: "5-25 积分/张" },
      { label: "视频模型(480P/720P/1080P/4K)", sub: "包含 Seedance 2.5SOTA", value: "5-135 积分/秒" },
      { label: "视频模型", sub: "包含 MiniMax H3", value: "8-39 积分/秒" },
      { label: "视频模型", sub: "包含 其他模型", value: "12-42 积分/秒" },
      { label: "音乐/旁白", value: "1-5 积分/生成" },
    ]
  },
  {
    title: "使用权益",
    items: [
      { label: `专享 Seedance 2.5 & 2.0 高并发：${concurrency}`, tag: "新" },
      { label: "快速生成功能，单素材自由创作", tag: "新" },
      { label: `单模型并发：${singleModel}` },
      { label: `授权人像容量：${avatars} 个` },
      { label: "去水印导出" },
      { label: "商用授权" },
      { label: "尊享真人画风合规生成", tag: "新" },
    ]
  }
];

const TEAM_FEATURES = []; // Keep for backward compatibility if needed, but we use getTeamFeatures now
