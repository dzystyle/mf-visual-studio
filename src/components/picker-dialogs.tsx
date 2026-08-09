import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Check, Plus, Sparkles, Image as ImageIcon, Video, Music, FileText } from "lucide-react";
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
    { name: "Midjourney", desc: "高精度模型，具有准确的提示、优质纹理和细节。" },
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
  const [activeTab, setActiveTab] = useState<keyof typeof modelData>("image");
  const selected = value ?? "Seedance 2.5";
  
  const handlePick = (name: string) => {
    onSelect?.(name);
    onOpenChange(false);
  };

  const tabs = [
    { key: "image", label: "图片" },
    { key: "video", label: "视频" },
    { key: "music", label: "音乐" },
    { key: "audio", label: "音频" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[580px] border-white/10 bg-[#0A0A0A]/95 p-0 text-white backdrop-blur-xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg font-bold">模型</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pt-4">
          <div className="flex w-full items-center gap-1 rounded-full bg-white/5 p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onMouseEnter={() => setActiveTab(t.key as any)}
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
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
            {tabs.find(t => t.key === activeTab)?.label}
          </div>
          <div className="max-h-[500px] space-y-2 overflow-y-auto pr-2 scrollbar-hide">
            {modelData[activeTab].map((m: any) => {
              const active = selected === m.name;
              return (
                <button
                  key={m.name}
                  onClick={() => handlePick(m.name)}
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
                      {m.badge && (
                        <span className="rounded bg-green-500/20 px-1 py-0.5 text-[8px] font-bold text-green-500">
                          {m.badge}
                        </span>
                      )}
                      {m.tag && (
                        <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                          {m.tag}
                        </span>
                      )}
                      {m.upgrade && (
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
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Skill Picker ---------------- */
const skills = [
  { title: "旅拍大师 V2.0", author: "Artrail", img: skillTravel, desc: "电影级唯美旅拍视频工作流" },
  { title: "剧本驱动型视频", author: "Artrail", img: skillScript, desc: "上传剧本,生成多镜头电影叙事" },
  { title: "商品宣传短片", author: "Artrail", img: skillProduct, desc: "AI 商业广告短片工作流" },
  { title: "音乐 MV", author: "Artrail", img: skillMv, desc: "上传音乐,生成口型同步 MV" },
  { title: "视频拉片复刻", author: "Artrail", img: skillReenact, desc: "学习参考视频的镜头语言并复刻" },
  { title: "故事驱动型视频", author: "Artrail", img: skillStory, desc: "从一句话到完整短片" },
];

export function SkillPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect?: (title: string) => void;
}) {
  const [tab, setTab] = useState<"mine" | "featured">("mine");
  const pick = (title: string) => {
    onSelect?.(title);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-border bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">选择 Skill</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex rounded-full border border-border bg-background/40 p-1">
            {(["mine", "featured"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-4 py-1 text-xs transition ${
                  tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "mine" ? "我的 Skill" : "精选 Skill"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs hover:bg-accent/40">
            <Sparkles className="h-3.5 w-3.5 text-aurora-pink" />
            创建 Skill
          </button>
        </div>
        <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto pr-1">
          {skills.map((s) => (
            <button
              key={s.title}
              onClick={() => pick(s.title)}
              className="group flex gap-3 rounded-xl border border-border bg-background/40 p-2.5 text-left transition hover:border-aurora-blue/60 hover:bg-accent/40"
            >
              <img src={s.img} alt={s.title} className="h-16 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{s.title}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">@{s.author}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Elements Picker ---------------- */
const elementTabs = [
  { key: "char", label: "角色", icon: Sparkles },
  { key: "scene", label: "场景", icon: ImageIcon },
  { key: "shot", label: "镜头", icon: Video },
  { key: "music", label: "音乐", icon: Music },
  { key: "script", label: "脚本", icon: FileText },
];

const elementItems = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  name: ["少女·夏野", "赛博都市", "黄昏海岸", "雪山追逐", "霓虹街角", "古风庭院", "未来太空站", "复古胶片", "雨夜东京", "极地极光", "森林精灵", "末日废土"][i],
}));

export function ElementsPickerDialog({ open, onOpenChange, onSelect }: { open: boolean; onOpenChange: (v: boolean) => void; onSelect?: (name: string) => void }) {
  const [tab, setTab] = useState("char");
  const pick = (name: string) => { onSelect?.(name); onOpenChange(false); };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl border-border bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">选择元素</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2 border-b border-border pb-3">
          {elementTabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
                  active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent/40"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="grid max-h-[55vh] grid-cols-4 gap-3 overflow-y-auto pr-1">
          <button className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground transition hover:border-aurora-blue/60 hover:text-foreground">
            <Plus className="h-5 w-5" />
            <span className="text-xs">上传 / 创建</span>
          </button>
          {elementItems.map((it) => (
            <button
              key={it.id}
              onClick={() => pick(it.name)}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-gradient-to-br from-aurora-pink/20 via-aurora-blue/20 to-aurora-orange/20 text-left transition hover:border-aurora-blue/60"
            >
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <span className="text-xs font-medium text-foreground">{it.name}</span>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
