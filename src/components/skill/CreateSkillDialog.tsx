import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronRight, Save, LayoutGrid, Eye, Code2, Plus, Mic, ArrowUp, CheckCircle2, MoreHorizontal, Send, ChevronDown, Check, Undo2, Redo2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SIDEBAR_ITEMS = [
  { id: "rules", label: "Skill调用规则", icon: InfoIcon, sub: "当开启多个 Skill 时，告诉 AI 在什么情况下应该调用这个 Skill。" },
  { id: "planning", label: "流程规划", icon: InfoIcon, sub: "告诉 AI 按什么顺序推进、步骤之间有什么依赖，以及应该怎样和用户交互。" },
  { id: "assets", label: "素材分析", icon: InfoIcon, sub: "告诉 AI 看完素材后要产出什么，比如提取分镜、整理人物描述，或做截帧这类基础处理。" },
  { id: "storyboard", label: "故事板设计", icon: InfoIcon, sub: "告诉 AI 怎么写故事板，包括要包含哪些元素、怎么设计镜头，以及如何描述画面和镜头语言。" },
  { id: "media", label: "媒体生成", icon: InfoIcon, sub: "告诉 AI 怎么生成图片、视频和音频，包括使用哪个模型、参考哪些素材，以及输出设置怎么定。" },
  { id: "prompts", label: "提示词写法", icon: InfoIcon, sub: "告诉 AI 生成媒体时提示词该怎么写，包括图片提示词、视频提示词，以及提升效果的小技巧。" },
  { id: "editing", label: "视频剪辑", icon: InfoIcon, sub: "告诉 AI 剪辑时要注意什么，包括怎么裁剪素材、怎样对齐音视频，以及如何保证成片连贯。" },
];

function InfoIcon() {
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] font-bold">
      i
    </div>
  );
}

function ChoiceCard({ onSelect, currentSelection }: { onSelect: (idx: number) => void, currentSelection: number | null }) {
    const options = [
      { title: "指定游戏类型", desc: "告诉我是 RPG、FPS、MOBA 还是其他类型，我来针对性调整视觉风格和节奏规则" },
      { title: "调整视频模型", desc: "换用其他视频生成模型（如 Seedance 2.5），或指定分辨率、时长等参数" },
      { title: "加入角色声音一致性", desc: "为角色添加 key_element_audio（声音参考绑定），保证多镜头中同一角色对白音色一致" },
      { title: "补充用户提供素材的处理流程", desc: "详细规定当用户上传官方截图、立绘或已有宣传片时，如何分析并融入生成工作流" }
    ];

  return (
    <div className="mt-4 rounded-[20px] bg-[var(--color-card)] border border-[var(--color-border)] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
      <div className="p-8 space-y-6">
        <h4 className="text-[17px] font-semibold text-[var(--color-foreground)] tracking-tight">你想优先完善哪个方向？</h4>
        
        <div className="border-t border-dashed border-[var(--color-border)] pt-6 space-y-8">
          {options.map((option, idx) => {
            const isSelected = currentSelection === idx;
            return (
              <div 
                key={idx} 
                className="flex gap-4 items-start group cursor-pointer"
                onClick={() => onSelect(idx)}
              >
                <div className={cn(
                  "mt-1 h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                  isSelected 
                    ? "bg-[#E1B166] text-black shadow-[0_0_15px_rgba(225,177,102,0.5)]" 
                    : "bg-[var(--color-secondary)] text-transparent border border-[var(--color-border)] group-hover:border-[var(--color-muted-foreground)]"
                )}>
                  <Check className="h-3 w-3" strokeWidth={4} />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className={cn(
                    "text-[15px] font-semibold transition-colors tracking-tight",
                    isSelected ? "text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]"
                  )}>
                    {option.title}
                  </div>
                  <div className={cn(
                    "text-[14px] leading-relaxed font-normal transition-colors",
                    isSelected ? "text-[var(--color-muted-foreground)]" : "text-[var(--color-muted-foreground)]/40 group-hover:text-[var(--color-muted-foreground)]/60"
                  )}>
                    {option.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Other Input Field */}
        <div 
          className="flex items-center gap-4 group cursor-pointer pt-2"
          onClick={() => onSelect(4)}
        >
          <div className={cn(
            "h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
            currentSelection === 4 
              ? "bg-[#E1B166] text-black shadow-[0_0_15px_rgba(225,177,102,0.5)]" 
              : "bg-[var(--color-secondary)] text-transparent border border-[var(--color-border)] group-hover:border-[var(--color-muted-foreground)]"
          )}>
            <Check className="h-3 w-3" strokeWidth={4} />
          </div>
          <div className={cn(
            "flex-1 rounded-[12px] bg-white/[0.02] border px-4 py-3 transition-all",
            currentSelection === 4 ? "border-white/20 bg-white/[0.04]" : "border-white/[0.08] group-hover:border-white/15"
          )}>
            <input 
              type="text"
              placeholder="其它"
              className="bg-transparent border-none outline-none text-[14px] font-medium text-white/90 w-full placeholder:text-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      {/* Send Button Row */}
      <div className="flex justify-end px-8 pb-8">
        <button className="h-[44px] px-9 rounded-full bg-[var(--color-secondary)] text-[#E1B166] font-semibold text-[15px] hover:bg-[var(--color-accent)] hover:text-[#f0c07d] transition-all shadow-xl active:scale-[0.98]">
          发送
        </button>
      </div>
    </div>
  );

}

function DiffField({ label, value, index, currentIndex, isTextarea = false }: { 
  label?: string; 
  value: string; 
  index: number; 
  currentIndex: number;
  isTextarea?: boolean;
}) {
  const isActive = index === currentIndex;
  
  return (
    <div className={cn(
      "space-y-2 relative transition-all duration-300",
      isActive ? "z-20 scale-[1.01]" : "opacity-80"
    )}>
      {label && <label className="text-xs font-medium text-muted-foreground">{label}</label>}
      <div className="relative group">
        <div className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl">
          {/* Old Content Placeholder (Red) */}
          <div className="bg-red-950/20 border-b border-red-900/10 px-4 py-3 min-h-[40px] flex items-center">
            <div className="h-4 w-full bg-red-900/10 rounded-sm animate-pulse" />
          </div>
          
          {/* New Content (Green) */}
          <div className="bg-green-950/20 px-4 py-5 relative">
            <div className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-foreground)]/90 font-light",
              isTextarea ? "min-h-[100px]" : ""
            )}>
              {value}
            </div>
            
            {/* Char count for rules */}
            {label === "Skill调用规则" && (
              <span className="absolute bottom-3 right-3 text-[10px] text-green-500/40">71/200</span>
            )}
          </div>

          {/* Individual Action Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-background)]/40 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2 text-[11px] text-[var(--color-foreground)]/40 font-medium">
              <ChevronDown className="h-3 w-3 rotate-180 opacity-40" />
              <span>第 1 / 5 处</span>
              <ChevronDown className="h-3 w-3 opacity-40" />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-[var(--color-secondary)] text-[11px] text-[var(--color-foreground)]/60 transition group">
                <Undo2 className="h-3 w-3 text-[var(--color-foreground)]/20 group-hover:text-[var(--color-foreground)] transition" />
                <span>撤销</span>
                <span className="opacity-40 ml-0.5">⌘B</span>
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 hover:bg-green-500/20 text-[11px] text-green-500 transition border border-green-500/20 group">
                <Check className="h-3 w-3 group-hover:scale-110 transition" />
                <span>保留</span>
                <span className="opacity-60 ml-0.5">⌘Y</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GAME_SKILL_MARKDOWN = `skill_name: "RPG 游戏宣发视频"

skill_description: "适用于角色扮演游戏（RPG）的新游预告、版本更新、角色展示与活动推广；突出世界观、角色成长、职业战斗和探索氛围，并清晰传达核心玩法与上线信息。"

<planner>

**整体流程与阶段逻辑：**

1. 与用户确认宣发目标（新游预告 / 版本更新 / 角色展示 / 活动促销等）、核心受众、视频时长与比例，写入 Final_Video_Spec.md（标题、类型、宣发目标、画面比例、时长、视觉风格、输出语言）→ **text_editor**。

2. 若用户已提供游戏截图、原画、角色立绘、UI 素材或品牌规范文档，先交由 **resource_prepare_and_analyze** 分析提炼，生成可复用的视觉风格摘要与素材清单，输出 \`semantic_output\` 供后续步骤引用。

3. 根据宣发目标设计分镜：明确关键视觉元素（英雄/角色、场景、UI 高光、Logo）、镜头节奏与情绪弧线、配乐风格和 VO 策略 → **storyboard_designer**。

4. 依次生成：关键元素形象图（角色/场景）→ 各分镜视频 → 配乐/VO → **media_generator**。

5. 完成所有媒体资产后，按分镜剪辑合成、对齐音画节奏 → **video_assembler**。

**暂停节点：** 每个主要里程碑后（规格确认、分镜完成、关键元素图完成、全部视频片段完成）暂停，等待用户确认后再继续。

**用户素材处理：** 若用户提供游戏内截图或品牌视觉素材，优先将其绑定到对应分镜元素，不重复生成已有素材。

</planner>

<multimodal_analyze_tool>

**素材分析重点：**

- 游戏截图 / 原画 / 角色立绘：提炼主色调、光影风格（写实 / 卡通 / 赛博朋克等）、角色外观特征（服装、武器、配色），输出结构化 \`semantic_output\` 供分镜描述和生成提示词复用。

- 品牌规范文档 / 游戏官方物料：提取字体风格、Logo 使用规则、禁用色、品牌关键词，写入可编辑的项目文档，作为全局视觉约束。

- 已有宣发视频：分析剪辑节奏、转场风格、BGM 类型，摘要输出，帮助新视频保持品牌一致性。

原始上传素材保持只读；所有整理后的风格摘要和素材清单需创建为独立的可编辑项目文档。

</multimodal_analyze_tool>

<storyboard_designer>

**关键元素设计**

- **角色/英雄（element character）：** 注明外观特征、标志性技能动作、情绪状态；若同一角色有多个皮肤或形态，逐一描述。

- **场景（element scene）：** 描述光影、氛围、标志性地标；区分战斗场景、过场场景、UI 展示场景。

- **Logo / 游戏标题（key_element）：** 记录官方字体、颜色、出现时机和动效要求。

**分镜设计原则**

- **节奏先行：** 宣发视频通常在前 3 秒内需建立视觉钩子（爆炸感、悬念感或情绪共鸣），以保持受众注意力。

- **镜头设计：** 每个分镜须包含：

  - **场景：** 引用对应 element scene ID。

  - **叙事节拍：** 角色动作、技能特效、情绪走向；对白或 VO 台词（若有）写明原文。

  - **摄影语言：** 景别（特写 / 中景 / 全景）、机位（低角度仰拍增强压迫感、航拍俯瞰展示世界观）、运镜（快速推进、旋转、锁定）。

- **信息层次：** 关键信息（游戏名、版本、上线时间）安排在视觉节奏稳定段或结尾，避免在高速剪辑中淹没。

- **优先较长镜头配合内部剪辑：** 每个生成单元尽量设计 8–15s 并包含内部节拍变化，减少碎片化镜头数量。

**音频轨道设计**

- **BGM（music）：** 结合游戏类型选择风格（史诗管弦 / 电子 / 战斗金属等）；高潮节点与视觉高潮对齐；通常贯穿全片。

- **旁白 VO（narration）：** 如有品牌旁白 or 版本更新说明，规划 \`narration_speaker_profile\`（如"低沉有力男声"/"干净清晰女声"）和对应台词。

- **音效层（SFX）：** 关键技能、爆炸、UI 音效在分镜描述中注明，由视频生成阶段同步处理。

</storyboard_designer>

<media_generator>

**关键元素图生成**

- 使用 **TextToImage** 生成角色/场景参考图；同一角色的多个皮肤使用 **ImageToImage** 保证一致性。

- 角色参考图采用横向双图布局：左侧半身/面部特写（锁定脸部、配色、特征），右侧全身（服装、武器、轮廓）。

**分镜视频生成**

- 优先使用 **MultiModalToVideo**（推荐模型：**Seedance 2.0**，720p），以元素图作为视觉参考。

- 每个分镜引用输入：

  1. 对应角色/场景的 **element 图像**；

  2. 若与上一分镜有极强视觉连贯性需求，可附加上一镜头视频作为 **reference_video**；其余情况不附加，避免过度约束运镜创意。

- 高强度动作或纯场景空镜可考虑 **TextToVideo** 辅助生成，但角色一致性镜头仍以 MultiModalToVideo 为主。

**音频生成**

- BGM：使用 **text_to_instrumental**，按游戏风格关键词描述。

- VO 旁白：使用 **TextToSpeech**（中文默认 Seed Audio 1.0，英文/多语言默认 ElevenLabs）。

**Asset Binding Contract**

- 遵循当前 \`manage_item_assets\` 合约，使用分镜中实际目标 ID 进行绑定；不在 Skill 中额外定义 ID 模板。

- 每次绑定前调用 \`query_assets_info\` 确认现有绑定状态，执行 \`manage_item_assets\` 时保留完整 \`asset_bindings\` 数组，完成后重新查询验证。

- 若一个资产承担多种用途，保留所有适用的绑定条目。

</media_generator>

<write_the_prompt>

**全局优先规则：** 中文界面或用户使用中文交互时，提示词正文用中文书写；台词/旁白文字跟随 Final_Video_Spec 中规定的输出语言。

**图像提示词（TextToImage / ImageToImage）**

- 用导演+美术指导语言描述：主体外观 + 动作/姿态 + 环境/背景 + 光效/色调 + 构图。

- 游戏宣发图须强调：游戏视觉风格标签（如"写实战争风"/"奇幻卡通渲染"）、主光方向与对比度、标志性道具/特效细节。

- 避免描述不可见的心理活动；只写镜头能捕捉到的视觉信息。

**视频提示词（MultiModalToVideo / Seedance 2.0）**

- 参考图使用占位符 \`<<<image_1>>>\`、\`<<<image_2>>>\` 逐一标注对应角色/场景。

- 运动描述顺序：**镜头运动**（推 / 拉 / 旋转 / 锁定）→ **主体动作**（技能释放 / 奔跑 / 特效爆发）→ **环境动态**（烟尘 / 光效 / 粒子）→ **音频备注**（若有对白或 SFX 注记）。

- 高能宣发镜头常用词汇：快速剪辑节奏感、电影级光效、特效粒子爆发、史诗感镜头语言。

- 固定负向词：\`no subtitles\`（字幕在后期处理）、\`no music\`（BGM 走独立音轨）；若 VO 在独立音轨，不在视频提示词中重复完整旁白文本。

</write_the_prompt>

<video_assembler>

**剪辑节奏**

- 宣发视频整体节奏偏快：动作/高能段落单镜不超过 3s；叙事/情绪段落可放宽至 5–8s。

- 片头 3 秒优先安排视觉冲击力最强的镜头（技能特效、世界观展示或悬念画面）。

- 游戏标题 / Logo 出现时机：通常在高潮节点后或视频结尾，配合 BGM 节拍落点。

**转场偏好**

- 动作场景：硬切为主，保持节奏紧张感。

- 场景/章节切换：闪白、速度模糊（motion blur wipe）或黑场渐入/渐出。

- 避免过多花哨转场效果，以免分散对游戏内容的注意力。

**音画同步**

- BGM 高潮节拍与视觉高潮严格对齐。

- VO 旁白与对应视觉信息同步展示；信息密度高时适当延长镜头停留时间。

- 结尾留 1–2s 静帧展示 Logo + 上线信息，淡出 BGM。

</video_assembler>`;


export function CreateSkillDialog({ open, onOpenChange }: CreateSkillDialogProps) {
  const [viewMode, setViewMode] = React.useState<"preview" | "markdown">("preview");
  const [markdownContent, setMarkdownContent] = React.useState<string>(`## 做什么
(一句话说明用途)例:把一句话故事想法做成一条短漫剧成讲

## 需要什么输入
(最少提供什么)例:一个想法,可选画风、时长、主角设定

## 怎么做
(写你在意的环节和要求,不用写全)例:脚本要反转多,画风固定成韩漫

## 产出什么
(最终交付什么)例:成片,附脚本和分镜

## 什么时候问问你
(什么情况下停下来问问你)例:拿不准题材或风格时间一次,其余自己定`);

  const [isSaving, setIsSaving] = React.useState(false);
  const [skillName, setSkillName] = React.useState("");
  const [skillIntro, setSkillIntro] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  
  const tags = ["专业影视", "专业营销", "产品推广", "短剧漫剧", "创意发散", "特效玩法", "社媒热点", "视频", "图片"];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else if (selectedTags.length < 3) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onOpenChange(false);
      window.dispatchEvent(new CustomEvent('skill-saved', { 
        detail: { title: skillName || "新技能", id: "skill-" + Date.now() } 
      }));
    }, 1000);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-all duration-300" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 h-[92vh] w-[96vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white text-black shadow-2xl focus:outline-none flex flex-col">
          
          {/* Header */}
          <div className="flex h-[72px] shrink-0 items-center justify-between px-8 border-b border-[#F0F0F0]">
            <h2 className="text-[18px] font-semibold text-[#1A1A1A]">创建技能</h2>
            <button 
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 text-[#999999] hover:bg-[#F5F5F5] transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Pane: Directory */}
            <div className="w-[200px] shrink-0 border-r border-[#F0F0F0] bg-[#FAFAFA] p-6 flex flex-col gap-6">
              <div className="space-y-4">
                <div className="text-[13px] font-medium text-[#999999]">技能内容 *</div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[12px] text-[#BFBFBF]">目录</span>
                    <div className="flex gap-2 text-[#BFBFBF]">
                      <RotateCcw className="h-3.5 w-3.5 cursor-pointer hover:text-[#999999]" />
                      <Plus className="h-3.5 w-3.5 cursor-pointer hover:text-[#999999]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] text-[#1A1A1A] font-medium">
                    <div className="h-1 w-1 rounded-full bg-[#1A1A1A]" />
                    <span>SKILL.md</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Pane: Editor */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="text-[13px] text-[#BFBFBF] mb-4">在此输入Skill内容</div>
                  <textarea 
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    className="w-full min-h-[600px] text-[15px] leading-[1.8] text-[#333333] border-none focus:ring-0 resize-none p-0 placeholder:text-[#BFBFBF]"
                    placeholder="输入详细的 Skill 指令..."
                  />
                </div>
              </div>
            </div>

            {/* Right Pane: Config */}
            <div className="w-[420px] shrink-0 border-l border-[#F0F0F0] overflow-y-auto bg-white p-8 scrollbar-hide flex flex-col">
              <div className="flex-1 space-y-8">
                {/* Name */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[13px] font-medium text-[#1A1A1A]">技能名称 *</label>
                  </div>
                  <div className="relative">
                    <input 
                      type="text"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value.slice(0, 20))}
                      placeholder="给你的技能起个名字"
                      className="w-full h-[52px] px-5 rounded-[12px] bg-[#F9F9F9] border-none text-[14px] focus:ring-1 focus:ring-black/5 placeholder:text-[#BFBFBF]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#BFBFBF]">{skillName.length} / 20</span>
                  </div>
                </div>

                {/* Intro */}
                <div className="space-y-3">
                  <label className="text-[13px] font-medium text-[#1A1A1A]">一句话介绍 *</label>
                  <div className="relative">
                    <textarea 
                      value={skillIntro}
                      onChange={(e) => setSkillIntro(e.target.value.slice(0, 50))}
                      placeholder="简短描述技能能做什么"
                      className="w-full h-[100px] p-5 rounded-[12px] bg-[#F9F9F9] border-none text-[14px] focus:ring-1 focus:ring-black/5 resize-none placeholder:text-[#BFBFBF]"
                    />
                    <span className="absolute right-4 bottom-4 text-[12px] text-[#BFBFBF]">{skillIntro.length} / 50</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <label className="text-[13px] font-medium text-[#1A1A1A]">选择符合这个技能的类型标签 ({selectedTags.length}/3)</label>
                  <div className="flex flex-wrap gap-2.5">
                    {tags.map(tag => (
                      <button 
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "px-5 py-2.5 rounded-full text-[13px] transition-all border",
                          selectedTags.includes(tag)
                            ? "bg-black text-white border-black"
                            : "bg-white text-[#666666] border-[#F0F0F0] hover:border-[#CCCCCC]"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cover Upload */}
                <div className="space-y-3">
                  <label className="text-[13px] font-medium text-[#1A1A1A]">技能封面（建议比例16:9）</label>
                  <div className="aspect-video rounded-[16px] bg-[#F9F9F9] border border-dashed border-[#E5E5E5] flex items-center justify-center cursor-pointer hover:bg-[#F5F5F5] transition-colors group">
                    <Plus className="h-6 w-6 text-[#BFBFBF] group-hover:text-[#999999]" />
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  <label className="text-[13px] font-medium text-[#1A1A1A]">更多成果示意图或视频（建议比例16:9）</label>
                  <div className="aspect-video rounded-[16px] bg-[#F9F9F9] border border-dashed border-[#E5E5E5] flex items-center justify-center cursor-pointer hover:bg-[#F5F5F5] transition-colors group">
                    <Plus className="h-6 w-6 text-[#BFBFBF] group-hover:text-[#999999]" />
                  </div>
                </div>

                {/* Prompt Guide */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[13px] font-medium text-[#1A1A1A]">提示词指引</label>
                    <div className="h-3.5 w-3.5 rounded-full border border-[#BFBFBF] flex items-center justify-center text-[9px] text-[#BFBFBF] font-bold">i</div>
                  </div>
                  <div className="relative">
                    <textarea 
                      placeholder="简要描述填写什么提示词可以让你的技能发挥得更好"
                      className="w-full h-[80px] p-5 rounded-[12px] bg-[#F9F9F9] border-none text-[13px] focus:ring-1 focus:ring-black/5 resize-none placeholder:text-[#BFBFBF]"
                    />
                    <span className="absolute right-4 bottom-4 text-[12px] text-[#BFBFBF]">0 / 50</span>
                  </div>
                </div>

                {/* Public Toggle */}
                <div className="flex items-center gap-2.5 pt-2">
                  <div className="h-5 w-5 rounded-full border border-[#E5E5E5] flex items-center justify-center cursor-pointer">
                    <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                  </div>
                  <span className="text-[13px] text-[#666666]">允许官方公开我的技能</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-8 mt-auto flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={cn(
                    "w-[120px] h-[48px] rounded-full bg-[#F5F5F5] text-[#CCCCCC] font-medium text-[15px] transition-all",
                    skillName && skillIntro && "bg-black text-white hover:bg-black/90 active:scale-95"
                  )}
                >
                  {isSaving ? "保存中..." : "保存并使用"}
                </button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

