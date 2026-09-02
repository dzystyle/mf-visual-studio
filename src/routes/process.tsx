import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  X,
  Users,
  FolderOpen,
  HelpCircle,
  RotateCcw,
  CornerUpLeft,
  GitBranch,
  Focus,
  Hand,
  Minus,
  Plus,
  Sparkles,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import tvSpace from "@/assets/tv-space.jpg";
import tvDrama from "@/assets/tv-drama.jpg";
import tvPalace from "@/assets/tv-palace.jpg";
import skillStory from "@/assets/skill-story.jpg";
import skillReenact from "@/assets/skill-reenact.jpg";
import skillScript from "@/assets/skill-script.jpg";
import skillProduct from "@/assets/skill-product.jpg";
import skillTravel from "@/assets/skill-travel.jpg";
import threeView from "@/assets/three-view-result.jpg";
import charLisa from "@/assets/char-lisa.jpg";
import charSam from "@/assets/char-sam.jpg";
import charBoss from "@/assets/char-boss.jpg";

type ProcessSearch = { title?: string; author?: string };

export const Route = createFileRoute("/process")({
  validateSearch: (search: Record<string, unknown>): ProcessSearch => ({
    title: typeof search.title === "string" ? search.title : undefined,
    author: typeof search.author === "string" ? search.author : undefined,
  }),
  head: () => ({
    meta: [
      { title: "创作过程 — Artrail" },
      { name: "description", content: "以只读画布的形式回看作品的角色资产、表情组、场景与分镜生成过程。" },
      { property: "og:title", content: "创作过程 — Artrail" },
      { property: "og:description", content: "以只读画布的形式回看作品的角色资产、表情组、场景与分镜生成过程。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProcessPage,
});

const ASSETS = [
  { label: "机器人清道夫", image: threeView, meta: "机器人|机甲·金属质感·破损涂装", sub: "20260828 · 单人" },
  { label: "非洲鸵鸟", image: charSam, meta: "全身特写·荒漠背景·长焦压缩", sub: "20260828 · 单人" },
  { label: "高爆手雷", image: skillProduct, meta: "产品静物·顶光·工业质感", sub: "20260828 · 道具" },
  { label: "路人模特", image: charLisa, meta: "红裙·全身站姿·棚拍白底", sub: "20260828 · 单人" },
];

const GROUPS = [
  {
    name: "分组 · 女性丧尸",
    items: [
      { label: "女性丧尸 A", image: skillReenact, meta: "近景·火光逆光·灰败肤质" },
      { label: "女性丧尸 B", image: skillStory, meta: "中景·断墙前景·手持镜头" },
    ],
  },
  {
    name: "分组 · 废弃都市中心大街",
    items: [
      { label: "中心大街 白天", image: tvSpace, meta: "俯拍大全景·废弃车流" },
      { label: "中心大街 黄昏", image: tvDrama, meta: "低机位·长焦·尘雾" },
    ],
  },
];

const EMOTIONS = [
  { label: "冷酷", color: "bg-sky-500", image: threeView },
  { label: "愤怒", color: "bg-red-500", image: charBoss },
  { label: "花痴", color: "bg-pink-500", image: charLisa },
  { label: "思考", color: "bg-slate-300", image: charSam },
  { label: "微笑", color: "bg-emerald-500", image: skillTravel },
  { label: "害怕", color: "bg-amber-400", image: skillStory },
  { label: "装酷", color: "bg-fuchsia-500", image: skillScript },
];

const SHOTS = [tvPalace, tvSpace, tvDrama, skillReenact, skillProduct, tvSpace, skillScript, tvDrama];

function ProcessPage() {
  const navigate = useNavigate();
  const { title, author } = Route.useSearch();
  const [zoom, setZoom] = React.useState(72);

  const scale = zoom / 100;

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0a0b] text-white">
      {/* 点状网格 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* 顶部栏 */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-7 py-5">
        <div className="flex items-center gap-3">
          <h1 className="text-[17px] font-semibold tracking-tight">
            {title ?? "作品"}–剧本
          </h1>
          <span className="flex items-center gap-1.5 text-[13px] text-white/55">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> 只读模式
          </span>
          {author && <span className="text-[13px] text-white/35">@{author}</span>}
        </div>
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
          aria-label="关闭"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* 左侧浮动工具栏 */}
      <div className="absolute left-6 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-1 rounded-2xl bg-white/[0.06] p-2 backdrop-blur">
        {[Users, FolderOpen, HelpCircle].map((Icon, i) => (
          <button
            key={i}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
        ))}
      </div>

      {/* 画布内容 */}
      <div className="absolute inset-0 overflow-auto pb-28 pt-24">
        <div
          className="mx-auto w-max origin-top px-24"
          style={{ transform: `scale(${scale})` }}
        >
          <div className="flex items-start gap-24">
            {/* 列 1：资产与分组 */}
            <div className="flex w-[420px] flex-col gap-10">
              {ASSETS.slice(0, 2).map((a) => (
                <AssetCard key={a.label} {...a} />
              ))}
              <GroupCard group={GROUPS[0]} />
              <AssetCard {...ASSETS[2]} />
              <GroupCard group={GROUPS[1]} />
              <AssetCard {...ASSETS[3]} />
            </div>

            {/* 列 2：表情组 */}
            <div className="flex w-[220px] flex-col gap-6">
              {EMOTIONS.map((e) => (
                <div key={e.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/45">
                    <ImageIcon className="h-3 w-3" /> {e.label}
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111113]">
                    <img src={e.image} alt={e.label} className="h-[190px] w-full object-cover opacity-90" />
                    <span className={cn("absolute left-3 top-3 h-2 w-2 rounded-full", e.color)} />
                    <span className="absolute bottom-2.5 right-3 text-[12px] font-medium text-white/90">
                      {e.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 列 3：分镜 */}
            <div className="flex w-[300px] flex-col gap-5">
              {SHOTS.map((s, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-white/45">
                    <VideoIcon className="h-3 w-3" /> 镜头 {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <img src={s} alt="" className="h-[150px] w-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部工具条 */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-2xl bg-white/[0.06] p-1.5 backdrop-blur">
          {[RotateCcw, CornerUpLeft, GitBranch, Focus, Hand].map((Icon, i) => (
            <button
              key={i}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white/[0.06] px-2 py-1.5 backdrop-blur">
          <button
            onClick={() => setZoom((z) => Math.max(20, z - 6))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="缩小"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-[13px] tabular-nums text-white/80">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(160, z + 6))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="放大"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AssetCard({
  label,
  image,
  meta,
  sub,
}: {
  label: string;
  image: string;
  meta: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="self-start text-[11px] text-white/45">{label}</div>
      <div className="w-[210px] overflow-hidden rounded-2xl border border-white/10 bg-[#111113]">
        <img src={image} alt={label} className="h-[130px] w-full object-cover" />
        <div className="border-t border-white/10 p-2.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-white/10">
              <Sparkles className="h-2.5 w-2.5 text-white/70" />
            </span>
            <span className="h-1 w-8 rounded bg-white/10" />
          </div>
          <div className="line-clamp-1 text-[10px] text-white/55">{meta}</div>
          <div className="mt-1 text-[9px] text-white/30">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function GroupCard({ group }: { group: (typeof GROUPS)[number] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="self-center text-[11px] text-white/45">{group.name}</div>
      <div className="flex gap-3 rounded-2xl bg-white/[0.04] p-3">
        {group.items.map((it) => (
          <div key={it.label} className="w-[150px] overflow-hidden rounded-xl border border-white/10 bg-[#111113]">
            <img src={it.image} alt={it.label} className="h-[92px] w-full object-cover" />
            <div className="p-2">
              <div className="line-clamp-1 text-[10px] text-white/55">{it.meta}</div>
              <div className="mt-1 text-[9px] text-white/30">20260828 · 场景</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
