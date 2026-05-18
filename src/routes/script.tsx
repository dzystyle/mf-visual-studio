import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ModelPickerDialog, SkillPickerDialog, ElementsPickerDialog } from "@/components/picker-dialogs";
import {
  Play,
  LayoutGrid,
  FolderOpen,
  Scissors,
  FileText,
  MessageSquare,
  Download,
  Coins,
  X,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Package,
  Smile,
  ArrowUp,
  CheckCircle2,
  Quote,
  Heart,
  Trash2,
  Pencil,
  RefreshCw,
  Eye,
  Video,
  Pause,
  Maximize2,
  Volume2,
  Music2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type Search = { prompt?: string };

export const Route = createFileRoute("/script")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    prompt: typeof s.prompt === "string" ? s.prompt : undefined,
  }),
  head: () => ({
    meta: [{ title: "剧本视频制作 — MovieFlow" }],
  }),
  component: ScriptPage,
});

type Element = {
  name: string;
  desc: string;
  expanded?: boolean;
  thumbs?: string[];
  refId?: string;
  count?: number;
};

import charSam from "@/assets/char-sam.jpg";
import charBoss from "@/assets/char-boss.jpg";
import charCarter from "@/assets/char-carter.jpg";
import charXiaopang from "@/assets/char-xiaopang.jpg";
import charLisa from "@/assets/char-lisa.jpg";
import charSecurity from "@/assets/char-security.jpg";

const initialElements: Element[] = [
  { name: "Element_Sam", desc: "28岁瘦弱白人男性,黑框眼镜,洗旧蓝格子衬衫,卡其裤,破洞白球鞋,凌乱棕发,眼下有浓重黑眼圈。现代都市写实风格。", thumbs: [charSam, charSam], refId: "Element_Sam_ref_img", count: 2 },
  { name: "Element_Boss", desc: "50岁肥胖白人男性,秃顶,身穿昂贵的深灰色西装,佩戴金表,满脸横肉,面部特征常常紧皱眉头。", thumbs: [charBoss], refId: "Element_Boss_ref_img" },
  { name: "Element_Detective_Carter", desc: "38岁高大白人男性,寸头发型,左脸有一道明显的刀疤,穿着黑色战术背心叩作战服。外观硬朗冷峻。", thumbs: [charCarter, charCarter], refId: "Element_Detective_Carter_ref_img", expanded: true },
  { name: "Element_Xiao_Pang", desc: "21岁亚裔男性,圆框眼镜,穿着宽松的灰色卫衣。体态多表现为含胸低头。", thumbs: [charXiaopang], refId: "Element_Xiao_Pang_ref_img" },
  { name: "Element_Lisa", desc: "32岁白人女性,金色大波浪卷发,穿着黑色紧身职业套装搭配细高跟鞋,涂有鲜艳红唇,外表冷艳。", thumbs: [charLisa], refId: "Element_Lisa_ref_img" },
  { name: "Element_Security_Chief", desc: "36岁黑人男性,光头,肌肉非常发达。穿着黑色保安制服,脖子上带有显眼的纹身。", thumbs: [charSecurity], refId: "Element_Security_Chief_ref_img" },
  { name: "Element_Mark", desc: "", thumbs: [], refId: "Element_Mark_ref_img" },
];

type Mode = "storyboard" | "timeline";
export type QuotedRef = { id: string; name: string; image: string };

function ScriptPage() {
  const { prompt } = Route.useSearch();
  const [mode, setMode] = useState<Mode>("storyboard");
  const [showLeft, setShowLeft] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [quotes, setQuotes] = useState<QuotedRef[]>([]);

  const addQuote = (q: QuotedRef) => {
    setShowChat(true);
    setQuotes((xs) => (xs.some((x) => x.id === q.id) ? xs : [...xs, q]));
  };
  const removeQuote = (id: string) =>
    setQuotes((xs) => xs.filter((x) => x.id !== id));

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TitleBar mode={mode} setMode={setMode} />
      <div className="flex flex-1 gap-2 overflow-hidden px-2 pb-2">
        {mode === "timeline" ? (
          <TimelineWorkspace
            showLeft={showLeft}
            showPreview={showPreview}
            onCloseLeft={() => setShowLeft(false)}
            onClosePreview={() => setShowPreview(false)}
            onQuote={addQuote}
          />
        ) : (
          <>
            {showLeft && (
              <StoryboardPanel onClose={() => setShowLeft(false)} />
            )}
            {showPreview && (
              <PreviewPanel
                onClose={() => setShowPreview(false)}
                onQuote={addQuote}
              />
            )}
          </>
        )}
        {showChat && (
          <ChatPanel
            initialPrompt={prompt}
            onClose={() => setShowChat(false)}
            quotes={quotes}
            onRemoveQuote={removeQuote}
          />
        )}
      </div>
    </div>
  );
}

function TitleBar({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-border/60 bg-sidebar px-3">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-aurora-pink via-aurora-orange to-aurora-blue">
          <Play className="h-3.5 w-3.5 fill-foreground text-foreground" />
        </Link>
        <div className="text-sm font-medium">《超能替罪羊》剧本视频制作</div>
        <div className="ml-2 flex items-center gap-1">
          <TabBtn icon={LayoutGrid} label={mode === "storyboard" ? "故事板" : undefined} active={mode === "storyboard"} onClick={() => setMode("storyboard")} />
          <TabBtn icon={FolderOpen} />
          <TabBtn icon={Scissors} label={mode === "timeline" ? "时间线" : undefined} active={mode === "timeline"} onClick={() => setMode("timeline")} />
          <TabBtn icon={FileText} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
        </button>
        <button className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-aurora-orange to-aurora-pink px-3 py-1.5 text-xs font-medium text-foreground">
          <Download className="h-3.5 w-3.5" />
          导出
        </button>
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs">
          <Coins className="h-3.5 w-3.5 text-aurora-orange" />
          <span className="font-semibold">62</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-2.5 py-1.5 text-xs">
          <div className="h-4 w-4 rounded-full bg-gradient-to-br from-aurora-pink to-aurora-blue" />
          Starter
        </div>
      </div>
    </div>
  );
}

function TabBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition ${
        active
          ? "bg-success/15 text-success"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label && <span>{label}</span>}
    </button>
  );
}

function StoryboardPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex w-[300px] flex-shrink-0 flex-col overflow-hidden rounded-lg border border-border/60 bg-card/30">
      <div className="flex h-9 items-center justify-between border-b border-border/60 px-3">
        <div className="flex items-center gap-1.5 text-xs text-foreground">
          <LayoutGrid className="h-3.5 w-3.5" />
          故事板
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="py-3 text-center text-xs text-muted-foreground">
          -- 关键元素 --
        </div>
        <div className="flex flex-col">
          {initialElements.map((el) => (
            <ElementRow key={el.name} el={el} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ElementRow({ el }: { el: Element }) {
  const [open, setOpen] = useState(el.expanded !== false);
  const hasThumbs = (el.thumbs?.length ?? 0) > 0;
  return (
    <div className="group border-t border-border/40 px-4 py-3.5 hover:bg-card/40">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <div className="mt-1 hidden h-3 w-2 flex-col justify-between opacity-0 group-hover:opacity-60">
            <div className="flex gap-0.5"><span className="h-0.5 w-0.5 rounded-full bg-muted-foreground"/><span className="h-0.5 w-0.5 rounded-full bg-muted-foreground"/></div>
            <div className="flex gap-0.5"><span className="h-0.5 w-0.5 rounded-full bg-muted-foreground"/><span className="h-0.5 w-0.5 rounded-full bg-muted-foreground"/></div>
            <div className="flex gap-0.5"><span className="h-0.5 w-0.5 rounded-full bg-muted-foreground"/><span className="h-0.5 w-0.5 rounded-full bg-muted-foreground"/></div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-foreground">{el.name}</div>
            {open && el.desc && (
              <div className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                {el.desc}
              </div>
            )}
            {open && hasThumbs && (
              <div className="mt-2.5 flex items-center gap-1.5">
                {el.thumbs!.slice(0, 2).map((src, i) => (
                  <div key={i} className="relative h-16 w-16 overflow-hidden rounded-md border border-border/60 bg-muted">
                    <img src={src} alt={el.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            {open && el.refId && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-card/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  <span className="rounded bg-muted/60 px-1 text-[9px] text-foreground/80">图片</span>
                  <span className="max-w-[110px] truncate">{el.refId}</span>
                  {el.count && el.count > 1 && (
                    <span className="rounded bg-success/20 px-1 text-[9px] text-success">x{el.count}</span>
                  )}
                  <ChevronRight className="h-2.5 w-2.5" />
                </div>
                <button className="flex h-5 w-5 items-center justify-center rounded border border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground">
                  <Plus className="h-2.5 w-2.5" />
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-0.5 text-muted-foreground transition hover:text-foreground"
        >
          <ChevronDown
            className={`h-4 w-4 transition ${open ? "" : "-rotate-90"}`}
          />
        </button>
      </div>
    </div>
  );
}

type Msg =
  | { kind: "user"; text: string }
  | { kind: "bot"; nodes: BotNode[] };
type BotNode =
  | { type: "status"; icon: "skill" | "spec" | "board"; label: string; tone?: "default" | "warn" | "accent" }
  | { type: "text"; text: string; emphasis?: boolean }
  | { type: "heading"; text: string }
  | { type: "list"; items: (string | { label: string; sub?: string })[] }
  | { type: "shots"; rows: { shot: string; time: string; content: string }[] }
  | { type: "meta"; icon: string; label: string; value: string }
  | {
      type: "mediaAssets";
      title: string;
      badge?: string;
      cost?: string;
      steps: {
        title: string;
        desc?: string;
        assets?: { name: string; duration?: string }[];
      }[];
    }
  | {
      type: "characterTable";
      rows: { icon: string; name: string; features: string }[];
    }
  | {
      type: "progressTable";
      title?: string;
      rows: { shot: string; content: string; status: string }[];
    };

const scriptShots = [
  { shot: "1", time: "0–3s", content: "特写猛推:打卡机屏幕显示\"8:59:59\",红色数字疯狂跳动,一只汗湿的手猛地拍在打卡键上" },
  { shot: "2", time: "3–7s", content: "低角度跟拍:萨姆喘着粗气冲进公司大门,领带歪在一边,手里还攥着没吃完的三明治" },
  { shot: "3", time: "7–12s", content: "全景:老板从办公室走出来,挡住萨姆去路,一脚狠狠踹在萨姆肚子上" },
  { shot: "4", time: "12–17s", content: "慢动作特写:萨姆向后摔倒,手中热咖啡泼洒,老板反手将整杯咖啡浇在萨姆头上" },
  { shot: "5", time: "17–22s", content: "中景扫过:周围同事纷纷侧目,有人偷笑,有人拿出手机偷拍,无人上前帮忙" },
  { shot: "6", time: "22–28s", content: "萨姆第一视角:模糊的视线中,老板指着他的鼻子破口大骂,口水喷在他脸上" },
  { shot: "7", time: "28–34s", content: "闪回特写:午夜零点,萨姆躺在床上,眼睛突然发出淡蓝色微光,视网膜上浮现文字" },
  { shot: "8", time: "34–40s", content: "中景:老板不耐烦地挥手,「滚去地下室搬杂物!今天别让我再看见你!」" },
  { shot: "9", time: "40–45s", content: "萨姆背影:他低着头走向地下室楼梯,头发上还滴着咖啡" },
  { shot: "10", time: "45–50s", content: "空镜:安静的走廊,突然从顶楼VIP办公室传来「咚」的一声沉闷重物倒地声" },
  { shot: "11", time: "50–55s", content: "快速跟拍:萨姆猛地抬头,犹豫一秒后转身冲向楼梯,脚步急促" },
  { shot: "12", time: "55–60s", content: "主观镜头:萨姆推开VIP办公室门,浓烈的血腥味扑面而来,镜头缓缓下移,露出地上的大片血迹" },
];

const storyboardShots = [
  { shot: "Shot 1", time: "0–12s", content: "打卡机特写→萨姆冲进公司→老板踹人" },
  { shot: "Shot 2", time: "12–22s", content: "咖啡浇头慢动作→同事旁观无人帮忙" },
  { shot: "Shot 3", time: "22–34s", content: "老板骂人(主观视角)→闪回萨姆床上眼睛发蓝光/异能觉醒" },
  { shot: "Shot 4", time: "34–45s", content: "老板挥手发配地下室→萨姆背影走向楼梯" },
  { shot: "Shot 5", time: "45–60s", content: "安静走廊空镜/倒地声→萨姆转身冲楼梯→推开VIP办公室门/血迹" },
];

const seedConversation: Msg[] = [
  {
    kind: "bot",
    nodes: [
      { type: "heading", text: "《超能替罪羊》第1集 · Seedance 逐帧分镜剧本" },
      { type: "text", text: "全局设定:现代都市写字楼,冷色调工业风,压抑的蓝灰色主调,雨天外景,室内荧光灯惨白光线,全程手持镜头+快速剪辑,营造紧张窒息感。" },
      { type: "text", text: "固定人物:萨姆 / 老板 / 卡特警探 / 小胖 / 丽莎 / 保安队长 / 马克 共 7 人。" },
      { type: "shots", rows: scriptShots },
      { type: "status", icon: "skill", label: "Skill 已完成" },
      { type: "text", text: "好的,正在为您加载「剧本驱动型视频」技能,稍等片刻!" },
      { type: "text", text: "技能加载完毕!现在让我建立项目规格文档,然后启动制作流程。" },
      { type: "text", text: "技能「剧本驱动型视频」已加载,核心流程如下:" },
      {
        type: "list",
        items: [
          { label: "工具组合:", sub: "Nano Banana(关键帧图像)+ Seedance 2.0(镜头视频)" },
          { label: "制作节奏:", sub: "规格确认 → 故事板 → 角色参考图 → 逐镜头视频 → 音频层 → 最终剪辑,每个关键阶段暂停确认" },
          { label: "人机协作模式:", sub: "一镜到底工作流,关键节点您可随时介入调整" },
        ],
      },
      { type: "status", icon: "spec", label: "视频规格 已完成", tone: "warn" },
      { type: "text", text: "项目规格已确立!现在开始设计故事板,将第1集的12个分镜全部结构化。" },
      { type: "status", icon: "board", label: "故事板 已更新", tone: "accent" },
      { type: "text", text: "故事板已就绪!5个长镜头(包含内部快剪)完整覆盖第1集60秒,7位角色全部定义完毕。" },
      { type: "text", text: "现在进入 第一个关键阶段:故事板确认,请您查看上方的分镜结构。以下是当前故事板概览:", emphasis: true },
      { type: "heading", text: "■ 镜头列表(共5组,每组含内部剪辑)" },
      { type: "shots", rows: storyboardShots },
      { type: "meta", icon: "🎭", label: "角色定义(7人):", value: "萨姆、老板、卡特警探、小胖、丽莎、保安队长、马克" },
      { type: "meta", icon: "🎵", label: "音频层:", value: "全局60秒工业风电子配乐(含环境音采样)" },
      { type: "text", text: "确认无误后,下一步将为7位角色各生成一张参考形象图,用于后续视频生成时保持角色一致性。" },
    ],
  },
  { kind: "user", text: "故事板确认,开始生成角色参考图" },
  {
    kind: "bot",
    nodes: [
      { type: "text", text: "好的,故事板已确认!现在开始为7位角色生成参考形象图 🎬" },
      {
        type: "mediaAssets",
        title: "首次生成图片",
        badge: "+30",
        cost: "-77",
        steps: [
          { title: "Agent分析完成", desc: "好的!开始为7位角色生成参考形象图。首先注册所有角色图像资产。" },
          { title: "资产配置完成" },
          { title: "Agent分析完成", desc: "资产注册完成!现在为所有7位角色同步撰写提示词。" },
          {
            title: "编写提示词完成",
            desc: "Element_Sam_ref_img\n角色参考图——萨姆(Sam)。版面布局:左侧为半身特写,右侧依次为全身正面、侧面、背面四视图,白色中性背景,无阴影干扰。人物设定:28岁瘦…",
          },
          { title: "Agent分析完成", desc: "提示词已全部就绪!现在同步生成所有7位角色的参考形象图 🎬" },
          {
            title: "生成素材完成",
            assets: [
              { name: "Element_Sam_ref_img" },
              { name: "Element_Boss_ref_img" },
              { name: "Element_Detective_Cart..." },
              { name: "Element_Xiao_Pang_ref..." },
              { name: "Element_Lisa_ref_img" },
              { name: "Element_Security_Chief..." },
              { name: "Element_Mark_ref_img" },
            ],
          },
          { title: "Agent分析完成" },
        ],
      },
      { type: "text", text: "7位角色的参考形象图全部生成完毕!✅", emphasis: true },
      { type: "text", text: "请查看上方每位角色的三视图参考图,确认外观是否符合预期:" },
      {
        type: "characterTable",
        rows: [
          { icon: "🧑", name: "萨姆", features: "黑框眼镜、蓝格子衬衫、浓黑眼圈" },
          { icon: "👨‍💼", name: "老板", features: "秃顶、深灰西装、金表、横肉脸" },
          { icon: "🔪", name: "卡特警探", features: "寸头、左脸刀疤、黑色战术背心" },
          { icon: "👀", name: "小胖", features: "圆框眼镜、灰色卫衣、含胸低头" },
          { icon: "💃", name: "丽莎", features: "金色大波浪、黑色职业套装、红唇" },
          { icon: "💪", name: "保安队长", features: "光头、肌肉发达、黑色制服、颈纹身" },
          { icon: "🎧", name: "马克", features: "凌乱棕色长发、黑色连帽衫、耳机" },
        ],
      },
    ],
  },
  { kind: "user", text: "角色确认,开始生成分镜视频" },
  {
    kind: "bot",
    nodes: [
      {
        type: "mediaAssets",
        title: "Media Assets",
        cost: "-1260",
        steps: [
          {
            title: "Agent分析完成",
            desc: "好的,萨姆的参考图已更新,现在将所有5个分镜的 prompt_id 复用,同时将萨姆替换为新版资源,一次性批量提交给 Seedance 2.0 生成!",
          },
          {
            title: "生成素材完成",
            assets: [
              { name: "Shot_Late_And_Kicked...", duration: "00:12" },
              { name: "Shot_Humiliation_final_...", duration: "00:10" },
              { name: "Shot_Cursing_And_Flas...", duration: "00:12" },
              { name: "Shot_Basement_Banish...", duration: "00:11" },
              { name: "Shot_The_Thud_And_Bl...", duration: "00:15" },
            ],
          },
          { title: "Agent分析完成" },
        ],
      },
      { type: "text", text: "5个分镜视频全部生成完毕!✅ 请在上方查看每个片段的效果。", emphasis: true },
      {
        type: "progressTable",
        title: "当前进度一览:",
        rows: [
          { shot: "Shot 1", content: "凌辱咖啡→同事旁观", status: "已生成" },
          { shot: "Shot 2", content: "打卡机→萨姆冲进→老板踹+骂", status: "已生成" },
          { shot: "Shot 3", content: "老板骂人主观视角→异能觉醒闪回", status: "已生成" },
          { shot: "Shot 4", content: "老板发配地下室→萨姆背影", status: "已生成" },
          { shot: "Shot 5", content: "走廊倒地声→萨姆转身冲楼梯→血迹", status: "已生成" },
        ],
      },
      { type: "text", text: "请仔细查看5个片段,如有需要调整的镜头告诉我。视频满意后,下一步将生成 60秒工业风背景配乐,然后进行最终剪辑合成 🎬" },
    ],
  },
];

function ChatPanel({
  initialPrompt,
  onClose,
  quotes,
  onRemoveQuote,
}: {
  initialPrompt?: string;
  onClose: () => void;
  quotes: QuotedRef[];
  onRemoveQuote: (id: string) => void;
}) {
  const [msgs] = useState<Msg[]>(() =>
    initialPrompt
      ? [{ kind: "user" as const, text: initialPrompt }, ...seedConversation]
      : seedConversation,
  );

  return (
    <div className="flex w-[460px] flex-shrink-0 flex-col overflow-hidden rounded-lg border border-border/60 bg-card/30">
      <div className="flex h-9 items-center justify-between border-b border-border/60 px-3">
        <div className="flex items-center gap-1.5 text-xs">
          <MessageSquare className="h-3.5 w-3.5" />
          对话
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide px-4 py-4">
        {msgs.map((m, i) =>
          m.kind === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-accent px-3.5 py-2 text-[13px] text-foreground">
                {m.text}
              </div>
            </div>
          ) : (
            <BotMessage key={i} nodes={m.nodes} />
          ),
        )}
      </div>

      <Composer quotes={quotes} onRemoveQuote={onRemoveQuote} />
    </div>
  );
}

function BotMessage({ nodes }: { nodes: BotNode[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-[13px] font-semibold">
        <span className="text-aurora-pink">✦</span>
        <span>Flova</span>
      </div>
      {nodes.map((n, i) => (
        <BotNodeView key={i} node={n} />
      ))}
    </div>
  );
}

function BotNodeView({ node }: { node: BotNode }) {
  if (node.type === "text") {
    return (
      <p className={`text-[13px] leading-relaxed ${node.emphasis ? "text-foreground" : "text-foreground/90"}`}>
        {node.text}
      </p>
    );
  }
  if (node.type === "heading") {
    return (
      <p className="text-[13px] font-semibold text-foreground">{node.text}</p>
    );
  }
  if (node.type === "list") {
    return (
      <ul className="ml-4 list-disc space-y-1.5 text-[13px] leading-relaxed text-foreground/90 marker:text-muted-foreground">
        {node.items.map((it, i) => (
          <li key={i}>
            {typeof it === "string" ? (
              it
            ) : (
              <>
                <span className="font-medium">{it.label}</span> {it.sub}
              </>
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (node.type === "shots") {
    return (
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-card/60 text-muted-foreground">
              <th className="w-16 px-3 py-2 text-left font-medium">镜头</th>
              <th className="w-20 px-2 py-2 text-left font-medium">时间段</th>
              <th className="px-2 py-2 text-left font-medium">核心内容</th>
            </tr>
          </thead>
          <tbody>
            {node.rows.map((r, i) => (
              <tr key={i} className="border-t border-border/40 align-top">
                <td className="px-3 py-2 text-foreground/80">{r.shot}</td>
                <td className="px-2 py-2 text-muted-foreground">{r.time}</td>
                <td className="px-2 py-2 leading-relaxed text-foreground/90">{r.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (node.type === "meta") {
    return (
      <p className="text-[13px] leading-relaxed text-foreground/90">
        <span className="mr-1">{node.icon}</span>
        <span className="font-medium">{node.label}</span> {node.value}
      </p>
    );
  }
  if (node.type === "mediaAssets") {
    return <MediaAssetsCard node={node} />;
  }
  if (node.type === "characterTable") {
    return (
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-card/60 text-muted-foreground">
              <th className="w-24 px-3 py-2 text-left font-medium">角色</th>
              <th className="px-2 py-2 text-left font-medium">关键外观特征</th>
            </tr>
          </thead>
          <tbody>
            {node.rows.map((r, i) => (
              <tr key={i} className="border-t border-border/40 align-top">
                <td className="px-3 py-2 text-foreground/90">
                  <span className="mr-1">{r.icon}</span>
                  {r.name}
                </td>
                <td className="px-2 py-2 leading-relaxed text-foreground/80">{r.features}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (node.type === "progressTable") {
    return (
      <div className="space-y-2">
        {node.title && (
          <p className="text-[13px] font-medium text-foreground/90">🎬 {node.title}</p>
        )}
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-card/60 text-muted-foreground">
                <th className="w-16 px-3 py-2 text-left font-medium">分镜</th>
                <th className="px-2 py-2 text-left font-medium">内容</th>
                <th className="w-24 px-2 py-2 text-left font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {node.rows.map((r, i) => (
                <tr key={i} className="border-t border-border/40 align-top">
                  <td className="px-3 py-2 text-foreground/90">{r.shot}</td>
                  <td className="px-2 py-2 leading-relaxed text-foreground/80">{r.content}</td>
                  <td className="px-2 py-2 text-success">✅ {r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  // status card
  const tone =
    node.tone === "warn"
      ? "text-aurora-orange"
      : node.tone === "accent"
        ? "text-aurora-blue"
        : "text-success";
  return (
    <button className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 text-left hover:bg-card">
      <div className="flex items-center gap-2">
        <CheckCircle2 className={`h-4 w-4 ${tone}`} />
        <span className="text-[13px] font-medium">{node.label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function Composer() {
  const [text, setText] = useState("");
  const [modelOpen, setModelOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [elemOpen, setElemOpen] = useState(false);
  const [model, setModel] = useState<string | null>(null);
  const [skill, setSkill] = useState<string | null>(null);
  const [elements, setElements] = useState<string[]>([]);
  return (
    <div className="border-t border-border/60 p-3">
      <div className="rounded-xl border border-border/60 bg-card/50 p-2.5">
        {(model || skill || elements.length > 0) && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {model && (
              <SelectedChip icon={LayoutGrid} label={model} onRemove={() => setModel(null)} />
            )}
            {skill && (
              <SelectedChip icon={Package} label={skill} onRemove={() => setSkill(null)} />
            )}
            {elements.map((e) => (
              <SelectedChip key={e} icon={Smile} label={e} onRemove={() => setElements((xs) => xs.filter((x) => x !== e))} />
            ))}
          </div>
        )}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请输入你的消息..."
          className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent">
              <Plus className="h-3 w-3" />
            </button>
            <MiniChip icon={LayoutGrid} label="模型" badge="新" onClick={() => setModelOpen(true)} />
            <MiniChip icon={Package} label="Skill" onClick={() => setSkillOpen(true)} />
            <MiniChip icon={Smile} label="元素" onClick={() => setElemOpen(true)} />
          </div>
          <button className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground hover:bg-foreground hover:text-background">
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <ModelPickerDialog open={modelOpen} onOpenChange={setModelOpen} value={model ?? undefined} onSelect={setModel} />
      <SkillPickerDialog open={skillOpen} onOpenChange={setSkillOpen} onSelect={setSkill} />
      <ElementsPickerDialog open={elemOpen} onOpenChange={setElemOpen} onSelect={(name) => setElements((xs) => (xs.includes(name) ? xs : [...xs, name]))} />
    </div>
  );
}

function SelectedChip({ icon: Icon, label, onRemove }: { icon: React.ComponentType<{ className?: string }>; label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-aurora-blue/40 bg-aurora-blue/10 px-2 py-0.5 text-[11px] text-foreground">
      <Icon className="h-3 w-3 text-aurora-blue" />
      <span className="max-w-[140px] truncate">{label}</span>
      <button onClick={onRemove} className="ml-0.5 text-muted-foreground hover:text-foreground">×</button>
    </span>
  );
}

function MiniChip({
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 rounded-full border border-border bg-card/40 px-2 py-1 text-[11px] text-foreground hover:bg-card">
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span>{label}</span>
      {badge && (
        <span className="rounded-full bg-success/20 px-1 text-[9px] font-medium text-success">
          {badge}
        </span>
      )}
    </button>
  );
}


function MediaAssetsCard({
  node,
}: {
  node: Extract<BotNode, { type: "mediaAssets" }>;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border border-border/60 bg-card/40">
      <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="rounded-md bg-aurora-pink/15 px-2 py-0.5 font-medium text-aurora-pink">
            {node.title}
          </span>
          {node.badge && (
            <span className="text-aurora-orange">{node.badge} 🎬</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {node.cost && (
            <span className="flex items-center gap-1 rounded-md bg-foreground/10 px-2 py-0.5 text-[11px] text-aurora-orange">
              🎞 {node.cost}
            </span>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronDown
              className={`h-4 w-4 transition ${open ? "" : "-rotate-90"}`}
            />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b border-border/40 px-3 py-2 text-[12px]">
        <div className="h-4 w-4 rounded-full bg-gradient-to-br from-aurora-blue to-aurora-pink" />
        <span className="font-medium text-aurora-blue">Media Assets</span>
        <span className="ml-auto text-muted-foreground">已完成</span>
      </div>
      {open && (
        <ol className="relative px-4 py-3">
          <div className="absolute bottom-4 left-[22px] top-4 w-px bg-border/60" />
          {node.steps.map((s, i) => (
            <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
              <div className="relative z-10 mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-success/60 bg-card">
                <CheckCircle2 className="h-3 w-3 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-foreground">
                  {s.title}
                </div>
                {s.desc && (
                  <div className="mt-1 whitespace-pre-line text-[11.5px] leading-relaxed text-muted-foreground">
                    {s.desc}
                    {s.desc.endsWith("…") && (
                      <button className="ml-1 text-foreground underline">
                        展开
                      </button>
                    )}
                  </div>
                )}
                {s.assets && (
                  <div className="mt-2 space-y-1.5">
                    {s.assets.map((a, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-2 rounded-md bg-card/60 p-1.5"
                      >
                        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded bg-gradient-to-br from-muted to-foreground/10">
                          {a.duration && (
                            <span className="absolute bottom-0.5 left-0.5 rounded bg-black/70 px-1 text-[9px] leading-tight text-white">
                              {a.duration}
                            </span>
                          )}
                        </div>
                        <span className="truncate text-[11.5px] text-foreground/90">
                          {a.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

const fileAssets: { name: string; src: string; isVideo?: boolean }[] = [
  { name: "Element_Sam_ref_img", src: charSam },
  { name: "", src: charSam },
  { name: "Element_Boss_ref_img", src: charBoss },
  { name: "Element_Detective_Carter_ref_img", src: charCarter },
  { name: "", src: charCarter },
  { name: "", src: charSam },
  { name: "", src: charXiaopang },
  { name: "", src: charLisa },
  { name: "", src: charSecurity },
  { name: "", src: charBoss },
  { name: "", src: charSam, isVideo: true },
  { name: "", src: charSam, isVideo: true },
];

function PreviewPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 min-w-0 flex-col gap-2 overflow-hidden">
      {/* Preview card */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border/60 bg-card/30">
        <div className="flex h-9 items-center justify-between border-b border-border/60 px-3">
          <div className="flex items-center gap-1.5 text-xs">
            <Eye className="h-3.5 w-3.5" />
            <span>预览</span>
            <span className="text-muted-foreground">Element_Sam_ref_img</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* Top chips */}
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
            <span className="rounded-md bg-black/50 px-2 py-1 text-[11px] text-foreground backdrop-blur">Nano Banana 2</span>
            <span className="rounded-md bg-black/50 px-2 py-1 text-[11px] text-foreground backdrop-blur">2K (2752*1536)</span>
          </div>
          <div className="absolute right-3 top-3 z-10 flex items-center gap-1">
            {[Quote, Download, Heart, Trash2].map((Icon, i) => (
              <button key={i} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-black/40 hover:text-foreground">
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          {/* Side nav */}
          <div className="absolute left-3 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-1.5">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-foreground backdrop-blur hover:bg-black/60">
              <ChevronUp className="h-4 w-4" />
            </button>
            <span className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-muted-foreground backdrop-blur">元素</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-foreground backdrop-blur hover:bg-black/60">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          {/* Image */}
          <div className="flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-b from-background to-black/60">
            <img src={charSam} alt="Element_Sam_ref_img" className="h-full w-full object-contain" />
          </div>
          {/* Bottom composer */}
          <div className="flex items-center gap-2 border-t border-border/60 p-3">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2">
              <input
                placeholder="输入评论,编辑当前镜头并生成新画面..."
                className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20">
                <ArrowUp className="h-3 w-3" />
              </button>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[12px] text-foreground hover:bg-card">
              <Pencil className="h-3.5 w-3.5" /> 手动编辑
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[12px] text-foreground hover:bg-card">
              <RefreshCw className="h-3.5 w-3.5" /> 重新生成
            </button>
          </div>
        </div>
      </div>

      {/* File area */}
      <div className="flex h-[260px] flex-shrink-0 flex-col overflow-hidden rounded-lg border border-border/60 bg-card/30">
        <div className="flex h-9 items-center justify-between border-b border-border/60 px-3">
          <div className="flex items-center gap-1.5 text-xs">
            <FolderOpen className="h-3.5 w-3.5" />
            文件区
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="relative inline-flex h-3.5 w-7 items-center rounded-full bg-muted/60">
                <span className="absolute left-0.5 h-2.5 w-2.5 rounded-full bg-foreground/70" />
              </span>
              只展示未分配素材
            </label>
            <button className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
            <button className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
          <div className="grid grid-cols-6 gap-2">
            {fileAssets.map((a, i) => (
              <div key={i} className="space-y-1">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border/60 bg-muted">
                  <img src={a.src} alt={a.name} loading="lazy" className="h-full w-full object-cover" />
                  {a.isVideo && (
                    <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-black/60">
                      <Video className="h-3 w-3 text-foreground" />
                    </span>
                  )}
                </div>
                {a.name && (
                  <div className="flex items-center justify-between rounded bg-success/15 px-1.5 py-0.5 text-[10px] text-success">
                    <span className="truncate">{a.name}</span>
                    <ChevronRight className="h-2.5 w-2.5 flex-shrink-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============== Timeline Mode ===============

const shotClips: { name: string; src: string; width: number }[] = [
  { name: "Shot_Late_And_Kicked", src: charSam, width: 140 },
  { name: "Shot_Humiliation", src: charBoss, width: 110 },
  { name: "Shot_Cursing_Flash", src: charSam, width: 150 },
  { name: "Shot_Basement_Banish", src: charSecurity, width: 130 },
  { name: "Shot_The_Thud_Blood", src: charSam, width: 180 },
];

function TimelineWorkspace({
  showLeft,
  showPreview,
  onCloseLeft,
  onClosePreview,
}: {
  showLeft: boolean;
  showPreview: boolean;
  onCloseLeft: () => void;
  onClosePreview: () => void;
}) {
  return (
    <div className="flex flex-1 min-w-0 flex-col gap-2 overflow-hidden">
      {/* Top row: file area + preview */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {showLeft && <FileLibraryPanel onClose={onCloseLeft} />}
        {showPreview && <EditorPreviewPanel onClose={onClosePreview} />}
      </div>
      {/* Bottom: timeline track */}
      <TimelineBar />
    </div>
  );
}

function FileLibraryPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex w-[360px] flex-shrink-0 flex-col overflow-hidden rounded-lg border border-border/60 bg-card/30">
      <div className="flex h-9 items-center justify-between border-b border-border/60 px-3">
        <div className="flex items-center gap-1.5 text-xs">
          <FolderOpen className="h-3.5 w-3.5" />
          文件区
        </div>
        <div className="flex items-center gap-1">
          <button className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
          <button onClick={onClose} className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
        <div className="grid grid-cols-3 gap-2">
          {fileAssets.filter((a) => !a.isVideo).map((a, i) => (
            <AssetCard key={i} name={a.name} src={a.src} />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {shotClips.slice(0, 4).map((s, i) => (
            <AssetCard key={i} name={s.name} src={s.src} video tone="muted" />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <AssetCard name="Shot_Base" src={charSam} video tone="muted" />
          <AudioCard name="Audio_BGM_Industr..." />
          <AudioCard name="Audio_BGM_Industr..." />
        </div>
      </div>
    </div>
  );
}

function AssetCard({ name, src, video, tone }: { name: string; src: string; video?: boolean; tone?: "success" | "muted" }) {
  const t = tone === "muted" ? "bg-muted/40 text-muted-foreground" : "bg-success/15 text-success";
  return (
    <div className="space-y-1">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border/60 bg-muted">
        <img src={src} alt={name} loading="lazy" className="h-full w-full object-cover" />
        {video && (
          <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded bg-black/60">
            <Video className="h-3 w-3 text-foreground" />
          </span>
        )}
      </div>
      {name && (
        <div className={`flex items-center justify-between rounded px-1.5 py-0.5 text-[10px] ${t}`}>
          <span className="truncate">{name}</span>
          <ChevronRight className="h-2.5 w-2.5 flex-shrink-0" />
        </div>
      )}
    </div>
  );
}

function AudioCard({ name }: { name: string }) {
  return (
    <div className="space-y-1">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/30">
        <div className="flex h-6 w-full items-center justify-around px-2">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className="w-0.5 rounded-full bg-aurora-blue/70" style={{ height: `${20 + Math.abs(Math.sin(i)) * 80}%` }} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between rounded bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
        <span className="truncate">{name}</span>
        <ChevronRight className="h-2.5 w-2.5 flex-shrink-0" />
      </div>
    </div>
  );
}

function EditorPreviewPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 min-w-0 flex-col overflow-hidden rounded-lg border border-border/60 bg-card/30">
      <div className="flex h-9 items-center justify-between border-b border-border/60 px-3">
        <div className="flex items-center gap-1.5 text-xs">
          <Eye className="h-3.5 w-3.5" />
          <span>预览</span>
          <span className="text-muted-foreground">Element_Sam_ref_img</span>
        </div>
        <button onClick={onClose} className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
          <span className="rounded-md bg-black/50 px-2 py-1 text-[11px] text-foreground backdrop-blur">Nano Banana 2</span>
          <span className="rounded-md bg-black/50 px-2 py-1 text-[11px] text-foreground backdrop-blur">2K (2752*1536)</span>
        </div>
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1">
          {[Quote, Download, Heart, Trash2, Maximize2].map((Icon, i) => (
            <button key={i} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-black/40 hover:text-foreground">
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
        <div className="flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-b from-background to-black/60 p-4">
          <img src={charSam} alt="Element_Sam_ref_img" className="max-h-full max-w-full rounded-md object-contain" />
        </div>
        <div className="flex items-center gap-2 border-t border-border/60 p-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2">
            <input placeholder="输入评论,编辑当前镜头并生成新画面..." className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none" />
            <button className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20">
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[12px] text-foreground hover:bg-card">
            <Pencil className="h-3.5 w-3.5" /> 手动编辑
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[12px] text-foreground hover:bg-card">
            <RefreshCw className="h-3.5 w-3.5" /> 重新生成
          </button>
        </div>
      </div>
    </div>
  );
}

function TimelineBar() {
  const ticks = ["00:00", "0:05", "0:10", "0:15", "0:20", "0:25", "0:30", "0:35", "0:40", "0:45", "0:50", "0:55", "1:00", "1:05"];
  return (
    <div className="flex h-[220px] flex-shrink-0 flex-col overflow-hidden rounded-lg border border-border/60 bg-card/30">
      {/* Toolbar */}
      <div className="flex h-10 items-center justify-between border-b border-border/60 px-3">
        <div className="flex items-center gap-1">
          <button className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"><Undo2 className="h-3.5 w-3.5" /></button>
          <button className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"><Redo2 className="h-3.5 w-3.5" /></button>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span><span className="text-foreground">00:00</span></span>
          <button className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20"><Play className="h-3 w-3 fill-current" /></button>
          <span>01:00</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-accent hover:text-foreground"><Volume2 className="h-3.5 w-3.5" /></button>
          <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-accent hover:text-foreground"><Maximize2 className="h-3.5 w-3.5" /></button>
          <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-accent hover:text-foreground"><ZoomOut className="h-3.5 w-3.5" /></button>
          <div className="h-1 w-20 rounded-full bg-muted/50"><div className="h-full w-1/3 rounded-full bg-foreground/60" /></div>
          <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-accent hover:text-foreground"><ZoomIn className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      {/* Timeline area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side icons */}
        <div className="flex w-10 flex-shrink-0 flex-col items-center gap-3 border-r border-border/60 py-2 pt-8 text-muted-foreground">
          <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-accent hover:text-foreground"><Undo2 className="h-3 w-3" /></button>
          <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-accent hover:text-foreground"><Redo2 className="h-3 w-3" /></button>
          <div className="flex-1" />
          <Video className="h-3.5 w-3.5" />
          <Volume2 className="h-3.5 w-3.5" />
          <Volume2 className="h-3.5 w-3.5" />
        </div>
        <div className="relative flex-1 overflow-x-auto scrollbar-hide">
          {/* Time ruler */}
          <div className="flex h-6 items-end border-b border-border/40 px-2 text-[10px] text-muted-foreground">
            {ticks.map((t) => (
              <div key={t} className="flex-1 border-l border-border/40 pl-1 first:border-l-0">{t}</div>
            ))}
          </div>
          {/* Playhead */}
          <div className="absolute left-4 top-0 bottom-0 z-10 w-px bg-aurora-orange">
            <div className="absolute -left-1 top-0 h-2 w-2 rotate-45 bg-aurora-orange" />
          </div>
          {/* Video clips track */}
          <div className="flex h-12 items-center gap-0.5 px-2 py-1">
            {shotClips.map((c, i) => (
              <div key={i} className="relative h-full overflow-hidden rounded border border-border/60 bg-muted" style={{ width: `${c.width}px` }}>
                <div className="flex h-full">
                  {Array.from({ length: Math.max(3, Math.floor(c.width / 36)) }).map((_, j) => (
                    <img key={j} src={c.src} alt="" className="h-full w-9 flex-shrink-0 object-cover opacity-90" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Empty middle track */}
          <div className="h-6 border-t border-border/40" />
          {/* Audio track */}
          <div className="flex h-7 items-center px-2">
            <div className="flex h-full w-full items-center gap-2 rounded bg-success/30 px-2 text-[11px] text-success">
              <Music2 className="h-3 w-3" />
              <span>背景音乐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
