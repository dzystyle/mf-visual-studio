import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { Plus, ChevronRight, Play, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { PromoBanner } from "@/components/PromoBanner";
import { BrandMark, TopBar } from "@/components/TopBar";
import { PromptBox } from "@/components/PromptBox";
import { SkillCard, hotSkills } from "@/components/SkillCard";
import { ArtrailTV } from "@/components/tv/ArtrailTV";
import { CreateCanvasDialog } from "@/components/CreateCanvasDialog";
import projectTeacher from "@/assets/project-teacher.jpg";
import tvSpace from "@/assets/tv-space.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "artrail.ai — 你的专属 AI 创作 平台" },
      { name: "description", content: "把品味和习惯写进 Skill,让精力回归创意。" },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [isHoveredInMini, setIsHoveredInMini] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("智能");

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

      {/* Hero with aurora */}
      <section className="aurora-bg relative px-6 pb-16 pt-16">
        <BrandMark />
        <TopBar />

        <div className="mx-auto max-w-4xl pt-10 text-center">
          <h1 className="text-[44px] font-semibold leading-tight tracking-tight text-foreground">
            ArTrail&nbsp;1.0 — 你的专属 AI 创作 平台
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            把品味和习惯写进 Skill,让精力回归创意
          </p>

          <div className={`mt-8 transition-all duration-500 ${isScrolledToBottom ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            {/* Input Tabs */}
            <div className="flex justify-center mb-4">
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
                        setActiveTab(tab);
                      }}
                      className={`flex items-center justify-center px-6 py-1.5 text-[14px] font-medium rounded-full transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-lg"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="px-6 py-1.5 text-[15px] text-foreground/80 font-normal ml-1">
                   Agent一起聊聊创作想法
                </div>
              </div>
            </div>

            <PromptBox
              onSubmit={(prompt, canvasMode) =>
                navigate({ 
                  to: canvasMode ? "/script" : "/creative-assistant", 
                  search: { prompt } 
                })
              }
            />
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl">
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="text-xs text-muted-foreground">热门 Skills</div>
            <Link
              to="/skill"
              className="flex items-center gap-1 text-[10px] text-muted-foreground transition hover:text-foreground"
            >
              更多 Skill <ChevronRight className="h-2.5 w-2.5" />
            </Link>
          </div>
          <SkillsWithPreview />
        </div>
      </section>

      {/* Recent projects */}
      <section className="px-6 pb-12 pt-2">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">最近项目</h2>
            <Link
              to="/projects"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              查看全部 <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <NewProjectCard onClick={() => setIsCreateDialogOpen(true)} />
            <ProjectCard title="会飞的鱼" date="2026年5月16日 15:33" />
            <ProjectCard
              title="AI视频演示:禁止在校园使用超能力"
              date="2026年5月16日 15:23"
              image={projectTeacher}
            />
          </div>
        </div>
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
            onSubmit={(prompt, canvasMode) => 
              navigate({ 
                to: canvasMode ? "/script" : "/creative-assistant", 
                search: { prompt } 
              })
            }
          />
        </div>
      </div>
      
      <CreateCanvasDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
}


function SkillsWithPreview() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const active = hotSkills.find((s) => s.id === hovered) ?? null;

  return (
    <div className="relative">
      {active && (
        <div
          className="fixed z-[30] -translate-x-1/2 -translate-y-[calc(100%+12px)] transition-all duration-200"
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
                    const event = new CustomEvent('select-skill', { detail: active.title });
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
          <div className="absolute left-1/2 -bottom-1.5 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-[#161616]" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {hotSkills.map((s) => (
          <div
            key={s.id}
            onMouseMove={(e) => {
              if (hovered === s.id) {
                const rect = e.currentTarget.getBoundingClientRect();
                setPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                });
              }
            }}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPosition({
                x: rect.left + rect.width / 2,
                y: rect.top,
              });
              setHovered(s.id);
            }}
            onMouseLeave={() => setHovered(null)}
          >
            <SkillCard
              {...s}
              onTry={() => {
                const event = new CustomEvent('select-skill', { detail: s.title });
                window.dispatchEvent(event);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function NewProjectCard({ onClick }: { onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/40 transition hover:border-foreground/40 hover:bg-card"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-muted-foreground group-hover:text-foreground">
        <Plus className="h-5 w-5" />
      </div>
      <div className="text-center">
        <div className="text-sm font-medium">创建新项目</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          开启您的创作之旅
        </div>
      </div>
    </button>
  );
}

function ProjectCard({
  title,
  date,
  image,
}: {
  title: string;
  date: string;
  image?: string;
}) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-card">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted text-3xl font-semibold tracking-tight text-foreground/30">
            Artrail
          </div>
        )}
      </div>
      <div className="mt-2.5">
        <div className="truncate text-sm font-medium">{title}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">
          最后编辑于 {date}
        </div>
      </div>
    </div>
  );
}

