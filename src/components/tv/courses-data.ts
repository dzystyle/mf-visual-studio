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

export type CourseChapter = {
  id: number;
  title: string;
  duration: string; // mm:ss
  cover: string;
};

export type Course = {
  id: number;
  title: string;
  author: string;
  cover: string;
  episodes: number;
  views: string;
  desc: string;
  chapters: CourseChapter[];
};

const ch = (id: number, title: string, duration: string, cover: string): CourseChapter => ({
  id,
  title,
  duration,
  cover,
});

export const COURSES: Course[] = [
  {
    id: 1,
    title: "90分钟拆解AI漫剧全流程",
    author: "GenJi是真想教会你",
    cover: skillStory,
    episodes: 9,
    views: "197.9w",
    desc: "作品、回家、电视剧2025年度优秀网络视听作品。",
    chapters: [
      ch(1, "第一章 用90分钟学会AI漫剧", "03:49", skillStory),
      ch(2, "第二章 编剧思维", "13:40", skillScript),
      ch(3, "第三章 资产建立", "20:54", threeView),
      ch(4, "第四章 导演分镜", "04:11", tvDrama),
      ch(5, "第五章 分镜转画面", "05:41", skillReenact),
      ch(6, "第六章 参数调校", "05:13", skillProduct),
      ch(7, "第七章 剪辑全流程", "08:41", skillMv),
    ],
  },
  {
    id: 2,
    title: "《丧尸清道夫》干货教程分享",
    author: "Mx-Shell",
    cover: tvSpace,
    episodes: 1,
    views: "86.2w",
    desc: "从选题到成片,完整复盘爆款丧尸短片的制作过程。",
    chapters: [ch(1, "第一章 完整制作复盘", "24:10", tvSpace)],
  },
  {
    id: 3,
    title: "AI 短片如何做出电影感",
    author: "Xuan酱",
    cover: tvDrama,
    episodes: 1,
    views: "64.8w",
    desc: "用镜头语言和光影设计,让 AI 短片拥有电影质感。",
    chapters: [ch(1, "第一章 电影感镜头语言", "18:32", tvDrama)],
  },
  {
    id: 4,
    title: "表演提示词公式课",
    author: "foyege",
    cover: charLisa,
    episodes: 1,
    views: "52.1w",
    desc: "一套提示词公式,让角色表演层次分明、情绪到位。",
    chapters: [ch(1, "第一章 表演提示词公式", "15:47", charLisa)],
  },
  {
    id: 5,
    title: "爆款 AI 短片课",
    author: "AI训练师大宇",
    cover: skillMv,
    episodes: 1,
    views: "48.3w",
    desc: "拆解 10 个爆款短片的共同结构,提炼可复制方法论。",
    chapters: [ch(1, "第一章 爆款结构拆解", "21:05", skillMv)],
  },
  {
    id: 6,
    title: "3D导演台进阶玩法",
    author: "栗子也该开点脑洞",
    cover: threeView,
    episodes: 1,
    views: "39.7w",
    desc: "用 3D 导演台精准控制机位、走位与场面调度。",
    chapters: [ch(1, "第一章 机位与调度进阶", "16:20", threeView)],
  },
  {
    id: 7,
    title: "一人剧组直出爆火AI漫剧",
    author: "喵同学",
    cover: tvPalace,
    episodes: 1,
    views: "35.4w",
    desc: "一个人就是一支剧组:编剧、分镜、生成、剪辑全流程。",
    chapters: [ch(1, "第一章 一人剧组工作流", "19:58", tvPalace)],
  },
  {
    id: 8,
    title: "导演台预演教学",
    author: "Rity",
    cover: skillProduct,
    episodes: 1,
    views: "28.9w",
    desc: "生成前先做预演,大幅降低返工率和积分消耗。",
    chapters: [ch(1, "第一章 预演工作流", "12:44", skillProduct)],
  },
  {
    id: 9,
    title: "AI片段衔接的导演思维",
    author: "栗子也该开点脑洞",
    cover: skillTravel,
    episodes: 1,
    views: "25.6w",
    desc: "15 秒以上片段如何无缝衔接?导演思维告诉你答案。",
    chapters: [ch(1, "第一章 片段衔接技巧", "14:12", skillTravel)],
  },
  {
    id: 10,
    title: "漫剧打斗教学",
    author: "来颗香菜",
    cover: skillReenact,
    episodes: 1,
    views: "22.3w",
    desc: "30 秒直出漫剧打斗场面:动作设计与节奏控制。",
    chapters: [ch(1, "第一章 打斗场面生成", "17:36", skillReenact)],
  },
  {
    id: 11,
    title: "丧尸清道夫同款Skill",
    author: "AIGC 自修室",
    cover: skillScript,
    episodes: 1,
    views: "19.8w",
    desc: "复刻爆款 Skill 配置,从参数到风格完整公开。",
    chapters: [ch(1, "第一章 Skill 复刻实战", "20:15", skillScript)],
  },
  {
    id: 12,
    title: "Artrail AI 创作基础课",
    author: "王浩",
    cover: projectTeacher,
    episodes: 5,
    views: "112.5w",
    desc: "从 0 到 1 的极速创作入门课程,新手必看。",
    chapters: [
      ch(1, "第一章 认识 Artrail", "06:20", projectTeacher),
      ch(2, "第二章 第一个作品", "09:15", skillTravel),
      ch(3, "第三章 提示词入门", "11:42", skillStory),
      ch(4, "第四章 素材与资产", "08:30", skillProduct),
      ch(5, "第五章 发布与分享", "07:26", tvPalace),
    ],
  },
];
