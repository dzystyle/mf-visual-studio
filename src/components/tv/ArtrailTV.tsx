import * as React from "react";
import { Play, CheckCircle2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { TvDetailDialog } from "./TvDetailDialog";
import tvSpace from "@/assets/tv-space.jpg";
import tvDrama from "@/assets/tv-drama.jpg";
import tvPalace from "@/assets/tv-palace.jpg";

const TV_DATA = [
  { id: 1, title: "The Surprise Lion", author: "Flova.ai", image: tvSpace, category: "漫剧", isLarge: true },
  { id: 2, title: "端午思念", author: "Holly", image: tvDrama, category: "漫剧" },
  { id: 3, title: "跑得全网最松弛的“面条猫”", author: "Bill", image: tvPalace, category: "漫剧" },
  { id: 4, title: "大虚", author: "参生", image: tvSpace, category: "漫剧" },
  { id: 5, title: "余烬星海", author: "小蓝蓝的天", image: tvDrama, category: "剧本生视频" },
  { id: 6, title: "宝可梦世界杯", author: "Holly", image: tvPalace, category: "漫剧" },
  { id: 7, title: "史前一万年", author: "Artrail", image: tvSpace, category: "漫剧" },
  { id: 8, title: "Dad.exe", author: "Artrail", image: tvDrama, category: "漫剧" },
  { id: 9, title: "The Hand", author: "Artrail", image: tvPalace, category: "漫剧" },
  { id: 10, title: "Auto Life", author: "Artrail", image: tvSpace, category: "漫剧" },
];

export function ArtrailTV() {
  const [activeCategory, setActiveCategory] = React.useState("漫剧");
  const [hoveredId, setHoveredId] = React.useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = React.useState<any>(null);

  const categories = ["全部", "影视", "短剧", "漫剧", "MV", "TVC"];

  return (
    <section className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground">ArtrailTV</h2>
            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm transition-all duration-200",
                    activeCategory === cat
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/40 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <button className="text-sm text-white/40 hover:text-white transition">查看更多</button>
        </div>

        {/* Grid Layout inspired by Reference 1 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
           {/* Top Main Banner Card */}
           <div className="relative col-span-1 lg:col-span-2 aspect-[21/9] overflow-hidden rounded-2xl group cursor-pointer bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/5">
              <img src={tvSpace} alt="Banner" className="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-center">
                 <div className="flex items-center gap-2 mb-4">
                    <img src="/favicon.png" alt="Logo" className="h-6 w-6" />
                    <span className="text-lg font-bold">Artrail.ai</span>
                 </div>
                 <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
                    Artrail 教程达人招募计划长期在线
                 </h1>
                 <p className="text-white/60 max-w-md">官方每月支持PRO会员 + 28000积分 | 至高单月得 ¥150000 元现金激励</p>
                 <div className="mt-6 flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                       <div key={i} className={cn("h-1.5 w-1.5 rounded-full", i === 1 ? "bg-white w-4" : "bg-white/20")} />
                    ))}
                 </div>
              </div>
           </div>

           {/* Normal Cards */}
           {TV_DATA.slice(0, 2).map((item) => (
             <TvItem 
               key={item.id} 
               item={item} 
               isHovered={hoveredId === item.id}
               onMouseEnter={() => setHoveredId(item.id)}
               onMouseLeave={() => setHoveredId(null)}
               onClick={() => setSelectedVideo(item)}
             />
           ))}

           {/* Remaining Cards */}
           {TV_DATA.slice(2).map((item) => (
             <TvItem 
               key={item.id} 
               item={item} 
               isHovered={hoveredId === item.id}
               onMouseEnter={() => setHoveredId(item.id)}
               onMouseLeave={() => setHoveredId(null)}
               onClick={() => setSelectedVideo(item)}
             />
           ))}
        </div>
      </div>

      <TvDetailDialog 
        open={!!selectedVideo} 
        onOpenChange={(open) => !open && setSelectedVideo(null)}
        videoData={selectedVideo}
      />
    </section>
  );
}

function TvItem({ item, isHovered, onMouseEnter, onMouseLeave, onClick }: any) {
  return (
    <div 
      className="group relative flex flex-col"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <div className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 transition-all duration-300 cursor-pointer bg-[#1A1A1A]",
        isHovered ? "ring-2 ring-primary/50 shadow-2xl shadow-primary/20 scale-[1.02]" : ""
      )}>
        <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        
        {/* Category Tag */}
        <div className="absolute left-3 top-3 rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white/70 backdrop-blur">
          {item.category}
        </div>

        {/* Play Icon (Top Right like Ref 1) */}
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
           <Play className="h-3 w-3 fill-current" />
        </div>

        {/* Hover Overlay Actions */}
        {isHovered && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 transition-all duration-300">
             <div className="mb-4 text-center">
                <div className="flex items-center justify-center gap-2 text-[10px] text-white/60 mb-2">
                   <div className="h-4 w-4 rounded bg-primary/20 flex items-center justify-center text-primary">
                      <Play className="h-2 w-2 fill-current" />
                   </div>
                   剧本生视频 (需上传剧本)
                   <span className="text-emerald-500 ml-2">✓ 已添加我的Skill</span>
                </div>
             </div>
             
             <div className="flex w-full gap-2">
                <button className="flex-1 rounded-full bg-white py-2 text-xs font-semibold text-black transition hover:bg-white/90">
                  查看
                </button>
                <button className="flex-1 rounded-full bg-white/20 py-2 text-xs font-semibold text-white backdrop-blur border border-white/10 transition hover:bg-white/30">
                  查看创作过程
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full overflow-hidden bg-white/10 border border-white/5">
             <img src={item.image} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="text-[10px] text-white/40">@{item.author}</div>
            <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{item.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
