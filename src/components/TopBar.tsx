import * as React from "react";
import { BookOpen, Coins, ChevronRight, Users, Settings, MessageSquare, Globe, LogOut, LayoutGrid } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SubscriptionDialog } from "./SubscriptionDialog";

export function TopBar({ title }: { title?: string }) {
  return (
    <div className="absolute right-6 top-4 z-20 flex items-center gap-3">
      <button className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs text-foreground backdrop-blur hover:bg-card">
        <BookOpen className="h-3.5 w-3.5 text-aurora-orange" />
        <span className="font-medium">全新 Artrail 1.0 使用教程</span>
      </button>

      <UserMenuContainer />

      {title ? <span className="sr-only">{title}</span> : null}
    </div>
  );
}

function UserMenuContainer() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <div 
      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-3 pr-1 py-1 text-sm backdrop-blur transition hover:bg-white/10 group cursor-pointer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center gap-2 pr-2 border-r border-white/10">
        <FilmIcon className="h-3.5 w-3.5" />
        <span className="font-bold text-white tracking-tight">2,081</span>
      </div>
      
      <div className="flex items-center gap-2 px-1">
        <span className="font-bold text-white tracking-tight">Free</span>
      </div>

      <UserMenu open={open} setOpen={setOpen} />
    </div>
  );
}

function UserMenu({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
  const [showSubscription, setShowSubscription] = React.useState(false);

  return (
    <>
      <SubscriptionDialog open={showSubscription} onOpenChange={setShowSubscription} />
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
          <Users className="h-5 w-5 text-white/40" />
        </div>
      </PopoverTrigger>

      <PopoverContent 
        align="end" 
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="w-[280px] overflow-hidden border-white/10 bg-[#1A1A1A]/95 p-0 text-foreground shadow-2xl backdrop-blur-2xl"
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">User</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60">Free</span>
            </div>
          </div>
          <div className="mt-1 text-sm text-white/40">yangdu776@gmail.com</div>

          <button 
            onClick={() => { setShowSubscription(true); setOpen(false); }}
            className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 cursor-pointer"
          >
            <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-white/20">
              <Play fill="white" className="h-2 w-2 text-white" />
            </div>
            开通会员
          </button>
        </div>

        <div className="space-y-0.5 px-2 pb-2">
          <MenuItem icon={LayoutGrid} label="切换为团队版" />
          <MenuItem icon={Users} label="团队管理" />

          <div className="my-2 border-t border-white/5" />

          <div className="px-3 py-2">
            <div className="flex items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-2">
                <Coins className="h-3.5 w-3.5 text-[#FFB800]" />
                <span>会员积分</span>
              </div>
              <span>0</span>
            </div>
            <div className="mt-2 space-y-1.5 pl-5.5 text-[11px] text-white/30">
              <div className="flex justify-between"><span>套餐</span><span>0</span></div>
              <div className="flex justify-between"><span>通用积分</span><span>0</span></div>
              <div className="flex justify-between"><span>模型专属积分</span><span>0</span></div>
              <div className="flex justify-between"><span>额外</span><span>0</span></div>
            </div>
          </div>

          <div className="px-3 py-2">
            <div className="flex items-center justify-between text-xs text-white/40">
              <div className="flex items-center gap-2">
                <div className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-white/10">
                  <div className="h-1.5 w-1.5 rounded-full border border-white/40" />
                </div>
                <span>奖励积分</span>
              </div>
              <span>0</span>
            </div>
            <div className="mt-1.5 pl-5.5 text-[11px] text-white/30">
              <div className="flex justify-between"><span>邀请奖励</span><span>0</span></div>
            </div>
          </div>

          <div className="px-2 pt-2">
            <button className="w-full rounded-lg bg-white/5 py-2 text-xs font-medium text-white/60 hover:bg-white/10">
              查看用量
            </button>
          </div>

          <div className="my-2 border-t border-white/5" />

          <MenuItem
            icon={Globe}
            label="语言"
            rightContent={<span className="text-[11px] text-white/30">简体中文</span>}
            hasChevron
          />
          <MenuItem icon={MessageSquare} label="反馈" />
          <MenuItem icon={Settings} label="管理账户" />
        </div>
      </PopoverContent>
    </Popover>
    </>
  );
}

function MenuItem({
  icon: Icon,
  label,
  rightContent,
  hasChevron,
}: {
  icon: any;
  label: string;
  rightContent?: React.ReactNode;
  hasChevron?: boolean;
}) {
  return (
    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/5 group">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-white/60 group-hover:text-white" />
        <span className="text-white/80 group-hover:text-white">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {rightContent}
        {hasChevron && <ChevronRight className="h-3.5 w-3.5 text-white/20" />}
      </div>
    </button>
  );
}

function Play({ className, fill, ...props }: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill || "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}


export function BrandMark() {
  return (
    <div className="absolute left-6 top-5 z-20 flex items-center gap-2">
      <div className="grid h-5 w-5 grid-cols-2 gap-[2px]">
        <div className="rounded-[1px] bg-aurora-pink" />
        <div className="rounded-[1px] bg-aurora-orange" />
        <div className="rounded-[1px] bg-aurora-blue" />
        <div className="rounded-[1px] bg-foreground" />
      </div>
      <span className="text-[15px] font-semibold tracking-tight">artrail.ai</span>
    </div>
  );
}
