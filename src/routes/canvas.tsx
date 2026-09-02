import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  User,
  FolderClosed,
  Hand,
  HelpCircle,
  Building2,
  Clapperboard,
  Video,
  ImageIcon,
  Type,
  Music,
  Library,
  Clock,
  Gem,
  Crown,
  Share2,
  MessageSquare,
  Bot,
  X,
  Info,
  Minus,
  Maximize,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/canvas")({
  head: () => ({
    meta: [
      { title: "画布 — Artrail" },
      { name: "description", content: "自由画布：以可视化的方式组织角色、场景、视频、图片、文本与音频。" },
      { property: "og:title", content: "画布 — Artrail" },
      { property: "og:description", content: "自由画布：以可视化的方式组织角色、场景、视频、图片、文本与音频。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CanvasPage,
});

type ToolItem = {
  icon: React.ElementType;
  label: string;
  badge?: string;
};

const TOOLS: ToolItem[] = [
  { icon: Plus, label: "新建", badge: "New" },
  { icon: User, label: "角色" },
  { icon: FolderClosed, label: "资产" },
  { icon: Hand, label: "抓手" },
  { icon: HelpCircle, label: "帮助" },
];

const ASSET_CARDS: ToolItem[] = [
  { icon: User, label: "角色" },
  { icon: Building2, label: "场景" },
  { icon: Clapperboard, label: "3D导演台", badge: "New" },
  { icon: Video, label: "视频" },
  { icon: ImageIcon, label: "图片" },
  { icon: Type, label: "文本" },
  { icon: Music, label: "音频" },
];

function CanvasPage() {
  const [showUpdateToast, setShowUpdateToast] = useState(true);
  const [zoom, setZoom] = useState(100);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[var(--color-background)]">
      {/* Dotted grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top bar */}
      <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)]/80 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-semibold text-[var(--color-foreground)]">
            未命名画布
          </span>
          <span className="flex items-center gap-1 text-[12px] text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            已保存
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/60 px-3 py-1.5 text-[12px] text-[var(--color-foreground)] transition hover:bg-[var(--color-accent)]">
            <Library className="h-3.5 w-3.5" />
            风格库
          </button>

          <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/60 px-3 py-1.5 text-[12px] text-[var(--color-foreground)]">
            <Clock className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
            9:16
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/60 px-3 py-1.5 text-[12px] text-[var(--color-foreground)]">
            <Gem className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
            <span className="font-semibold">854</span>
          </div>

          <button className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-1.5 text-[12px] font-medium text-white transition hover:opacity-90">
            <Crown className="h-3.5 w-3.5" />
            优惠开会员
            <span className="rounded-md bg-white/20 px-1 py-0.5 text-[10px]">低至5折</span>
          </button>

          <div className="mx-1 h-4 w-px bg-[var(--color-border)]" />

          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/60 text-[var(--color-muted-foreground)] transition hover:text-[var(--color-foreground)]">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/60 text-[var(--color-muted-foreground)] transition hover:text-[var(--color-foreground)]">
            <MessageSquare className="h-4 w-4" />
          </button>

          <Avatar className="h-8 w-8 border border-[var(--color-border)]">
            <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-[11px] text-white">
              MF
            </AvatarFallback>
          </Avatar>

          <button className="flex items-center gap-1.5 rounded-full bg-[var(--color-foreground)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-background)] transition hover:opacity-90">
            <Bot className="h-3.5 w-3.5" />
            Agent
          </button>
        </div>
      </header>

      {/* Left floating toolbar */}
      <div className="absolute left-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/80 p-1.5 shadow-sm backdrop-blur-xl">
        {TOOLS.map((tool) => (
          <button
            key={tool.label}
            title={tool.label}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-foreground)]/70 transition hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]"
          >
            <tool.icon className="h-4 w-4" strokeWidth={1.75} />
            {tool.badge && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 items-center justify-center rounded-full bg-purple-500 px-1 text-[8px] font-bold text-white">
                {tool.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main canvas area */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {ASSET_CARDS.slice(0, 6).map((card) => (
              <AssetCard key={card.label} {...card} />
            ))}
          </div>
          <div className="flex justify-center">
            <AssetCard {...ASSET_CARDS[6]} />
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-[13px] text-[var(--color-muted-foreground)]">
            <span className="text-[var(--color-foreground)]/40">▶</span>
            点击快速新建
          </p>
        </div>
      </main>

      {/* Bottom left zoom controls */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/80 p-1 shadow-sm backdrop-blur-xl">
        <button className="flex h-7 items-center justify-center rounded-lg px-2 text-[11px] text-[var(--color-muted-foreground)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]">
          <Maximize className="mr-1 h-3 w-3" />
          适配
        </button>
        <div className="flex h-7 items-center justify-center rounded-lg bg-[var(--color-secondary)] px-2 text-[11px] font-medium text-[var(--color-foreground)]">
          {zoom}%
        </div>
        <button
          onClick={() => setZoom((z) => Math.max(25, z - 25))}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-foreground)]/70 transition hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.min(200, z + 25))}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-foreground)]/70 transition hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Update toast */}
      {showUpdateToast && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 shadow-lg">
          <Info className="h-4 w-4 text-[var(--color-muted-foreground)]" />
          <span className="text-[13px] text-[var(--color-foreground)]">发现新版本！</span>
          <button className="rounded-full bg-[var(--color-foreground)] px-3 py-1 text-[11px] font-medium text-[var(--color-background)] transition hover:opacity-90">
            刷新
          </button>
          <button
            onClick={() => setShowUpdateToast(false)}
            className="text-[var(--color-muted-foreground)] transition hover:text-[var(--color-foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function AssetCard({
  icon: Icon,
  label,
  badge,
}: {
  icon: (typeof ASSET_CARDS)[number]["icon"];
  label: string;
  badge?: string;
}) {
  return (
    <button className="group relative flex min-w-[140px] items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/70 px-4 py-3.5 text-[var(--color-foreground)] shadow-sm transition hover:border-[var(--color-foreground)]/20 hover:bg-[var(--color-accent)]/60 hover:shadow-md">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-secondary)] text-[var(--color-foreground)]/70 group-hover:text-[var(--color-foreground)]">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <span className="text-[14px] font-medium">{label}</span>
      {badge && (
        <span className="absolute right-2 top-2 rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-purple-600 dark:text-purple-400">
          {badge}
        </span>
      )}
    </button>
  );
}
