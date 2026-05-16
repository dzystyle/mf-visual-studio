import { createFileRoute } from "@tanstack/react-router";
import { BrandMark, TopBar } from "@/components/TopBar";
import { Play } from "lucide-react";
import tvSpace from "@/assets/tv-space.jpg";
import tvDrama from "@/assets/tv-drama.jpg";
import tvPalace from "@/assets/tv-palace.jpg";

export const Route = createFileRoute("/tv")({
  head: () => ({ meta: [{ title: "MovieFlowTV — 社区作品" }] }),
  component: () => (
    <div className="relative min-h-screen">
      <section className="aurora-bg px-8 pb-10 pt-16">
        <BrandMark />
        <TopBar />
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold">MovieFlowTV</h1>
          <p className="mt-1 text-sm text-muted-foreground">来自社区的精选作品</p>
        </div>
      </section>
      <section className="px-8 pb-24">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {[tvSpace, tvDrama, tvPalace, tvSpace, tvDrama, tvPalace, tvSpace, tvDrama, tvPalace, tvSpace].map(
            (img, i) => (
              <div key={i} className="group cursor-pointer">
                <div className={`relative overflow-hidden rounded-xl border border-border ${i % 3 === 2 ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
                  <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/40">
                    <Play className="h-3 w-3 fill-foreground text-foreground" />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  ),
});
