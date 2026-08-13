import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  ChevronRight, 
  LayoutGrid, 
  Plus, 
  ArrowUp, 
  Mic, 
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Video,
  X,
  Search
} from "lucide-react";
import { BrandMark, TopBar } from "@/components/TopBar";
import { cn } from "@/lib/utils";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import charSam from "@/assets/char-sam.jpg";
import charBoss from "@/assets/char-boss.jpg";
import skillReenact from "@/assets/skill-reenact.jpg";

type Search = { prompt?: string };

export const Route = createFileRoute("/creative-assistant")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    prompt: typeof s.prompt === "string" ? s.prompt : undefined,
  }),
  head: () => ({
    meta: [{ title: "创作助手 — Artrail" }],
  }),
  component: CreativeAssistantPage,
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content?: string;
  card?: React.ReactNode;
  timestamp: string;
  attachments?: { name: string; type: string; url?: string }[];
};

function CreativeAssistantPage() {
  const { prompt } = Route.useSearch();
  const [showResources, setShowResources] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "user",
      content: prompt || "我想生成掌趣的一拳超人的游戏宣发视频。",
      timestamp: "2026/8/13 14:32:15",
    },
    {
      id: "2",
      role: "assistant",
      content: "掌趣一拳超人游戏宣发，埼玉一拳秒杀的震撼感很适合做营销短视频的开场钩子。我先确认几个关键信息，帮你把方向定准。",
      timestamp: "2026/8/13 14:33:02",
    },
    {
      id: "3",
      role: "assistant",
      card: <DurationChoiceCard />,
      timestamp: "2026/8/13 14:33:05",
    },
    {
      id: "4",
      role: "user",
      content: "我已确认以上信息",
      timestamp: "2026/8/13 14:34:37",
    },
    {
      id: "5",
      role: "assistant",
      content: "收到，15秒内的热血燃战风格，突出角色和战斗特效。请把你的素材上传上来，我基于你的素材来制作营销短视频。",
      timestamp: "2026/8/13 14:37:18",
    },
  ]);

  return (
    <div className="flex h-screen flex-col bg-[#0A0A0A] text-foreground overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto"><BrandMark /></div>
        <div className="pointer-events-auto"><TopBar /></div>
      </div>

      <div className="flex flex-1 overflow-hidden pt-20">
        {/* Main Chat Area */}
        <div className={cn(
          "flex flex-1 flex-col transition-all duration-500 ease-in-out relative",
          showResources ? "mr-[400px]" : "mr-0"
        )}>
          <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
            <div className="mx-auto max-w-3xl space-y-8">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  {msg.content && (
                    <div className={cn(
                      "max-w-[85%] px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user" 
                        ? "rounded-2xl rounded-tr-sm bg-white/10 text-white" 
                        : "text-white/90"
                    )}>
                      {msg.content}
                    </div>
                  )}
                  {msg.card}
                  <div className="text-[10px] text-white/20 px-1">{msg.timestamp}</div>
                </div>
              ))}
              
              {/* Image attachment dummy in chat */}
              <div className="flex flex-col items-start gap-2">
                <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={charSam} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Input Area */}
          <div className="px-6 pb-8">
            <div className="mx-auto max-w-4xl">
              <div className="glass rounded-3xl border border-white/10 bg-white/[0.03] p-4 shadow-2xl backdrop-blur-3xl">
                <textarea 
                  rows={1}
                  placeholder="与综合助手对话，支持多种能力..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none resize-none px-2"
                />
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 transition">
                      <Plus className="h-4 w-4" />
                    </button>
                    <div className="h-4 w-px bg-white/10 mx-1" />
                    
                    <button className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/60">
                      <div className="w-3.5 h-2.5 border border-current rounded-[1px]" />
                      16:9 (横屏)
                      <ChevronDown className="h-3 w-3" />
                    </button>

                    <button className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/60">
                      <LayoutGrid className="h-3 w-3" />
                      技能
                      <ChevronDown className="h-3 w-3" />
                    </button>

                    <button className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/60 uppercase">
                      720P
                    </button>

                    <button className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/60 uppercase">
                      2K
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-white/20 hover:text-white/40 transition">
                      <Mic className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/20">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center text-[10px] text-white/10">
                AI 可能会犯错，内容仅供参考，请核查重要信息。
              </div>
            </div>
          </div>
          
          {/* Floating Resource Toggle */}
          <button 
            onClick={() => setShowResources(!showResources)}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-2 px-3 py-6 bg-white/5 border border-white/10 rounded-l-2xl backdrop-blur-xl transition-all duration-500",
              showResources ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
            )}
          >
            <LayoutGrid className="h-4 w-4 text-white/60" />
            <span className="text-[11px] [writing-mode:vertical-lr] text-white/60 font-medium tracking-widest">查看对话资源</span>
          </button>
        </div>

        {/* Resources Panel */}
        <AnimatePresence>
          {showResources && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[600px] z-[100] bg-[#121212] border-l border-white/5 flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-6">
                  <h2 className="text-lg font-bold">资源</h2>
                  <div className="flex items-center bg-white/5 rounded-lg p-1">
                    <button className="p-1.5 bg-white/10 rounded-md"><LayoutGrid className="h-4 w-4" /></button>
                    <button className="p-1.5 text-white/40"><ChevronDown className="h-4 w-4 rotate-180" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                    <input 
                      type="text" 
                      placeholder="查找..." 
                      className="bg-white/5 border border-white/10 rounded-full pl-8 pr-4 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none w-48"
                    />
                  </div>
                  <button onClick={() => setShowResources(false)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {/* Documents */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">文稿</h3>
                    <span className="text-[10px] text-white/20">共 5 个</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ResourceCard title="video-projects_20260813-14..." type="JSON" date="1小时前" />
                    <ResourceCard title="video-projects_20260813-14..." type="JSON" date="25分钟前" />
                    <ResourceCard title="final-generation-info.md" type="MD" date="1小时前" />
                    <ResourceCard title="story-brief.md" type="MD" date="1小时前" />
                    <ResourceCard title="story-script.md" type="MD" date="1小时前" />
                  </div>
                </section>

                {/* Images */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">图片</h3>
                    <span className="text-[10px] text-white/20">共 2 个</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ImageResourceCard title="user_upload_image_1.webp" type="WEBP" date="1小时前" img={charSam} />
                    <ImageResourceCard title="genos-reference.png" type="PNG" date="1小时前" img={charBoss} />
                  </div>
                </section>

                {/* Videos */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">视频</h3>
                    <span className="text-[10px] text-white/20">共 1 个</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ImageResourceCard title="intro-animation.mp4" type="MP4" date="刚刚" img={skillReenact} />
                  </div>
                </section>
              </div>
              
              {/* Collapse handle */}
              <button 
                onClick={() => setShowResources(false)}
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-6 bg-[#121212] border border-white/5 rounded-full flex items-center justify-center text-white/40 hover:text-white"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Question Mark */}
      <div className="fixed bottom-6 right-6">
        <button className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
          <span className="text-sm font-bold">?</span>
        </button>
      </div>
    </div>
  );
}

function DurationChoiceCard() {
  return (
    <div className="w-full max-w-xl glass border border-white/10 rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-white/90">视频时长希望控制在多少秒以内？</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40 font-medium">已提交</span>
          <div className="flex items-center gap-1">
            <button className="text-white/20"><ChevronRight className="h-4 w-4 rotate-180" /></button>
            <span className="text-[11px] text-white/40">1/4</span>
            <button className="text-white/20"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <ChoiceItem 
          num="1" 
          label="15秒以内" 
          desc="节奏紧凑，适合信息流投放" 
          active 
        />
        <ChoiceItem 
          num="2" 
          label="15-30秒" 
          desc="可展示更多角色和玩法细节" 
        />
        <ChoiceItem 
          num="3" 
          label="30-60秒" 
          desc="完整剧情+玩法展示" 
        />
      </div>
    </div>
  );
}

function ChoiceItem({ num, label, desc, active = false }: { num: string; label: string; desc: string; active?: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl transition-all border",
      active ? "bg-white/10 border-white/10 shadow-lg" : "bg-white/[0.02] border-transparent"
    )}>
      <div className={cn(
        "h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
        active ? "bg-white/40 text-white" : "bg-white/10 text-white/20"
      )}>
        {num}
      </div>
      <div>
        <div className={cn("text-sm font-bold", active ? "text-white" : "text-white/60")}>{label}</div>
        <div className="text-[11px] text-white/20 mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function ResourceCard({ title, type, date }: { title: string; type: string; date: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 group hover:border-white/10 transition">
      <div className="h-24 w-full bg-white/5 rounded-xl flex items-center justify-center">
        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{type}</div>
      </div>
      <div>
        <div className="text-[11px] font-medium text-white/80 truncate mb-1">{title}</div>
        <div className="text-[9px] text-white/20 flex items-center gap-2">
          <span>文稿</span>
          <span>·</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

function ImageResourceCard({ title, type, date, img }: { title: string; type: string; date: string; img: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 group hover:border-white/10 transition">
      <div className="h-24 w-full rounded-xl overflow-hidden relative border border-white/5">
        <img src={img} className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[8px] font-bold text-white/60 uppercase">{type}</div>
      </div>
      <div>
        <div className="text-[11px] font-medium text-white/80 truncate mb-1">{title}</div>
        <div className="text-[9px] text-white/20 flex items-center gap-2">
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
