import { createFileRoute } from "@tanstack/react-router";
import { BrandMark, TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/tutorial")({
  head: () => ({ meta: [{ title: "教程 — Flova.ai" }] }),
  component: () => (
    <div className="relative min-h-screen">
      <section className="aurora-bg px-8 pb-10 pt-16">
        <BrandMark />
        <TopBar />
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-semibold">教程</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            从零开始,掌握 Flova 1.0 的核心工作流。
          </p>
        </div>
      </section>
      <section className="px-8 pb-24">
        <div className="mx-auto grid max-w-4xl gap-3">
          {["快速上手 Flova 1.0", "Skill 是什么、如何使用", "模型选择指南", "如何生成高质量电影级视频"].map(
            (t, i) => (
              <div key={i} className="rounded-xl border border-border bg-card/60 p-5 hover:bg-card">
                <div className="text-xs text-muted-foreground">第 {i + 1} 章</div>
                <div className="mt-1 text-base font-medium">{t}</div>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  ),
});
