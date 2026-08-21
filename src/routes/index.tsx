import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { Plus, ChevronRight, Play, ArrowUpRight, LayoutGrid, RotateCcw } from "lucide-react";
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
            <div className="flex flex-col items-center gap-6">
              {/* Tabs for different creation modes */}
              <div className="flex items-center gap-1.5 p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-white/40 hover:text-white/60 transition-all">
                  创作
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-black/40 shadow-inner transition-all">
                  短剧
                </button>
                <button className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-white/40 hover:text-white/60 transition-all">
                  营销
                </button>
                <div className="w-px h-3 bg-white/10 mx-2" />
                <span className="text-xs text-white/60 font-medium px-2">Agent一起聊聊创作想法</span>
              </div>

              <div className="w-full max-w-4xl relative group">
                {/* Secondary Navigation bar integrated with PromptBox style */}
                <div className="absolute -top-10 left-0 right-0 flex px-8 pointer-events-none">
                  <div className="flex items-end gap-0.5">
                    <button className="h-10 px-6 rounded-t-2xl bg-white/5 border-t border-x border-white/10 flex items-center gap-2 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all pointer-events-auto">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      上传剧本
                    </button>
                    <button className="h-10 px-6 rounded-t-2xl bg-white/5 border-t border-x border-white/10 flex items-center gap-2 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all pointer-events-auto relative">
                      <Plus className="h-3.5 w-3.5" />
                      剧本创作
                      <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[8px] font-bold bg-aurora-purple/20 text-aurora-purple border border-aurora-purple/20">剧本限免1次</span>
                    </button>
                    <button className="h-10 px-6 rounded-t-2xl bg-white/5 border-t border-x border-white/10 flex items-center gap-2 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all pointer-events-auto">
                      <LayoutGrid className="h-3.5 w-3.5" />
                      自由画布
                    </button>
                    <div className="h-10 px-8 rounded-t-[20px] bg-white border-t border-x border-white/5 flex items-center gap-2 text-xs font-bold text-black pointer-events-auto relative shadow-[0_-4px_12px_rgba(255,255,255,0.05)]">
                      <RotateCcw className="h-3.5 w-3.5" />
                      重制转绘
                      <span className="ml-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold bg-black text-white">NEW</span>
                    </div>
                  </div>
                </div>

                <div className="relative pt-[2px]">
                   <PromptBox
                    onSubmit={(prompt, canvasMode) =>
                      navigate({ 
                        to: canvasMode ? "/script" : "/creative-assistant", 
                        search: { prompt } 
                      })
                    }
                  />
                </div>
                
                {/* Footer Tip */}
                <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-white/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center text-[8px]">i</div>
                    <span>请确认上传的视频拥有合法版权或已获得授权</span>
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <button className="hover:text-white/50 transition-colors">没有剧本？进入画布创作</button>
                </div>
              </div>
            </div>
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

