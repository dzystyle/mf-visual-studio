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
    id: "jojo",
    title: "JOJO 风格变身玩法",
    author: "@Seast Zhu",
    version: "V2",
    model: "Seedance 2.5",
    desc: "把任何一张图片（人物、场景、物件都行）变成一段 30 秒的 JOJO 动画风格短片：厚描边、硬阴影、高饱和和平涂、满屏...",
    image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=800&auto=format&fit=crop",
    video: SAMPLES.bunny,
    tags: ["动漫游戏", "新手必用"],
    default: false
  },
  {
    id: "gta6",
    title: "GTA 6 风格演示 (玩转我的人生)",
    author: "@やはたうみり",
    version: "V10",
    model: "Seedance 2.5",
    desc: "受 GTA6 官方公开素材启发的主题视频、分镜、提示词和视觉审查。只借鉴公开素材里的视觉语法、城市气质、镜头组...",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    video: SAMPLES.elephant,
    tags: ["新手必用", "动漫游戏"],
    default: true
  },
  {
    id: "3d-horror",
    title: "经典 3D 日式怪谈风",
    author: "@みお",
    version: "V9",
    model: "Seedance 2.5",
    subModel: "GPT Image 2",
    desc: "专用于生成具有日式恐怖（如《死魂曲》《零》）风格的写实 3D 游戏恐怖视频。聚焦于阴雨浓雾下的旧校舍、民居、生...",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=800&auto=format&fit=crop",
    video: SAMPLES.blazes,
    tags: ["大师美学", "动漫游戏"],
    default: false
  },
  {
    id: "dimension",
    title: "次元破壁互动玩法",
    author: "@みお",
    version: "V8",
    model: "Seedance 2.5",
    subModel: "GPT Image 2",
    desc: "打破屏幕让自己喜欢的角色来到现实世界或者去到他们的世界。",
    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop",
    video: SAMPLES.escape,
    tags: ["新手必用", "动漫游戏"],
    default: true
  }
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
