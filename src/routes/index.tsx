import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { PromoBanner } from "@/components/PromoBanner";
import { BrandMark, TopBar } from "@/components/TopBar";
import { PromptBox } from "@/components/PromptBox";
import { SkillCard, hotSkills } from "@/components/SkillCard";
import { ArtrailTV } from "@/components/tv/ArtrailTV";
import { FeatureCarousel } from "@/components/FeatureCarousel";
import { CreateCanvasDialog } from "@/components/CreateCanvasDialog";
import { WhatsNewDialog } from "@/components/WhatsNewDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "artrail.ai — 你的专属 AI 创作 平台" },
      { name: "description", content: "把品味和习惯写进 Skill,让精力回归创意。" },
    ],
  }),
  component: Home,
});

const SKILL_CATEGORIES = [
  "全部",
  "剧情短片",
  "动漫游戏",
  "大师美学",
  "科幻特效",
  "效率工具",
  "广告营销",
  "萌宠",
];

function Home() {
  const navigate = useNavigate();
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [isHoveredInMini, setIsHoveredInMini] = useState(false);
  
  const [activeTab, setActiveTab] = useState("智能");
  const [canvasDialogOpen, setCanvasDialogOpen] = useState(false);
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWhatsNewOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Logic: If scrolled more than 100px or near the bottom, show the mini input
      // Actually, the prompt says "After sliding to the bottom 灵感发现"
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      // If we are past the hero section (roughly 500px), or specifically near the TV section
      setIsScrolledToBottom(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <PromoBanner />
      <CreateCanvasDialog open={canvasDialogOpen} onOpenChange={setCanvasDialogOpen} />
      <WhatsNewDialog open={whatsNewOpen} onOpenChange={setWhatsNewOpen} />

      {/* Hero with aurora */}
      <section className="aurora-bg relative px-6 pb-8 pt-6">
        <BrandMark />
        <TopBar />

        <div className="mx-auto max-w-4xl pt-4 text-center">
          <h1 className="text-[34px] font-semibold leading-tight tracking-tight text-foreground">
            ArTrail&nbsp;1.0 — 你的专属 AI 创作 平台
          </h1>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            把品味和习惯写进 Skill,让精力回归创意
          </p>

          <div className={`mt-5 transition-all duration-500 ${isScrolledToBottom ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            <div className="flex justify-center mb-3">
              <div className="flex items-center p-1 bg-black/5 dark:bg-white/5 backdrop-blur-md rounded-full border border-black/[0.03] dark:border-white/[0.03] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] dark:shadow-none">
                <div className="flex bg-black/[0.03] dark:bg-white/[0.03] p-0.5 rounded-full items-center">
                  {["智能", "画布", "营销"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        if (tab === "营销") {
                          toast.info("功能开发中");
                          return;
                        }
                        if (tab === "画布") {
                          setCanvasDialogOpen(true);
                          return;
                        }
                        setActiveTab(tab);
                      }}
                      className={`flex items-center justify-center px-5 py-1 text-[13px] font-medium rounded-full transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="px-5 py-1 text-[13px] text-foreground/80 font-normal ml-1">
                   Agent一起聊聊创作想法
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`mx-auto w-full max-w-[810px] transition-all duration-500 ${isScrolledToBottom ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <PromptBox
            tall
            onSubmit={(prompt, canvasMode, skill) =>
              navigate({ 
                to: canvasMode ? "/script" : "/creative-assistant", 
                search: (skill ? { prompt, skill } : { prompt }) as any 
              })
            }
          />
        </div>

        <div className="mx-auto mt-6 w-full max-w-[810px]">
          <SkillsWithPreview />
        </div>
      </section>

      {/* Feature carousel */}
      <section className="px-6 pb-8 pt-1">
        <FeatureCarousel
          onTry={(title) => {
            window.dispatchEvent(new CustomEvent("insert-template", { detail: title }));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </section>

      {/* Inspiration Discovery Section */}
      <ArtrailTV />

      {/* Floating Mini Prompt Box */}
      <div 
        className={`fixed bottom-8 left-1/2 z-[200] -translate-x-1/2 transition-all duration-500 ease-out-expo ${
          isScrolledToBottom ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
        onMouseEnter={() => setIsHoveredInMini(true)}
        onMouseLeave={() => setIsHoveredInMini(false)}
      >
        <div className={`transition-all duration-300 ${isHoveredInMini ? 'w-[800px]' : 'w-[400px]'}`}>
          <PromptBox 
            isMini={!isHoveredInMini}
            onSubmit={(prompt, canvasMode, skill) => 
              navigate({ 
                to: canvasMode ? "/script" : "/creative-assistant", 
                search: (skill ? { prompt, skill } : { prompt }) as any 
              })
            }
          />
        </div>
      </div>
    </div>
  );
}


function SkillsWithPreview() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [category, setCategory] = useState("全部");
  const [catOpen, setCatOpen] = useState(false);
  const [page, setPage] = useState(0);
  const active = hotSkills.find((s) => s.id === hovered) ?? null;
  const filtered = useMemo(
    () => (category === "全部" ? hotSkills : hotSkills.filter((s) => s.tags?.includes(category))),
    [category]
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 4));
  const safePage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(safePage * 4, safePage * 4 + 4);

  return (
    <div className="relative">
      {active && (
        <div
          className="fixed z-[30] -translate-x-1/2 translate-y-3 transition-all duration-200"
          style={{
            left: position.x,
            top: position.y,
          }}
          onMouseEnter={() => setHovered(active.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#161616] shadow-2xl shadow-black/50">
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <video
                key={active.video}
                src={active.video}
                poster={active.image}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                {active.subModel && (
                  <div className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white/70 backdrop-blur">
                    {active.subModel}
                  </div>
                )}
                <div className="rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white/70 backdrop-blur">
                  {active.model}
                </div>
              </div>
              
              {/* Try it button overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <button 
                  onClick={() => {
                    const event = new CustomEvent('insert-template', { detail: active.title });
                    window.dispatchEvent(event);
                    setHovered(null);
                  }}
                  className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 text-sm font-medium text-white backdrop-blur-md border border-white/20 transition hover:bg-white/20"
                >
                  试一试
                </button>
                <div className="absolute bottom-4 left-0 w-full px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/80">
                    <span>适用：1-5分钟短片 · 视觉/声...</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-[10px] text-white/40 mb-1">{active.author}</div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-white truncate mr-2">{active.title}</div>
                <div className="rounded bg-white/10 px-1 text-[9px] font-medium text-white/60">
                  {active.version}
                </div>
              </div>
              <div className="text-[11px] leading-relaxed text-white/60 mb-3 line-clamp-2">
                {active.desc}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {active.tags?.map(tag => (
                    <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/40">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-white/60">{active.default ? "取消默认" : "设为默认"}</span>
                  <div className={`h-3 w-6 rounded-full p-0.5 transition-colors ${active.default ? 'bg-emerald-500' : 'bg-white/20'}`}>
                    <div className={`h-2 w-2 rounded-full bg-white transition-transform ${active.default ? 'translate-x-3' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 -top-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-t border-l border-white/10 bg-[#161616]" />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-[15px] font-semibold text-foreground">热门模版</div>
            <div className="h-3.5 w-px bg-black/10 dark:bg-white/15" />
            <div className="relative">
              <button
                onClick={() => setCatOpen((v) => !v)}
                className="flex items-center gap-1 rounded-lg px-1 py-0.5 text-[13px] text-muted-foreground transition hover:text-foreground"
              >
                {category}
                <ChevronDown className="h-3 w-3" />
              </button>
              {catOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCatOpen(false)} />
                  <div className="absolute left-0 top-full z-50 mt-1.5 w-32 overflow-hidden rounded-xl border border-black/[0.08] bg-white py-1 shadow-xl shadow-black/10 dark:border-white/10 dark:bg-[#1a1a1d] dark:shadow-black/50">
                    {SKILL_CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCategory(c);
                          setPage(0);
                          setCatOpen(false);
                        }}
                        className={`block w-full px-3 py-1.5 text-left text-[12px] transition ${
                          c === category
                            ? "bg-black/[0.04] text-foreground dark:bg-white/[0.06]"
                            : "text-muted-foreground hover:bg-black/[0.03] hover:text-foreground dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, safePage - 1))}
              disabled={safePage === 0}
              aria-label="上一页"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white/70 text-foreground/70 transition hover:bg-white disabled:opacity-30 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.1]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))}
              disabled={safePage === pageCount - 1}
              aria-label="下一页"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white/70 text-foreground/70 transition hover:bg-white disabled:opacity-30 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/[0.1]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="grid w-full grid-cols-4 gap-2.5">
          {visible.map((s) => (
            <SkillHoverItem key={s.id} skill={s} hovered={hovered} setHovered={setHovered} setPosition={setPosition} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SkillHoverItem({
  skill: s,
  hovered,
  setHovered,
  setPosition,
}: {
  skill: (typeof hotSkills)[number];
  hovered: string | null;
  setHovered: (id: string | null) => void;
  setPosition: (p: { x: number; y: number }) => void;
}) {
  return (
    <div
      onMouseMove={(e) => {
        if (hovered === s.id) {
          const rect = e.currentTarget.getBoundingClientRect();
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.bottom,
          });
        }
      }}
      onMouseEnter={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.bottom,
        });
        setHovered(s.id);
      }}
      onMouseLeave={() => setHovered(null)}
    >
      <SkillCard
        {...s}
        compact
        onTry={() => {
          const event = new CustomEvent('insert-template', { detail: s.title });
          window.dispatchEvent(event);
        }}
      />
    </div>
  );
}

