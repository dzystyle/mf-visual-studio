import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import tvSpace from "@/assets/tv-space.jpg";
import tvDrama from "@/assets/tv-drama.jpg";
import tvPalace from "@/assets/tv-palace.jpg";
import skillMv from "@/assets/skill-mv.jpg";
import projectTeacher from "@/assets/project-teacher.jpg";

const features = [
  {
    id: "seedance",
    title: "Seedance 2.5",
    subtitle: "is now live",
    badge: "MovieFlow",
    image: tvSpace,
    accent: "#34d399",
  },
  {
    id: "kling",
    title: "Kling3.0",
    subtitle: "4K 超清画质",
    badge: "MovieFlow",
    image: projectTeacher,
    accent: "#2dd4bf",
  },
  {
    id: "animation3d",
    title: "3D Animation Channel",
    subtitle: "now live",
    badge: "MovieFlow",
    image: tvDrama,
    accent: "#34d399",
  },
  {
    id: "liveaction",
    title: 'LIVE-ACTION CHANNEL',
    subtitle: "THE ALL-NEW",
    badge: "MovieFlow",
    image: tvPalace,
    accent: "#2dd4bf",
  },
  {
    id: "mv",
    title: "MV 频道",
    subtitle: "音乐一响 成片登场",
    badge: "MovieFlow",
    image: skillMv,
    accent: "#34d399",
  },
];

const N = features.length;

function offsetOf(index: number, active: number) {
  let d = index - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

export function FeatureCarousel({ onTry }: { onTry?: (title: string) => void }) {
  const [active, setActive] = useState(0);
  const go = (dir: number) => setActive((a) => (a + dir + N) % N);

  return (
    <div className="relative mx-auto max-w-7xl select-none">
      {/* Arrows */}
      <button
        onClick={() => go(-1)}
        aria-label="上一个"
        className="absolute left-2 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-accent"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="下一个"
        className="absolute right-2 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-accent"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Stage */}
      <div
        className="relative h-[200px] sm:h-[230px]"
        style={{ perspective: "1200px" }}
      >
        {features.map((f, i) => {
          const d = offsetOf(i, active);
          const abs = Math.abs(d);
          const isActive = d === 0;
          return (
            <div
              key={f.id}
              onClick={() => !isActive && setActive((N + active + d) % N)}
              className="absolute left-1/2 top-1/2 w-[min(400px,70vw)] cursor-pointer overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/20 transition-all duration-500 ease-out"
              style={{
                transform: `translate(-50%, -50%) translateX(${d * 62}%) scale(${
                  isActive ? 1 : 0.78 - (abs - 1) * 0.08
                })`,
                zIndex: 20 - abs * 2,
                opacity: abs > 2 ? 0 : 1,
                filter: isActive ? "none" : "brightness(0.55)",
                pointerEvents: abs > 2 ? "none" : "auto",
              }}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* dark gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
                {/* badge */}
                <div className="absolute right-3 top-2.5 text-[10px] font-semibold tracking-wide text-white/70">
                  {f.badge}
                </div>
                {/* title */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                  <div
                    className="text-[clamp(18px,2.6vw,28px)] font-extrabold italic leading-tight drop-shadow-lg"
                    style={{ color: f.accent }}
                  >
                    {f.title}
                  </div>
                  <div className="mt-1 text-[clamp(13px,1.8vw,19px)] font-bold text-white drop-shadow-md">
                    {f.subtitle}
                  </div>
                </div>
                {/* try button — only on active card */}
                {isActive && onTry && (
                  <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTry(f.title);
                      }}
                      className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs text-white backdrop-blur-md transition hover:bg-white/20"
                    >
                      试试这个
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-1.5">
        {features.map((f, i) => (
          <button
            key={f.id}
            aria-label={`切换到 ${f.title}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active
                ? "w-5 bg-foreground"
                : "w-1.5 bg-foreground/25 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
