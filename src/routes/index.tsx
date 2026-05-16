import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { Plus, ChevronRight, Play } from "lucide-react";
import { PromoBanner } from "@/components/PromoBanner";
import { BrandMark, TopBar } from "@/components/TopBar";
import { PromptBox } from "@/components/PromptBox";
import { SkillCard, hotSkills } from "@/components/SkillCard";
import projectTeacher from "@/assets/project-teacher.jpg";
import tvSpace from "@/assets/tv-space.jpg";
import tvDrama from "@/assets/tv-drama.jpg";
import tvPalace from "@/assets/tv-palace.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "movieflow.ai — 你的专属 AI 视频创作 Agent" },
      { name: "description", content: "把品味和习惯写进 Skill,让精力回归创意。" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative">
      <PromoBanner />

      {/* Hero with aurora */}
      <section className="aurora-bg relative px-6 pb-16 pt-16">
        <BrandMark />
        <TopBar />

        <div className="mx-auto max-w-4xl pt-10 text-center">
          <h1 className="text-[44px] font-semibold leading-tight tracking-tight text-foreground">
            MovieFlow 1.0 — 你的专属 AI 视频创作 Agent
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            把品味和习惯写进 Skill,让精力回归创意
          </p>

          <div className="mt-8">
            <PromptBox />
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl">
          <div className="mb-3 text-center text-xs text-muted-foreground">
            热门 Skills
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {hotSkills.map((s) => (
              <SkillCard key={s.id} {...s} />
            ))}
          </div>
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
            <NewProjectCard />
            <ProjectCard title="会飞的鱼" date="2026年5月16日 15:33" />
            <ProjectCard
              title="AI视频演示:禁止在校园使用超能力"
              date="2026年5月16日 15:23"
              image={projectTeacher}
            />
          </div>
        </div>
      </section>

      {/* MovieFlowTV */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-semibold">MovieFlowTV</h2>
            <div className="flex items-center gap-2">
              {["全部", "影视", "短剧", "漫剧", "MV", "TVC"].map((t, i) => (
                <button
                  key={t}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    i === 0
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <TvCard title="星海漫游" author="MovieFlow Studio" image={tvSpace} />
            <TvCard title="红尘旧梦" author="夜色出品" image={tvDrama} />
            <TvCard title="深宫往事" author="一帧影像" image={tvPalace} tall />
            <TvCard title="霓虹之夜" author="MovieFlow" image={tvSpace} />
            <TvCard title="花信风" author="叙光" image={tvDrama} />
          </div>
        </div>
      </section>
    </div>
  );
}

function NewProjectCard() {
  return (
    <button className="group flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/40 transition hover:border-foreground/40 hover:bg-card">
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
            MovieFlow
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

function TvCard({
  title,
  author,
  image,
  tall,
}: {
  title: string;
  author: string;
  image: string;
  tall?: boolean;
}) {
  return (
    <div className="group cursor-pointer">
      <div
        className={`relative overflow-hidden rounded-xl border border-border ${
          tall ? "aspect-[3/4]" : "aspect-[4/5]"
        }`}
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
        <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 backdrop-blur">
          <Play className="h-3 w-3 fill-foreground text-foreground" />
        </div>
        <div className="absolute inset-x-3 bottom-3">
          <div className="text-sm font-semibold leading-tight">{title}</div>
          <div className="mt-0.5 text-[11px] text-foreground/70">@ {author}</div>
        </div>
      </div>
    </div>
  );
}
