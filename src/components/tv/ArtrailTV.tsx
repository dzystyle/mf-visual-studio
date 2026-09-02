import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { Play, ArrowRight, Flame, Sparkles, ListVideo } from "lucide-react";
import { cn } from "@/lib/utils";
import { TvDetailDialog } from "./TvDetailDialog";
import { CoursePlayerDialog } from "./CoursePlayerDialog";
import { COURSES, type Course } from "./courses-data";
import tvSpace from "@/assets/tv-space.jpg";
import tvDrama from "@/assets/tv-drama.jpg";
import tvPalace from "@/assets/tv-palace.jpg";
import skillMv from "@/assets/skill-mv.jpg";
import skillStory from "@/assets/skill-story.jpg";
import skillTravel from "@/assets/skill-travel.jpg";
import skillProduct from "@/assets/skill-product.jpg";
import skillScript from "@/assets/skill-script.jpg";
import skillReenact from "@/assets/skill-reenact.jpg";
import projectTeacher from "@/assets/project-teacher.jpg";
import threeView from "@/assets/three-view-result.jpg";
import charLisa from "@/assets/char-lisa.jpg";

type Work = { id: number; title: string; author: string; image: string; category: string };

const WORKS: Work[] = [
  { id: 1, title: "百匠:纸契灵", author: "阿生的ai", image: tvPalace, category: "漫剧" },
  { id: 2, title: "丧尸清道夫", author: "Mx-Shell", image: tvSpace, category: "科幻短片" },
  { id: 3, title: "归墟08", author: "泫九", image: tvDrama, category: "概念片" },
  { id: 4, title: "她骗了我两次", author: "Kim根鸠", image: skillStory, category: "剧情短片" },
  { id: 5, title: "拓妖录", author: "傩时NUOVRA", image: skillReenact, category: "漫剧" },
  { id: 6, title: "相骨预告片", author: "提示炼金师", image: threeView, category: "预告片" },
  { id: 7, title: "胜利协议", author: "何止维", image: skillScript, category: "科幻短片" },
  { id: 8, title: "美人心计之西施", author: "欢娱影视x小笼包", image: charLisa, category: "古装剧" },
  { id: 9, title: "超级英雄是社畜", author: "许立展", image: skillMv, category: "搞笑短剧" },
  { id: 10, title: "端午思念", author: "Holly", image: skillTravel, category: "漫剧" },
  { id: 11, title: "异常收容局 第四集", author: "Artrail", image: skillProduct, category: "连续剧" },
  { id: 12, title: "史前一万年", author: "小蓝蓝的天", image: projectTeacher, category: "纪录片" },
];

const GUESS_SLIDES = [
  { image: skillStory, title: "职场反串,拍个搞笑短剧~", author: "今日爆款" },
  { image: skillMv, title: "MV 频道:音乐一响,成片登场", author: "编辑精选" },
  { image: tvDrama, title: "一秒入戏,剧本直出成片", author: "热门趋势" },
];

const TABS = ["精选作品", "创作课程"];

export function ArtrailTV() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(TABS[0]);
  const [selectedVideo, setSelectedVideo] = React.useState<Work | null>(null);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

  return (
    <section className="px-6 pb-24 pt-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Tabs */}
        <div className="mb-6 flex items-center gap-8 border-b border-border/60">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative pb-3 text-[15px] transition-colors",
                activeTab === tab
                  ? "font-semibold text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === TABS[0] ? (
          <div key="works" className="animate-fade-in">
            {/* Row 1: Hero activity + Guess-you-like + Featured */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              <ActivityHero />
              <GuessYouLike onPick={(w) => setSelectedVideo(w)} />
              <WorkCard work={WORKS[0]} onClick={() => setSelectedVideo(WORKS[0])} navigate={navigate} />
            </div>

            {/* Remaining works grid */}
            <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
              {WORKS.slice(1).map((w) => (
                <WorkCard key={w.id} work={w} onClick={() => setSelectedVideo(w)} navigate={navigate} />
              ))}
            </div>
          </div>
        ) : (
          <div key="courses" className="animate-fade-in grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {COURSES.map((c) => (
              <CourseCard key={c.id} course={c} onClick={() => setSelectedCourse(c)} />
            ))}
          </div>
        )}
      </div>

      <TvDetailDialog
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
        videoData={selectedVideo ?? undefined}
      />
      <CoursePlayerDialog
        open={!!selectedCourse}
        onOpenChange={(open) => !open && setSelectedCourse(null)}
        course={selectedCourse ?? undefined}
        onSwitchCourse={(c) => setSelectedCourse(c)}
      />
    </section>
  );
}

/* ================= 课程卡 ================= */
function CourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
  return (
    <div className="group flex cursor-pointer flex-col" onClick={onClick}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 bg-muted transition-all duration-300 group-hover:scale-[1.015] group-hover:shadow-xl group-hover:shadow-black/10 dark:group-hover:shadow-black/40">
        <img
          src={course.cover}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* author */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
          <span className="text-[11px] text-white/85">@ {course.author}</span>
          <span className="flex items-center gap-1 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] text-white/90 backdrop-blur">
            <ListVideo className="h-3 w-3" /> {course.episodes} 集
          </span>
        </div>
        {/* hover play */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white px-5 py-1.5 text-xs font-semibold text-black">
            <Play className="h-3 w-3 fill-current" /> 进入课程
          </span>
        </div>
      </div>
      <div className="mt-2.5 truncate px-0.5 text-[13px] font-medium text-foreground/90 transition-colors group-hover:text-foreground">
        {course.title}
      </div>
    </div>
  );
}

/* ================= 热门活动大卡 ================= */
function ActivityHero() {
  return (
    <div className="group relative col-span-1 overflow-hidden rounded-2xl border border-border/60 bg-[#0b0b0d] cursor-pointer md:col-span-2 aspect-[16/8] lg:aspect-auto lg:h-full">
      <img
        src={tvSpace}
        alt="万物皆可X来 活动"
        className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
      {/* badge */}
      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
        <Flame className="h-3 w-3 text-orange-400" /> 热门活动
      </div>
      <div className="absolute inset-0 flex flex-col justify-center p-8">
        <div className="text-xs font-medium tracking-widest text-white/50">artrail.ai</div>
        <h3 className="mt-2 text-3xl font-bold leading-tight text-white lg:text-4xl">
          万物皆可 X 来
        </h3>
        <p className="mt-3 text-xs tracking-wide text-white/50">参赛时间: 8月20日 至 8月30日</p>
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={cn("h-1 rounded-full", i === 0 ? "w-4 bg-white" : "w-1 bg-white/30")} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= 猜你喜欢 自动轮播卡 ================= */
function GuessYouLike({ onPick }: { onPick: (w: Work) => void }) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % GUESS_SLIDES.length), 3500);
    return () => clearInterval(t);
  }, [paused]);

  const slide = GUESS_SLIDES[index];

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-border/60 bg-muted cursor-pointer">
        {GUESS_SLIDES.map((s, i) => (
          <img
            key={s.title}
            src={s.image}
            alt={s.title}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-all duration-700",
              i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        {/* badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-violet-500/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg">
          <Sparkles className="h-3 w-3" /> 猜你喜欢
        </div>
        {/* arrow */}
        <button
          onClick={() =>
            onPick({ id: 100 + index, title: slide.title, author: slide.author, image: slide.image, category: "推荐" })
          }
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-110"
          aria-label="查看推荐"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        {/* dots */}
        <div className="absolute bottom-3.5 left-3 flex gap-1">
          {GUESS_SLIDES.map((_, i) => (
            <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i === index ? "w-3.5 bg-white" : "w-1 bg-white/40")} />
          ))}
        </div>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 px-0.5 text-[13px] text-foreground/90">
        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
        <span className="truncate">{slide.title}</span>
      </div>
    </div>
  );
}

/* ================= 作品卡 ================= */
function WorkCard({ work, onClick, navigate }: { work: Work; onClick: () => void; navigate: ReturnType<typeof useNavigate> }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div
        className={cn(
          "relative aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-muted transition-all duration-300",
          hovered && "shadow-xl shadow-black/10 dark:shadow-black/40 scale-[1.015]"
        )}
      >
        <img
          src={work.image}
          alt={work.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* author overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
          <div className="text-[11px] text-white/80">@ {work.author}</div>
        </div>
        {/* hover play */}
        <div
          className={cn(
            "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-opacity",
            hovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Play className="h-3 w-3 fill-current" />
        </div>
        {/* hover actions */}
        {hovered && (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/50 backdrop-blur-[2px] animate-fade-in">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="rounded-full bg-white px-5 py-1.5 text-xs font-semibold text-black transition hover:bg-white/90"
            >
              查看
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: "/process", search: { title: work.title, author: work.author } });
              }}
              className="rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25"
            >
              查看创作过程
            </button>
          </div>
        )}
      </div>
      <div className="mt-2.5 px-0.5 text-[13px] font-medium text-foreground/90 transition-colors group-hover:text-foreground">
        {work.title}
      </div>
    </div>
  );
}
