import skillScript from "@/assets/skill-script.jpg";
import skillStory from "@/assets/skill-story.jpg";
import skillReenact from "@/assets/skill-reenact.jpg";
import skillMv from "@/assets/skill-mv.jpg";
import skillProduct from "@/assets/skill-product.jpg";

const SAMPLES = {
  bunny:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  elephant:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  blazes:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  escape:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  fun:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
};

export const hotSkills = [
  {
    id: "script",
    title: "剧本驱动型视频",
    desc: "上传脚本生成短剧视频。",
    image: skillScript,
    video: SAMPLES.bunny,
  },
  {
    id: "story",
    title: "故事驱动型视频",
    desc: "适用于所有故事驱动型视频。",
    image: skillStory,
    video: SAMPLES.elephant,
  },
  {
    id: "reenact",
    title: "视频拉片复刻",
    desc: "参考现有视频以生成最终视频...",
    image: skillReenact,
    video: SAMPLES.blazes,
  },
  {
    id: "mv",
    title: "音乐 MV",
    desc: "用于通过已上传的音乐生成音...",
    image: skillMv,
    video: SAMPLES.escape,
  },
  {
    id: "product",
    title: "商品宣传短片",
    desc: "基于上传的产品图片制作商业...",
    image: skillProduct,
    video: SAMPLES.fun,
  },
];

export function SkillCard({
  title,
  desc,
  image,
  onHover,
  onLeave,
}: {
  title: string;
  desc: string;
  image: string;
  onHover?: () => void;
  onLeave?: () => void;
}) {
  return (
    <button
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-border bg-card/60 p-2.5 text-left transition hover:border-border/80 hover:bg-card"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="h-14 w-20 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-foreground">
          {title}
        </div>
        <div className="truncate text-[11px] text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}
