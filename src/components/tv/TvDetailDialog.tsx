import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Play, Info, Share2, CheckCircle2, ChevronLeft, ChevronRight, Maximize2, Volume2, Pause } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import tvSpace from "@/assets/tv-space.jpg";
import tvDrama from "@/assets/tv-drama.jpg";

interface TvDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoData?: {
    title: string;
    author: string;
    image: string;
    videoUrl?: string;
  };
}

export function TvDetailDialog({ open, onOpenChange, videoData }: TvDetailDialogProps) {
  const navigate = useNavigate();
  if (!videoData) return null;

  const thumbnails = [
    { id: 1, image: videoData.image, active: true },
    { id: 2, image: tvSpace, active: false },
    { id: 3, image: tvDrama, active: false },
    { id: 4, image: tvSpace, active: false },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen h-screen border-none bg-black/95 p-0 sm:rounded-none [&>button[data-radix-collection-item]]:hidden">
        <div className="relative flex h-full w-full flex-col overflow-hidden">
          {/* Top Bar / Navigation */}
          <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar px-10 mx-auto">
               {thumbnails.map((thumb) => (
                 <div 
                   key={thumb.id}
                   className={cn(
                     "relative h-12 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-200",
                     thumb.active ? "border-primary scale-110" : "border-transparent opacity-50 hover:opacity-80"
                   )}
                 >
                   <img src={thumb.image} alt="" className="h-full w-full object-cover" />
                 </div>
               ))}
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="relative flex flex-1 items-center justify-center">
            {/* Background Blur Image */}
            <div className="absolute inset-0 z-0">
              <img src={videoData.image} alt="" className="h-full w-full object-cover blur-3xl opacity-30" />
            </div>

            {/* Main Video/Image Display */}
            <div className="relative z-10 w-full max-w-5xl px-6 aspect-video">
               <div className="group relative h-full w-full overflow-hidden rounded-2xl shadow-2xl shadow-black">
                 <img src={videoData.image} alt={videoData.title} className="h-full w-full object-cover" />
                 
                 {/* Video Controls Overlay */}
                 <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent p-8 opacity-100 transition-opacity">
                    <div className="flex flex-col gap-1 mb-8">
                       <div className="text-sm text-white/60">@{videoData.author}</div>
                       <h2 className="text-4xl font-bold text-white">{videoData.title}</h2>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <button 
                           onClick={() => navigate({ to: "/script" })}
                           className="flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-black transition hover:bg-white/90"
                         >
                           <Play className="h-5 w-5 fill-current" />
                           查看创作过程
                         </button>
                         <button className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/20 border border-white/10">
                           <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-500">
                                <CheckCircle2 className="h-3 w-3" />
                              </span>
                              剧本生视频 (需上传剧本)
                           </div>
                         </button>
                         <button className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/20 border border-white/10">
                           <span className="text-emerald-500 text-xs">✓ 已添加我的Skill</span>
                         </button>
                         <button className="flex items-center justify-center rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20 border border-white/10">
                           <Share2 className="h-5 w-5" />
                         </button>
                      </div>

                      <div className="flex items-center gap-6 text-white/80">
                         <div className="flex items-center gap-3">
                           <Pause className="h-4 w-4 fill-current cursor-pointer hover:text-white" />
                           <span className="text-sm font-mono tracking-tighter">00:04 / 01:43</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <Volume2 className="h-5 w-5 cursor-pointer hover:text-white" />
                            <Maximize2 className="h-5 w-5 cursor-pointer hover:text-white" />
                         </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                      <div className="h-full w-[15%] bg-white" />
                    </div>
                 </div>

                 {/* Subtitles Placeholder */}
                 <div className="absolute bottom-24 left-0 right-0 text-center">
                    <p className="text-2xl font-medium text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      Yeah, let's stop bombarding this
                    </p>
                 </div>
               </div>
            </div>

            {/* Navigation Arrows */}
            <button className="absolute left-10 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white">
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button className="absolute right-10 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white">
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
