import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, Bot, ArrowRight, Wand2, Star, Slash, Layers, Film, SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import skillPreview from "@/assets/skill-story.jpg";
import agentPreview from "@/assets/skill-script.jpg";

export const WHATS_NEW_KEY = "mf_whatsnew_v1";

type Slide = {
  key: string;
  badge: string;
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
  image: string;
  points: { icon: typeof Sparkles; title: string; desc: string }[];
  cta: string;
};

const slides: Slide[] = [
  {
    key: "skill",
    badge: "全新 Skill",
    icon: Sparkles,
    title: "把品味和习惯，沉淀成可复用的 Skill",
    subtitle: "一次设定，之后每次创作都自动带上你的风格。",
    image: skillPreview,
    points: [
      { icon: Wand2, title: "风格复用", desc: "镜头、配色、节奏一次写好，随时调用" },
      { icon: Slash, title: "输入框 / 唤起", desc: "在输入框敲 / 即可搜索并插入 Skill" },
      { icon: Star, title: "设为默认", desc: "常用 Skill 设为默认，Agent 自动匹配" },
    ],
    cta: "去看看 Skill",
  },
  {
    key: "agent",
    badge: "全新 Agent",
    icon: Bot,
    title: "一句话，Agent 帮你跑完整条创作流水线",
    subtitle: "需求拆解 → 分镜脚本 → 分段生成 → 成片，每一步都可干预。",
    image: agentPreview,
    points: [
      { icon: Layers, title: "自动拆解", desc: "理解时长、风格与叙事结构，给出方案" },
      { icon: Film, title: "分段生成", desc: "按镜头逐段产出，画面与旁白同步对齐" },
      { icon: SlidersHorizontal, title: "随时接管", desc: "任意节点确认、替换或重跑，掌控最终效果" },
    ],
    cta: "立即体验 Agent",
  },
];

export function WhatsNewDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  const slide = slides[index];
  const Icon = slide.icon;
  const isLast = index === slides.length - 1;

  const dismiss = () => {
    onOpenChange(false);
  };

  const handlePrimary = () => {
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    dismiss();
    window.dispatchEvent(
      new CustomEvent("insert-template", { detail: "帮我生成一条 30 秒的品牌短片，节奏明快、画面电影感" }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSecondaryLink = () => {
    dismiss();
    navigate({ to: "/skill" });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) dismiss();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-[720px] gap-0 overflow-hidden rounded-3xl border-border bg-card p-0">
        <DialogTitle className="sr-only">新功能发布</DialogTitle>
        <DialogDescription className="sr-only">{slide.subtitle}</DialogDescription>

        {/* Glow header */}
        <div className="relative overflow-hidden px-8 pb-6 pt-8">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <Icon className="h-3.5 w-3.5" />
              NEW · {slide.badge}
            </div>
            <h2 className="mt-3 text-[23px] font-semibold leading-snug tracking-tight text-foreground">
              {slide.title}
            </h2>
            <p className="mt-1.5 text-[13px] text-muted-foreground">{slide.subtitle}</p>
          </div>
        </div>

        {/* Body */}
        <div className="grid gap-5 px-8 md:grid-cols-[240px_1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/40">
            <img
              key={slide.image}
              src={slide.image}
              alt={`${slide.badge}功能预览`}
              className="h-[168px] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="flex flex-col justify-center gap-3">
            {slide.points.map((p) => {
              const PIcon = p.icon;
              return (
                <div
                  key={p.title}
                  className="flex items-start gap-3 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-border hover:bg-muted/40"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <PIcon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-foreground">{p.title}</div>
                    <div className="text-[12px] leading-relaxed text-muted-foreground">{p.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border px-8 py-4">
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.key}
                aria-label={`查看 ${s.badge}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-emerald-500" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {isLast ? (
              <button
                onClick={handleSecondaryLink}
                className="rounded-xl px-4 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                去看 Skill
              </button>
            ) : (
              <button
                onClick={dismiss}
                className="rounded-xl px-4 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                稍后再说
              </button>
            )}
            <button
              onClick={handlePrimary}
              className="flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-2 text-[13px] font-medium text-background transition hover:opacity-90"
            >
              {isLast ? slide.cta : "下一个"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
