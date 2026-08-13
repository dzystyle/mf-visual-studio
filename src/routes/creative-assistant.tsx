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
    <div className="flex h-screen flex-col bg-[#F5F5F7] text-[#1D1D1F] overflow-hidden font-sans">
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <BrandMark variant="dark" />
        </div>
        <div className="pointer-events-auto">
          <TopBar variant="light" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden pt-20">
        {/* Main Chat Area */}
        <div className={cn(
          "flex flex-1 flex-col transition-all duration-500 ease-in-out relative",
          showResources ? "mr-[600px]" : "mr-0"
        )}>
          <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
            <div className="mx-auto max-w-4xl space-y-10">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex flex-col gap-3",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  {msg.content && (
                    <div className={cn(
                      "max-w-[85%] px-5 py-3 text-[15px] leading-relaxed tracking-tight shadow-sm",
                      msg.role === "user" 
                        ? "rounded-2xl rounded-tr-sm bg-[#FFFFFF] text-[#1D1D1F] border border-[#E5E5E7]" 
                        : "text-[#1D1D1F] font-medium"
                    )}>
                      {msg.content}
                    </div>
                  )}
                  {msg.card}
                  
                  {/* Status indicators like in reference image */}
                  {msg.role === 'assistant' && msg.id === '2' && (
                    <div className="flex flex-col gap-2 w-full max-w-xl">
                       <StatusLine icon="check" text="读取文件" subText="查看用户上传的一拳超人素材" />
                    </div>
                  )}

                  {msg.role === 'assistant' && msg.id === '5' && (
                    <div className="flex flex-col gap-2 w-full max-w-xl">
                       <StatusLine icon="check" text="技能学习" subText="营销视频大师" />
                       <StatusLine icon="loading" text="正在加载技能: 营销视频大师" />
                       <StatusLine icon="check" text="任务规划" />
                    </div>
                  )}

                  <div className="text-[11px] text-[#86868B] px-1 font-medium">{msg.timestamp}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Input Area */}
          <div className="px-6 pb-10">
            <div className="mx-auto max-w-5xl">
              <div className="bg-[#FFFFFF] rounded-[2.5rem] border border-[#E5E5E7] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.04)] transition-all focus-within:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                <div className="flex flex-wrap gap-2 px-4 mb-2">
                   {/* Prompt chips could go here */}
                </div>
                <textarea 
                  rows={1}
                  placeholder="与综合助手对话，支持多种能力..."
                  className="w-full bg-transparent text-[16px] text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none resize-none px-4 py-2 font-medium"
                />
                <div className="mt-4 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2.5">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5E7] transition-colors border border-transparent active:scale-95">
                      <Plus className="h-5 w-5" />
                    </button>
                    <div className="h-5 w-px bg-[#E5E5E7] mx-1" />
                    
                    <button className="flex items-center gap-2 rounded-full border border-[#E5E5E7] bg-[#F5F5F7] px-4 py-2 text-[13px] font-semibold text-[#1D1D1F] hover:bg-[#E5E5E7] transition-all">
                      <div className="w-4 h-3 border-2 border-current rounded-[2px]" />
                      16:9 (横屏)
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>

                    <button className="flex items-center gap-2 rounded-full border border-[#E5E5E7] bg-[#F5F5F7] px-4 py-2 text-[13px] font-semibold text-[#1D1D1F] hover:bg-[#E5E5E7] transition-all">
                      <LayoutGrid className="h-4 w-4" />
                      技能
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>

                    <button className="flex items-center gap-2 rounded-full border border-[#E5E5E7] bg-[#F5F5F7] px-4 py-2 text-[13px] font-bold text-[#1D1D1F] hover:bg-[#E5E5E7] transition-all uppercase tracking-tight">
                      720P
                    </button>

                    <button className="flex items-center gap-2 rounded-full border border-[#E5E5E7] bg-[#F5F5F7] px-4 py-2 text-[13px] font-bold text-[#1D1D1F] hover:bg-[#E5E5E7] transition-all uppercase tracking-tight">
                      2K
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-[#86868B] hover:text-[#1D1D1F] transition-colors p-2 rounded-full hover:bg-[#F5F5F7]">
                      <Mic className="h-5 w-5" />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#000000] text-[#FFFFFF] shadow-lg hover:bg-[#1D1D1F] transition-all active:scale-90">
                      <ArrowUp className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center text-[11px] text-[#86868B] font-medium">
                AI 可能会犯错，内容仅供参考，请核查重要信息。
              </div>
            </div>
          </div>
          
          {/* Floating Resource Toggle */}
          <button 
            onClick={() => setShowResources(!showResources)}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-2 px-3 py-8 bg-[#FFFFFF] border border-[#E5E5E7] rounded-l-[1.5rem] shadow-xl transition-all duration-500 hover:pr-5 group",
              showResources ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
            )}
          >
            <LayoutGrid className="h-5 w-5 text-[#1D1D1F]" />
            <span className="text-[12px] [writing-mode:vertical-lr] text-[#1D1D1F] font-bold tracking-widest uppercase py-2">查看对话资源</span>
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
              className="fixed top-0 right-0 bottom-0 w-[600px] z-[100] bg-[#FFFFFF] border-l border-[#E5E5E7] flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-[#E5E5E7]">
                <div className="flex items-center gap-6">
                  <h2 className="text-xl font-bold text-[#1D1D1F]">资源</h2>
                  <div className="flex items-center bg-[#F5F5F7] rounded-lg p-1 border border-[#E5E5E7]">
                    <button className="p-1.5 bg-[#FFFFFF] rounded-md shadow-sm text-[#1D1D1F]"><LayoutGrid className="h-4 w-4" /></button>
                    <button className="p-1.5 text-[#86868B] hover:text-[#1D1D1F]"><ChevronDown className="h-4 w-4 rotate-180" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868B]" />
                    <input 
                      type="text" 
                      placeholder="查找..." 
                      className="bg-[#F5F5F7] border border-[#E5E5E7] rounded-full pl-9 pr-4 py-2 text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 w-56 transition-all"
                    />
                  </div>
                  <button onClick={() => setShowResources(false)} className="text-[#86868B] hover:text-[#1D1D1F] p-1 rounded-full hover:bg-[#F5F5F7] transition-colors"><X className="h-6 w-6" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
                {/* Documents */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[13px] font-bold text-[#86868B] uppercase tracking-[0.1em] flex items-center gap-2">文稿</h3>
                    <span className="text-[12px] text-[#86868B] font-medium">共 5 个</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <ResourceCard title="video-projects_20260813-14..." type="JSON" date="1小时前" />
                    <ResourceCard title="video-projects_20260813-14..." type="JSON" date="25分钟前" />
                    <ResourceCard title="final-generation-info.md" type="MD" date="1小时前" />
                    <ResourceCard title="story-brief.md" type="MD" date="1小时前" />
                    <ResourceCard title="story-script.md" type="MD" date="1小时前" />
                  </div>
                </section>

                {/* Images */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[13px] font-bold text-[#86868B] uppercase tracking-[0.1em] flex items-center gap-2">图片</h3>
                    <span className="text-[12px] text-[#86868B] font-medium">共 2 个</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <ImageResourceCard title="user_upload_image_1.webp" type="WEBP" date="1小时前" img={charSam} />
                    <ImageResourceCard title="genos-reference.png" type="PNG" date="1小时前" img={charBoss} />
                  </div>
                </section>

                {/* Videos */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[13px] font-bold text-[#86868B] uppercase tracking-[0.1em] flex items-center gap-2">视频</h3>
                    <span className="text-[12px] text-[#86868B] font-medium">共 1 个</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <ImageResourceCard title="intro-animation.mp4" type="MP4" date="刚刚" img={skillReenact} />
                  </div>
                </section>
              </div>
              
              {/* Collapse handle */}
              <button 
                onClick={() => setShowResources(false)}
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-8 bg-[#FFFFFF] border border-[#E5E5E7] rounded-full flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] shadow-lg transition-all hover:scale-110 active:scale-95 z-[110]"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Question Mark */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <button className="h-10 w-10 rounded-full border border-[#E5E5E7] bg-[#FFFFFF] flex items-center justify-center text-[#1D1D1F] shadow-lg hover:shadow-xl transition-all active:scale-95">
          <span className="text-base font-bold">?</span>
        </button>
      </div>
    </div>
  );
}

function StatusLine({ icon, text, subText }: { icon: 'check' | 'loading'; text: string; subText?: string }) {
  return (
    <div className="flex items-center gap-3 px-1 py-1 group">
      <div className={cn(
        "flex h-5 w-5 items-center justify-center rounded-full text-white shrink-0",
        icon === 'check' ? "bg-green-500" : "bg-blue-500 animate-pulse"
      )}>
        {icon === 'check' ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      <div className="flex items-center gap-2 text-[14px]">
        <span className="font-semibold text-[#1D1D1F]">{text}</span>
        {subText && <span className="text-[#86868B]">{subText}</span>}
      </div>
      {icon === 'check' && (
        <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronDown className="h-4 w-4 text-[#86868B]" />
        </button>
      )}
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
    <div className="bg-[#FFFFFF] border border-[#E5E5E7] rounded-3xl p-5 flex flex-col gap-5 group hover:border-[#D2D2D7] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer">
      <div className="h-28 w-full bg-[#F5F5F7] rounded-2xl flex items-center justify-center border border-[#E5E5E7]">
        <div className="text-[12px] font-bold text-[#86868B] uppercase tracking-[0.2em]">{type}</div>
      </div>
      <div>
        <div className="text-[14px] font-bold text-[#1D1D1F] truncate mb-1.5">{title}</div>
        <div className="text-[12px] text-[#86868B] flex items-center gap-2 font-medium">
          <span>文稿</span>
          <span className="opacity-30">·</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

function ImageResourceCard({ title, type, date, img }: { title: string; type: string; date: string; img: string }) {
  return (
    <div className="bg-[#FFFFFF] border border-[#E5E5E7] rounded-3xl p-5 flex flex-col gap-5 group hover:border-[#D2D2D7] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer">
      <div className="h-28 w-full rounded-2xl overflow-hidden relative border border-[#E5E5E7]">
        <img src={img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#1D1D1F] uppercase tracking-wider shadow-sm">{type}</div>
      </div>
      <div>
        <div className="text-[14px] font-bold text-[#1D1D1F] truncate mb-1.5">{title}</div>
        <div className="text-[12px] text-[#86868B] flex items-center gap-2 font-medium">
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
