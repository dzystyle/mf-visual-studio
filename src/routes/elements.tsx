import { createFileRoute } from "@tanstack/react-router";
import { BrandMark, TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/elements")({
  head: () => ({ meta: [{ title: "资产库 — artrail.ai" }] }),
  component: () => (
    <div className="relative min-h-screen">
      <section className="aurora-bg px-8 pb-10 pt-16">
        <BrandMark />
        <TopBar />
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold">元素库</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            上传角色、场景、道具,沉淀你的素材资产。
          </p>
        </div>
      </section>
      <section className="px-8 pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border border-dashed border-border bg-card/40"
            />
          ))}
        </div>
      </section>
    </div>
  ),
});
