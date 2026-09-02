import skillJojo from "@/assets/skill-jojo.png.asset.json";
import skillDimension from "@/assets/skill-dimension.png.asset.json";
import skillDestiny from "@/assets/skill-destiny.png.asset.json";
import skillScript from "@/assets/skill-script.jpg";
import skillStory from "@/assets/skill-story.jpg";
import skillReenact from "@/assets/skill-reenact.jpg";
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
    id: "drama-voice",
    title: "田园",
    author: "@时见鹿小创",
    version: "V6",
    model: "MiniMax H3",
    desc: "剧情短片音色参考：自动分析参考视频音色，生成情绪一致的角色对白配音。",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.bunny,
    tags: ["剧情短片", "新手必用"],
    hot: true,
    default: false
  },
  {
    id: "destiny",
    title: "克系微恐",
    author: "@时见鹿小创",
    version: "V6",
    model: "MiniMax H3",
    desc: "主角高燃登场视频生成：用户上传主角人物图和结算画面图，基于案例提示词模板替换画风，保留极限镜头语言，并...",
    image: skillDestiny.url,
    video: SAMPLES.elephant,
    tags: ["动漫游戏", "新手必用"],
    hot: true,
    default: false
  },
  {
    id: "wes-anderson",
    title: "现代刑侦",
    author: "@WesFan",
    version: "V3",
    model: "Seedance 2.5",
    desc: "对称构图、复古配色、定格感运镜，一键生成韦斯·安德森式电影短片。",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.fun,
    tags: ["大师美学", "剧情短片"],
    hot: true,
    default: false
  },
  {
    id: "script-to-video",
    title: "现代小镇",
    author: "@剧创社",
    version: "V4",
    model: "Seedance 2.5",
    desc: "上传剧本自动生成完整视频：自动拆分分镜、生成画面、配音配乐一站式完成。",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.escape,
    tags: ["剧情短片", "效率工具"],
    hot: false,
    default: false
  },
  {
    id: "video-replica",
    title: "美女",
    author: "@拉片君",
    version: "V2",
    model: "Seedance 2.5",
    desc: "上传参考视频，逐镜头拆解并复刻镜头语言、节奏与转场，生成同款风格成片。",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.blazes,
    tags: ["大师美学", "效率工具"],
    hot: false,
    default: false
  },
  {
    id: "planet-play",
    title: "奇幻",
    author: "@星球迷航",
    version: "V5",
    model: "Seedance 2.5",
    desc: "把你的照片变成漫游星球的科幻短片：穿越星云、登陆异星、俯瞰地球。",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.escape,
    tags: ["科幻特效", "新手必用"],
    hot: false,
    default: false
  },
  {
    id: "memphis-science",
    title: "英式复古",
    author: "@科普小站",
    version: "V3",
    model: "GPT Image 2",
    desc: "孟菲斯设计风格的科普动画：几何色块、活泼图形，让知识讲解更吸睛。",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.fun,
    tags: ["科普教育", "新手必用"],
    hot: false,
    default: false
  },
  {
    id: "3d-guoman",
    title: "美式复古",
    author: "@国漫工坊",
    version: "V7",
    model: "Seedance 2.5",
    desc: "3D 国漫古装短剧生成：唯美古风场景、精致角色建模，一键产出精品剧集。",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.bunny,
    tags: ["动漫游戏", "大师美学"],
    hot: false,
    default: false
  },
  {
    id: "ai-drama-onestop",
    title: "末日",
    author: "@短剧工厂",
    version: "V8",
    model: "Seedance 2.5",
    desc: "从创意到成片：剧本、分镜、画面、配音、字幕全流程 AI 短剧生成。",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.elephant,
    tags: ["剧情短片", "效率工具"],
    hot: false,
    default: true
  },
  {
    id: "jojo",
    title: "现代都市",
    author: "@Seast Zhu",
    version: "V2",
    model: "Seedance 2.5",
    desc: "把任何一张图片（人物、场景、物件都行）变成一段 30 秒的 JOJO 动画风格短片：厚描边、硬阴影、高饱和和平涂、满屏...",
    image: skillJojo.url,
    video: SAMPLES.bunny,
    tags: ["动漫游戏", "新手必用"],
    hot: false,
    default: false
  },
  {
    id: "gta6",
    title: "糖果",
    author: "@やはたう米り",
    version: "V10",
    model: "Seedance 2.5",
    desc: "受 GTA6 官方公开素材启发的主题视频、分镜、提示词和视觉审查。只借鉴公开素材里的视觉语法、城市气质、镜头组...",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    video: SAMPLES.elephant,
    tags: ["新手必用", "动漫游戏"],
    hot: false,
    default: true
  },
  {
    id: "dimension",
    title: "烹饪",
    author: "@みお",
    version: "V8",
    model: "Seedance 2.5",
    subModel: "GPT Image 2",
    desc: "打破屏幕让自己喜欢的角色来到现实世界或者去到他们的世界。",
    image: skillDimension.url,
    video: SAMPLES.escape,
    tags: ["新手必用", "动漫游戏"],
    hot: false,
    default: true
  },
  {
    id: "ai-anchor",
    title: "宝石",
    author: "@智能主播台",
    version: "V3",
    model: "Kling 3.0 Omni",
    desc: "输入口播文案，自动生成数字人主播视频，支持多语种、多音色与肢体动作。",
    image: "https://images.unsplash.com/photo-1593508512255-9e638c3e7394?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.bunny,
    tags: ["口播", "效率工具"],
    hot: false,
    default: false
  },
  {
    id: "cyber-city",
    title: "现代小镇",
    author: "@未来视觉",
    version: "V5",
    model: "Seedance 2.5",
    desc: "霓虹雨夜、全息广告、飞行载具，一键生成赛博朋克风格的未来城市短片。",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.elephant,
    tags: ["科幻特效", "大师美学"],
    hot: false,
    default: false
  },
  {
    id: "cat-daily",
    title: "末日",
    author: "@猫掌柜",
    version: "V4",
    model: "MiniMax H3",
    desc: "慵懒午后、阳光窗台、软萌互动，生成温暖治愈的猫咪生活短视频。",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.fun,
    tags: ["萌宠", "新手必用"],
    hot: false,
    default: false
  },
  {
    id: "guochao-makeup",
    title: "旅行",
    author: "@美妆实验室",
    version: "V6",
    model: "GPT Image 2",
    desc: "国潮元素与美妆产品结合，生成具有东方美学的高级感广告短片。",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.blazes,
    tags: ["广告营销", "国潮"],
    hot: false,
    default: false
  },
  {
    id: "cosmos-meditation",
    title: "海盗",
    author: "@冥想空间",
    version: "V2",
    model: "Seedance 2.5",
    desc: "浩瀚星云、舒缓光流、白噪音视觉化，打造沉浸式冥想背景视频。",
    image: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.escape,
    tags: ["治愈", "氛围"],
    hot: false,
    default: false
  },
  {
    id: "kids-story",
    title: "中世纪",
    author: "@童话镇",
    version: "V4",
    model: "MiniMax H3",
    desc: "把绘本故事变成动画短片：可爱角色、柔和配音、自动分页呈现。",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.bunny,
    tags: ["教育", "亲子"],
    hot: false,
    default: false
  },
  {
    id: "food-vlog",
    title: "美食探店短片",
    author: "@味觉旅行",
    version: "V5",
    model: "Seedance 2.5",
    desc: "烟火气十足的美食探店视频：特写食材、烹饪过程、诱人色泽。",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.fun,
    tags: ["美食", "生活"],
    hot: false,
    default: false
  },
  {
    id: "fitness-motivation",
    title: "运动健身激励",
    author: "@燃动时刻",
    version: "V3",
    model: "Kling 3.0 Omni",
    desc: "高强度训练剪影、汗水慢动作、节奏鼓点，生成充满力量的健身短片。",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.elephant,
    tags: ["运动", "励志"],
    hot: false,
    default: false
  },
  {
    id: "travel-opener",
    title: "旅行 Vlog 开场",
    author: "@环球旅拍",
    version: "V6",
    model: "Seedance 2.5",
    desc: "地图轨迹、地标蒙太奇、胶片滤镜，打造电影感旅行视频开场。",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.escape,
    tags: ["旅行", "Vlog"],
    hot: false,
    default: false
  },
  {
    id: "product-showcase",
    title: "电商产品展示",
    author: "@爆款制造机",
    version: "V4",
    model: "GPT Image 2",
    desc: "360° 旋转展示、质感光影、卖点字幕，一键生成电商产品种草视频。",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.blazes,
    tags: ["电商", "广告营销"],
    hot: false,
    default: false
  },
  {
    id: "wedding-album",
    title: "婚礼回忆相册",
    author: "@婚礼记忆",
    version: "V5",
    model: "Seedance 2.5",
    desc: "浪漫转场、誓词字幕、氛围配乐，将照片串成温馨婚礼回忆影片。",
    image: "https://images.unsplash.com/photo-1519741497673-6113e69b04ff?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.fun,
    tags: ["婚礼", "纪念"],
    hot: false,
    default: false
  },
  {
    id: "festival-greeting",
    title: "节日祝福动画",
    author: "@祝福工坊",
    version: "V3",
    model: "MiniMax H3",
    desc: "春节、圣诞、生日等节日主题动画，自动生成祝福文案与喜庆画面。",
    image: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.bunny,
    tags: ["节日", "祝福"],
    hot: false,
    default: false
  },
  {
    id: "corporate-promo",
    title: "企业宣传短片",
    author: "@品牌官",
    version: "V6",
    model: "Kling 3.0 Omni",
    desc: "高端商务视觉、数据图表、企业口号，快速生成专业企业宣传片。",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.elephant,
    tags: ["企业", "宣传"],
    hot: false,
    default: false
  },
  {
    id: "suspense-drama",
    title: "悬疑微短剧",
    author: "@迷雾剧场",
    version: "V4",
    model: "Seedance 2.5",
    desc: "雨夜追凶、反转对白、紧张配乐，生成扣人心弦的悬疑短剧片段。",
    image: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.escape,
    tags: ["剧情短片", "悬疑"],
    hot: false,
    default: false
  },
  {
    id: "mmd-dance",
    title: "二次元 MMD 舞蹈",
    author: "@次元舞台",
    version: "V7",
    model: "MiniMax H3",
    desc: "为虚拟角色绑定舞蹈动作，生成二次元风格的 MMD 舞蹈视频。",
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.blazes,
    tags: ["动漫游戏", "舞蹈"],
    hot: false,
    default: false
  },
  {
    id: "pet-dressup",
    title: "宠物换装变装",
    author: "@萌宠衣橱",
    version: "V2",
    model: "GPT Image 2",
    desc: "给宠物换上各种可爱装扮，生成趣味变装短视频。",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.fun,
    tags: ["萌宠", "变装"],
    hot: false,
    default: false
  },
  {
    id: "doodle-animation",
    title: "手绘涂鸦动画",
    author: "@涂鸦星球",
    version: "V3",
    model: "Seedance 2.5",
    desc: "把手绘草图变成会动的涂鸦动画，适合知识科普与趣味表达。",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.bunny,
    tags: ["手绘", "科普"],
    hot: false,
    default: false
  },
  {
    id: "data-viz",
    title: "智能数据可视化",
    author: "@数据可视",
    version: "V5",
    model: "Kling 3.0 Omni",
    desc: "把枯燥数据变成动态图表、增长动画与信息图视频。",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop",
    video: SAMPLES.elephant,
    tags: ["数据", "商业"],
    hot: false,
    default: false
  }
];

export function SkillCard({
  title,
  desc,
  image,
  hot,
  onHover,
  onLeave,
  onTry,
}: {
  title: string;
  desc: string;
  image: string;
  hot?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  onTry?: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative flex w-full items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/60 px-3 py-3 text-left shadow-sm transition hover:border-black/[0.12] hover:bg-white/80 dark:border-white/[0.08] dark:bg-[#1a1a1d] dark:hover:border-white/[0.16] dark:hover:bg-[#202024]"
    >
      {hot && (
        <div className="absolute -top-2 right-3 z-10 rounded-full bg-gradient-to-r from-emerald-500/90 to-teal-500/90 px-2 py-px text-[9px] font-medium text-white shadow-md dark:from-emerald-400/20 dark:to-teal-400/20 dark:text-emerald-300 dark:border dark:border-emerald-400/30">
          热门
        </div>
      )}
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="h-14 w-[72px] shrink-0 rounded-xl object-cover ring-1 ring-black/10 dark:ring-white/10"
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-foreground">
          {title}
        </div>
        <div className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
          {desc}
        </div>
      </div>

      {/* "Try it" button overlay on hover */}
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTry?.();
          }}
          className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/20 transition hover:bg-white/40"
        >
          试一试
        </button>
      </div>
    </div>
  );
}
