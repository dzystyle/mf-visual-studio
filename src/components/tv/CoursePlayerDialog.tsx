import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Clock3,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { COURSES, type Course } from "./courses-data";

function parseDuration(d: string) {
  const [m, s] = d.split(":").map(Number);
  return m * 60 + s;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface CoursePlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course;
  onSwitchCourse?: (course: Course) => void;
}

export function CoursePlayerDialog({
  open,
  onOpenChange,
  course,
  onSwitchCourse,
}: CoursePlayerDialogProps) {
  const [chapterId, setChapterId] = React.useState<number | null>(null);
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  const chapter =
    course?.chapters.find((c) => c.id === chapterId) ?? course?.chapters[0];
  const total = chapter ? parseDuration(chapter.duration) : 1;

  // 切换课程/章节时重置
  React.useEffect(() => {
    setChapterId(null);
    setProgress(0);
    setPlaying(true);
  }, [course?.id, open]);

  React.useEffect(() => {
    setProgress(0);
    setPlaying(true);
  }, [chapterId]);

  // 模拟播放进度
  React.useEffect(() => {
    if (!playing || !open) return;
    const t = setInterval(
      () => setProgress((p) => Math.min(p + 1, total)),
      1000
    );
    return () => clearInterval(t);
  }, [playing, open, total]);

  // 相关课程缩略图(排除当前)
  const related = React.useMemo(
    () => COURSES.filter((c) => c.id !== course?.id).slice(0, 8),
    [course?.id]
  );
  const stripRef = React.useRef<HTMLDivElement>(null);
  const scrollStrip = (dir: number) =>
    stripRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  if (!course || !chapter) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-screen max-w-screen flex-col border-none bg-black p-0 sm:rounded-none lg:flex-row [&>button]:hidden">
        {/* ============ 左侧播放区 ============ */}
        <div className="relative flex min-h-0 flex-1 flex-col">
          {/* 返回 */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute left-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="返回"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* 播放器 */}
          <div className="flex min-h-0 flex-1 items-center justify-center px-6 pt-6 lg:px-12">
            <div
              key={chapter.id}
              className="relative aspect-video w-full max-w-4xl animate-fade-in overflow-hidden rounded-2xl shadow-2xl shadow-black"
            >
              <img
                src={chapter.cover}
                alt={chapter.title}
                className="h-full w-full object-cover"
              />
              {/* 字幕占位 */}
              <div className="absolute bottom-16 left-0 right-0 text-center">
                <span className="rounded bg-black/60 px-3 py-1 text-sm font-medium text-white/95">
                  这绝对是B站最用心的
                </span>
              </div>
              {/* 控制条 */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-3 pt-10">
                <div className="flex items-center gap-3 text-white">
                  <button
                    onClick={() => setPlaying((p) => !p)}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/15"
                    aria-label={playing ? "暂停" : "播放"}
                  >
                    {playing ? (
                      <Pause className="h-4 w-4 fill-current" />
                    ) : (
                      <Play className="h-4 w-4 fill-current" />
                    )}
                  </button>
                  <span className="font-mono text-xs text-white/80">
                    {formatTime(progress)}
                    <span className="mx-1.5 text-white/40">|</span>
                    {chapter.duration}
                  </span>
                  {/* 进度条 */}
                  <div
                    className="group relative h-4 flex-1 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setProgress(
                        Math.round(
                          ((e.clientX - rect.left) / rect.width) * total
                        )
                      );
                    }}
                  >
                    <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25">
                      <div
                        className="h-full rounded-full bg-white transition-[width] duration-300"
                        style={{ width: `${(progress / total) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Volume2 className="h-4 w-4 cursor-pointer text-white/80 hover:text-white" />
                  <Maximize2 className="h-4 w-4 cursor-pointer text-white/80 hover:text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* 底部相关视频缩略图横条 */}
          <div className="relative flex items-center gap-3 px-6 pb-6 pt-4 lg:px-12">
            <button
              onClick={() => scrollStrip(-1)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="向左"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div
              ref={stripRef}
              className="scrollbar-hide flex flex-1 items-center gap-3 overflow-x-auto"
            >
              {related.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSwitchCourse?.(c)}
                  className="group relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border-2 border-transparent opacity-70 transition hover:opacity-100"
                  title={c.title}
                >
                  <img
                    src={c.cover}
                    alt={c.title}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollStrip(1)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              aria-label="向右"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ============ 右侧课程目录 ============ */}
        <aside className="flex w-full shrink-0 flex-col border-t border-white/10 bg-[#121214] lg:h-full lg:w-[360px] lg:border-l lg:border-t-0">
          {/* 标题 */}
          <div className="flex items-start justify-between gap-3 px-5 pt-5">
            <h2 className="text-[16px] font-semibold leading-snug text-white">
              {course.title}
            </h2>
            <button
              className="mt-0.5 shrink-0 text-white/50 transition hover:text-white"
              title="在新窗口打开"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>

          {/* 作者 */}
          <div className="mt-3 flex items-center gap-2 px-5 text-[12px] text-white/60">
            <img
              src={course.cover}
              alt={course.author}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-white/80">{course.author}</span>
            <span className="text-white/25">·</span>
            <span className="flex items-center gap-1">
              <Play className="h-3 w-3" /> {course.views}
            </span>
          </div>

          <p className="mt-3 truncate px-5 text-[12px] text-white/40">
            {course.desc}
          </p>

          <div className="mx-5 my-4 h-px bg-white/10" />

          {/* 章节列表 */}
          <div className="px-5 pb-2 text-[13px] font-medium text-white/80">
            创作课程
          </div>
          <div className="scrollbar-hide min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-5">
            {course.chapters.map((c) => {
              const active = c.id === chapter.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setChapterId(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-2 text-left transition",
                    active ? "bg-white/10" : "hover:bg-white/5"
                  )}
                >
                  <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={c.cover}
                      alt={c.title}
                      className="h-full w-full object-cover"
                    />
                    <Play className="absolute bottom-1 right-1 h-3 w-3 fill-white text-white drop-shadow" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "truncate text-[13px]",
                        active
                          ? "font-semibold text-violet-400"
                          : "text-white/85"
                      )}
                    >
                      {c.title}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px] text-white/40">
                      <Clock3 className="h-3 w-3" /> {c.duration}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </DialogContent>
    </Dialog>
  );
}
