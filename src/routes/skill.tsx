import { createFileRoute } from "@tanstack/react-router";
import { Plus, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import skillJojo from "@/assets/skill-jojo.png.asset.json";
import skillDimension from "@/assets/skill-dimension.png.asset.json";
import skillDestiny from "@/assets/skill-destiny.png.asset.json";
import skillScript from "@/assets/skill-script.jpg";
import skillStory from "@/assets/skill-story.jpg";
import skillReenact from "@/assets/skill-reenact.jpg";
import skillProduct from "@/assets/skill-product.jpg";

export const Route = createFileRoute("/skill")({
  head: () => ({
    meta: [
      { title: "Skill 发现 — Artrail" },
      { name: "description", content: "探索并使用最适合你的 AI 创作 Skill。" },
    ],
  }),
  component: SkillDiscoveryPage,
});

const CATEGORIES = [
  "全部", "热门玩法", "大师美学", "剧情短片", "商业广告", 
  "动漫游戏", "短剧/微短剧", "音乐/MV", "产品展示", "平面设计", 
  "生活Vlog", "工具增强"
];

const SORT_OPTIONS = ["精选", "使用最多", "最新"];

const SKILLS = [
  {
    id: "story-driven",
    title: "故事驱动型视频",
    version: "V35",
    author: "@Flova",
    model: "Seedance 2.5",
    desc: "专为具有完整故事线的视频而设计。核心亮点：由 Seedance 2.5 (分辨率 480p) 目前最强大的视频模型...",
    image: skillScript,
    tags: ["全部", "剧情短片"],
    isDefault: true,
    authorAvatar: "F"
  },
  {
    id: "product-ads",
    title: "商品宣传短片",
    version: "V24",
    author: "@Flova",
    model: "Nano Banana Pro + Seedance 2.5",
    desc: "快速创建AI商业广告短片，为您的产品呈现专业级的视觉效果和创意故事。使用模型 Nano Banana + Seedance 2.5...",
    image: skillProduct,
    tags: ["全部", "商业广告"],
    isDefault: false,
    authorAvatar: "F"
  },
  {
    id: "video-reenact",
    title: "视频拉片复刻",
    version: "V22",
    author: "@Flova",
    model: "Nano Banana Pro + Seedance 2.5",
    desc: "通过学习上传视频的电影语法（提取其脚本、镜头结构、视觉语言和节奏），围绕您自己的主题生成全新视频。使用...",
    image: skillReenact,
    tags: ["全部", "工具增强"],
    isDefault: false,
    authorAvatar: "F"
  },
  {
    id: "audio-ref",
    title: "剧情短片(音色参考)",
    version: "V14",
    author: "@Flova",
    model: "Seedance 2.5",
    desc: "核心亮点：角色语音锚定：每个角色在元素阶段都有专属的参考音频，确保整个过程中语调的一致性。- 由 Seedance...",
    image: skillStory,
    tags: ["全部", "剧情短片"],
    isDefault: false,
    authorAvatar: "F"
  },
  {
    id: "concept-ads",
    title: "宣言式概念短片",
    version: "V2",
    author: "@野菩萨WildPusa",
    model: "Seedance 2.5",
    desc: "「宣言短片」编译器：把任何议题编译成一支 1:30、以英文旁白为骨、画面零文字、21:9 的概念影像。本技能全链...",
    image: skillDestiny.url,
    tags: ["全部", "商业广告"],
    isDefault: true,
    authorAvatar: "W"
  },
  {
    id: "3d-classic",
    title: "3D国漫古装精品短剧",
    version: "V7",
    author: "@Flova",
    model: "Seedance 2.5 + GPT Image 2",
    desc: "适用于将剧本拆解为3D古风风格短视频的全流程制作场景。画面风格统一锁定为3D质感，以Seedance 2.0为核心...",
    image: skillJojo.url,
    tags: ["全部", "短剧/微短剧"],
    isDefault: true,
    authorAvatar: "F"
  },
  {
    id: "script-video",
    title: "剧本生视频(需上传剧本)",
    version: "V30",
    author: "@Flova",
    model: "Seedance 2.5",
    desc: "分析上传的剧本(图片/PDF/文本)，通过学习其电影语法——提取脚本、镜头结构、视觉语言和节奏——围绕您的主题生...",
    image: skillDimension.url,
    tags: ["全部", "剧情短剧"],
    isDefault: false,
    authorAvatar: "F"
  }
];

function SkillDiscoveryPage() {
  const [activeTab, setActiveTab] = useState("精选");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [sortOption, setSortOption] = useState("精选");

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <TopBar />
      
      <main className="mx-auto max-w-[1600px] px-6 pt-20 pb-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab("精选")}
              className={`text-xl font-bold transition-colors ${activeTab === '精选' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              精选
            </button>
            <button 
              onClick={() => setActiveTab("我的")}
              className={`text-xl font-bold transition-colors ${activeTab === '我的' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              我的
            </button>
          </div>
          
          <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10">
            <Plus className="h-4 w-4" />
            新建Skill
          </button>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  activeCategory === cat 
                  ? 'bg-foreground text-background' 
                  : 'bg-white/5 text-muted-foreground border border-white/5 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pl-4">
            <span className="text-[11px] text-muted-foreground">排序:</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:opacity-80 transition">
                  {sortOption}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-32 p-1 bg-[#1c1c1f] border-white/10">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSortOption(opt)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  >
                    {opt}
                    {sortOption === opt && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SKILLS.map(skill => (
            <SkillCard key={skill.id} {...skill} />
          ))}
        </div>
      </main>
    </div>
  );
}

function SkillCard({ title, version, author, model, desc, image, isDefault, authorAvatar }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#161618] transition-all hover:border-white/20 hover:shadow-xl hover:shadow-black/20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/20">
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Model Chips */}
        <div className="absolute top-3 left-3 flex gap-2">
          {model.split('+').map((m: string) => (
            <div key={m} className="rounded bg-black/60 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-md">
              {m.trim()}
            </div>
          ))}
        </div>

        {/* Author Info */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-lg">
            {authorAvatar}
          </div>
          <span className="text-[11px] font-medium text-white/90 drop-shadow-md">{author}</span>
        </div>

        {/* Default Toggle (Bottom Right) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 backdrop-blur-md border border-white/5">
          <span className="text-[10px] text-white/60">{isDefault ? "取消默认" : "设为默认"}</span>
          <div className={`h-2.5 w-5 rounded-full p-0.5 transition-colors ${isDefault ? 'bg-emerald-500' : 'bg-white/20'}`}>
            <div className={`h-1.5 w-1.5 rounded-full bg-white transition-transform ${isDefault ? 'translate-x-2' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="truncate text-[15px] font-bold text-foreground pr-2">{title}</h3>
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {version}
          </span>
        </div>
        
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground/80 mb-4">
          {desc}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <div className="rounded bg-white/5 px-2 py-1 text-[10px] text-muted-foreground">全部</div>
          <div className="rounded bg-white/5 px-2 py-1 text-[10px] text-muted-foreground">剧情短片</div>
        </div>
      </div>
    </div>
  );
}
