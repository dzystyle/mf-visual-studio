import { createFileRoute } from "@tanstack/react-router";
import { BrandMark, TopBar } from "@/components/TopBar";
import { PromptBox } from "@/components/PromptBox";

export const Route = createFileRoute("/quick")({
  head: () => ({ meta: [{ title: "快速生成 — Flova.ai" }] }),
  component: () => (
    <div className="relative min-h-screen">
      <section className="aurora-bg px-8 pb-20 pt-20">
        <BrandMark />
        <TopBar />
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-semibold">快速生成</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            一句话生成图片、视频、音频或文本。
          </p>
          <div className="mt-8">
            <PromptBox />
          </div>
        </div>
      </section>
    </div>
  ),
});
