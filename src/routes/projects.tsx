import { createFileRoute } from "@tanstack/react-router";
import { BrandMark, TopBar } from "@/components/TopBar";
import { Plus } from "lucide-react";
import projectTeacher from "@/assets/project-teacher.jpg";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "我的项目 — movieflow.ai" }] }),
  component: ProjectsPage,
});

const projects = [
  { title: "AI视频演示:禁止在校园使用超能力", date: "2026年5月16日 15:23", img: projectTeacher },
  { title: "会飞的鱼", date: "2026年5月16日 15:33" },
  { title: "新建项目", date: "2026年5月15日 09:12" },
];

function ProjectsPage() {
  return (
    <div className="relative min-h-screen">
      <section className="aurora-bg px-8 pb-10 pt-16">
        <BrandMark />
        <TopBar />
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold">项目</h1>
          <p className="mt-1 text-sm text-muted-foreground">管理你的所有创作</p>
        </div>
      </section>
      <section className="px-8 pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <button className="group flex aspect-[16/10] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/40 hover:border-foreground/40 hover:bg-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <Plus className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium">创建新项目</div>
          </button>
          {projects.map((p) => (
            <div key={p.title} className="group cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-card">
                {p.img ? (
                  <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-foreground/20">
                    MovieFlow
                  </div>
                )}
              </div>
              <div className="mt-2.5 text-sm font-medium truncate">{p.title}</div>
              <div className="text-[11px] text-muted-foreground">最后编辑于 {p.date}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
