import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Check, Plus, Sparkles, Image as ImageIcon, Video, Music, FileText, ChevronRight, Eye, X, Code, Calendar, LayoutGrid } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import skillScript from "@/assets/skill-script.jpg";
import skillStory from "@/assets/skill-story.jpg";
import skillReenact from "@/assets/skill-reenact.jpg";
import skillMv from "@/assets/skill-mv.jpg";
import skillProduct from "@/assets/skill-product.jpg";
import skillTravel from "@/assets/skill-travel.jpg";

/* ---------------- Model Picker ---------------- */
const modelData = {
  image: [
    { name: "GPT Image 2", badge: "新", tag: "SOTA", desc: "OpenAI 的模型，用于从文本或现有图像生成高质量图像。" },
    { name: "Nano Banana 2", desc: "高品质 · 更快速 · 更低成本" },
    { name: "Nano Banana Pro", desc: "Google Gemini 的精确自然语言处理驱动图像修改工具。" },
    { name: "Seedream 5.0 Pro", badge: "新", desc: "字节跳动的图像模型，用于文本生成图像/编辑，在性能和速度方面表现更佳。" },
    { name: "Seedream 4.5", desc: "字节跳动的图像模型，用于文本生成图像/编辑，在性能和速度方面表现更佳。" },
    { name: "Midjourney", desc: "高精度模型，具有准确的提示、优质纹理 and 细节。" },
  ],
  video: [
    { name: "Seedance 2.5", badge: "新", tag: "SOTA", upgrade: true, desc: "支持 4–30 秒视频生成、多模态参考、原生音频，以及符合条件的视频延长。" },
    { name: "Seedance 2.0", badge: "新", upgrade: true, desc: "最强视频模型，图片及音视频全能参考，跨镜头强一致性保持和可控生成。" },
    { name: "Seedance 2.0 - Fast", badge: "新", upgrade: true, desc: "最强性价比视频模型，兼具全能参考、跨镜头一致性和可控生成。" },
    { name: "Seedance 2.0 Mini", badge: "新", upgrade: true, desc: "更轻量的 Seedance 2.0 视频模型，支持图片、视频、音频全能参考，以更低积分成本实现可控生成。" },
    { name: "MiniMax H3", badge: "新", desc: "MiniMax 2K 视频模型，支持图片、视频和音频全能参考、原生音画同步及 4–15 秒可控生成。" },
    { name: "HappyHorse 1.1", desc: "阿里旗下最新视频模型，超真实质感。" },
    { name: "Seedance 1.5 Pro Audio", desc: "字节跳动最新视频模型：音画同步、高性价比。" },
    { name: "Kling 3.0 Audio", desc: "Kling 3.0，全面升级的高质量视频生成模型。" },
    { name: "Kling 3.0 Omni (ucloud)", badge: "新", desc: "多模态模型，支持4K高清，多图驱动，一镜成片。" },
    { name: "Kling 01 (ucloud)", desc: "多模态模型，超高一致性。" },
    { name: "Kling Video 3.0 (ucloud)", desc: "音画同步升级，支持4K高清。" },
    { name: "Kling Video 2.6 (ucloud)", desc: "音画同步。" },
    { name: "Vidu Q3 Pro", desc: "最强智能切镜、音画直出，支持1-16S视频模型。" },
    { name: "Grok Imagine Video", upgrade: true, desc: "xAI最新视频模型，超快生成速度，动作表现力好" },
    { name: "Veo3.1-Fast", desc: "Veo 3.1 的快速模式 — 音画同步、生成迅速、性价比高" },
    { name: "Gemini Omni Flash", badge: "新", desc: "Google Gemini 视频模型，支持通过文本提示词及图片/视频参考快速生成，并可输出原生音频。" },
    { name: "Sora 2", desc: "OpenAI 的媒体生成模型，生成带同步音频的视频。" },
    { name: "Wan 2.6", desc: "阿里通义最新多模态生成模型，支持多切镜叙事及音画同出。" },
    { name: "MiniMax Hailuo 2.3", desc: "MiniMax 的高清视频模型，具有强大的动态效果 and 复杂指令处理能力。" },
    { name: "Vidu Q3", desc: "生数科技的顶级模型，支持参考图像转视频。" },
    { name: "OmniHuman 1.5", desc: "对口型视频生成模型，根据音频驱动人物图片生成说话视频。" },
  ],
  music: [
    { name: "Suno", desc: "先进的AI音乐工具，具有丰富的声乐和广泛的音乐风格。" },
    { name: "Mureka", desc: "第一梯队的音乐模型，兼具多元风格与自然人声" },
  ],
  audio: [
    { name: "Seed-Audio 1.0", badge: "新", desc: "真正面向影视创作的多模态音频生成模型。支持文本、图片、音频多模态输入，一站式生成影视级音频内容。" },
    { name: "ElevenLabs", desc: "领先的AI语音工具，提供高质量、可定制的语音。" },
    { name: "MiniMax", badge: "新", desc: "MiniMax Speech 2.8 HD 音频模型，适合高质量旁白生成。" },
    { name: "Doubao", desc: "字节跳动的语音模型，在自然中文音频生成方面表现出色。" },
  ],
};

export function ModelPicker({
  value,
  onSelect,
}: {
  value?: string | null;
  onSelect?: (name: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<keyof typeof modelData>("video");
  const selected = value ?? "Seedance 2.5";
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isScrollingRef = useRef(false);
  
  const tabs = [
    { key: "image", label: "图片" },
    { key: "video", label: "视频" },
    { key: "music", label: "音乐" },
    { key: "audio", label: "音频" },
  ] as const;

  const handleTabClick = (key: keyof typeof modelData) => {
    setActiveTab(key);
    const element = sectionRefs.current[key];
    if (element && scrollRef.current) {
      isScrollingRef.current = true;
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  const handleScroll = () => {
    if (isScrollingRef.current || !scrollRef.current) return;
    
    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    
    let currentTab = activeTab;
    let maxVisibleHeight = 0;

    tabs.forEach((tab) => {
      const element = sectionRefs.current[tab.key];
      if (element) {
        const rect = element.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, containerRect.top);
        const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          currentTab = tab.key;
        }
      }
    });

    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  };

  return (
    <div className="w-[580px] flex flex-col rounded-[28px] bg-white dark:bg-[#0A0A0A]/95 text-[#1A1A1A] dark:text-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.12)] overflow-hidden animate-in zoom-in-95 fade-in duration-300 origin-bottom border border-[#E5E5E5]/50 dark:border-white/10 dark:backdrop-blur-xl">
      <div className="px-6 py-5 border-b border-[#F0F0F0] dark:border-white/5">
        <h3 className="text-sm font-bold text-[#1A1A1A] dark:text-white/90">模型</h3>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex w-full items-center gap-1 rounded-xl bg-[#F5F5F5] dark:bg-white/5 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabClick(t.key)}
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                activeTab === t.key ? "bg-white dark:bg-white/10 shadow-sm text-black dark:text-white" : "text-[#666] dark:text-white/40 hover:text-black dark:hover:text-white/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[400px] space-y-6 overflow-y-auto pr-2 scrollbar-hide"
        >
          {tabs.map((tab) => (
            <div 
              key={tab.key}
              ref={(el) => { sectionRefs.current[tab.key] = el; }}
              className="space-y-4"
            >
              <div className="text-[11px] font-bold text-[#999] dark:text-white/30 uppercase tracking-wider sticky top-0 bg-white dark:bg-transparent py-2 z-10">
                {tab.label}
              </div>
              <div className="space-y-3">
                {modelData[tab.key].map((m) => {
                  const active = selected === m.name;
                  return (
                    <button
                      key={m.name}
                      onClick={() => onSelect?.(m.name)}
                      className="group relative flex w-full items-start gap-3 text-left transition-all"
                    >
                      <div className="mt-1 w-3.5 h-3.5 flex items-center justify-center">
                        {active ? (
                          <Check className="w-3.5 h-3.5 text-black stroke-[3px]" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5]" />
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[13px] font-bold transition-colors ${active ? 'text-black' : 'text-[#333] group-hover:text-black'}`}>{m.name}</span>
                          {"badge" in m && m.badge && (
                            <span className="bg-[#22C55E] text-white text-[8px] font-black px-1 rounded-sm leading-tight">
                              {m.badge}
                            </span>
                          )}
                          {"tag" in m && m.tag && (
                            <span className="bg-[#F97316] text-white text-[8px] font-black px-1 rounded-sm leading-tight">
                              {m.tag}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[10px] leading-relaxed text-[#999]">{m.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ModelPickerDialog({
  open,
  onOpenChange,
  value,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value?: string | null;
  onSelect?: (name: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] border-none bg-transparent p-0 text-white backdrop-blur-none shadow-none">
        <ModelPicker value={value} onSelect={(name) => { onSelect?.(name); onOpenChange(false); }} />
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Skill Picker ---------------- */
const categories = [
  { key: "all", label: "全部" },
  { key: "mine", label: "我的" },
  { key: "starred", label: "收藏" },
  { key: "film", label: "专业影视" },
  { key: "marketing", label: "专业营销" },
  { key: "product", label: "产品推广" },
  { key: "drama", label: "短剧漫剧" },
  { key: "creative", label: "创意发散" },
] as const;

const skillList = [
  {
    id: "tang",
    title: "《大唐妖探》同款转场",
    desc: "电影《大唐妖探》官方合作模板，一起带毛孩子勇闯机关大唐吧！",
    models: "SD 2.0 Fast VIP",
    tags: ["特效玩法", "社媒热点", "视频"],
    img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "reenact",
    title: "爆款复刻",
    desc: "高燃登场视频生成：基于案例提示词模板替换画风，保留极限镜头语言。",
    models: "SD 2.5 • Seedream 5.0 Pro",
    tags: ["特效", "电影感"],
    img: "https://images.unsplash.com/photo-1578632738981-43c9ad4c585f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "zine",
    title: "Zine风格Skill",
    desc: "将任何场景转化为精致的杂志排版风格短片，突出时尚感与设计力。",
    models: "SD 2.0 Fast VIP • Seedream 5.0 Pro",
    tags: ["排版", "时尚"],
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "multicell",
    title: "多宫格分镜",
    desc: "经典多宫格构图，适合展示多角度细节或快节奏叙事切换。",
    models: "SD 2.5 • Seedream 5.0 Pro",
    tags: ["分镜", "叙事"],
    img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "youth",
    title: "日系青春广告短片",
    desc: "清新通透的画面感，捕捉夏日微风与少年感，极具呼吸感的影像表达。",
    models: "SD 2.0 Fast VIP • Seedream 5.0 Pro",
    tags: ["青春", "日系"],
    img: "https://images.unsplash.com/photo-1560972550-aba3456b5564?q=80&w=800&auto=format&fit=crop",
  },
];


export function SkillPicker({
  onSelect,
}: {
  onSelect?: (title: string) => void;
}) {
  const [tab, setTab] = useState<typeof categories[number]["key"]>("all");
  const [hoveredSkill, setHoveredSkill] = useState<typeof skillList[number]>(skillList[0]);
  const [previewSkill, setPreviewSkill] = useState<typeof skillList[number] | null>(null);
  
  return (
    <div className="w-[840px] flex flex-col rounded-[28px] bg-white dark:bg-[#0A0A0A]/95 text-[#1A1A1A] dark:text-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.12)] overflow-hidden animate-in zoom-in-95 fade-in duration-300 origin-bottom border border-[#E5E5E5]/50 dark:border-white/10 dark:backdrop-blur-xl">
      {/* Search Header */}
      <div className="flex items-center px-6 py-4 border-b border-[#F0F0F0] dark:border-white/5 bg-white dark:bg-transparent">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999] stroke-[2.5px]" />
          <input 
            type="text" 
            placeholder="搜索技能" 
            className="w-full bg-transparent pl-10 pr-4 py-2 text-[15px] font-bold focus:outline-none placeholder:text-[#999]" 
          />
        </div>
        <button className="flex items-center gap-0.5 text-[13px] font-bold text-[#666] dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
          全部 <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden h-[480px]">
        {/* Left Sidebar Categories */}
        <div className="w-[140px] border-right border-[#F0F0F0] dark:border-white/5 py-4 flex flex-col gap-1 bg-[#F9F9F9] dark:bg-transparent">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setTab(c.key)}
              className={`flex items-center gap-3 px-6 py-2.5 text-[13px] font-bold transition-all relative ${
                tab === c.key
                  ? "text-black dark:text-white"
                  : "text-[#666] dark:text-white/40 hover:text-black dark:hover:text-white/60"
              }`}
            >
              {tab === c.key && <Check className="h-3.5 w-3.5 absolute left-2 stroke-[3px]" />}
              <span className="pl-0">{c.label}</span>
            </button>
          ))}
        </div>

        {/* Middle Skill List */}
        <div className="w-[300px] border-x border-[#F0F0F0] dark:border-white/5 bg-white dark:bg-white/5 overflow-y-auto scrollbar-hide py-2 relative z-10">
          {skillList.map((s) => (
            <div
              key={s.id}
              onMouseEnter={() => setHoveredSkill(s)}
              onClick={() => onSelect?.(s.title)}
              className={`group flex items-center justify-between px-6 py-4 cursor-pointer transition-all ${
                hoveredSkill?.id === s.id ? "bg-[#F5F5F5] dark:bg-white/10 rounded-2xl" : "hover:bg-[#F9F9F9] dark:hover:bg-white/5 rounded-2xl"
              }`}
            >
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-[14px] font-bold text-[#333] dark:text-white/90 truncate">{s.title}</h4>
                <p className="mt-0.5 text-[11px] text-[#999] dark:text-white/40 font-bold tracking-tight">
                  {s.models}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(s.title);
                }}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-white/10 text-[#999] dark:text-white/40 hover:text-black dark:hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Plus className="h-4 w-4" />
              </button>
              {hoveredSkill?.id === s.id && (
                <div className="ml-2 flex items-center">
                  <span className="text-[14px] leading-none text-[#999] dark:text-white/40 font-serif">↵</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Preview Area */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto scrollbar-hide bg-[#F9F9F9] dark:bg-transparent relative">
          {hoveredSkill && (
            <div className="animate-in fade-in duration-300">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden group shadow-md border border-[#F0F0F0] dark:border-white/10">
                <img src={hoveredSkill.img} alt={hoveredSkill.title} className="w-full h-full object-cover" />
                <button className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-white/60 dark:bg-black/20 backdrop-blur text-black/60 dark:text-white hover:bg-white/80 dark:hover:bg-black/40 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </button>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#333] dark:text-white/90 tracking-tight">{hoveredSkill.models}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#666] dark:text-white/60 font-medium">
                    {hoveredSkill.desc}
                  </p>
                </div>
 
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <div className="flex flex-wrap items-center gap-2 max-w-[180px]">
                    {hoveredSkill.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 text-[12px] font-bold text-[#666] dark:text-white/60 shadow-sm border border-black/5 dark:border-white/5 whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => setPreviewSkill(hoveredSkill)}
                    className="ml-auto flex items-center gap-0.5 text-[13px] font-bold text-[#333] dark:text-white hover:opacity-70 transition-all"
                  >
                    详情 <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 z-20">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('open-create-skill'));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 text-[13px] font-bold text-[#666] dark:text-white/40 hover:text-black dark:hover:text-white transition-all shadow-sm border border-black/5 dark:border-white/5"
                >
                  创建技能 <div className="grid grid-cols-2 gap-0.5 opacity-60"><div className="w-1.5 h-1.5 rounded-sm bg-current"></div><div className="w-1.5 h-1.5 rounded-sm bg-current"></div><div className="w-1.5 h-1.5 rounded-sm bg-current"></div><div className="w-1.5 h-1.5 rounded-sm bg-current"></div></div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Skill Detail Preview Modal */}
      <Dialog open={!!previewSkill} onOpenChange={(open) => !open && setPreviewSkill(null)}>
        <DialogContent className="max-w-[560px] p-0 border-[#E5E5E5]/50 dark:border-white/10 bg-white dark:bg-[#121212] overflow-hidden rounded-3xl shadow-2xl [&>button]:hidden dark:text-white">
          <div className="relative">
            {/* Header Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img src={previewSkill?.img} className="w-full h-full object-cover" alt={previewSkill?.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#121212] via-transparent to-transparent" />
              
              {/* Top Controls */}
              <div className="absolute top-4 left-4">
                <div className="rounded-full bg-black/40 backdrop-blur px-3 py-1 text-[11px] text-white/80">
                  Seedance 2.5
                </div>
              </div>
              <button 
                onClick={() => setPreviewSkill(null)}
                className="absolute top-4 right-4 h-7 w-7 flex items-center justify-center rounded-full bg-black/40 backdrop-blur text-white/60 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Title */}
              <div className="absolute bottom-6 left-6 pr-6">
                <h2 className="text-xl font-bold text-white dark:text-white tracking-tight">{previewSkill?.title}</h2>
              </div>
            </div>

            {/* Content Area */}
            <div className="px-6 pb-6">
              <div className="flex border-b border-[#F0F0F0] dark:border-white/5 mb-6">
                <button className="px-1 pb-3 text-sm font-medium text-black dark:text-white border-b-2 border-black dark:border-white">简介</button>
                <button className="px-1 pb-3 text-sm font-medium text-[#999] dark:text-white/40 hover:text-[#666] dark:hover:text-white/60 ml-6">内容</button>
              </div>

              <div className="space-y-6">
                <div className="text-[14px] leading-relaxed text-[#666] dark:text-white/70">
                  {previewSkill?.id === 'destiny' ? (
                    "分析上传的剧本（图片/PDF/文本），通过学习其电影语法——提取脚本、镜头结构、视觉语言和节奏——围绕您的主题生成全新的视频。使用 Nano Banana + Seedance 2.5（分辨率480p）生成视觉素材。"
                  ) : previewSkill?.desc}
                </div>

                <div className="flex items-center justify-between py-4 border-t border-b border-[#F0F0F0] dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#F5F5F5] dark:bg-white/5 text-[10px] text-[#999] dark:text-white/40">历史使用</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#CCC] dark:text-white/20">最近一次更新时间 2026-08-11 16:56</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs hover:bg-red-500/20 transition-colors">
                      <X className="h-3.5 w-3.5" />
                      删除
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F5F5] dark:bg-white/5 text-[#333] dark:text-white/80 text-xs hover:bg-[#EEE] dark:hover:bg-white/10 transition-colors">
                      <FileText className="h-3.5 w-3.5" />
                      创建副本
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5F5F5] dark:bg-white/5 text-[#333] dark:text-white/80 text-xs hover:bg-[#EEE] dark:hover:bg-white/10 transition-colors">
                      <Sparkles className="h-3.5 w-3.5" />
                      分享
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (previewSkill) onSelect?.(previewSkill.title);
                      setPreviewSkill(null);
                    }}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFE5B4] to-[#FFD700] dark:to-white px-8 py-2.5 text-sm font-bold text-black hover:opacity-90 transition-all shadow-xl shadow-black/5 dark:shadow-white/5"
                  >
                    <Sparkles className="h-4 w-4" />
                    去使用 Skill
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function SkillPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect?: (title: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[840px] border-none bg-transparent p-0 text-white backdrop-blur-none shadow-none">
        <SkillPicker onSelect={(title) => { onSelect?.(title); onOpenChange(false); }} />
      </DialogContent>
    </Dialog>
  );
}


/* ---------------- Assets Picker ---------------- */
const assetTabs = [
  { key: "works", label: "作品" },
  { key: "history", label: "历史上传" },
  { key: "char", label: "角色" },
  { key: "product", label: "商品" },
] as const;

const assetSubTabs = [
  { key: "all", label: "全部" },
  { key: "image", label: "图片" },
  { key: "video", label: "视频" },
] as const;

const assetItems = [
  { id: 1, name: "S1.mp4", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", kind: "video", duration: "10s", date: "2026-08-10 13:43" },
  { id: 2, name: "S2.mp4", img: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=300&fit=crop", kind: "video", duration: "10s", date: "2026-08-07 17:50" },
  { id: 3, name: "画布生图", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop", kind: "image", date: "2026-08-07 17:32" },
  { id: 4, name: "画布生图", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", kind: "image", date: "2026-08-07 17:20" },
  { id: 5, name: "画布生图", img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=300&fit=crop", kind: "image", date: "2026-08-07 17:16" },
  { id: 6, name: "画布生图", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop", kind: "image", date: "2026-08-07 17:16" },
  { id: 7, name: "画布生图", img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop", kind: "image", date: "2026-08-07 17:16" },
  { id: 8, name: "画布生图", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop", kind: "image", date: "2026-08-07 17:16" },
];

export function ElementsPicker({ 
  onSelect 
}: { 
  onSelect?: (name: string, kind?: string, url?: string) => void 
}) {
  const [tab, setTab] = useState<typeof assetTabs[number]["key"]>("works");
  const [subTab, setSubTab] = useState<typeof assetSubTabs[number]["key"]>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = assetItems.filter(item => selectedIds.includes(item.id));
    selected.forEach(item => {
      onSelect?.(item.name, item.kind, item.img);
    });
  };

  return (
    <div className="w-[1000px] h-[720px] bg-[#0A0A0A] text-white overflow-hidden flex flex-col relative">
      {/* Sidebar and Main Content Wrapper */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[180px] border-r border-white/5 flex flex-col pt-6">
          <div className="px-6 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">所有资产</span>
              <span className="text-sm text-white/40">(8)</span>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1 px-3">
            {assetTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === t.key 
                    ? "bg-white/10 text-white shadow-lg" 
                    : "text-white/40 hover:text-white/60 hover:bg-white/5"
                }`}
              >
                {t.key === 'works' && <LayoutGrid className="h-4 w-4" />}
                {t.key === 'history' && <Calendar className="h-4 w-4" />}
                {t.key === 'char' && <Sparkles className="h-4 w-4" />}
                {t.key === 'product' && <ImageIcon className="h-4 w-4" />}
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <div className="flex items-center justify-end px-6 py-4 border-b border-white/5 h-[72px]">
            <button 
              onClick={() => (window as any).closeElementsPicker?.()}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/5 transition"
            >
          <X className="h-4 w-4 text-white/40" />
        </button>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex items-center gap-3 px-6 py-4 flex-wrap border-b border-white/5">
        {/* Creation Source Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
              创作资产 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-[#1A1A1A] border-white/10 p-1 text-white">
            <div className="space-y-1">
              {['全部来源', '画布创作', '工作流创作', 'AI生成'].map((item) => (
                <button key={item} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 rounded-md transition-colors">{item}</button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Media Type Filters */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {assetSubTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setSubTab(t.key)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                subTab === t.key ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {t.key === 'image' && <ImageIcon className="h-3 w-3" />}
                {t.key === 'video' && <Video className="h-3 w-3" />}
                {t.label}
              </div>
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
              时间范围 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-[#1A1A1A] border-white/10 p-1 text-white">
            <div className="space-y-1">
              {['全部时间', '今天', '最近7天', '最近30天', '自定义范围'].map((item) => (
                <button key={item} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 rounded-md transition-colors">{item}</button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Order */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
              倒序 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-32 bg-[#1A1A1A] border-white/10 p-1 text-white">
            <div className="space-y-1">
              {['正序', '倒序'].map((item) => (
                <button key={item} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 rounded-md transition-colors">{item}</button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1" />

        {/* Right Side Filters */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
                全部项目 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 bg-[#1A1A1A] border-white/10 p-1 text-white">
              <div className="space-y-1">
                {['全部项目', '一拳超人宣发', '游戏预告', '节日活动'].map((item) => (
                  <button key={item} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 rounded-md transition-colors">{item}</button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
                全部人员 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 bg-[#1A1A1A] border-white/10 p-1 text-white">
              <div className="space-y-1">
                {['全部人员', '我自己', '设计师-阿强', '项目经理-老李'].map((item) => (
                  <button key={item} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 rounded-md transition-colors">{item}</button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
                全部画布 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-40 bg-[#1A1A1A] border-white/10 p-1 text-white">
              <div className="space-y-1">
                {['全部画布', '主画布-01', '备选画布-02', '草稿-03'].map((item) => (
                  <button key={item} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 rounded-md transition-colors">{item}</button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input 
              type="text" 
              placeholder="搜索资产..." 
              className="pl-9 pr-4 py-1.5 bg-white/5 rounded-lg text-xs w-40 focus:outline-none focus:ring-1 focus:ring-white/10"
            />
          </div>

          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1.5 rounded bg-white/10"><Sparkles className="h-3.5 w-3.5" /></button>
              </PopoverTrigger>
              <PopoverContent className="w-40 bg-[#1A1A1A] border-white/10 p-1 text-white">
                <div className="space-y-1">
                  {['AI 优化排序', '按关联度排序'].map((item) => (
                    <button key={item} className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 rounded-md transition-colors">{item}</button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <button className="p-1.5 rounded hover:bg-white/10"><Check className="h-3.5 w-3.5 text-white/40" /></button>
          </div>

          <button 
            onClick={() => {
              if (selectedIds.length === assetItems.length) {
                setSelectedIds([]);
              } else {
                setSelectedIds(assetItems.map(i => i.id));
              }
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition"
          >
            <Check className="h-3.5 w-3.5" />
            批量操作
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        <div className="grid grid-cols-4 lg:grid-cols-5 gap-6">
          {assetItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div key={item.id} className="group relative">
                <div 
                  onClick={() => toggleSelect(item.id)}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-[#0A0A0A]" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  
                  {/* Video Icon/Duration */}
                  {item.kind === "video" && (
                    <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <Video className="h-3 w-3 text-white" />
                    </div>
                  )}

                  {/* Hover/Selected Overlay */}
                  <div className={`absolute inset-0 bg-black/20 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                </div>
                
                {/* Info Footer */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-white/40" />
                    <span className="text-[10px] font-medium text-white/40">D</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-medium">· {item.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>

      {/* Footer Actions */}
      {selectedIds.length > 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 bg-[#1A1A1A] border border-white/10 rounded-2xl flex items-center gap-6 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-sm font-medium">
            已选择 <span className="text-primary">{selectedIds.length}</span> 个素材
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 text-sm text-white/60 hover:text-white transition"
            >
              取消
            </button>
            <button 
              onClick={handleConfirm}
              className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
            >
              确认添加
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ElementsPickerDialog({ 
  open, 
  onOpenChange, 
  onSelect 
}: { 
  open: boolean; 
  onOpenChange: (v: boolean) => void; 
  onSelect?: (name: string, kind?: string, url?: string) => void 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] border-white/10 bg-[#0A0A0A] p-0 text-white overflow-hidden rounded-[24px] shadow-2xl [&>button]:hidden">
        <div ref={(el) => {
          if (el) {
            (window as any).closeElementsPicker = () => onOpenChange(false);
          }
        }}>
          <ElementsPicker onSelect={(name, kind, url) => { 
            onSelect?.(name, kind, url); 
            onOpenChange(false); 
          }} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Creative Preference Picker ---------------- */
export function CreativePreferencePicker() {
  const [activeMode, setActiveMode] = useState<"video" | "image">(() => {
    if (typeof window === 'undefined') return "video";
    return (localStorage.getItem("pref_activeMode") as "video" | "image") || "video";
  });
  const [videoModel, setVideoModel] = useState(() => {
    if (typeof window === 'undefined') return "智能匹配模型";
    return localStorage.getItem("pref_videoModel") || "智能匹配模型";
  });
  const [imageModel, setImageModel] = useState(() => {
    if (typeof window === 'undefined') return "Seedream 5.0 Pro";
    return localStorage.getItem("pref_imageModel") || "Seedream 5.0 Pro";
  });
  const [ratio, setRatio] = useState(() => {
    if (typeof window === 'undefined') return "智能";
    return localStorage.getItem("pref_ratio") || "智能";
  });
  const [resolution, setResolution] = useState(() => {
    if (typeof window === 'undefined') return "720P";
    return localStorage.getItem("pref_resolution") || "720P";
  });
  const [duration, setDuration] = useState(() => {
    if (typeof window === 'undefined') return 85;
    return Number(localStorage.getItem("pref_duration")) || 85;
  });
  const [durationMode, setDurationMode] = useState<"smart" | "custom">(() => {
    if (typeof window === 'undefined') return "smart";
    return (localStorage.getItem("pref_durationMode") as "smart" | "custom") || "smart";
  });
  const [canvas, setCanvas] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem("pref_canvas") === "true";
  });
  const [imgFormat, setImgFormat] = useState(() => {
    if (typeof window === 'undefined') return "jpeg";
    return localStorage.getItem("pref_imgFormat") || "jpeg";
  });
  const [groupType, setGroupType] = useState(() => {
    if (typeof window === 'undefined') return "parallel";
    return localStorage.getItem("pref_groupType") || "parallel";
  });
  const [groupCount, setGroupCount] = useState(() => {
    if (typeof window === 'undefined') return 4;
    return Number(localStorage.getItem("pref_groupCount")) || 4;
  });
  const [watermark, setWatermark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem("pref_watermark") === "true";
  });
  const [groupEnabled, setGroupEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem("pref_groupEnabled") !== "false";
  });
  const [groupAuto, setGroupAuto] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem("pref_groupAuto") === "true";
  });
  const [videoAudio, setVideoAudio] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem("pref_videoAudio") === "true";
  });
  const [videoCount, setVideoCount] = useState(() => {
    if (typeof window === 'undefined') return 1;
    return Number(localStorage.getItem("pref_videoCount")) || 1;
  });
  const [videoWatermark, setVideoWatermark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem("pref_videoWatermark") !== "false";
  });
  const [isAutoMode, setIsAutoMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem("pref_isAutoMode") !== "false";
  });
  const [klingMode, setKlingMode] = useState<"standard" | "high">(() => {
    if (typeof window === 'undefined') return "standard";
    return (localStorage.getItem("pref_klingMode") as "standard" | "high") || "standard";
  });
  const [imgQuality, setImgQuality] = useState<"low" | "medium" | "high">(() => {
    if (typeof window === 'undefined') return "medium";
    return (localStorage.getItem("pref_imgQuality") as "low" | "medium" | "high") || "medium";
  });




  // Persist changes to localStorage
  useEffect(() => { 
    localStorage.setItem("pref_activeMode", activeMode); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [activeMode]);
  useEffect(() => { 
    localStorage.setItem("pref_videoModel", videoModel); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [videoModel]);
  useEffect(() => { 
    localStorage.setItem("pref_imageModel", imageModel); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [imageModel]);
  useEffect(() => { 
    localStorage.setItem("pref_ratio", ratio); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [ratio]);
  useEffect(() => { 
    localStorage.setItem("pref_resolution", resolution); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [resolution]);
  useEffect(() => { 
    localStorage.setItem("pref_duration", duration.toString()); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [duration]);
  useEffect(() => { 
    localStorage.setItem("pref_durationMode", durationMode); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [durationMode]);
  useEffect(() => { 
    localStorage.setItem("pref_canvas", canvas.toString()); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [canvas]);
  useEffect(() => { 
    localStorage.setItem("pref_imgFormat", imgFormat); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [imgFormat]);
  useEffect(() => { 
    localStorage.setItem("pref_groupType", groupType); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [groupType]);
  useEffect(() => { 
    localStorage.setItem("pref_groupCount", groupCount.toString()); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [groupCount]);
  useEffect(() => { 
    localStorage.setItem("pref_watermark", watermark.toString()); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [watermark]);
  useEffect(() => { 
    localStorage.setItem("pref_groupAuto", groupAuto.toString()); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [groupAuto]);
  useEffect(() => { 
    localStorage.setItem("pref_groupEnabled", groupEnabled.toString()); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [groupEnabled]);
  useEffect(() => { 
    localStorage.setItem("pref_videoAudio", videoAudio.toString()); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [videoAudio]);
  useEffect(() => { 
    localStorage.setItem("pref_videoCount", videoCount.toString()); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [videoCount]);
  useEffect(() => { 
    localStorage.setItem("pref_videoWatermark", videoWatermark.toString()); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [videoWatermark]);
  useEffect(() => { 
    localStorage.setItem("pref_isAutoMode", isAutoMode.toString()); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [isAutoMode]);
  useEffect(() => { 
    localStorage.setItem("pref_klingMode", klingMode); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [klingMode]);
  useEffect(() => { 
    localStorage.setItem("pref_imgQuality", imgQuality); 
    window.dispatchEvent(new Event('pref-updated'));
  }, [imgQuality]);





  const videoModels = [
    { name: "智能匹配模型", desc: "当 Agent 识别到视频生成诉求时为你智能选择视频模型", icon: true },
    { name: "Seedance 2.5", badge: "新", isVip: true, desc: "支持 4–30 秒视频生成、多模态参考、原生音频，以及符合条件的视频延长。" },
    { name: "Seedance 2.0 VIP", isVip: true, desc: "最强视频模型，图片及音视频全能参考，跨镜头强一致性保持和可控生成。" },
    { name: "Seedance 2.0 Fast VIP", isVip: true, desc: "最强性价比视频模型，兼具全能参考、跨镜头一致性和可控生成。" },
    { name: "旗舰生图模型 V2-Flash", isVip: true, desc: "出图更快，文字准确性提升，真实感强。" },
    { name: "Seedance 2.0 Mini", isVip: true, desc: "更轻量的视频模型，支持全能参考，以更低积分实现可控生成。" },
    { name: "MiniMax H3", badge: "新", desc: "MiniMax 2K 视频模型，支持原生音画同步及 4–15 秒可控生成。" },
    { name: "HappyHorse 1.1", desc: "阿里旗下最新视频模型，超真实质感。" },
    { name: "Kling 3.0 Audio", desc: "Kling 3.0，全面升级的高质量视频生成模型。" },
    { name: "Kling 3.0 Omni (ucloud)", badge: "新", desc: "多模态模型，支持4K高清，多图驱动，一镜成片。" },
    { name: "Kling 01 (ucloud)", desc: "多模态模型，超高一致性。" },
    { name: "Kling Video 3.0 (ucloud)", desc: "音画同步升级，支持4K高清。" },
    { name: "Kling Video 2.6 (ucloud)", desc: "音画同步。" },
    { name: "Vidu Q3 Pro", desc: "最强智能切镜、音画直出，支持1-16S视频模型。" },
    { name: "Grok Imagine Video", desc: "xAI最新视频模型，动作表现力好。" },
    { name: "Sora 2", desc: "OpenAI 的媒体生成模型，生成带同步音频的视频。" },
    { name: "Wan 2.6", desc: "阿里通义最新多模态生成模型，支持音画同出。" },
  ];

  const imageModels = [
    { name: "智能匹配模型", desc: "当 Agent 识别到图片生成诉求时为你智能选择图片模型", icon: true },
    { name: "Seedream 5.0 Pro", badge: "新", isVip: true, desc: "支持交互式编辑，精准改图更可控。", extraBadge: "限次" },
    { name: "Seedream 5.0 Lite", desc: "超强指令响应，智能逻辑推理。" },
    { name: "Seedream 4.0 美感版", badge: "新", desc: "图像画质美感提升。" },
    { name: "旗舰生图模型 V2-Flash", isVip: true, desc: "出图更快，文字准确性提升，真实感强。" },
    { name: "Seedream 4.5", desc: "字节跳动的图像模型，用于文本生成图像/编辑，在性能和速度方面表现更佳。" },
    { name: "GPT Image 2", badge: "新", desc: "OpenAI 的模型，用于从文本或现有图像生成高质量图像。" },
    { name: "Midjourney", desc: "高精度模型，具有准确的提示、优质纹理 and 细节。" },
    { name: "Nano Banana 2", desc: "高品质 · 更快速 · 更低成本。" },
  ];

  const videoRatios = [
    { label: "智能", icon: <LayoutGrid className="w-4 h-4" /> },
    { label: "16:9", icon: <div className="w-4 h-2.5 border border-current rounded-sm" /> },
    { label: "4:3", icon: <div className="w-4 h-3 border border-current rounded-sm" /> },
    { label: "1:1", icon: <div className="w-3.5 h-3.5 border border-current rounded-sm" /> },
    { label: "3:4", icon: <div className="w-3 h-4 border border-current rounded-sm" /> },
    { label: "9:16", icon: <div className="w-2.5 h-4 border border-current rounded-sm" /> },
    { label: "21:9", icon: <div className="w-5 h-2 border border-current rounded-sm" /> },
  ];

  const imageRatios = [
    { label: "1:1", icon: <div className="w-3.5 h-3.5 border border-current rounded-sm" /> },
    { label: "4:3", icon: <div className="w-4 h-3 border border-current rounded-sm" /> },
    { label: "3:4", icon: <div className="w-3 h-4 border border-current rounded-sm" /> },
    { label: "16:9", icon: <div className="w-4 h-2.5 border border-current rounded-sm" /> },
    { label: "9:16", icon: <div className="w-2.5 h-4 border border-current rounded-sm" /> },
    { label: "3:2", icon: <div className="w-4 h-2.5 border border-current rounded-sm" /> },
    { label: "2:3", icon: <div className="w-2.5 h-4 border border-current rounded-sm" /> },
    { label: "21:9", icon: <div className="w-5 h-2 border border-current rounded-sm" /> },
  ];

  const currentRatios = activeMode === "video" ? videoRatios : imageRatios;

  return (
    <div className="flex flex-col rounded-[28px] bg-white dark:bg-[#0A0A0A]/95 text-[#1A1A1A] dark:text-white shadow-[0_24px_64px_-12px_rgba(0,0,0,0.12)] overflow-hidden animate-in zoom-in-95 fade-in duration-300 origin-bottom border border-[#E5E5E5]/50 dark:border-white/10 dark:backdrop-blur-xl">
      {/* Tabs Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F0F0] dark:border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex bg-[#F5F5F5] dark:bg-white/5 p-1 rounded-xl">
            <button 
              onClick={() => setActiveMode("video")}
              className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMode === 'video' ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-[#666] dark:text-white/40'}`}
            >
              视频偏好
            </button>
            <button 
              onClick={() => setActiveMode("image")}
              className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeMode === 'image' ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-[#666] dark:text-white/40'}`}
            >
              图片偏好<span className="ml-0.5 opacity-40 font-normal">*</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold transition-colors ${isAutoMode ? 'text-[#3B82F6]' : 'text-[#22C55E]'}`}>
              {isAutoMode ? '自动模式，算法由系统选择' : '手动模式，算法由用户选择'}
            </span>
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-[10px] font-bold text-[#999] dark:text-white/30">自动控制</span>
              <div 
                className={`w-8 h-4.5 rounded-full relative transition-colors cursor-pointer ${isAutoMode ? 'bg-[#3B82F6]' : 'bg-[#E5E5E5] dark:bg-white/10'}`}
                onClick={() => setIsAutoMode(!isAutoMode)}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-all ${isAutoMode ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[#9333EA] font-bold">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs">{activeMode === 'video' ? '12/秒' : '12/张'}</span>
            <span className="text-[#999] dark:text-white/30 font-normal text-[10px] ml-0.5 line-through">{activeMode === 'video' ? '14/秒' : '14/张'}</span>
          </div>
        </div>
      </div>

      <div className={`flex px-6 py-6 gap-6 transition-opacity duration-200 ${isAutoMode ? 'opacity-50 pointer-events-none grayscale-[0.2]' : 'opacity-100'}`}>
        {/* Left Side: Model Selection - Reference image layout */}

        <div className="flex-1 max-w-[340px]">
          <h4 className="text-[12px] font-bold text-[#999] dark:text-white/30 mb-4">模型选择</h4>
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-hide">
            {(activeMode === "video" ? videoModels : imageModels).map((m) => {
              const isActive = activeMode === "video" ? videoModel === m.name : imageModel === m.name;
              return (
                <button 
                  key={m.name}
                  onClick={() => activeMode === "video" ? setVideoModel(m.name) : setImageModel(m.name)}
                  className="w-full text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1.5 w-4 h-4 flex items-center justify-center shrink-0">
                      {isActive ? (
                        <Check className="w-4 h-4 text-black dark:text-white stroke-[3px]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5] dark:bg-white/20 group-hover:bg-[#CCC] dark:group-hover:bg-white/40" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[13px] font-bold transition-colors ${isActive ? 'text-black dark:text-white' : 'text-[#333] dark:text-white/60 group-hover:text-black dark:group-hover:text-white'}`}>
                          {m.name}
                        </span>
                        {(m as any).extraBadge && (
                          <span className="bg-[#9333EA]/10 text-[#9333EA] text-[8px] font-black px-1 rounded-sm leading-tight flex items-center gap-0.5">
                            <Sparkles className="w-2 h-2 fill-current" />
                            {(m as any).extraBadge}
                          </span>
                        )}
                        {(m as any).isVip && !(m as any).extraBadge && <Sparkles className="w-3 h-3 text-[#9333EA] fill-current" />}
                        {(m as any).badge && (
                          <span className="bg-[#22C55E] text-white text-[8px] font-black px-1 rounded-sm leading-tight">
                            {(m as any).badge}
                          </span>
                        )}
                      </div>
                      {m.desc && (
                        <p className="text-[10px] leading-relaxed text-[#999] dark:text-white/30 mt-0.5 pr-2">
                          {m.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-[#F0F0F0] dark:bg-white/5" />

        {/* Right Side: Parameters */}
        <div className="flex-1 space-y-8">
          <section>
            <div className="flex items-center gap-1 mb-4">
              <h4 className="text-[12px] font-bold text-[#999] dark:text-white/30">画面比例</h4>
              <div className="w-3 h-3 rounded-full border border-[#CCC] dark:border-white/20 flex items-center justify-center text-[8px] text-[#999] dark:text-white/30 cursor-help">?</div>
            </div>
            <div className="relative group/slider w-full max-w-[320px]">
              <button 
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-5 h-5 flex items-center justify-center rounded-full bg-white dark:bg-[#1A1A1A] border border-[#F0F0F0] dark:border-white/10 text-[#999] dark:text-white/40 hover:text-black dark:hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 shadow-md hover:scale-110 active:scale-95"
                onClick={() => {
                  const container = document.getElementById('ratio-container');
                  if (container) container.scrollBy({ left: -80, behavior: 'smooth' });
                }}
              >
                <ChevronRight className="w-3 h-3 rotate-180" />
              </button>
              
              <div 
                id="ratio-container"
                className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 px-1 snap-x scroll-smooth"
              >
                {currentRatios.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => setRatio(r.label)}
                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border shrink-0 transition-all snap-start ${
                      ratio === r.label 
                        ? 'bg-white dark:bg-white/10 border-black dark:border-white text-black dark:text-white shadow-md shadow-black/5' 
                        : 'bg-[#F8F8F8] dark:bg-white/5 border-transparent text-[#666] dark:text-white/40 hover:bg-[#F0F0F0] dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="scale-90">{r.icon}</div>
                    <span className="text-[10px] font-bold mt-1.5">{r.label}</span>
                  </button>
                ))}
              </div>

              <button 
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-5 h-5 flex items-center justify-center rounded-full bg-white dark:bg-[#1A1A1A] border border-[#F0F0F0] dark:border-white/10 text-[#999] dark:text-white/40 hover:text-black dark:hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 shadow-md hover:scale-110 active:scale-95"
                onClick={() => {
                  const container = document.getElementById('ratio-container');
                  if (container) container.scrollBy({ left: 80, behavior: 'smooth' });
                }}
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </section>

          {!(activeMode === 'video' && videoModel.includes("Kling")) && (
            <section className="mb-4">
              <h4 className="text-[12px] font-bold text-[#999] dark:text-white/30 mb-2">{activeMode === 'video' ? '视频分辨率' : '图片分辨率'}</h4>
              <div className="flex gap-1.5 p-1 bg-[#F5F5F5] dark:bg-white/5 rounded-full w-fit">
                {(activeMode === 'video' ? ["4K", "2K", "1080P", "720P"] : ["1K", "2K", "4K"]).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`px-5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      resolution === res ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-[#999] dark:text-white/40 hover:text-[#666] dark:hover:text-white/60'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeMode === 'video' && videoModel.includes("Kling") && (
            <section className="mb-4">
              <h4 className="text-[12px] font-bold text-[#999] dark:text-white/30 mb-2">生成模式</h4>
              <div className="flex gap-1.5 p-1 bg-[#F5F5F5] dark:bg-white/5 rounded-full w-fit">
                {[
                  { id: "standard", label: "标准(720p)" },
                  { id: "high", label: "高品质(1080p)" }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setKlingMode(mode.id as "standard" | "high")}
                    className={`px-5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      klingMode === mode.id ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-[#999] dark:text-white/40 hover:text-[#666] dark:hover:text-white/60'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeMode === "video" && (
            <div className="space-y-4">
              <section>
                <div className="flex items-center gap-1 mb-2">
                  <h4 className="text-[12px] font-bold text-[#999] dark:text-white/30">时长</h4>
                  <div className="w-3 h-3 rounded-full border border-[#CCC] dark:border-white/20 flex items-center justify-center text-[8px] text-[#999] dark:text-white/30 cursor-help">?</div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setDurationMode("smart")}
                    className={`px-5 py-2 rounded-xl text-[12px] font-bold transition-all ${
                      durationMode === "smart" 
                        ? "bg-white dark:bg-white/10 border-black dark:border-white text-black dark:text-white shadow-md border" 
                        : "bg-[#F5F5F5] dark:bg-white/5 text-[#666] dark:text-white/40 border-transparent border hover:bg-[#F0F0F0] dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {durationMode === "smart" && <div className="w-1 h-1 rounded-full bg-black dark:bg-white" />}
                      智能时长
                    </div>
                  </button>
                  <button 
                    onClick={() => setDurationMode("custom")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2 min-w-[100px] transition-all ${
                      durationMode === "custom"
                        ? "bg-white dark:bg-white/10 border-black dark:border-white text-black dark:text-white shadow-md border"
                        : "bg-[#F5F5F5] dark:bg-white/5 text-[#666] dark:text-white/40 border-transparent border hover:bg-[#F0F0F0] dark:hover:bg-white/10"
                    }`}
                  >
                    {durationMode === "custom" && <div className="w-1 h-1 rounded-full bg-black dark:bg-white" />}
                    <span className="text-[12px] font-bold">自定义时长</span>
                    {durationMode === "custom" && (
                      <div className="flex items-center ml-1">
                        <input 
                          type="text" 
                          value={duration} 
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) setDuration(Math.min(Math.max(val, 4), 180));
                          }}
                          className="bg-transparent text-[12px] font-bold text-black dark:text-white w-7 outline-none text-center"
                        />
                        <span className="text-[12px] font-medium text-[#999] dark:text-white/30">秒</span>
                      </div>
                    )}
                  </button>
                </div>
                
                <div className={`mt-6 relative px-1 transition-opacity duration-200 ${durationMode === 'custom' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                  <div 
                    className="h-1 bg-[#F0F0F0] dark:bg-white/10 rounded-full w-full relative cursor-pointer"
                    onClick={(e) => {
                      if (durationMode !== 'custom') return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const percent = x / rect.width;
                      const newVal = Math.round(4 + percent * (180 - 4));
                      setDuration(Math.min(Math.max(newVal, 4), 180));
                    }}
                  >
                    <div 
                      className="absolute h-1 bg-black dark:bg-white/40 rounded-full" 
                      style={{ width: `${((duration - 4) / (180 - 4)) * 100}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-[#333] border-2 border-black dark:border-white/20 rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
                      style={{ 
                        left: `${((duration - 4) / (180 - 4)) * 100}%`,
                      }}
                      onMouseDown={(e) => {
                        if (durationMode !== 'custom') return;
                        const startX = e.clientX;
                        const startVal = duration;
                        const container = e.currentTarget.parentElement;
                        if (!container) return;
                        const width = container.clientWidth;

                        const onMouseMove = (moveEvent: MouseEvent) => {
                          const deltaX = moveEvent.clientX - startX;
                          const deltaVal = (deltaX / width) * (180 - 4);
                          const newVal = Math.round(startVal + deltaVal);
                          setDuration(Math.min(Math.max(newVal, 4), 180));
                        };

                        const onMouseUp = () => {
                          document.removeEventListener('mousemove', onMouseMove);
                          document.removeEventListener('mouseup', onMouseUp);
                        };

                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-[10px] font-bold text-[#BBB] px-0.5">
                    <span>4秒</span>
                    <span>180秒</span>
                  </div>
                </div>
              </section>

              <div className="flex items-start gap-8 mt-2">
                <section className="flex-1">
                  <div className="flex items-center gap-1 mb-2 whitespace-nowrap">
                    <Music className="w-3.5 h-3.5 text-[#999]" />
                    <h4 className="text-[12px] font-bold text-[#999] dark:text-white/30">音频</h4>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${videoAudio ? 'bg-primary' : 'bg-[#E5E5E5] dark:bg-white/10'}`}
                    onClick={() => setVideoAudio(!videoAudio)}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${videoAudio ? 'right-1' : 'left-1'}`} />
                  </div>
                </section>

                <section className="flex-[2]">
                  <div className="flex items-center gap-1 mb-2">
                    <LayoutGrid className="w-3.5 h-3.5 text-[#999]" />
                    <h4 className="text-[12px] font-bold text-[#999] dark:text-white/30">数量</h4>
                  </div>
                  <div className="flex gap-1.5 p-1 bg-[#F5F5F5] dark:bg-white/5 rounded-xl w-fit">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setVideoCount(num)}
                        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                          videoCount === num ? 'bg-black dark:bg-white/10 text-white shadow-sm' : 'text-[#666] dark:text-white/40 hover:text-black dark:hover:text-white/60'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <section>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#999]" />
                    <span className="text-[12px] font-bold text-[#999] dark:text-white/30">水印</span>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${videoWatermark ? 'bg-primary' : 'bg-[#E5E5E5] dark:bg-white/10'}`}
                    onClick={() => setVideoWatermark(!videoWatermark)}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${videoWatermark ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              </section>
            </div>
          )}




          {activeMode === "image" && (
            <div className="space-y-4">
              {/* Format Selection */}
              <section>
                <div className="flex items-center gap-1 mb-2">
                  <FileText className="w-3.5 h-3.5 text-[#999]" />
                  <h4 className="text-[12px] font-bold text-[#999] dark:text-white/30">格式</h4>
                </div>
                <div className="flex gap-1.5 p-1 bg-[#F5F5F5] dark:bg-white/5 rounded-xl w-fit">
                  {["jpeg", "png"].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setImgFormat(fmt)}
                      className={`px-8 py-2 rounded-lg text-xs font-bold transition-all ${
                        imgFormat === fmt ? 'bg-primary text-white shadow-md' : 'text-[#666] dark:text-white/40 hover:text-black dark:hover:text-white/60'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </section>

              {/* Image Quality Selection for GPT Image 2 */}
              {imageModel === "GPT Image 2" && (
                <section>
                  <div className="flex items-center gap-1 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#999]" />
                    <h4 className="text-[12px] font-bold text-[#999] dark:text-white/30">输入画质</h4>
                  </div>
                  <div className="flex gap-1.5 p-1 bg-[#F5F5F5] dark:bg-white/5 rounded-xl w-fit">
                    {[
                      { id: "low", label: "低" },
                      { id: "medium", label: "中" },
                      { id: "high", label: "高" }
                    ].map((q) => (
                      <button
                        key={q.id}
                        onClick={() => setImgQuality(q.id as "low" | "medium" | "high")}
                        className={`px-8 py-2 rounded-lg text-xs font-bold transition-all ${
                          imgQuality === q.id ? "bg-primary text-white shadow-md" : "text-[#666] dark:text-white/40 hover:text-black dark:hover:text-white/60"
                        }`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Group Image Settings */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <LayoutGrid className="w-3.5 h-3.5 text-[#999]" />
                    <h4 className="text-[12px] font-bold text-[#999] dark:text-white/30">组图</h4>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${groupEnabled ? 'bg-primary' : 'bg-[#E5E5E5] dark:bg-white/10'}`}
                    onClick={() => setGroupEnabled(!groupEnabled)}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${groupEnabled ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>

                {groupEnabled && (
                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex gap-1 p-1 bg-[#F5F5F5] dark:bg-white/5 rounded-xl">
                      <button
                        onClick={() => setGroupType("link")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          groupType === "link" ? 'bg-primary text-white shadow-sm' : 'text-[#666] dark:text-white/40 hover:text-black dark:hover:text-white/60'
                        }`}
                      >
                        关联
                      </button>
                      <button
                        onClick={() => setGroupType("parallel")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          groupType === "parallel" ? 'bg-primary text-white shadow-sm' : 'text-[#666] dark:text-white/40 hover:text-black dark:hover:text-white/60'
                        }`}
                      >
                        并行
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className={`flex items-center gap-1.5 px-2 py-1 border rounded-lg transition-all ${groupAuto && groupType === 'link' ? 'bg-primary/5 border-primary/30' : 'border-[#E5E5E5] dark:border-white/10'}`}
                          onClick={() => groupType === 'link' && setGroupAuto(!groupAuto)}
                        >
                          <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-all ${groupAuto && groupType === 'link' ? 'bg-primary border-primary' : 'bg-white dark:bg-[#1A1A1A] border-[#DDD] dark:border-white/20'}`}>
                            {groupAuto && groupType === 'link' && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                          </div>
                          <span className={`text-[11px] font-bold ${groupType === 'link' ? 'text-black dark:text-white' : 'text-[#BBB] dark:text-white/20'}`}>Auto</span>
                        </div>

                        <div className={`flex items-center px-1.5 py-0.5 border border-[#E5E5E5] dark:border-white/10 rounded-lg bg-white dark:bg-[#1A1A1A] overflow-hidden transition-opacity ${groupAuto && groupType === 'link' ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                          <input 
                            type="text" 
                            value={groupCount}
                            readOnly
                            className="w-5 bg-transparent text-[11px] font-bold text-center outline-none py-1 text-black dark:text-white"
                          />
                          <div className="flex flex-col border-l border-[#F0F0F0] dark:border-white/5 ml-1">
                            <button 
                              onClick={() => setGroupCount(prev => Math.min(prev + 1, 9))}
                              className="px-1 hover:bg-[#F5F5F5] dark:hover:bg-white/5 transition-colors"
                            >
                              <ChevronRight className="w-2.5 h-2.5 rotate-[-90deg] text-[#999]" />
                            </button>
                            <button 
                              onClick={() => setGroupCount(prev => Math.max(prev - 1, 1))}
                              className="px-1 border-t border-[#F0F0F0] dark:border-white/5 hover:bg-[#F5F5F5] dark:hover:bg-white/5 transition-colors"
                            >
                              <ChevronRight className="w-2.5 h-2.5 rotate-90 text-[#999]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>


              {/* Watermark Section (if standalone requested but combined above usually) */}
              <section>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#999]" />
                    <span className="text-[12px] font-bold text-[#999]">水印</span>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${watermark ? 'bg-primary' : 'bg-[#E5E5E5] dark:bg-white/10'}`}
                    onClick={() => setWatermark(!watermark)}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${watermark ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


