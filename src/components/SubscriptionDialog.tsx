import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Check, Play, Info, ChevronDown, Minus, Plus as PlusIcon, HelpCircle, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function SubscriptionDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [activeTab, setActiveTab] = React.useState<"personal" | "team">("personal");
  const [personalCycle, setPersonalCycle] = React.useState<"month" | "year">("month");
  const [teamCycle, setTeamCycle] = React.useState<"1month" | "3month" | "1year">("1month");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-y-auto border-white/10 bg-[#0A0A0A] p-0 text-white scrollbar-hide">
        <div className="relative pb-20 pt-10">
          {/* Header Section */}
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="mb-8 inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#2A1F15] to-[#151A25] p-1 pr-6 border border-white/5">
              <div className="flex flex-col items-start px-4 py-2">
                <div className="text-sm font-semibold text-[#E6B380]">Seedance 2.5 满血版上线, 积分限时买一送一</div>
                <div className="text-xs text-white/60">480p 再享 5.3折, 低至 ¥ 0.23/秒</div>
              </div>
              <div className="flex gap-2">
                <CountdownItem value="07" label="日" />
                <CountdownItem value="20" label="时" />
                <CountdownItem value="48" label="分" />
                <CountdownItem value="33" label="秒" />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight">Artrail - 价格与套餐</h1>

            <div className="mt-8 flex justify-center">
              <div className="flex border-b border-white/10 w-full max-w-md">
                <button 
                  onClick={() => setActiveTab("personal")}
                  className={cn(
                    "flex-1 pb-3 text-sm font-medium transition-colors relative",
                    activeTab === "personal" ? "text-white" : "text-white/40"
                  )}
                >
                  个人版
                  {activeTab === "personal" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                </button>
                <button 
                  onClick={() => setActiveTab("team")}
                  className={cn(
                    "flex-1 pb-3 text-sm font-medium transition-colors relative",
                    activeTab === "team" ? "text-white" : "text-white/40"
                  )}
                >
                  团队版 <span className="text-[10px] opacity-60 font-normal">(均支持真人合规生成)</span>
                  {activeTab === "team" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
                </button>
              </div>
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
                  <button className="flex items-center gap-2 text-xs text-white/60 hover:text-white">
                    <div className="h-4 w-4 rounded bg-white/10 flex items-center justify-center">
                      <PlusIcon className="h-2 w-2" />
                    </div>
                    个人版会员积分购买
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <PersonalCard 
                    name="Starter" 
                    price={140} 
                    credits="2000 + 400" 
                    bonus="多送20%" 
                    features={PERSONAL_FEATURES} 
                    highlight="创作补贴"
                  />
                  <PersonalCard 
                    name="Basic" 
                    price={350} 
                    credits="5000 + 1500" 
                    bonus="多送30%" 
                    features={PERSONAL_FEATURES}
                  />
                  <PersonalCard 
                    name="Plus" 
                    price={700} 
                    credits="10000 + 4000" 
                    bonus="多送40%" 
                    features={PERSONAL_FEATURES}
                  />
                  <PersonalCard 
                    name="Pro" 
                    price={1400} 
                    credits="20000 + 10000" 
                    bonus="多送50%" 
                    features={PERSONAL_FEATURES}
                  />
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
                  <button className="flex items-center gap-2 text-xs text-white/60 hover:text-white">
                    <div className="h-4 w-4 rounded bg-white/10 flex items-center justify-center">
                      <PlusIcon className="h-2 w-2" />
                    </div>
                    团队版会员积分购买
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <TeamCard 
                    name="Starter Team" 
                    price={160} 
                    credits="2000 + 400" 
                    bonus="多送20%" 
                    features={TEAM_FEATURES}
                  />
                  <TeamCard 
                    name="Basic Team" 
                    price={400} 
                    credits="5000 + 1500" 
                    bonus="多送30%" 
                    features={TEAM_FEATURES}
                  />
                  <TeamCard 
                    name="Plus Team" 
                    price={800} 
                    credits="10000 + 4000" 
                    bonus="多送40%" 
                    features={TEAM_FEATURES}
                  />
                  <TeamCard 
                    name="Pro Team" 
                    price={1600} 
                    credits="20000 + 10000" 
                    bonus="多送50%" 
                    features={TEAM_FEATURES}
                  />
                </div>
              </>
            )}
          </div>

          {/* FAQ Section */}
          <div className="mx-auto mt-24 max-w-4xl px-6">
            <h2 className="mb-10 text-center text-xl font-bold">Artrail 订阅与积分常见问题</h2>
            <Accordion type="single" collapsible className="w-full space-y-4 border-none">
              <FaqItem 
                id="q1" 
                num="1" 
                title="什么是积分 (credits), 我如何获得?" 
                content={
                  <div className="space-y-3 text-white/60 text-xs">
                    <p>• 积分是 Artrail 平台的标准计量单位。当您通过对话、故事板或其他创作工具开始创作时, 系统会根据所使用的模型类型、生成时长、分辨率及其他相关参数自动扣除相应积分。</p>
                    <p>• 您可以通过两种方式获取积分:</p>
                    <div className="pl-4 space-y-2">
                      <p>• <span className="text-white">订阅获取积分</span> 订阅任意会员后, 可获取固定额度的月度积分, 有效期为 30天;</p>
                      <p>• <span className="text-white">免费与奖励积分</span></p>
                      <ul className="pl-4 space-y-1">
                        <li>• 邀请奖励积分 (Invite Bonus Credits): 成功邀请用户注册后获取, 有效期 7天;</li>
                        <li>• 探索使用奖励 (Exploration Bonus Credits): 使用 Artrail 制作视频, 在中间步骤可获得探索使用奖励, 有效期30天;</li>
                        <li>• 超创奖励积分与活动奖励积分 (Super Creator / Event Bonus Credits): 其发放数量及有效期将根据具体的社区计划及运营活动规则进行设置。</li>
                      </ul>
                    </div>
                  </div>
                } 
              />
              <FaqItem 
                id="q2" 
                num="2" 
                title="积分在使用过程中如何扣除?" 
                content={
                  <div className="space-y-3 text-white/60 text-xs">
                    <p>• 系统将根据不同任务的复杂程度扣除积分:</p>
                    <ul className="pl-4 space-y-1">
                      <li>• 文生图/图生图: 5-25 积分/张, 取决于选用的模型与分辨率;</li>
                      <li>• 视频生成: 5-135 积分/秒, Seedance 2.5 满血版会消耗更多积分以换取顶级画质;</li>
                      <li>• 音频/配音: 按照生成时长扣除积分。</li>
                    </ul>
                  </div>
                } 
              />
              <FaqItem 
                id="q3" 
                num="3" 
                title="订阅是如何运作的?" 
                content={
                  <div className="space-y-3 text-white/60 text-xs">
                    <p>• 订阅会员后, 您将立即获得当前周期的积分额度。月度积分有效期为 30 天, 逾期将自动失效, 请及时使用。</p>
                    <p>• 如果您在周期内耗尽积分, 可以通过手动购买积分包或升级套餐来继续创作。</p>
                  </div>
                } 
              />
              <FaqItem id="q4" num="4" title="订阅会自动续费吗?" content={<div className="text-xs text-white/60">会。订阅将在每个计费周期结束时自动续费, 除非您在续费日前主动取消。</div>} />
            </Accordion>

            <div className="mt-16 border-t border-white/5 pt-10">
              <div className="text-sm font-bold mb-4">免责声明与联系方式</div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <MessageSquare className="h-3 w-3" />
                如有关于订阅或积分的问题, 欢迎联系 support@artrail.ai
              </div>
              <div className="mt-2 text-[10px] leading-relaxed text-white/20">
                <span className="text-yellow-500/50">⚠</span> Artrail 会根据产品优化与用户体验需要, 不断调整功能、价格、订阅方案及积分政策。上述内容仅供参考, 可能会在提前通知或不提前通知的情况下进行变更。如出现争议或不一致情况, 以官方服务条款、系统记录与实际账单数据为准。
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
    <div className="relative flex flex-col rounded-3xl border border-white/10 bg-[#161616] p-6 text-left transition hover:border-white/20">
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
        <span className="text-xs text-white/40">/月</span>
      </div>

      <div className="mt-2 text-lg font-medium">{credits} 积分</div>
      
      <div className="mt-4 flex gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={cn("h-1.5 w-1.5 rounded-full", i < (name === "Starter" ? 3 : name === "Basic" ? 5 : 8) ? "bg-[#E6B380]" : "bg-white/10")} />
        ))}
      </div>

      <button className="mt-6 w-full rounded-full bg-white py-2.5 text-sm font-bold text-black hover:bg-white/90">
        购买
      </button>

      <div className="mt-8 space-y-6 overflow-hidden">
        {features.map((group: any) => (
          <div key={group.title}>
            <div className="mb-3 text-[10px] font-medium text-white/40 uppercase tracking-wider">{group.title}</div>
            <div className="space-y-2.5">
              {group.items.map((item: any) => (
                <div key={item.label} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#E6B380]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-white/80">{item.label}</span>
                      {item.info && <Info className="h-2.5 w-2.5 text-white/20" />}
                      {item.tag && <span className="rounded bg-white/10 px-1 py-0.5 text-[8px] text-white/60">{item.tag}</span>}
                    </div>
                    {item.sub && <div className="mt-0.5 text-[9px] text-white/40">{item.sub}</div>}
                  </div>
                  {item.value && <div className="text-[10px] text-white/40">{item.value}</div>}
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
    <div className="relative flex flex-col rounded-3xl border border-white/10 bg-[#161616] p-6 text-left transition hover:border-white/20">
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
        <span className="text-[10px] text-white/40 ml-1">/席/月</span>
      </div>

      <div className="mt-2 text-lg font-medium">{credits} 积分</div>
      
      <div className="mt-4 flex gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={cn("h-1.5 w-1.5 rounded-full", i < (name.includes("Starter") ? 3 : name.includes("Basic") ? 5 : 8) ? "bg-[#E6B380]" : "bg-white/10")} />
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-white/5 p-3">
        <div className="flex items-center justify-between text-[11px] text-white/60">
          <span>席位</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setSeats(Math.max(2, seats - 1))} className="h-5 w-5 rounded bg-white/5 flex items-center justify-center hover:bg-white/10"><Minus className="h-3 w-3" /></button>
            <span className="text-white font-medium">{seats} 席</span>
            <button onClick={() => setSeats(seats + 1)} className="h-5 w-5 rounded bg-white/5 flex items-center justify-center hover:bg-white/10"><PlusIcon className="h-3 w-3" /></button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="text-[9px] text-white/30">总积分 {2000 * seats}/月</div>
          <div className="text-[9px] text-white/30">总价 ¥{price * seats}/月</div>
        </div>
      </div>

      <button className="mt-4 w-full rounded-full bg-white py-2.5 text-sm font-bold text-black hover:bg-white/90">
        购买 {seats} 席位
      </button>

      <div className="mt-8 space-y-6 overflow-hidden">
        {features.map((group: any) => (
          <div key={group.title}>
            <div className="mb-3 text-[10px] font-medium text-white/40 uppercase tracking-wider">{group.title}</div>
            <div className="space-y-2.5">
              {group.items.map((item: any) => (
                <div key={item.label} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#E6B380]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-white/80">{item.label}</span>
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
    <AccordionItem value={id} className="border-white/5">
      <AccordionTrigger className="hover:no-underline py-4 group">
        <div className="flex items-center gap-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-[10px] text-white/40 group-data-[state=open]:border-white/20 group-data-[state=open]:text-white">
            {num}
          </div>
          <span className="text-sm font-medium text-white/60 group-data-[state=open]:text-white">{title}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-10 text-white/60">
        {content}
      </AccordionContent>
    </AccordionItem>
  );
}

const PERSONAL_FEATURES = [
  {
    title: "制作补贴 (Production Subsidy)",
    items: [
      { label: "注册奖励 (Registration Bonus)", value: "100 积分" },
      { label: "探索使用奖励 (Exploration Bonus)", value: "200 积分" },
      { label: "每日签到奖励 (Daily Check-in)", tag: "新" },
    ]
  },
  {
    title: "模型权益 (Model Rights)",
    items: [
      { label: "大语言模型 (LLM)", info: true, tag: "无限免费" },
      { label: "图生成模型 (Image Models)", sub: "包含 Nano Banana 2 / GPT Image 2", value: "5-25 积分/张" },
      { label: "视频生成模型 (Video Models)", sub: "包含 Seedance 2.5 (SOTA)", value: "5-135 积分/秒" },
    ]
  },
  {
    title: "使用权益 (Usage Rights)",
    items: [
      { label: "专享 Seedance 2.5 高并发", value: "优先通道" },
      { label: "资产库素材快速生成", tag: "新" },
      { label: "最大并行生成数", value: "5" },
      { label: "授权人像容量", value: "2 个" },
      { label: "专属会员标识", tag: "新" },
    ]
  }
];

const TEAM_FEATURES = [
  {
    title: "团队管理 (Team Management)",
    items: [
      { label: "多成员协同工作", tag: "新" },
      { label: "团队资产库共享", tag: "新" },
      { label: "项目权限精细化管控", tag: "新" },
      { label: "团队积分池统一分配", tag: "新" },
    ]
  },
  {
    title: "制作权益 (Production Rights)",
    items: [
      { label: "全量模型优先使用权", tag: "无限免费" },
      { label: "企业级极速并发", value: "极速通道" },
      { label: "4K/8K 超高清生成", value: "支持" },
    ]
  }
];
