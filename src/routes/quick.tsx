import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import {
  Plus,
  Video,
  Image as ImageIcon,
  Music,
  AudioLines,
  Edit3,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  Sparkles,
  Download,
  Star,
  Trash2,
  Maximize2,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BrandMark, TopBar } from "@/components/TopBar";
import skillProduct from "@/assets/skill-product.jpg";
import skillStory from "@/assets/skill-story.jpg";
import skillReenact from "@/assets/skill-reenact.jpg";

type Msg = {
  id: string;
  prompt: string;
  model: string;
  badge?: string;
  ratio: string;
  size?: string;
  refImage?: string;
  resultKind: "image" | "video";
  resultImage: string;
  time: string;
};

const initialMsgs: Msg[] = [
  {
    id: "m1",
    prompt: "一个小男孩在客厅里跳舞,自然光,纪录片风格",
    model: "Seedance 2.0",
    badge: "新",
    ratio: "16:9",
    size: "720p",
    resultKind: "video",
    resultImage: skillReenact,
    time: "18:42",
  },
  {
    id: "m2",
    prompt: "把头发变成红色.",
    model: "Nano Banana Pro",
    ratio: "16:9",
    size: "2K",
    refImage: skillStory,
    resultKind: "image",
    resultImage: skillProduct,
    time: "18:53",
  },
];

export const Route = createFileRoute("/quick")({
  head: () => ({ meta: [{ title: "快速生成 — movieflow.ai" }] }),
  component: QuickPage,
});

function QuickPage() {
  const [msgs, setMsgs] = useState<Msg[]>(initialMsgs);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<"video" | "image" | "music" | "voice">(
    "video",
  );
  const [showMini, setShowMini] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    const handleScroll = () => {
      // Logic for mini input: when scrolled up enough from the bottom
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setShowMini(!isNearBottom);
    };

    el.addEventListener('scroll', handleScroll);
    
    // Initial scroll to bottom
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });

    return () => el.removeEventListener('scroll', handleScroll);
  }, [msgs.length]);

  function submit() {
    const text = input.trim();
    if (!text) return;
    const sample = [skillProduct, skillStory, skillReenact];
    setMsgs((m) => [
      ...m,
      {
        id: String(Date.now()),
        prompt: text,
        model: tab === "image" ? "Nano Banana Pro" : "Seedance 2.0",
        badge: tab === "video" ? "新" : undefined,
        ratio: "16:9",
        size: tab === "image" ? "2K" : "720p",
        resultKind: tab === "image" ? "image" : "video",
        resultImage: sample[m.length % sample.length],
        time: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-black">
      <section className="aurora-bg relative flex flex-1 flex-col overflow-hidden px-8 pt-6">
        <BrandMark />
        <TopBar />

        <div className="mx-auto mb-4 flex w-full max-w-7xl items-center gap-2 pt-16 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-white/90">5.21</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <FilterMenu label="全部时间" options={['全部', '今天', '近7天', '近30天']} />
            <FilterMenu label="全部类型" options={['全部', '图片', '视频', '音乐', '音频']} />
            <FilterMenu label="全部操作" options={['全部', '收藏']} />
          </div>
        </div>

        {/* Conversation stream */}
        <div
          ref={scrollRef}
          className="scrollbar-hide mx-auto w-full max-w-7xl flex-1 space-y-12 overflow-y-auto pb-6 pt-4"
        >
          {msgs.map((m) => (
            <MessageBlock key={m.id} msg={m} />
          ))}
          <div className="h-40" />
        </div>

        {/* Bottom composer container */}
        <div className="absolute bottom-6 left-1/2 w-full max-w-7xl -translate-x-1/2 px-8">
          {showMini ? (
            <div 
              className="mx-auto w-[600px] animate-in fade-in slide-in-from-bottom-4 duration-300"
              onMouseEnter={() => setShowMini(false)}
            >
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 shadow-2xl backdrop-blur-2xl transition hover:bg-black/80">
                <Plus className="h-4 w-4 text-white/40" />
                <div className="flex-1 text-sm text-white/40">使用@快速调用参考能力，支持文本、图片、音频、视频全能参考...</div>
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 text-white/40" />
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white/60">
                    <ArrowUp className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Composer
                tab={tab}
                setTab={setTab}
                input={input}
                setInput={setInput}
                onSubmit={submit}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MessageBlock({ msg }: { msg: Msg }) {
  return (
    <div className="group relative">
      <div className="mb-6 flex items-center gap-2 text-[12px]">
        <Tag>{msg.model}</Tag>
        {msg.size && <Tag>{msg.size}</Tag>}
        <Tag>{msg.ratio}</Tag>
        {msg.badge && (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-400 font-mono">
             <span className="h-1 w-1 rounded-full bg-amber-400" />
            -5
          </span>
        )}
        <span className="ml-auto text-[11px] text-white/20">
          {msg.time}
        </span>
      </div>

      <div className="text-sm leading-relaxed text-white/60 mb-6 max-w-4xl">
        {msg.prompt}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Placeholder for multiple images as shown in ref */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="group/item relative aspect-video overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
            <img
              src={msg.resultImage}
              alt={msg.prompt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-110"
            />
            
            {/* Hover overlay icons */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 backdrop-blur-[2px]">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20">
                <Download className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20">
                <span className="text-[10px] font-bold">HD</span>
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20">
                <Star className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 transition-opacity group-hover/item:opacity-100">
              <span className="text-[10px] text-white/40 bg-black/60 px-1.5 rounded">{i}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3 opacity-60 transition-opacity group-hover:opacity-100">
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10">
          <Edit3 className="h-3.5 w-3.5" />
          重新编辑
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/10">
          <RefreshCw className="h-3.5 w-3.5" />
          重新生成
        </button>
      </div>

      <div className="mt-12 w-full border-b border-white/5" />
    </div>
  );
}

function Composer({
  tab,
  setTab,
  input,
  setInput,
  onSubmit,
}: {
  tab: "video" | "image" | "music" | "voice";
  setTab: (t: "video" | "image" | "music" | "voice") => void;
  input: string;
  setInput: (v: string) => void;
  onSubmit: () => void;
}) {
  const tabs = [
    { id: "video", label: "视频生成", icon: Video },
    { id: "image", label: "图片生成", icon: ImageIcon },
    { id: "music", label: "音乐生成", icon: Music },
    { id: "voice", label: "配音生成", icon: AudioLines },
  ] as const;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-xl">
      {/* Tabs */}
      <div className="grid grid-cols-4 border-b border-border/60">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex items-center justify-center gap-2 py-3 text-sm transition ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              {active && (
                <span className="absolute inset-x-6 -bottom-px h-px bg-foreground" />
              )}
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Input area */}
      <div className="px-5 pt-4">
        <div className="flex items-start gap-3">
          <button className="relative flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 text-muted-foreground transition hover:border-foreground/40 hover:text-foreground">
            <span className="absolute right-1 top-1 rounded bg-background/60 px-1 text-[9px] text-muted-foreground">
              0/9
            </span>
            <Plus className="h-4 w-4" />
            <span className="mt-0.5 text-[10px]">添加</span>
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            rows={2}
            placeholder="使用@快速调用参考能力，支持文本、图片、音频、视频全能参考，例如：@图片1参考 @音频1的音色，模仿@视频1的动作"
            className="min-h-[80px] flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Bottom chips + submit */}
      <div className="flex items-center gap-2 px-5 pb-4 pt-3">
        <ComposerChip label="全能参考" />
        <ComposerChip label="模型" value="Seedance 2.0" badge="新" />
        <ComposerChip label="分辨率" value="720p" badge="测试" />
        <ComposerChip label="比例" value="21:9" />
        <ComposerChip label="时长" value="4s" />
        <div className="ml-auto">
          <button
            onClick={onSubmit}
            disabled={!input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ComposerChip({
  label,
  value,
  badge,
}: {
  label: string;
  value?: string;
  badge?: string;
}) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-foreground/90 transition hover:bg-background/70">
      <span className="text-muted-foreground">{label}</span>
      {value && <span>: {value}</span>}
      {badge && (
        <span className="rounded bg-emerald-500/20 px-1 text-[9px] text-emerald-300">
          {badge}
        </span>
      )}
      <ChevronDown className="h-3 w-3 opacity-60" />
    </button>
  );
}

function FilterMenu({ label, options }: { label: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs transition-all hover:bg-white/10",
          open ? "text-white border-white/20" : "text-white/60"
        )}>
          {selected === options[0] ? label : selected}
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] border-white/10 bg-[#1A1A1A]/95 p-1 backdrop-blur-xl" align="start">
        <div className="flex flex-col gap-0.5">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
              }}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-xs transition-colors hover:bg-white/5",
                selected === opt ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              )}
            >
              {opt}
              {selected === opt && <Check className="h-3 w-3" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:text-white transition-colors">
      {label}
      <ChevronDown className="h-3 w-3" />
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/40">
      {children}
    </span>
  );
}

function ActionBtn({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs text-foreground/90 transition hover:bg-card">
      {icon}
      {children}
    </button>
  );
}
