import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Play,
  LayoutGrid,
  Clock,
  PlaySquare,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import tvSpace from "@/assets/tv-space.jpg";
import tvDrama from "@/assets/tv-drama.jpg";
import tvPalace from "@/assets/tv-palace.jpg";
import skillStory from "@/assets/skill-story.jpg";
import skillReenact from "@/assets/skill-reenact.jpg";
import skillScript from "@/assets/skill-script.jpg";
import charLisa from "@/assets/char-lisa.jpg";

interface TvDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoData?: {
    title: string;
    author: string;
    image: string;
    category?: string;
    videoUrl?: string;
  };
}

const REEL = [tvPalace, tvSpace, tvDrama, skillStory, skillReenact, skillScript, charLisa];

export function TvDetailDialog({ open, onOpenChange, videoData }: TvDetailDialogProps) {
  const navigate = useNavigate();
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (open) setActive(1);
  }, [open]);

  if (!videoData) return null;

  const tags = [videoData.title, "末日", videoData.category ?? "爱死机"];

  const goProcess = () => {
    onOpenChange(false);
    navigate({ to: "/process", search: { title: videoData.title, author: videoData.author } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen max-w-screen border-none bg-black p-0 sm:rounded-none">
        <div className="relative flex h-full w-full overflow-hidden bg-black">
          {/* 返回 */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute left-6 top-6 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
            aria-label="返回"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* 左侧播放区 */}
          <div className="relative flex flex-1 flex-col items-center justify-center px-16 py-10">
            <div className="relative w-full max-w-[1100px] overflow-hidden rounded-2xl bg-[#0a0a0a] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
              <div className="relative aspect-video w-full">
                <img
                  src={REEL[active] ?? videoData.image}
                  alt={videoData.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-4 top-3 text-[11px] tracking-widest text-white/50">
                  AIGC By {videoData.author}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                <button className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20">
                  <Play className="h-4 w-4 fill-current" />
                </button>
              </div>
            </div>

            {/* 底部胶片条 */}
            <div className="mt-10 flex w-full max-w-[1100px] items-center justify-center gap-4">
              <button
                onClick={() => setActive((i) => (i - 1 + REEL.length) % REEL.length)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                aria-label="上一个"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex flex-1 items-center justify-center gap-3 overflow-hidden">
                {REEL.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={cn(
                      "relative h-[52px] flex-shrink-0 overflow-hidden rounded-lg border transition-all duration-300",
                      i === active
                        ? "w-[112px] border-white/70 opacity-100 shadow-lg"
                        : "w-[88px] border-white/10 opacity-45 hover:opacity-80"
                    )}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setActive((i) => (i + 1) % REEL.length)}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                aria-label="下一个"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 右侧信息面板 */}
          <aside className="relative m-4 ml-0 flex w-[420px] flex-shrink-0 flex-col rounded-3xl bg-[#141414] p-7">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="关闭"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            <h2 className="pr-10 text-2xl font-semibold text-white">{videoData.title}</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="rounded-md bg-white/[0.07] px-2.5 py-1 text-[12px] text-white/70">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3 text-[13px] text-white/70">
              <img src={videoData.image} alt="" className="h-6 w-6 rounded-full object-cover" />
              <span>{videoData.author}</span>
              <span className="text-white/25">·</span>
              <span className="flex items-center gap-1.5">
                <PlaySquare className="h-3.5 w-3.5" /> 4296.3w
              </span>
            </div>

            <div className="mt-8">
              <div className="text-[15px] font-medium text-white">作品介绍</div>
              <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-white/60">
                <li className="flex gap-2">
                  <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-white/40" />
                  <span>
                    海外观众称之为「最具类型强度的 AI 电影」,几天内播放量破千万,好莱坞电影 AI 制作人表示,
                    这是自己最近几年看到的最好短片之一。
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <div className="text-[15px] font-medium text-white">创作课程</div>
              <div className="mt-3 flex cursor-pointer gap-3 rounded-xl p-2 transition hover:bg-white/[0.05]">
                <div className="relative h-[62px] w-[110px] flex-shrink-0 overflow-hidden rounded-lg">
                  <img src={tvSpace} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white">
                    <Play className="h-2.5 w-2.5 fill-current" />
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] leading-snug text-white/90">
                    国产「爱死机」的制作全流程公开
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[12px] text-white/45">
                    <Clock className="h-3 w-3" /> 42:47
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="mb-5 flex justify-center -space-x-2">
                {[charLisa, skillReenact, skillStory].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="h-11 w-11 rounded-xl border-2 border-[#141414] object-cover"
                  />
                ))}
              </div>
              <button
                onClick={goProcess}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-[14px] font-semibold text-black transition hover:bg-white/90"
              >
                <LayoutGrid className="h-4 w-4" /> 查看创作模版
              </button>
            </div>
          </aside>

          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-8 top-8 z-50 hidden h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="关闭"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
