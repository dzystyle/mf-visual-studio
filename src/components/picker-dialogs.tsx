import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Check, Plus, Sparkles, Image as ImageIcon, Video, Music, FileText, ChevronRight, Eye, X, Code, Calendar } from "lucide-react";
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
  value?: string;
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
  value?: string;
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
              onClick={() => onSelect?.(s.title)}

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
                <button className="px-1 pb-3 text-sm font-medium text-white border-b-2 border-white">内容</button>
              </div>

              <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[15px] font-bold text-white">流程规划：</div>
                  <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-white/5">
                    <button className="p-2 rounded-md bg-white/10 text-white shadow-sm">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-md text-white/40 hover:text-white/60">
                      <Code className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-[13px] leading-relaxed text-white/60">
                  <p className="font-medium text-white/80">全流程规划逻辑与依赖关系：</p>
                  <ol className="space-y-4 list-decimal pl-4">
                    <li>
                      <span className="font-medium text-white/80">全局设定初始化：</span> 创建并锁定 Final_Video_Spec.md (明确画面比例默认为 16:9; 受开放世界犯罪/街头题材启发的主题视频、分镜、提示词和视觉审查。只借鉴其视觉语法、城市气质、镜头组织和角色类型，不复刻官方镜头、Logo、UI、商标、车牌或具体台词。) → text_editor。
                      <ul className="mt-2 list-disc pl-4 space-y-2 opacity-80">
                        <li>视觉风格不是单纯“霓虹犯罪”，而是“热带度假广告 + 真实犯罪纪录片 + 社交媒体荒诞短视频 + 开放世界城市展示”的混合体。画面表层热闹、性感、阳光、夸张；底层始终有追捕、债务、人情、走私、音乐产业、帮派和情侣逃亡的压力。</li>
                      </ul>
                    </li>
                    <li>
                      <span className="font-medium text-white/80">分镜大纲设计：</span> 设计完整故事分镜脚本 (时长默认控制在30-60s的小篇幅游戏机展示demo，除非用户有明确的长故事需求)，包含 key_elements (角色、场景、道具) 及 shot 列表。此处提供两种角色创作路径，由用户进行选择:
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between text-[11px] text-white/20">
                <div className="flex items-center gap-1.5">
                  最近一次更新时间 2026-08-10 20:22
                </div>
              </div>
              
              <div className="h-px bg-white/5 my-6" />

              <div className="flex justify-center">
                <button 
                  onClick={() => {
                    if (previewSkill) onSelect?.(previewSkill.title);
                    setPreviewSkill(null);
                  }}
                  className="flex items-center gap-2 rounded-full bg-white px-8 py-2.5 text-sm font-bold text-black hover:bg-white/90 transition-all shadow-xl shadow-white/5"
                >
                  <Sparkles className="h-4 w-4" />
                  去使用 Skill
                </button>
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
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">所有资产</span>
          <span className="text-sm text-white/40">(8)</span>
        </div>
        <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/5 transition">
          <X className="h-4 w-4 text-white/40" />
        </button>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex items-center gap-3 px-6 py-4 flex-wrap border-b border-white/5">
        {/* Creation Source Dropdown */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
          创作资产 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
        </button>

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
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
          时间范围 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
        </button>

        {/* Sort Order */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
          倒序 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
        </button>

        <div className="flex-1" />

        {/* Right Side Filters */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
            全部项目 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
            全部人员 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition">
            全部画布 <ChevronRight className="h-4 w-4 rotate-90 text-white/40" />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input 
              type="text" 
              placeholder="搜索资产..." 
              className="pl-9 pr-4 py-1.5 bg-white/5 rounded-lg text-xs w-40 focus:outline-none focus:ring-1 focus:ring-white/10"
            />
          </div>

          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button className="p-1.5 rounded bg-white/10"><Sparkles className="h-3.5 w-3.5" /></button>
            <button className="p-1.5 rounded hover:bg-white/10"><Check className="h-3.5 w-3.5 text-white/40" /></button>
          </div>

          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition">
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
      <DialogContent className="max-w-[1000px] border-white/10 bg-[#0A0A0A] p-0 text-white overflow-hidden rounded-[24px] shadow-2xl">
        <ElementsPicker onSelect={(name, kind, url) => { 
          onSelect?.(name, kind, url); 
          onOpenChange(false); 
        }} />
      </DialogContent>
    </Dialog>
  );
}

