import { createFileRoute } from "@tanstack/react-router";
import { Plus, Package } from "lucide-react";
import { BrandMark, TopBar } from "@/components/TopBar";
import skillScript from "@/assets/skill-script.jpg";
import skillStory from "@/assets/skill-story.jpg";
import skillReenact from "@/assets/skill-reenact.jpg";
import skillMv from "@/assets/skill-mv.jpg";
import skillProduct from "@/assets/skill-product.jpg";
import skillTravel from "@/assets/skill-travel.jpg";

export const Route = createFileRoute("/skill")({
  head: () => ({
    meta: [
      { title: "Skill 库 — artrail.ai" },
      { name: "description", content: "我的 Skill 与精选 Skill 工作流。" },
    ],
  }),
  component: SkillPage,
});

const mine = [
  { title: "旅拍大师 V2.0 | 唯美旅拍视频生成 Skill", img: skillTravel, on: true,
    desc: "将用户任意模糊的旅拍主题、文案、散文、脚本或短视频创意,转译为  Artrail 可执行的电影级唯美旅拍工作流。作者..." },
  { title: "剧本驱动型视频(需上传剧本)", img: skillScript, on: true,
    desc: "分析上传的剧本(图片/PDF/文本),通过学习其电影语法——提取脚本、镜头结构、视觉语言和节奏——围绕您的..." },
  { title: "商品宣传短片", img: skillProduct, on: true,
    desc: "快速创建 AI 商业广告短片,为您的产品呈现专业级的视觉效果和创意故事。使用模型 Nano Banana + Seedance ..." },
  { title: "音乐 MV(需上传音乐)", img: skillMv, on: true,
    desc: "专为音乐 MV 制作设计的工作流,根据上传的音乐驱动主角演唱表演。依托 Omnihuman 数字人对口型模型,实现高..." },
  { title: "视频拉片复刻", img: skillReenact, on: true,
    desc: "通过学习上传视频的电影语法(提取其脚本、镜头结构、视觉语言和节奏),围绕您自己的主题生成全新视频。使用..." },
];

const featured = [
  { title: "百万爆款羊毛毡动画 Skill", img: skillStory, author: "AI 创意研习社",
    desc: "AI 创意研习社动画羊毛毡同款创作 Skill,输入视频旁白即可生成高质量羊毛毡动画(竖屏)" },
  { title: "旅拍大师 V2.0 | 唯美旅拍视频生成 Skill", img: skillTravel, author: "Artrail", added: true,
    desc: "将用户任意模糊的旅拍主题、文案、散文、脚本或短视频创意,转译为  Artrail 可执行的电影级唯美旅拍工作流。作者..." },
  { title: "你的女友已上线 | 沉浸式 POV 互动视频", img: skillReenact, author: "黄鑫波",
    desc: "打造第一视角沉浸式互动影游体验,以\"你的女友 / 男友视角\"展开剧情。用户通过选择或自然语言输入设定场景,AI ..." },
  { title: "剧本驱动型视频(需上传剧本)", img: skillScript, author: "Artrail", added: true,
    desc: "分析上传的剧本(图片/PDF/文本),通过学习其电影语法——提取脚本、镜头结构、视觉语言和节奏——围绕您的..." },
];

function SkillPage() {
  return (
    <div className="relative min-h-screen">
      <section className="aurora-bg px-8 pb-10 pt-16">
        <BrandMark />
        <TopBar />
        <div className="absolute left-24 top-5 flex items-center gap-2 text-sm text-foreground">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span>Skill</span>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">我的 Skill</h2>
            <button className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs hover:bg-accent">
              <Plus className="h-3.5 w-3.5" />
              新建 Skill
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {mine.map((s) => (
              <MyRow key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-xl font-semibold">精选 Skill</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {featured.map((s) => (
              <FeaturedRow key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MyRow({
  title,
  desc,
  img,
  on,
}: {
  title: string;
  desc: string;
  img: string;
  on: boolean;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card/60 p-4 transition hover:bg-card">
      <img
        src={img}
        alt={title}
        loading="lazy"
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold">{title}</h3>
          <span className="shrink-0 text-[11px] text-muted-foreground">@ Artrail</span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>
      <Toggle on={on} />
    </div>
  );
}

function FeaturedRow({
  title,
  desc,
  img,
  author,
  added,
}: {
  title: string;
  desc: string;
  img: string;
  author: string;
  added?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card/60 p-4 transition hover:bg-card">
      <img
        src={img}
        alt={title}
        loading="lazy"
        className="h-20 w-20 shrink-0 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold">{title}</h3>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            @ {author}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>
      {added ? (
        <span className="shrink-0 text-xs text-muted-foreground">已添加</span>
      ) : (
        <button className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-accent">
          <Plus className="h-3 w-3" />
          添加
        </button>
      )}
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      className={`relative h-5 w-9 shrink-0 rounded-full transition ${
        on ? "bg-success" : "bg-muted"
      }`}
    >
      <div
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition ${
          on ? "left-[18px]" : "left-0.5"
        }`}
      />
    </div>
  );
}
