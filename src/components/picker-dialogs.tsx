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
const modelGroups: { label: string; items: { name: string; tag?: string; desc: string; badge?: string }[] }[] = [
  {
    label: "视频模型",
    items: [
      { name: "Seedance 1.0 Pro", tag: "推荐", desc: "字节跳动 · 高质量电影级视频", badge: "新" },
      { name: "Kling 2.1 Master", desc: "可灵 · 长镜头与运镜表现优秀" },
      { name: "Hailuo 02", desc: "MiniMax · 自然光影,人物细节" },
      { name: "Veo 3", desc: "Google · 真实物理与音效同步" },
      { name: "Sora Turbo", desc: "OpenAI · 多镜头复杂场景" },
    ],
  },
  {
    label: "图像模型",
    items: [
      { name: "Nano Banana", tag: "推荐", desc: "Google · 一致性角色生成" },
      { name: "Seedream 4.0", desc: "字节跳动 · 商业摄影级出图" },
      { name: "Flux 1.1 Pro", desc: "Black Forest Labs · 高细节通用模型" },
    ],
  },
  {
    label: "音频模型",
    items: [
      { name: "Suno v5", desc: "AI 音乐生成,支持中英文歌词" },
      { name: "ElevenLabs v3", desc: "高拟真人声配音" },
    ],
  },
];

export function ModelPickerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [selected, setSelected] = useState("Seedance 1.0 Pro");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border-border bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">选择模型</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="搜索模型名称…"
            className="w-full rounded-full border border-border bg-background/40 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-aurora-blue"
          />
        </div>
        <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-1">
          {modelGroups.map((g) => (
            <div key={g.label}>
              <div className="mb-2 text-xs font-medium text-muted-foreground">{g.label}</div>
              <div className="grid grid-cols-2 gap-2">
                {g.items.map((m) => {
                  const active = selected === m.name;
                  return (
                    <button
                      key={m.name}
                      onClick={() => setSelected(m.name)}
                      className={`group relative rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-aurora-blue bg-aurora-blue/10"
                          : "border-border bg-background/40 hover:bg-accent/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{m.name}</span>
                        <div className="flex items-center gap-1.5">
                          {m.tag && (
                            <span className="rounded-full bg-aurora-orange/20 px-1.5 py-0.5 text-[9px] font-medium text-aurora-orange">
                              {m.tag}
                            </span>
                          )}
                          {m.badge && (
                            <span className="rounded-full bg-success/20 px-1.5 py-0.5 text-[9px] font-medium text-success">
                              {m.badge}
                            </span>
                          )}
                          {active && <Check className="h-3.5 w-3.5 text-aurora-blue" />}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Skill Picker ---------------- */
const skills = [
  { title: "旅拍大师 V2.0", author: "MovieFlow", img: skillTravel, desc: "电影级唯美旅拍视频工作流" },
  { title: "剧本驱动型视频", author: "MovieFlow", img: skillScript, desc: "上传剧本,生成多镜头电影叙事" },
  { title: "商品宣传短片", author: "MovieFlow", img: skillProduct, desc: "AI 商业广告短片工作流" },
  { title: "音乐 MV", author: "MovieFlow", img: skillMv, desc: "上传音乐,生成口型同步 MV" },
  { title: "视频拉片复刻", author: "MovieFlow", img: skillReenact, desc: "学习参考视频的镜头语言并复刻" },
  { title: "故事驱动型视频", author: "MovieFlow", img: skillStory, desc: "从一句话到完整短片" },
];

export function SkillPickerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [tab, setTab] = useState<"mine" | "featured">("mine");
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

export function ElementsPickerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [tab, setTab] = useState("char");
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
