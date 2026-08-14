import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect, Dispatch, SetStateAction, useCallback } from "react";
import { toast } from "sonner";
import { XCircle, RotateCcw, Loader2 } from "lucide-react";
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
import { VideoHdDialog } from "@/components/VideoHdDialog";
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
  status?: "success" | "failed" | "processing";
  progress?: number;
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
  {
    id: "m3",
    prompt: "生成直播带货的视频",
    model: "OmniHuman 1.5",
    ratio: "16:9",
    size: "720p",
    resultKind: "video",
    resultImage: skillReenact,
    status: "failed",
    time: "19:02",
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
  const [hdOpen, setHdOpen] = useState(false);
  const [attachments, setAttachments] = useState<{ id: string; url: string; name: string }[]>([]);
  const [mentions, setMentions] = useState<{ id: string; url: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    
    // Simulate failure if prompt contains "fail" or "失败"
    const isFailed = text.toLowerCase().includes("fail") || text.includes("失败");
    const id = String(Date.now());
    
    const sample = [skillProduct, skillStory, skillReenact];
    const newMsg: Msg = {
      id,
      prompt: text,
      model: tab === "image" ? "Nano Banana Pro" : "Seedance 2.0",
      badge: tab === "video" ? "新" : undefined,
      ratio: "16:9",
      size: tab === "image" ? "2K" : "720p",
      resultKind: tab === "image" ? "image" : "video",
      resultImage: sample[msgs.length % sample.length],
      status: "processing",
      progress: 0,
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMsgs((m) => [...m, newMsg]);
    setInput("");

    // Simulate progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15;
      if (prog >= 100) {
        clearInterval(interval);
        setMsgs(prev => prev.map(m => 
          m.id === id ? { ...m, status: isFailed ? "failed" : "success", progress: 100 } : m
        ));
      } else {
        setMsgs(prev => prev.map(m => 
          m.id === id ? { ...m, progress: Math.floor(prog) } : m
        ));
      }
    }, 800);
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <section className="aurora-bg relative flex flex-1 flex-col overflow-hidden px-8 pt-6">
        <BrandMark />
        <TopBar />

        <div className="mx-auto mb-4 flex w-full max-w-7xl items-center gap-2 pt-16 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground/90">5.21</span>
          </div>
          <div className="ml-auto flex items-center overflow-hidden rounded-full border border-border bg-background/50 backdrop-blur-sm">
            <FilterMenu label="全部时间" options={['全部', '今天', '近7天', '近30天']} isFirst />
            <div className="h-4 w-[1px] bg-border" />
            <FilterMenu label="全部类型" options={['全部', '图片', '视频', '音乐', '音频']} />
            <div className="h-4 w-[1px] bg-border" />
            <FilterMenu label="全部操作" options={['全部', '收藏']} isLast />
          </div>
        </div>

        {/* Conversation stream */}
        <div
          ref={scrollRef}
          className="scrollbar-hide mx-auto w-full max-w-7xl flex-1 space-y-12 overflow-y-auto pt-4"
        >
          {msgs.map((m) => (
            <MessageBlock key={m.id} msg={m} onHdClick={() => setHdOpen(true)} />
          ))}
          <VideoHdDialog open={hdOpen} onOpenChange={setHdOpen} />
          <div className="h-40" />
        </div>

        {/* Bottom composer container */}
        <div className="absolute bottom-6 left-1/2 w-full max-w-7xl -translate-x-1/2 px-8 z-[50]">
          {showMini ? (
            <div 
              className="mx-auto w-[600px] animate-in fade-in slide-in-from-bottom-4 duration-300"
              onMouseEnter={() => setShowMini(false)}
            >
              <div className="flex items-center gap-3 rounded-full border border-border bg-background/60 px-4 py-2 shadow-2xl backdrop-blur-2xl transition hover:bg-background/80">
                <Plus className="h-4 w-4 text-muted-foreground/40" />
                <div className="flex-1 text-sm text-muted-foreground/40">使用@快速调用参考能力，支持文本、图片、音频、视频全能参考...</div>
                <div className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 text-muted-foreground/40" />
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 text-foreground/60">
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
                attachments={attachments}
                setAttachments={setAttachments}
                mentions={mentions}
                setMentions={setMentions}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MessageBlock({ msg, onHdClick }: { msg: Msg; onHdClick?: () => void }) {
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
        <span className="ml-auto text-[11px] text-muted-foreground/40">
          {msg.time}
        </span>
      </div>

      <div className="text-sm leading-relaxed text-foreground/60 mb-6 max-w-4xl">
        {msg.prompt}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {msg.status === "processing" ? (
          <>
            {[1, 2].map((i) => (
              <div key={i} className="group/item relative aspect-video overflow-hidden rounded-xl border border-border flex flex-col items-center justify-center gap-4 bg-muted/20">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <Loader2 className="h-8 w-8 text-foreground/40 animate-spin" />
                  <svg className="absolute inset-0 h-full w-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      className="text-foreground/5"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={175.9}
                      strokeDashoffset={175.9 * (1 - (msg.progress || 0) / 100)}
                      className="text-foreground/60 transition-all duration-500 ease-out"
                    />
                  </svg>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xs font-medium text-foreground/60">正在生成中...</div>
                  <div className="text-[10px] text-foreground/30 font-mono">{msg.progress}%</div>
                </div>
              </div>
            ))}
          </>
        ) : msg.status === "failed" ? (
          <>
            {[1, 2].map((i) => (
              <div key={i} className="group/item relative aspect-video overflow-hidden rounded-xl border border-border flex flex-col items-center justify-center gap-4 bg-muted/20">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div className="text-sm text-foreground/60">生成失败</div>
                
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs text-white/40 transition hover:bg-white/10 hover:text-white/60">
                    <RotateCcw className="h-3.5 w-3.5" />
                    重试
                  </button>
                  <button className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs text-white/40 transition hover:bg-white/10 hover:text-white/60">
                    <Trash2 className="h-3.5 w-3.5" />
                    删除
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="group/item relative aspect-video overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]">
              <img
                src={msg.resultImage}
                alt={msg.prompt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-110"
              />
              
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100 backdrop-blur-[2px]">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20">
                  <Download className="h-4 w-4" />
                </button>
                <button 
                  onClick={onHdClick}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
                >
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
          ))
        )}
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
  attachments,
  setAttachments,
  mentions,
  setMentions,
}: {
  tab: "video" | "image" | "music" | "voice";
  setTab: (t: "video" | "image" | "music" | "voice") => void;
  input: string;
  setInput: (v: string) => void;
  onSubmit: () => void;
  attachments: { id: string; url: string; name: string }[];
  setAttachments: Dispatch<SetStateAction<{ id: string; url: string; name: string }[]>>;
  mentions: { id: string; url: string; name: string }[];
  setMentions: Dispatch<SetStateAction<{ id: string; url: string; name: string }[]>>;
}) {
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textBeforeCursor = input.slice(0, cursorPos);
    const lastAtPos = textBeforeCursor.lastIndexOf("@");
    
    if (lastAtPos !== -1) {
      const afterAt = textBeforeCursor.slice(lastAtPos + 1);
      if (!afterAt.includes(" ")) {
        setMentionOpen(true);
        setMentionFilter(afterAt);
      } else {
        setMentionOpen(false);
      }
    } else {
      setMentionOpen(false);
    }
  }, [input, cursorPos]);

  const handleMentionSelect = (name: string, url: string) => {
    const textBeforeCursor = input.slice(0, cursorPos);
    const lastAtPos = textBeforeCursor.lastIndexOf("@");
    
    let newInput: string;
    let newCursorPos: number;

    if (lastAtPos !== -1 && !textBeforeCursor.slice(lastAtPos).includes(" ")) {
      const before = input.slice(0, lastAtPos);
      const after = input.slice(cursorPos);
      // Remove the @mention text entirely from input
      newInput = `${before.trimEnd()}${after.startsWith(" ") ? after : " " + after}`.trim();
      newCursorPos = before.trimEnd().length;
    } else {
      newInput = input;
      newCursorPos = cursorPos;
    }

    setInput(newInput);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPos(newCursorPos);
      }
    }, 0);
    
    setMentionOpen(false);
    
    // Add to mentions list for visual chip display below input
    if (!mentions.find((a: any) => a.url === url)) {
      setMentions((prev: any) => [...prev, { id: `${Date.now()}-${name}`, name, url }]);
    }
  };

  const onFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";

    const validFiles: { id: string; url: string; name: string }[] = [];
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    
    for (const file of files) {
      // 1. Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.custom((t) => (
          <div className="flex w-[400px] items-center gap-3 rounded-xl border border-white/5 bg-[#1A1111]/90 px-4 py-3 text-white/90 shadow-2xl backdrop-blur-xl">
            <XCircle className="h-5 w-5 text-red-500 shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium tracking-wide">{file.name}</div>
              <div className="text-[11px] text-white/40 mt-0.5">文件过大 (上限 50MB)</div>
            </div>
            <button onClick={() => toast.dismiss(t)} className="text-white/20 hover:text-white/40 transition">
              <Plus className="h-4 w-4 rotate-45" />
            </button>
          </div>
        ), { duration: 4000 });
        continue;
      }

      const objectUrl = URL.createObjectURL(file);

      // 2. Video validation
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        const duration = await new Promise<number>((resolve) => {
          video.onloadedmetadata = () => resolve(video.duration);
          video.onerror = () => resolve(-1); // -1 indicates load error
          video.src = objectUrl;
        });

        if (duration === -1) {
          toast.custom((t) => (
            <div className="flex w-[400px] items-center gap-3 rounded-xl border border-white/5 bg-[#1A1111]/90 px-4 py-3 text-white/90 shadow-2xl backdrop-blur-xl">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium tracking-wide">{file.name}</div>
                <div className="text-[11px] text-white/40 mt-0.5">视频文件损坏或无法识别</div>
              </div>
              <button onClick={() => toast.dismiss(t)} className="text-white/20 hover:text-white/40 transition">
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            </div>
          ), { duration: 4000 });
          URL.revokeObjectURL(objectUrl);
          continue;
        }

        if (duration < 2 || duration > 30) {
          toast.custom((t) => (
            <div className="flex w-[400px] items-center gap-3 rounded-xl border border-white/5 bg-[#1A1111]/90 px-4 py-3 text-white/90 shadow-2xl backdrop-blur-xl">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium tracking-wide">{file.name}</div>
                <div className="text-[11px] text-white/40 mt-0.5">视频时长需在 2s ~ 30s 之间 (当前: {Math.round(duration)}s)</div>
              </div>
              <button onClick={() => toast.dismiss(t)} className="text-white/20 hover:text-white/40 transition">
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            </div>
          ), { duration: 4000 });
          URL.revokeObjectURL(objectUrl);
          continue;
        }
      } 
      // 3. Image validation
      else if (file.type.startsWith('image/')) {
        const img = new Image();
        const dimensions = await new Promise<{ width: number; height: number; error: boolean }>((resolve) => {
          img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight, error: false });
          img.onerror = () => resolve({ width: 0, height: 0, error: true });
          img.src = objectUrl;
        });

        if (dimensions.error) {
          toast.custom((t) => (
            <div className="flex w-[400px] items-center gap-3 rounded-xl border border-white/5 bg-[#1A1111]/90 px-4 py-3 text-white/90 shadow-2xl backdrop-blur-xl">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium tracking-wide">{file.name}</div>
                <div className="text-[11px] text-white/40 mt-0.5">图片文件损坏或无法识别</div>
              </div>
              <button onClick={() => toast.dismiss(t)} className="text-white/20 hover:text-white/40 transition">
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            </div>
          ), { duration: 4000 });
          URL.revokeObjectURL(objectUrl);
          continue;
        }

        if (dimensions.width < 480 || dimensions.width > 8192 || dimensions.height < 480 || dimensions.height > 8192) {
          toast.custom((t) => (
            <div className="flex w-[400px] items-center gap-3 rounded-xl border border-white/5 bg-[#1A1111]/90 px-4 py-3 text-white/90 shadow-2xl backdrop-blur-xl">
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium tracking-wide">{file.name}</div>
                <div className="text-[11px] text-white/40 mt-0.5">尺寸不合规 (需在 480px 到 8192px 之间, 当前: {dimensions.width}x{dimensions.height})</div>
              </div>
              <button onClick={() => toast.dismiss(t)} className="text-white/20 hover:text-white/40 transition">
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            </div>
          ), { duration: 4000 });
          URL.revokeObjectURL(objectUrl);
          continue;
        }
      } else {
        // 4. Unsupported format
        toast.custom((t) => (
          <div className="flex w-[400px] items-center gap-3 rounded-xl border border-white/5 bg-[#1A1111]/90 px-4 py-3 text-white/90 shadow-2xl backdrop-blur-xl">
            <XCircle className="h-5 w-5 text-red-500 shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium tracking-wide">{file.name}</div>
              <div className="text-[11px] text-white/40 mt-0.5">不支持的文件格式</div>
            </div>
            <button onClick={() => toast.dismiss(t)} className="text-white/20 hover:text-white/40 transition">
              <Plus className="h-4 w-4 rotate-45" />
            </button>
          </div>
        ), { duration: 4000 });
        URL.revokeObjectURL(objectUrl);
        continue;
      }

      validFiles.push({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        url: objectUrl,
      });
    }

    if (validFiles.length > 0) {
      setAttachments((prev) => [...prev, ...validFiles]);
    }
  }, [setAttachments]);
  const tabs = [
    { id: "video", label: "视频生成", icon: Video },
    { id: "image", label: "图片生成", icon: ImageIcon },
    { id: "music", label: "音乐生成", icon: Music },
    { id: "voice", label: "配音生成", icon: AudioLines },
  ] as const;

  const [videoMode, setVideoMode] = useState("全能参考");
  const [model, setModel] = useState("Seedance 2.0");
  const [resolution, setResolution] = useState("720p");
  const [ratio, setRatio] = useState("21:9");
  const [duration, setDuration] = useState("4s");

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

      <div className="px-5 pt-4">
        {/* Row 1: Add Image button */}
        <div className="mb-4 flex items-center gap-3">
          {attachments.map((a) => (
            <div key={a.id} className="relative group h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-white/10">
              <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setAttachments(prev => prev.filter(x => x.id !== a.id))}
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                <Plus className="h-3 w-3 rotate-45" />
              </button>
            </div>
          ))}
          {attachments.length < 50 && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="relative flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-white/40 transition hover:border-white/20 hover:text-white/60"
            >
              <span className="absolute right-1 top-1 rounded bg-black/40 px-1 text-[9px] text-white/40">
                {attachments.length}/50
              </span>
              <Plus className="h-4 w-4" />
              <span className="mt-0.5 text-[10px]">添加</span>
            </button>
          )}
          <input ref={fileInputRef} type="file" multiple className="hidden" accept="image/*,video/*" onChange={onFiles} />
        </div>


        {/* Row 3: Textarea + Mention Popover */}
        <div className="relative z-50 flex flex-col gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {mentions.map((a: any) => (
              <div key={a.id} className="inline-flex h-[32px] items-center gap-2 rounded-lg bg-white/10 border border-white/5 pl-1.5 pr-2 py-1 text-xs text-white/90">
                <div className="h-5 w-5 shrink-0 rounded overflow-hidden border border-white/10">
                  <img src={a.url} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="leading-none">{a.name}</span>
                <button 
                  onClick={() => setMentions((prev: any) => prev.filter((x: any) => x.id !== a.id))}
                  className="hover:text-white transition-colors"
                >
                  <Plus className="h-3 w-3 rotate-45 text-muted-foreground" />
                </button>
              </div>
            ))}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setCursorPos(e.target.selectionStart);
              }}
              onKeyUp={(e) => setCursorPos((e.target as HTMLTextAreaElement).selectionStart)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              rows={1}
              placeholder="使用@快速调用参考能力"
              className="flex-1 min-w-[200px] min-h-[32px] self-center bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none py-1.5"
            />
          </div>
          
          {mentionOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 w-72 bg-[#1A1A1A]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-[99999] animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="p-3 border-b border-white/5">
                <div className="relative">
                  <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground rotate-45" />
                  <input 
                    autoFocus
                    type="text" 
                    value={mentionFilter}
                    onChange={(e) => setMentionFilter(e.target.value)}
                    placeholder="搜索素材、角色、商品..."
                    className="w-full bg-white/5 border-none rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-muted-foreground focus:ring-1 focus:ring-white/10 focus:outline-none"
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-hide">
                <div className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">最近使用</div>
                {attachments.length === 0 ? (
                  <div className="px-2 py-8 text-center">
                    <div className="text-[11px] text-muted-foreground">暂无可用资源</div>
                    <div className="text-[10px] text-muted-foreground/60 mt-1">请先上传图片或视频</div>
                  </div>
                ) : (
                  attachments
                    .filter(i => i.name.toLowerCase().includes(mentionFilter.toLowerCase()))
                    .map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => handleMentionSelect(item.name, item.url)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition group"
                      >
                        <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden border border-white/5">
                          <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs font-medium text-white group-hover:text-aurora-purple transition truncate max-w-[160px]">{item.name}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {item.name.match(/\.(mp4|webm|ogg|mov)$/i) ? '视频' : '图片'}
                          </div>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 pb-4 pt-3">
        <button 
          onClick={() => {
            const before = input.slice(0, cursorPos);
            const after = input.slice(cursorPos);
            setInput(before + "@" + after);
            textareaRef.current?.focus();
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background/40 text-muted-foreground hover:bg-background/70 transition"
        >
          <span className="text-sm font-medium">@</span>
        </button>
        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-foreground/90 transition hover:bg-background/70">
              <span className="text-muted-foreground">{videoMode}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-36 p-1 border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-xl shadow-2xl">
            {["全能参考", "图生视频", "首尾帧生视频", "对口型数字人"].map((item) => (
              <button 
                key={item}
                onClick={() => setVideoMode(item)}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${videoMode === item ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                {item}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-foreground/90 transition hover:bg-background/70">
              <span className="text-muted-foreground">模型</span>
              <span>: {model}</span>
              <span className="rounded bg-emerald-500/20 px-1 text-[9px] text-emerald-300">新</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-48 p-1 border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-xl shadow-2xl">
            {["Seedance 2.0", "Seedance 2.5", "Seedance 1.5"].map((m) => (
              <button 
                key={m}
                onClick={() => setModel(m)}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${model === m ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                {m}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-foreground/90 transition hover:bg-background/70">
              <span className="text-muted-foreground">分辨率</span>
              <span>: {resolution}</span>
              <span className="rounded bg-emerald-500/20 px-1 text-[9px] text-emerald-300">测试</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-32 p-1 border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-xl shadow-2xl">
            {["480p", "720p", "1080p"].map((res) => (
              <button 
                key={res}
                onClick={() => setResolution(res)}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${resolution === res ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                {res}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-foreground/90 transition hover:bg-background/70">
              <span className="text-muted-foreground">比例</span>
              <span>: {ratio}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-24 p-1 border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-xl shadow-2xl">
            {["21:9", "16:9", "4:3", "1:1", "9:16"].map((r) => (
              <button 
                key={r}
                onClick={() => setRatio(r)}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${ratio === r ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                {r}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs text-foreground/90 transition hover:bg-background/70">
              <span className="text-muted-foreground">时长</span>
              <span>: {duration}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-24 p-1 border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-xl shadow-2xl">
            {["4s", "10s", "30s"].map((d) => (
              <button 
                key={d}
                onClick={() => setDuration(d)}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${duration === d ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                {d}
              </button>
            ))}
          </PopoverContent>
        </Popover>

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

function FilterMenu({ label, options, isFirst, isLast }: { label: string; options: string[]; isFirst?: boolean; isLast?: boolean }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={cn(
          "inline-flex items-center gap-1.5 px-4 py-1.5 text-xs transition-all hover:bg-white/5",
          open ? "text-white" : "text-white/60",
          isFirst && "rounded-l-full pl-5",
          isLast && "rounded-r-full pr-5",
          !isFirst && !isLast && "",
          "bg-[#1A1A1A]/40"
        )}>
          {selected === options[0] ? label : selected}
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] border-white/10 bg-[#1A1A1A]/95 p-1 shadow-2xl backdrop-blur-xl" align={isLast ? "end" : "start"}>
        <div className="flex flex-col gap-0.5">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setSelected(opt);
                setOpen(false);
              }}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-[13px] transition-colors hover:bg-white/5",
                selected === opt ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              )}
            >
              {opt}
              {selected === opt && <Check className="h-3 w-3 text-white/40" />}
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
