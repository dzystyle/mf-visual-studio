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
  ArrowUp,
  Sparkles,
} from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
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
    <div className="relative flex h-screen flex-col">
      <section className="aurora-bg relative flex flex-1 flex-col overflow-hidden px-8 pt-6">
        <BrandMark />
        <TopBar />

        <div className="mx-auto mb-4 flex w-full max-w-6xl items-center gap-2 pt-16 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-medium">快速生成</span>
          <div className="ml-auto flex items-center gap-2">
            <FilterChip label="全部时间" />
            <FilterChip label="全部类型" />
            <FilterChip label="全部操作" />
          </div>
        </div>

        {/* Conversation stream */}
        <div
          ref={scrollRef}
          className="scrollbar-hide mx-auto w-full max-w-6xl flex-1 space-y-10 overflow-y-auto pb-6"
        >
          {msgs.map((m) => (
            <MessageBlock key={m.id} msg={m} />
          ))}
        </div>

        {/* Bottom composer */}
        <div className="mx-auto w-full max-w-6xl pb-6">
          <Composer
            tab={tab}
            setTab={setTab}
            input={input}
            setInput={setInput}
            onSubmit={submit}
          />
        </div>
      </section>
    </div>
  );
}

function MessageBlock({ msg }: { msg: Msg }) {
  return (
    <div className="border-b border-border/40 pb-8">
      {msg.refImage && (
        <img
          src={msg.refImage}
          alt="ref"
          className="mb-3 h-20 w-28 rounded-lg object-cover"
        />
      )}
      <div className="flex items-center gap-2 text-[12px]">
        <Tag>{msg.model}</Tag>
        {msg.size && <Tag>{msg.size}</Tag>}
        <Tag>{msg.ratio}</Tag>
        {msg.badge && (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-400">
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            -14
          </span>
        )}
        <span className="ml-1 text-foreground/80">{msg.prompt}</span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          {msg.time}
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card/60">
        <div className="relative aspect-video w-full max-w-3xl">
          <img
            src={msg.resultImage}
            alt={msg.prompt}
            className="h-full w-full object-cover"
          />
          {msg.resultKind === "video" && (
            <div className="absolute right-3 top-3 rounded-md bg-black/50 px-2 py-0.5 text-[11px] text-foreground/90 backdrop-blur">
              4s
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <ActionBtn icon={<Edit3 className="h-3.5 w-3.5" />}>手动编辑</ActionBtn>
        <ActionBtn icon={<RefreshCw className="h-3.5 w-3.5" />}>
          重新生成
        </ActionBtn>
      </div>
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
            placeholder={`'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''\n                                            \n                                            这个是画布模式,是根据底部的这个菜单来进行切换画布模式和列表模式.`}
            className="min-h-16 flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
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

function FilterChip({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-1 rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted-foreground hover:text-foreground">
      {label}
      <ChevronDown className="h-3 w-3" />
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-background/60 px-2 py-0.5 text-[11px] text-foreground/80">
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
