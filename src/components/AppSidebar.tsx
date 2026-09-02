import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  Pencil,
  MessagesSquare,
  Sparkles,
  Zap,
  LayoutGrid,
  FolderClosed,
  Package,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/logo.png.asset.json";
import videoPreviewAsset from "@/assets/generated-video-preview.jpg.asset.json";
import iconCharBoss from "@/assets/char-boss.jpg";
import iconCharLisa from "@/assets/char-lisa.jpg";
import iconCharSam from "@/assets/char-sam.jpg";
import iconCharXiaopang from "@/assets/char-xiaopang.jpg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type HistoryItem = {
  id: string;
  title: string;
  group: "今天" | "昨天" | "本月" | "更早";
  kind: "video" | "image" | "icon";
  /** 创作来源：canvas = 画布，agent = 智能 Agent 对话 */
  source: "canvas" | "agent";
  cover?: string;
};

export const DEFAULT_HISTORY: HistoryItem[] = [
  { id: "h1", title: "美女机甲游戏视频", group: "今天", kind: "video", source: "agent" },
  { id: "h2", title: "美女机甲游戏视频", group: "今天", kind: "image", source: "canvas" },
  { id: "h3", title: "小猫钓鱼", group: "今天", kind: "video", source: "agent" },
  { id: "h4", title: "美女机甲游戏视频", group: "今天", kind: "image", source: "canvas" },
  { id: "h7", title: "黑暗童话食物图标", group: "昨天", kind: "icon", source: "agent" },
  { id: "h5", title: "机甲游戏视频", group: "昨天", kind: "video", source: "canvas" },
  { id: "h6", title: "小猫钓鱼图片", group: "本月", kind: "image", source: "canvas" },
  { id: "h8", title: "赛博朋克武器图标", group: "更早", kind: "icon", source: "agent" },
];

/** 来源标识配置：画布 = 网格图标，Agent = 机器人图标 */
const SOURCE_META = {
  canvas: { icon: LayoutGrid, label: "画布" },
  agent: { icon: Bot, label: "Agent" },
} as const;

const GROUP_ORDER: HistoryItem["group"][] = ["今天", "昨天", "本月", "更早"];

const NAV_ITEMS = [
  { to: "/", icon: Sparkles, label: "创作" },
  { to: "/canvas", icon: LayoutGrid, label: "画布" },
  { to: "/creative-assistant", icon: MessagesSquare, label: "探讨" },
  { to: "/quick", icon: Zap, label: "快速" },
  { to: "/elements", icon: FolderClosed, label: "资产" },
  { to: "/skill", icon: Package, label: "Skill" },
] as const;

export const ASSISTANT_NEW_SESSION_EVENT = "assistant:new-session";
export const ASSISTANT_SELECT_HISTORY_EVENT = "assistant:select-history";

const VIDEO_PREVIEW_URL = "/__l5e/assets-v1/8d62e11b-80d3-455c-94e8-3ec9c3556590/video-preview.mp4";
const ICON_GRID = [iconCharBoss, iconCharLisa, iconCharSam, iconCharXiaopang];

type PreviewState = { item: HistoryItem; top: number };

/** 历史项目悬浮素材预览：视频播放预览，图标项目展示四宫格缩略 */
function HistoryHoverPreview({ preview }: { preview: PreviewState }) {
  const { item, top } = preview;
  return (
    <motion.div
      initial={{ opacity: 0, x: -6, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -6, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{ top: Math.min(top, window.innerHeight - 230) }}
      className="pointer-events-none fixed left-[268px] z-50 w-[220px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl"
    >
      <div className="relative aspect-video w-full bg-[var(--color-secondary)]">
        {item.kind === "video" && (
          <video
            src={VIDEO_PREVIEW_URL}
            poster={videoPreviewAsset.url}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        {item.kind === "image" && (
          <img
            src={item.cover ?? videoPreviewAsset.url}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        )}
        {item.kind === "icon" && (
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5 p-0.5">
            {ICON_GRID.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${item.title} 图标 ${i + 1}`}
                className="h-full w-full rounded-md object-cover"
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="truncate text-[12px] font-medium text-[var(--color-foreground)]">
          {item.title}
        </span>
        <span className="ml-auto shrink-0 rounded-md bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] text-[var(--color-muted-foreground)]">
          {item.kind === "video" ? "视频" : item.kind === "icon" ? "图标" : "图片"}
        </span>
      </div>
    </motion.div>
  );
}

export function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState<HistoryItem[]>(DEFAULT_HISTORY);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | undefined>("h3");
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const showPreview = (item: HistoryItem, e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPreview({ item, top: rect.top - 20 });
  };

  const grouped = useMemo(() => {
    const filtered = items.filter((i) =>
      i.title.toLowerCase().includes(query.trim().toLowerCase())
    );
    return GROUP_ORDER.map((g) => ({
      group: g,
      list: filtered.filter((i) => i.group === g),
    })).filter((g) => g.list.length > 0);
  }, [items, query]);

  const goAssistant = () => {
    if (pathname !== "/creative-assistant") {
      navigate({ to: "/creative-assistant" });
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setSelected(item.id);
    goAssistant();
    window.dispatchEvent(
      new CustomEvent(ASSISTANT_SELECT_HISTORY_EVENT, { detail: item })
    );
  };

  return (
    <>
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 264, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="sticky top-0 z-40 h-screen shrink-0 overflow-hidden border-r border-[var(--color-border)] bg-[var(--color-card)]/60 backdrop-blur-xl"
          >
            <div className="flex h-full w-[264px] flex-col">
              {/* 品牌区 */}
              <div className="flex items-center justify-between px-4 pb-2 pt-3">
                <Link to="/" className="flex items-center gap-2">
                  <img src={logoAsset.url} alt="Artrail" className="h-6 w-6" />
                  <span className="text-[15px] font-bold tracking-tight text-[var(--color-foreground)]">
                    Artrail
                  </span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  title="收起"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-muted-foreground)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>

              {/* 功能导航 */}
              <nav className="px-2 pb-1">
                {NAV_ITEMS.map((item) => {
                  const active =
                    item.to === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={cn(
                        "mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] transition",
                        active
                          ? "bg-[var(--color-accent)] font-semibold text-[var(--color-foreground)]"
                          : "text-[var(--color-foreground)]/75 hover:bg-[var(--color-accent)]/60 hover:text-[var(--color-foreground)]"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mx-4 my-1 h-px bg-[var(--color-border)]" />

              {/* 历史项目标题 */}
              <div className="flex items-center justify-between px-4 pb-1 pt-1.5">
                <span className="text-[11px] font-medium text-[var(--color-muted-foreground)]">
                  创作历史
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      title="更多"
                      className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-muted-foreground)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)]"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem
                      onClick={() => {
                        setItems(DEFAULT_HISTORY);
                        setQuery("");
                      }}
                    >
                      恢复默认列表
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setItems([])}
                    >
                      清空全部历史
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 搜索 */}
              <div className="px-4 pb-2">
                <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] px-3 py-1.5">
                  <Search className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="搜索创作"
                    className="w-full bg-transparent text-[12px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none"
                  />
                </div>
              </div>

              {/* 列表 */}
              <div className="scrollbar-hide flex-1 overflow-y-auto px-2 pb-6">
                {grouped.length === 0 && (
                  <p className="px-3 py-8 text-center text-[12px] text-[var(--color-muted-foreground)]">
                    暂无匹配的创作记录
                  </p>
                )}
                {grouped.map((section) => (
                  <div key={section.group} className="mb-1">
                    <div className="px-3 pb-1 pt-3 text-[11px] font-medium text-[var(--color-muted-foreground)]">
                      {section.group}
                    </div>
                    {section.list.map((item) => {
                      const active = selected === item.id;
                      const SourceIcon = SOURCE_META[item.source].icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectHistory(item)}
                          onMouseEnter={(e) => showPreview(item, e)}
                          onMouseLeave={() => setPreview(null)}
                          className={cn(
                            "group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition",
                            active
                              ? "bg-[var(--color-accent)]"
                              : "hover:bg-[var(--color-accent)]/60"
                          )}
                        >
                          <div
                            title={SOURCE_META[item.source].label}
                            className={cn(
                              "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border",
                              item.source === "agent"
                                ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                                : "border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]"
                            )}
                          >
                            {item.cover ? (
                              <img src={item.cover} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <SourceIcon className="h-4 w-4" strokeWidth={1.75} />
                            )}
                          </div>
                          <span
                            className={cn(
                              "flex-1 truncate text-[13px]",
                              active
                                ? "font-semibold text-[var(--color-foreground)]"
                                : "text-[var(--color-foreground)]/80"
                            )}
                          >
                            {item.title}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground)] opacity-0 transition hover:bg-[var(--color-background)] group-hover:opacity-100"
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const name = window.prompt("重命名创作", item.title);
                                  if (name)
                                    setItems((prev) =>
                                      prev.map((p) => (p.id === item.id ? { ...p, title: name } : p))
                                    );
                                }}
                              >
                                <Pencil className="mr-2 h-3.5 w-3.5" /> 重命名
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setItems((prev) => prev.filter((p) => p.id !== item.id));
                                }}
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> 删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && preview && (
          <HistoryHoverPreview key={preview.item.id} preview={preview} />
        )}
      </AnimatePresence>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="展开侧栏"
          className="fixed left-3 top-3 z-40 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-muted-foreground)] shadow-sm transition hover:text-[var(--color-foreground)]"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
