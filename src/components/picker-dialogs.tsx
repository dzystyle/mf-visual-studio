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
    { name: "Vidu Q3 Pro", desc: "最强智能切镜、音画直出，支持1-16S视频模型。" },
    { name: "Grok Imagine Video", upgrade: true, desc: "xAI最新视频模型，超快生成速度，动作表现力好" },
    { name: "Kling 3.0 Omni", desc: "多图驱动，一镜成片。Kling 3.0 Omni，图生视频新标杆。" },
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
    <div className="w-[580px] text-white">
      <div className="px-6 pt-6">
        <h3 className="text-lg font-bold">模型</h3>
      </div>
      
      <div className="px-6 pt-4">
        <div className="flex w-full items-center gap-1 rounded-full bg-white/5 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabClick(t.key)}
              className={`flex-1 rounded-full py-1.5 text-xs font-medium transition-all ${
                activeTab === t.key ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 px-6 pb-6">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[400px] space-y-6 overflow-y-auto pr-2 scrollbar-hide text-white"
        >
          {tabs.map((tab) => (
            <div 
              key={tab.key}
              ref={(el) => { sectionRefs.current[tab.key] = el; }}
              className="space-y-3"
            >
              <div className="text-[10px] font-medium uppercase tracking-wider text-white/40 sticky top-0 bg-[#0A0A0A] py-1 z-10">
                {tab.label}
              </div>
              <div className="space-y-2">
                {modelData[tab.key].map((m) => {
                  const active = selected === m.name;
                  return (
                    <button
                      key={m.name}
                      onClick={() => onSelect?.(m.name)}
                      className={`group relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? "border-white/20 bg-white/10"
                          : "border-transparent bg-white/[0.02] hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className={`mt-1 h-5 w-5 rounded-full border-2 ${active ? 'border-white bg-white' : 'border-white/20'} flex items-center justify-center`}>
                        {active && <Check className="h-3 w-3 text-black stroke-[3px]" />}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{m.name}</span>
                          {"badge" in m && m.badge && (
                            <span className="rounded bg-green-500/20 px-1 py-0.5 text-[8px] font-bold text-green-500">
                              {m.badge}
                            </span>
                          )}
                          {"tag" in m && m.tag && (
                            <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                              {m.tag}
                            </span>
                          )}
                          {"upgrade" in m && m.upgrade && (
                            <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[8px] font-bold text-blue-500">
                              升级
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-white/50">{m.desc}</p>
                      </div>

                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="h-3 w-3" />
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
      <DialogContent className="max-w-[600px] border-white/10 bg-[#0A0A0A]/95 p-0 text-white backdrop-blur-xl">
        <ModelPicker value={value} onSelect={(name) => { onSelect?.(name); onOpenChange(false); }} />
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Skill Picker ---------------- */
const categories = [
  { key: "default", label: "默认调用" },
  { key: "newbie", label: "新手必用" },
  { key: "master", label: "大师美学" },
  { key: "story", label: "剧情短片" },
] as const;

const skillList = [
  {
    id: "destiny",
    title: "百万主角登场动效",
    desc: "主角高燃登场视频生成：用户上传主角人物图和结算画面图，基于案例提示词模板替换画风，保留极限镜头语言，并...",
    img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "jojo",
    title: "JOJO 风格变身玩法",
    desc: "把任何一张图片（人物、场景、物件都行）变成一段 30 秒的 JOJO 动画风格短片：厚描边、硬阴影、高饱和和平涂、满屏...",
    img: "https://images.unsplash.com/photo-1578632738981-43c9ad4c585f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "gta6",
    title: "GTA 6 风格演示 (玩转我的人生)",
    desc: "受 GTA6 官方公开素材启发的主题视频、分镜、提示词和视觉审查。只借鉴公开素材里的视觉语法、城市气质、镜头组...",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3d-horror",
    title: "经典 3D 日式怪谈风",
    desc: "专用于生成具有日式恐怖（如《死魂曲》《零》）风格的写实 3D 游戏恐怖视频。聚焦于阴雨浓雾下的旧校舍、民居、生...",
    img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "dimension",
    title: "次元破壁互动玩法",
    desc: "打破屏幕让自己喜欢的角色来到现实世界或者去到他们的世界。",
    img: "https://images.unsplash.com/photo-1560972550-aba3456b5564?q=80&w=800&auto=format&fit=crop",
  },
];

export function SkillPicker({
  onSelect,
}: {
  onSelect?: (title: string) => void;
}) {
  const [tab, setTab] = useState<typeof categories[number]["key"]>("newbie");
  const [previewSkill, setPreviewSkill] = useState<typeof skillList[number] | null>(null);
  
  return (
    <div className="w-[480px] text-white">
      <div className="flex items-center justify-between px-6 pt-6">
        <h3 className="text-lg font-bold">Skill</h3>
        <button className="flex items-center gap-0.5 text-xs text-white/40 hover:text-white/60">
          更多 <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="mt-4 px-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setTab(c.key)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-all ${
                tab === c.key
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {c.label}
              {c.key === "default" && (
                <span className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full border border-white/20 text-[8px]">i</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 max-h-[400px] overflow-y-auto px-6 pb-6 scrollbar-hide">
        <div className="space-y-3">
          {skillList.map((s) => (
            <div
              key={s.title}
              className="group flex cursor-pointer items-start gap-3 rounded-xl py-1 transition-all"
              onClick={() => setPreviewSkill(s)}
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/5">
                <img src={s.img} alt={s.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-bold text-white group-hover:text-white/90">{s.title}</h4>
                  <div className="flex items-center gap-2 transition-opacity">
                    <button 
                      onClick={() => setPreviewSkill(s)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(s.title);
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/40">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Detail Preview Modal */}
      <Dialog open={!!previewSkill} onOpenChange={(open) => !open && setPreviewSkill(null)}>
        <DialogContent className="max-w-[560px] p-0 border-white/10 bg-[#121212] overflow-hidden rounded-3xl shadow-2xl [&>button]:hidden">
          <div className="relative">
            {/* Header Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img src={previewSkill?.img} className="w-full h-full object-cover" alt={previewSkill?.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
              
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
                <h2 className="text-xl font-bold text-white tracking-tight">{previewSkill?.title}</h2>
              </div>
            </div>

            {/* Content Area */}
            <div className="px-6 pb-6">
              <div className="flex border-b border-white/5 mb-6">
                <button className="px-1 pb-3 text-sm font-medium text-white border-b-2 border-white">简介</button>
                <button className="px-1 pb-3 text-sm font-medium text-white/40 hover:text-white/60 ml-6">内容</button>
              </div>

              <div className="space-y-6">
                <div className="text-[14px] leading-relaxed text-white/70">
                  {previewSkill?.id === 'destiny' ? (
                    "分析上传的剧本（图片/PDF/文本），通过学习其电影语法——提取脚本、镜头结构、视觉语言和节奏——围绕您的主题生成全新的视频。使用 Nano Banana + Seedance 2.5（分辨率480p）生成视觉素材。"
                  ) : previewSkill?.desc}
                </div>

                <div className="flex items-center justify-between py-4 border-t border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/40">历史使用</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/20">最近一次更新时间 2026-08-11 16:56</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs hover:bg-red-500/20 transition-colors">
                      <X className="h-3.5 w-3.5" />
                      删除
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/80 text-xs hover:bg-white/10 transition-colors">
                      <FileText className="h-3.5 w-3.5" />
                      创建副本
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/80 text-xs hover:bg-white/10 transition-colors">
                      <Sparkles className="h-3.5 w-3.5" />
                      分享
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (previewSkill) onSelect?.(previewSkill.title);
                      setPreviewSkill(null);
                    }}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFE5B4] to-white px-8 py-2.5 text-sm font-bold text-black hover:opacity-90 transition-all shadow-xl shadow-white/5"
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
      <DialogContent className="max-w-[500px] border-white/10 bg-[#0A0A0A]/95 p-0 text-white backdrop-blur-xl">
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
  const [activeMode, setActiveMode] = useState<"video" | "image">("video");
  const [videoModel, setVideoModel] = useState("智能匹配模型");
  const [imageModel, setImageModel] = useState("Seedream 5.0 Pro");
  const [ratio, setRatio] = useState("智能");
  const [resolution, setResolution] = useState("720P");
  const [duration, setDuration] = useState(85);
  const [canvas, setCanvas] = useState(false);

  const videoModels = [
    { name: "智能匹配模型", desc: "当 Agent 识别到视频生成诉求时为你智能选择视频模型", icon: true },
    { name: "Seedance 2.5", badge: "新", isVip: true, desc: "支持30s直出和精准时间戳控制，会员积分消耗低至5.4折" },
    { name: "Seedance 2.0 Fast VIP", isVip: true, desc: "极速推理，会员专属通道" },
    { name: "Seedance 2.0 VIP", isVip: true, desc: "效果无损，会员专属通道" },
    { name: "Seedance 2.0 Mini 体验版", isVip: true, desc: "非会员限次体验，单秒限时低至4积分" },
  ];

  const imageModels = [
    { name: "智能匹配模型", desc: "当 Agent 识别到图片生成诉求时为你智能选择图片模型" },
    { name: "Seedream 5.0 Pro", badge: "新", isVip: true, desc: "支持交互式编辑，精准改图更可控" },
    { name: "Seedream 5.0 Lite", desc: "超强指令响应，智能逻辑推理" },
    { name: "Seedream 4.0 美感版", badge: "新", desc: "图像画质美感提升" },
    { name: "旗舰生图模型 V2-Flash", isVip: true, desc: "出图更快，文字准确性提升，真实感强" },
    { name: "Seedream 4.5", desc: "" },
  ];

  const ratios = [
    { label: "智能", icon: <LayoutGrid className="w-4 h-4" /> },
    { label: "16:9", icon: <div className="w-4 h-2.5 border border-current rounded-sm" /> },
    { label: "21:9", icon: <div className="w-5 h-2 border border-current rounded-sm" /> },
    { label: "9:16", icon: <div className="w-2.5 h-4 border border-current rounded-sm" /> },
    { label: "4:3", icon: <div className="w-4 h-3 border border-current rounded-sm" /> },
  ];

  return (
    <div className="flex flex-col rounded-[32px] bg-white text-[#1A1A1A] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] overflow-hidden animate-in zoom-in-95 fade-in duration-300 origin-bottom border border-[#F0F0F0]">
      <div className="flex items-center justify-between px-10 py-8">
        <div className="flex bg-[#F5F5F5] p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveMode("video")}
            className={`px-8 py-2.5 rounded-xl text-[15px] font-bold transition-all ${activeMode === 'video' ? 'bg-white shadow-sm text-black' : 'text-[#999]'}`}
          >
            视频偏好
          </button>
          <button 
            onClick={() => setActiveMode("image")}
            className={`px-8 py-2.5 rounded-xl text-[15px] font-bold transition-all ${activeMode === 'image' ? 'bg-white shadow-sm text-black' : 'text-[#999]'}`}
          >
            图片偏好
          </button>
        </div>
      </div>

      <div className="flex px-10 pb-12 gap-16">
        {/* Left Side: Model Selection */}
        <div className="flex-1 max-w-[340px]">
          <h4 className="text-[13px] font-bold text-[#999] mb-6 tracking-wide">模型选择</h4>
          <div className="space-y-6">
            {(activeMode === "video" ? videoModels : imageModels).map((m) => {
              const isActive = activeMode === "video" ? videoModel === m.name : imageModel === m.name;
              return (
                <button 
                  key={m.name}
                  onClick={() => activeMode === "video" ? setVideoModel(m.name) : setImageModel(m.name)}
                  className="w-full text-left group relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 flex items-center justify-center">
                      {isActive ? (
                        <Check className="w-5 h-5 text-black stroke-[3px]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5] group-hover:bg-[#CCC]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[15px] font-bold transition-colors ${isActive ? 'text-black' : 'text-[#333] group-hover:text-black'}`}>
                          {m.name}
                        </span>
                        {"isVip" in m && m.isVip && <div className="w-4 h-4 rounded-full bg-[#E0C3FC] flex items-center justify-center"><Sparkles className="w-2.5 h-2.5 text-[#9333EA] fill-current" /></div>}
                        {"badge" in m && m.badge && (
                          <span className="bg-[#22C55E] text-white text-[10px] font-black px-1.5 py-0.5 rounded leading-none">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      {m.desc && (
                        <p className="text-[13px] leading-relaxed text-[#999] mt-2 pr-4 font-medium">
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
        <div className="w-px bg-[#F0F0F0] self-stretch" />

        {/* Right Side: Parameters */}
        <div className="flex-1 space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <h4 className="text-[13px] font-bold text-[#999] tracking-wide">画面比例</h4>
              <div className="w-4 h-4 rounded-full border border-[#DDD] flex items-center justify-center text-[10px] text-[#999] cursor-help">?</div>
            </div>
            <div className="flex gap-4">
              {ratios.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setRatio(r.label)}
                  className={`flex flex-col items-center justify-center w-[84px] h-[84px] rounded-[24px] border-2 transition-all ${
                    ratio === r.label 
                      ? 'bg-white border-black text-black shadow-xl shadow-black/10' 
                      : 'bg-[#F8F8F8] border-transparent text-[#999] hover:bg-[#F3F3F3]'
                  }`}
                >
                  <div className="mb-2.5 transform scale-110">{r.icon}</div>
                  <span className="text-[13px] font-bold">{r.label}</span>
                </button>
              ))}
              <button className="flex items-center justify-center w-[84px] h-[84px] rounded-[24px] bg-[#F8F8F8] text-[#999] hover:bg-[#F0F0F0] transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </section>

          <section>
            <h4 className="text-[13px] font-bold text-[#999] mb-6 tracking-wide">{activeMode === 'video' ? '视频分辨率' : '图片分辨率'}</h4>
            <div className="flex gap-2 p-1.5 bg-[#F5F5F5] rounded-full w-fit">
              {(activeMode === 'video' ? ["4K", "2K", "1080P", "720P"] : ["1K", "2K", "4K"]).map((res) => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={`px-10 py-2.5 rounded-full text-[13px] font-bold transition-all ${
                    resolution === res ? 'bg-white shadow-sm text-black' : 'text-[#999] hover:text-[#666]'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </section>

          {activeMode === "video" && (
            <section>
              <div className="flex items-center gap-2 mb-6">
                <h4 className="text-[13px] font-bold text-[#999] tracking-wide">时长</h4>
                <div className="w-4 h-4 rounded-full border border-[#DDD] flex items-center justify-center text-[10px] text-[#999] cursor-help">?</div>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-10 py-3 rounded-2xl bg-[#F5F5F5] text-[15px] font-bold text-[#666] hover:bg-[#F0F0F0] transition-colors">
                  智能时长
                </button>
                <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-2xl px-8 py-3 min-w-[140px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  <input 
                    type="text" 
                    value={duration} 
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    className="bg-transparent text-[15px] font-bold text-black w-10 outline-none text-center"
                  />
                  <span className="text-[15px] font-bold text-[#999]">秒</span>
                </div>
              </div>
              <div className="mt-10 relative px-2 group">
                <div className="h-1 bg-[#F0F0F0] rounded-full w-full relative">
                  <div 
                    className="absolute h-1 bg-black rounded-full" 
                    style={{ width: `${(duration / 180) * 100}%` }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-black rounded-full shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    style={{ left: `${(duration / 180) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-4 text-[12px] font-bold text-[#CCC]">
                  <span>4秒</span>
                  <span>180秒</span>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}


