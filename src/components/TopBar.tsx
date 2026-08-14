import * as React from "react";
import { BookOpen, Coins, ChevronRight, Users, Settings, MessageSquare, Globe, LogOut, LayoutGrid, Film, Gift, Sun, Moon, Monitor, Key, Languages, Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SubscriptionDialog } from "./SubscriptionDialog";
import { CreditPurchaseDialog } from "./subscription/CreditPurchaseDialog";
import { FeedbackDialog } from "./FeedbackDialog";
import { NotificationDrawer } from "./NotificationDrawer";
import { useTheme } from "@/hooks/use-theme";
import logoAsset from "@/assets/logo.png.asset.json";
import { cn } from "@/lib/utils";

export function TopBar({ title, variant }: { title?: string; variant?: "light" | "dark" }) {
  const { theme } = useTheme();
  const isLight = variant === "light" || theme === "light";
  
  return (
    <div className="absolute right-6 top-4 z-50 flex items-center gap-3">
      <button className={cn(
        "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs backdrop-blur transition-all",
        isLight 
          ? "border-[#E5E5E7] bg-white/80 text-[#1D1D1F] hover:bg-white" 
          : "border-border bg-card/80 text-foreground hover:bg-card"
      )}>
        <BookOpen className="h-3.5 w-3.5 text-aurora-orange" />
        <span className="font-medium">全新 Artrail 1.0 使用教程</span>
      </button>

      <NotificationTrigger variant={variant} />
      <UserMenuContainer variant={variant} />

      {title ? <span className="sr-only">{title}</span> : null}
    </div>
  );
}

function NotificationTrigger({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const hasUnread = true; // Hardcoded for design representation
  const isLight = variant === "light";

  return (
    <>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowNotifications(true);
        }}
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur transition-all cursor-pointer",
          isLight 
            ? "border-[#E5E5E7] bg-white/50 text-[#1D1D1F]/60 hover:bg-white hover:text-[#1D1D1F]"
            : "border-border bg-card/50 text-foreground/60 backdrop-blur hover:bg-card hover:text-foreground"
        )}
        style={{ pointerEvents: 'auto' }}
      >
        <Bell className="h-4 w-4" />
        {hasUnread && (
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        )}
      </button>
      <NotificationDrawer open={showNotifications} onOpenChange={setShowNotifications} />
    </>
  );
}

function UserMenuContainer({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isLight = variant === "light";

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 rounded-full border pl-3 pr-1 py-1 text-sm backdrop-blur transition group cursor-pointer relative z-[60]",
        isLight
          ? "border-[#E5E5E7] bg-white/50 hover:bg-white"
          : "border-border bg-card/50 pl-3 pr-1 py-1 text-sm backdrop-blur transition hover:bg-card"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn(
        "flex items-center gap-2 pr-2 border-r",
        isLight ? "border-[#E5E5E7]" : "border-border"
      )}>
        <FilmIconGradient className="h-4 w-4" />
        <span className={cn(
          "font-bold tracking-tight text-[13px]",
          isLight ? "text-[#1D1D1F]" : "text-foreground"
        )}>2,081</span>
      </div>

      <div className="flex items-center gap-2 px-1">
        <span className={cn(
          "font-bold tracking-tight",
          isLight ? "text-[#1D1D1F]" : "text-foreground"
        )}>Free</span>
      </div>

      <UserMenu open={open} setOpen={setOpen} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
    </div>
  );
}

function UserMenu({ 
  open, 
  setOpen, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  open: boolean; 
  setOpen: (v: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const [showSubscription, setShowSubscription] = React.useState(false);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [showCreditPurchase, setShowCreditPurchase] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      <SubscriptionDialog open={showSubscription} onOpenChange={setShowSubscription} />
      <CreditPurchaseDialog open={showCreditPurchase} onOpenChange={setShowCreditPurchase} />
      <FeedbackDialog open={showFeedback} onOpenChange={setShowFeedback} />
      <NotificationDrawer open={showNotifications} onOpenChange={setShowNotifications} />
      <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div 
          className="h-8 w-8 rounded-full bg-foreground/10 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <Users className="h-5 w-5 text-foreground/40" />
        </div>
      </PopoverTrigger>

      <PopoverContent 
        align="end" 
        sideOffset={8}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="w-[280px] overflow-hidden border-border bg-popover p-0 text-popover-foreground shadow-2xl backdrop-blur-2xl"
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <Link to="/settings/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-lg font-bold">User</span>
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-medium text-foreground/60">Free</span>
            </Link>
          </div>
          <Link to="/settings/profile" className="mt-1 block text-sm text-foreground/40 hover:text-foreground/60 transition-colors">yangdu776@gmail.com</Link>

          <button 
            onClick={() => { setShowSubscription(true); setOpen(false); }}
            className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A855F7] to-[#3B82F6] py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 cursor-pointer"
          >
            <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-white/20">
              <Play fill="white" className="h-2 w-2 text-white ml-0.5" />
            </div>
            开通会员
          </button>
        </div>

        <div className="space-y-0 px-2 pb-2 mt-2">
          <div className="px-3 pt-2">
            <div className="flex items-center justify-between text-xs text-foreground/40 font-medium">
              <div className="flex items-center gap-2 text-foreground">
                <FilmIconGradient className="h-3.5 w-3.5" />
                <span className="text-[13px]">会员积分</span>
              </div>
              <span className="font-bold text-foreground text-[13px]">2081</span>
            </div>
            <div className="mt-2 space-y-1.5 pl-5.5 text-[11px] text-foreground/30">
              <div 
                className="flex justify-between cursor-pointer hover:text-foreground/50 transition-colors"
                onClick={() => { setShowCreditPurchase(true); setOpen(false); }}
              >
                <span>套餐</span><span>2000</span>
              </div>
              <div 
                className="flex justify-between cursor-pointer hover:text-foreground/50 transition-colors"
                onClick={() => { setShowCreditPurchase(true); setOpen(false); }}
              >
                <span>通用积分</span><span>0</span>
              </div>
              <div 
                className="flex justify-between cursor-pointer hover:text-foreground/50 transition-colors"
                onClick={() => { setShowCreditPurchase(true); setOpen(false); }}
              >
                <span>模型专属积分</span><span>0</span>
              </div>
              <div 
                className="flex justify-between cursor-pointer hover:text-foreground/50 transition-colors"
                onClick={() => { setShowCreditPurchase(true); setOpen(false); }}
              >
                <span>额外</span><span>81</span>
              </div>
            </div>
          </div>

          <div className="px-3 pt-3 pb-3">
            <div className="flex items-center justify-between text-xs text-foreground/40 font-medium">
              <div className="flex items-center gap-2 text-foreground">
                <Gift className="h-3.5 w-3.5 text-foreground/60" />
                <span className="text-[13px]">奖励积分</span>
              </div>
              <span className="font-bold text-foreground text-[13px]">0</span>
            </div>
            <div className="mt-2 space-y-1.5 pl-5.5 text-[11px] text-foreground/30">
              <div className="flex justify-between"><span>邀请奖励</span><span>0</span></div>
            </div>
            
            <Link 
              to="/settings/billing" 
              search={{ tab: 'credits' }}
              onClick={() => setOpen(false)} 
              className="mt-4 flex w-full items-center justify-center rounded-full bg-foreground/5 py-2.5 text-[13px] font-semibold text-foreground/80 transition-colors hover:bg-foreground/10"
            >
              查看用量
            </Link>
          </div>

          <div className="border-t border-border/50 opacity-50" />
          
          <Link to="/settings/team" onClick={() => setOpen(false)}><MenuItem icon={Users} label="团队管理" className="py-2" /></Link>
          <MenuItem 
            icon={Bell} 
            label="消息通知" 
            className="py-2" 
            onClick={() => { setShowNotifications(true); setOpen(false); }}
          />
          <Link to="/settings/redeem" onClick={() => setOpen(false)}><MenuItem icon={Gift} label="兑换码" className="py-2" /></Link>

          <div className="border-t border-border/50 opacity-50" />

          {/* Language Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="px-3 py-2 cursor-pointer hover:bg-foreground/5 rounded-lg transition-colors group">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 text-sm text-foreground/80 group-hover:text-foreground">
                    <Globe className="h-4 w-4 text-foreground/60 group-hover:text-foreground" />
                    <span>语言</span>
                    <span className="mx-0.5 text-foreground/20">|</span>
                    <span className="text-foreground/40 font-normal group-hover:text-foreground/60">简体中文</span>
                    <ChevronRight className="h-3 w-3 ml-0.5 text-foreground/20 group-hover:text-foreground/40" />
                  </div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent 
              side="left" 
              align="start" 
              sideOffset={12}
              className="w-[180px] p-1 border-border bg-popover/95 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex flex-col gap-0.5">
                {[
                  { label: "English", value: "en" },
                  { label: "简体中文", value: "zh-CN", active: true },
                  { label: "繁体中文", value: "zh-TW" },
                  { label: "日本語", value: "ja" },
                  { label: "한국어", value: "ko" },
                  { label: "Français", value: "fr" },
                  { label: "Deutsch", value: "de" },
                  { label: "Español", value: "es" },
                  { label: "Italiano", value: "it" },
                  { label: "Русский", value: "ru" },
                  { label: "العربية", value: "ar" },
                ].map((lang) => (
                  <button
                    key={lang.value}
                    className={cn(
                      "flex w-full items-center px-3 py-2 text-sm rounded-md transition-colors",
                      lang.active 
                        ? "bg-foreground/10 text-foreground font-medium" 
                        : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <MenuItem 
            icon={MessageSquare} 
            label="反馈" 
            className="py-2"
            onClick={() => { setShowFeedback(true); setOpen(false); }}
          />
          <Link to="/settings/profile"><MenuItem icon={Settings} label="管理账户" className="py-2" /></Link>
          
          <div className="border-t border-border/50 opacity-50" />

          {/* Theme Selector - compact */}
          <div className="px-3 py-2">
            <div className="flex p-1 bg-foreground/5 rounded-lg gap-1">
              <ThemeButton icon={Sun} label="亮色" active={theme === 'light'} onClick={() => setTheme('light')} />
              <ThemeButton icon={Moon} label="暗色" active={theme === 'dark'} onClick={() => setTheme('dark')} />
              <ThemeButton icon={Monitor} label="跟随" active={theme === 'system'} onClick={() => setTheme('system')} />
            </div>
          </div>
          
          <MenuItem icon={LogOut} label="退出登录" className="text-red-400/80 hover:text-red-400 hover:bg-red-400/5" />
        </div>
      </PopoverContent>
    </Popover>
    </>
  );
}

function ThemeButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
      "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-all",
      active 
        ? "bg-foreground/10 text-foreground shadow-sm" 
        : "text-foreground/40 hover:text-foreground/60 hover:bg-foreground/[0.02]"
    )}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function LanguageButton({ label, active, icon: Icon }: { label: string, active: boolean, icon: any }) {
  return (
    <button className={cn(
      "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-all",
      active 
        ? "bg-foreground/10 text-foreground shadow-sm" 
        : "text-foreground/40 hover:text-foreground/60 hover:bg-foreground/[0.02]"
    )}>
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function MenuItem({
  icon: Icon,
  label,
  rightContent,
  hasChevron,
  className,
  onClick,
}: {
  icon: any;
  label: string;
  rightContent?: React.ReactNode;
  hasChevron?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-foreground/5 group",
      className
    )}>
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-foreground/60 group-hover:text-foreground" />
        <span className="text-foreground/80 group-hover:text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {rightContent}
        {hasChevron && <ChevronRight className="h-3.5 w-3.5 text-foreground/20" />}
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


function FilmIconGradient({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-4 w-4 overflow-hidden rounded-[2px] bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center", className)}>
      <div className="grid grid-cols-1 gap-[1px]">
        <div className="flex gap-[1px]">
          <div className="h-[2px] w-[2px] bg-[#1A1A1A]" />
          <div className="h-[2px] w-[2px] bg-[#1A1A1A]" />
        </div>
        <div className="h-1.5 w-2.5 rounded-[1px] bg-transparent border-[1.5px] border-[#1A1A1A]" />
        <div className="flex gap-[1px]">
          <div className="h-[2px] w-[2px] bg-[#1A1A1A]" />
          <div className="h-[2px] w-[2px] bg-[#1A1A1A]" />
        </div>
      </div>
    </div>
  );
}

export function BrandMark({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const isLight = variant === "light";

  return (
    <div className="absolute left-6 top-5 z-20 flex items-center gap-2">
      <img src={logoAsset.url} alt="Artrail Logo" className="h-6 w-auto" />
      <span className={cn(
        "text-[15px] font-semibold tracking-tight",
        isLight ? "text-[#1D1D1F]" : "text-white"
      )}>artrail.ai</span>
    </div>
  );
}
