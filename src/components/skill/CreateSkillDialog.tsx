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
    <div className="mt-4 rounded-[20px] bg-[#1a1a1c] border border-white/[0.03] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
      <div className="p-8 space-y-6">
        <h4 className="text-[17px] font-semibold text-white/95 tracking-tight">你想优先完善哪个方向？</h4>
        
        <div className="border-t border-dashed border-white/10 pt-6 space-y-8">
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
                    : "bg-white/[0.03] text-transparent border border-white/[0.08] group-hover:border-white/20"
                )}>
                  <Check className="h-3 w-3" strokeWidth={4} />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className={cn(
                    "text-[15px] font-semibold transition-colors tracking-tight",
                    isSelected ? "text-white/95" : "text-white/70 group-hover:text-white/90"
                  )}>
                    {option.title}
                  </div>
                  <div className={cn(
                    "text-[14px] leading-relaxed font-normal transition-colors",
                    isSelected ? "text-white/60" : "text-white/30 group-hover:text-white/40"
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
              : "bg-white/[0.03] text-transparent border border-white/[0.08] group-hover:border-white/20"
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
        <button className="h-[44px] px-9 rounded-full bg-[#2a2a2c] text-[#E1B166] font-semibold text-[15px] hover:bg-[#323235] hover:text-[#f0c07d] transition-all shadow-xl active:scale-[0.98]">
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
        <div className="rounded-xl overflow-hidden border border-white/5 bg-[#141417] shadow-xl">
          {/* Old Content Placeholder (Red) */}
          <div className="bg-red-950/20 border-b border-red-900/10 px-4 py-3 min-h-[40px] flex items-center">
            <div className="h-4 w-full bg-red-900/10 rounded-sm animate-pulse" />
          </div>
          
          {/* New Content (Green) */}
          <div className="bg-green-950/20 px-4 py-5 relative">
            <div className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap text-white/90 font-light",
              isTextarea ? "min-h-[100px]" : ""
            )}>
              {value}
            </div>
            
            {/* Char count for rules */}
            {label === "Skill调用规则" && (
              <span className="absolute bottom-3 right-3 text-[10px] text-green-500/40">66/200</span>
            )}
          </div>

          {/* Individual Action Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-t border-white/5">
            <div className="flex items-center gap-2 text-[11px] text-white/40 font-medium">
              <ChevronDown className="h-3 w-3 rotate-180 opacity-40" />
              <span>第 {index} / 8 处</span>
              <ChevronDown className="h-3 w-3 opacity-40" />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-white/5 text-[11px] text-white/60 transition group">
                <Undo2 className="h-3 w-3 text-white/20 group-hover:text-white transition" />
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

const GAME_SKILL_MARKDOWN = `skill_name: "游戏宣发视频"

skill_description: "适用于游戏宣传推广视频的制作，包括新游预告、版本更新宣传、角色/英雄展示、活动推广等场景；以强视觉冲击、氛围感和信息传达为核心目标。"

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
  const [markdownContent, setMarkdownContent] = React.useState<string>("");

  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant', content: string | React.ReactNode }>>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = React.useState(1);
  const [acceptedChanges, setAcceptedChanges] = React.useState<Set<number>>(new Set());
  const [rejectedChanges, setRejectedChanges] = React.useState<Set<number>>(new Set());
  const [selectedDirection, setSelectedDirection] = React.useState<number | null>(null);

  const handleSelect = (idx: number) => {
    setSelectedDirection(idx);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = { role: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    
    if (inputValue.includes("游戏宣发")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: 'GAME_SKILL_FLOW' }]);
        setShowSuggestions(true);
        setMarkdownContent(GAME_SKILL_MARKDOWN);
      }, 600);
    }
    
    setInputValue("");
  };

  
  const gameSkillSuggestions = {
    name: "游戏宣发视频",
    rules: "适用于游戏宣传推广视频的制作，包括新游预告、版本更新宣传、角色/英雄展示、活动推广等场景；以强视觉冲击、氛围感和信息传达为核心目标。",
    planning: `**整体流程与阶段逻辑：**\n\n1. 与用户确认宣发目标（新游预告 / 版本更新 / 角色展示 / 活动促销等）、核心受众、视频时长与比例，写入 Final_Video_Spec.md（标题、类型、宣发目标、画面比例、时长、视觉风格、输出语言）→ **text_editor**。\n\n2. 若用户已提供游戏截图、原画、角色立绘、UI 素材或品牌规范文档，先交由 **resource_prepare_and_analyze** 分析提炼，生成可复用的视觉风格摘要与素材清单，输出 \`semantic_output\` 供后续步骤引用。\n\n3. 根据宣发目标设计分镜：明确关键视觉元素（英雄/角色、场景、UI 高光、Logo）、镜头节奏与情绪弧线、配乐风格和 VO 策略 → **storyboard_designer**。\n\n4. 依次生成：关键元素形象图（角色/场景）→ 各分镜视频 → 配乐/VO → **media_generator**。\n\n5. 完成所有媒体资产后，按分镜剪辑合成、对齐音画节奏 → **video_assembler**。\n\n**暂停节点：** 每个主要里程碑后（规格确认、分镜完成、关键元素图完成、全部视频片段完成）暂停，等待用户确认后再继续。\n\n**用户素材处理：** 若用户提供游戏内截图或品牌视觉素材，优先将其绑定到对应分镜元素，不重复生成已有素材。`,
    assets: `**素材分析重点：**\n\n- 游戏截图 / 原画 / 角色立绘：提炼主色调、光影风格（写实 / 卡通 / 赛博朋克等）、角色外观特征（服装、武器、配色），输出结构化 \`semantic_output\` 供分镜描述 and 生成提示词复用。\n\n- 品牌规范文档 / 游戏官方物料：提取字体风格、Logo 使用规则、禁用色、品牌关键词，写入可编辑的项目文档，作为全局视觉约束。\n\n- 已有宣发视频：分析剪辑节奏、转场风格、BGM 类型，摘要输出，帮助新视频保持品牌一致性。\n\n原始上传素材保持只读；所有整理后的风格摘要和素材清单需创建为独立的可编辑项目文档。`,
    storyboard: `**关键元素设计**\n\n- **角色/英雄（element character）：** 注明外观特征、标志性技能动作、情绪状态；若同一角色有多个皮肤或形态，逐一描述。\n\n- **场景（element scene）：** 描述光影、氛围、标志性地标；区分战斗场景、过场场景、UI 展示场景。\n\n- **Logo / 游戏标题（key_element）：** 记录官方字体、颜色、出现时机和动效要求。\n\n**分镜设计原则**\n\n- **节奏先行：** 宣发视频通常在前 3 秒内需建立视觉钩子（爆炸感、悬念感或情绪共鸣），以保持受众注意力。\n\n- **镜头设计：** 每个分镜须包含：\n\n - **场景：** 引用对应 element scene ID。\n\n - **叙事节拍：** 角色动作、技能特效、情绪走向；对白或 VO 台词（若有）写明原文。\n\n - **摄影语言：** 景别（特写 / 中景 / 全景）、机位（低角度仰拍增强压迫感、航拍俯瞰展示世界观）、运镜（快速推进、旋转、锁定）。\n\n- **信息层次：** 关键信息（游戏名、版本、上线时间）安排在视觉节奏稳定段或结尾，避免在高速剪辑中淹没。\n\n- **优先较长镜头配合内部剪辑：** 每个生成单元尽量设计 8–15s 并包含内部节拍变化，减少碎片化镜头数量。\n\n**音频轨道设计**\n\n- **BGM（music）：** 结合游戏类型选择风格（史诗管弦 / 电子 / 战斗金属等）；高潮节点与视觉高潮对齐；通常贯穿全片。\n\n- **旁白 VO（narration）：** 如有品牌旁白或版本更新说明，规划 \`narration_speaker_profile\`（如"低沉有力男声"/"干净清晰女声"）和对应台词。`,
    media: `**关键元素图生成**\n\n- 使用 **TextToImage** 生成角色/场景参考图；同一角色的多个皮肤使用 **ImageToImage** 保证一致性。\n\n- 角色参考图采用横向双图布局：左侧半身/面部特写（锁定脸部、配色、特征），右侧全身（服装、武器、轮廓）。\n\n**分镜视频生成**\n\n- 优先使用 **MultiModalToVideo**（推荐模型：**Seedance 2.0**，720p），以元素图作为视觉参考。\n\n- 每个分镜引用输入：\n\n 1. 对应角色/场景的 **element 图像**；\n\n 2. 若与上一分镜有极强视觉连贯性需求，可附加上一镜头视频作为 **reference_video**；其余情况不附加，避免过度约束运镜创意。\n\n- 高强度动作或纯场景空镜可考虑 **TextToVideo** 辅助生成，但角色一致性镜头仍以 MultiModalToVideo 为主。\n\n**音频生成**\n\n- BGM：使用 **text_to_instrumental**，按游戏风格关键词描述。\n\n- VO 旁白：使用 **TextToSpeech**（中文默认 Seed Audio 1.0，英文/多语言默认 ElevenLabs）。\n\n**Asset Binding Contract**\n\n- 遵循当前 \`manage_item_assets\` 合约，使用分镜中实际目标 ID 进行绑定；不在 Skill 中额外定义 ID 模板。\n\n- 每次绑定前调用 \`query_assets_info\` 确认现有绑定状态，执行 \`manage_item_assets\` 时保留完整 \`asset_bindings\` 数组，完成后重新查询验证。`,
    prompts: `**全局优先规则：** 中文界面或用户使用中文交互时，提示词正文用中文书写；台词/旁白文字跟随 Final_Video_Spec 中规定的输出语言。\n\n**图像提示词（TextToImage / ImageToImage）**\n\n- 用导演+美术指导语言描述：主体外观 + 动作/姿态 + 环境/背景 + 光效/色调 + 构图。\n\n- 游戏宣发图须强调：游戏视觉风格标签（如"写实战争风"/"奇幻卡通渲染\"）、主光方向与对比度、标志性道具/特效细节。\n\n- 避免描述不可见的心理活动；只写镜头能捕捉到的视觉信息。\n\n**视频提示词（MultiModalToVideo / Seedance 2.0）**\n\n- 参考图使用占位符 \`<<<image_1>>>\`、\`<<<image_2>>>\` 逐一标注对应角色/场景。\n\n- 运动描述顺序：**镜头运动**（推 / 拉 / 旋转 / 锁定）→ **主体动作**（技能释放 / 奔跑 / 特效爆发）→ **环境动态**（烟尘 / 光效 / 粒子）→ **音频备注**（若有对白或 SFX 注记）。`,
    editing: `**剪辑节奏**\n\n- 宣发视频整体节奏偏快：动作/高能段落单镜不超过 3s；叙事/情绪段落可放宽至 5–8s。\n\n- 片头 3 秒优先安排视觉冲击力最强的镜头（技能特效、世界观展示或悬念画面）。\n\n- 游戏标题 / Logo 出现时机：通常在高潮节点后或视频结尾，配合 BGM 节拍落点。\n\n**转场偏好**\n\n- 动作场景：硬切为主，保持节奏紧张感。\n\n- 场景/章节切换：闪白、速度模糊（motion blur wipe）或黑场渐入/渐出。\n\n- 避免过多花哨转场效果，以免分散对游戏内容的注意力。\n\n**音画同步**\n\n- BGM 高潮节拍与视觉高潮严格对齐。\n\n- VO 旁白与对应视觉信息同步展示；信息密度高时适当延长镜头停留时间。\n\n- 结尾留 1–2s 静帧展示 Logo + 上线信息，淡出 BGM。`
  };

  const [selectedDirection, setSelectedDirection] = React.useState<number | null>(0);

  // We use a counter to force a re-render of the messages array when state changes
  const [updateCounter, setUpdateCounter] = React.useState(0);
  
  const handleSelect = (idx: number) => {
    setSelectedDirection(idx);
    setUpdateCounter(prev => prev + 1);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue("");

    // Simulate system response if it's the game skill request
    if (userMsg.includes("游戏宣发")) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'GAME_SKILL_FLOW'
        }]);
      }, 600);
      setTimeout(() => {
        setShowSuggestions(true);
        setCurrentSuggestionIndex(1);
      }, 1500);
    }
  };



  const handleNextSuggestion = () => {
    setCurrentSuggestionIndex(prev => (prev < 8 ? prev + 1 : 1));
  };

  const handlePrevSuggestion = () => {
    setCurrentSuggestionIndex(prev => (prev > 1 ? prev - 1 : 8));
  };

  const handleAcceptAll = () => {
    setShowSuggestions(false);
    // In a real app, we would update the actual form values here
  };

  const handleRejectAll = () => {
    setShowSuggestions(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-all duration-300" />
        <DialogPrimitive.Content className="fixed inset-[30px] z-50 flex overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0c] text-foreground shadow-2xl focus:outline-none">
          
          {/* Main Layout: Left Sidebar & Right Chat Panel */}
          <div className="flex w-full overflow-hidden">
            
            {/* Left Scrollable Settings */}
            <div className="flex flex-1 flex-col overflow-y-auto scrollbar-hide border-r border-white/5">
              {/* Header */}
              <div className="flex h-16 items-center justify-between border-b border-white/5 px-6 shrink-0 bg-[#0f0f12]/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LayoutGrid className="h-4 w-4" />
                  <span>我的Skill</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className={cn("font-medium", showSuggestions ? "text-foreground" : "text-muted-foreground")}>
                    {showSuggestions ? "游戏宣发视频" : "未命名Skill"}
                  </span>
                </div>
                <button className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium border border-white/10 hover:bg-white/10 transition group">
                  <Save className="h-4 w-4 text-white/40 group-hover:text-white transition" />
                  保存
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 space-y-10">
                {/* Diff Controls & View Switcher */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
                      <button 
                        onClick={() => setViewMode("preview")}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition",
                          viewMode === "preview" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        预览
                      </button>
                      <button 
                        onClick={() => setViewMode("markdown")}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition",
                          viewMode === "markdown" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        Markdown
                      </button>
                    </div>

                    {showSuggestions && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-4 rounded-sm bg-red-950/40 border border-red-900/20" />
                          <span className="text-xs text-red-500/80">修改前</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-4 rounded-sm bg-green-950/40 border border-green-900/20" />
                          <span className="text-xs text-green-500/80">修改后</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 border-l border-white/10">
                          <button className="p-1 text-white/20 hover:text-white/60 transition"><Undo2 className="h-4 w-4" /></button>
                          <button className="p-1 text-white/20 hover:text-white/60 transition"><Redo2 className="h-4 w-4" /></button>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/60 cursor-pointer hover:bg-white/10 transition group">
                            <ChevronDown onClick={handlePrevSuggestion} className="h-3 w-3 rotate-180 opacity-40 hover:opacity-100 transition" />
                            <span>第 {currentSuggestionIndex} / 8 处</span>
                            <ChevronDown onClick={handleNextSuggestion} className="h-3 w-3 opacity-40 hover:opacity-100 transition" />
                          </div>
                          <button 
                            onClick={handleRejectAll}
                            className="px-3 py-1.5 rounded-lg bg-white/5 text-xs hover:bg-white/10 transition"
                          >
                            全部撤销
                          </button>
                          <button 
                            onClick={handleAcceptAll}
                            className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-xs hover:bg-green-500/20 transition border border-green-500/20"
                          >
                            全部保留
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Sections / Markdown View */}
                {viewMode === "markdown" ? (
                  <div className="flex-1 p-8">
                    <div className="rounded-2xl border border-white/5 bg-[#141417] p-8 min-h-[800px] shadow-2xl relative overflow-hidden group">
                      {/* Gradient overlay to simulate terminal/code-editor feel */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                      
                      {markdownContent ? (
                        <div className="relative font-mono text-[13.5px] leading-[1.8] text-white/80 whitespace-pre-wrap selection:bg-[#E1B166]/20">
                          {markdownContent}
                        </div>
                      ) : (
                        <div className="relative h-full flex flex-col items-center justify-center text-center space-y-4 pt-40">
                          <div className="h-16 w-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                            <Code2 className="h-8 w-8 text-white/10" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-white/40">暂无 Markdown 数据</p>
                            <p className="text-xs text-white/20 max-w-[280px]">预览模式下有数据后，系统会自动将数据整理为 Markdown 配置</p>
                          </div>
                        </div>
                      )}

                      {/* Floating Indicator */}
                      {markdownContent && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                          <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Read Only</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (

                  <>
                    {SIDEBAR_ITEMS.map((item, sectionIdx) => {
                      const getSuggestion = () => {
                        switch(item.id) {
                          case 'rules': return { name: gameSkillSuggestions.name, rules: gameSkillSuggestions.rules };
                          case 'planning': return gameSkillSuggestions.planning;
                          case 'assets': return gameSkillSuggestions.assets;
                          case 'storyboard': return gameSkillSuggestions.storyboard;
                          case 'media': return gameSkillSuggestions.media;
                          case 'prompts': return gameSkillSuggestions.prompts;
                          case 'editing': return gameSkillSuggestions.editing;
                          default: return null;
                        }
                      };

                      const suggestion = getSuggestion();
                      const isRules = item.id === 'rules';

                      return (
                        <div key={item.id} className="space-y-4">
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold text-foreground">{item.label}</h3>
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <InfoIcon />
                              <p>{item.sub}</p>
                            </div>
                          </div>

                          {showSuggestions && suggestion ? (
                            <div className="space-y-6">
                              {isRules ? (
                                <>
                                  <DiffField 
                                    label="Skill 名称" 
                                    value="游戏宣发视频" 
                                    index={1} 
                                    currentIndex={currentSuggestionIndex}
                                  />
                                  <DiffField 
                                    label="Skill调用规则" 
                                    value={gameSkillSuggestions.rules} 
                                    index={2} 
                                    currentIndex={currentSuggestionIndex}
                                    isTextarea
                                  />
                                </>
                              ) : (
                                <DiffField 
                                  value={suggestion as string} 
                                  index={sectionIdx + 2} 
                                  currentIndex={currentSuggestionIndex}
                                  isTextarea
                                />
                              )}
                            </div>
                          ) : (
                            isRules ? (
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-muted-foreground">Skill 名称</label>
                                  <input 
                                    placeholder="为你的Skill命名"
                                    className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm focus:border-white/10 focus:outline-none focus:ring-1 focus:ring-white/10 transition"
                                  />
                                </div>
                                <div className="space-y-2 relative">
                                  <label className="text-xs font-medium text-muted-foreground">Skill调用规则</label>
                                  <textarea 
                                    placeholder="告诉 Agent 这个 Skill 应该在什么情况下被调用"
                                    className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm min-h-[100px] resize-none focus:border-white/10 focus:outline-none focus:ring-1 focus:ring-white/10 transition"
                                  />
                                  <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground/40">0/200</span>
                                </div>
                              </div>
                            ) : (
                              <div className="relative group">
                                <textarea 
                                  placeholder={`输入${item.label}内容...`}
                                  className="w-full rounded-xl border border-white/5 bg-white/5 px-4 py-5 text-sm min-h-[200px] resize-none focus:border-white/10 focus:outline-none focus:ring-1 focus:ring-white/10 transition placeholder:text-muted-foreground/30"
                                />
                                <button className="absolute bottom-4 right-4 text-muted-foreground/30 hover:text-muted-foreground transition opacity-0 group-hover:opacity-100">
                                  <LayoutGrid className="h-4 w-4" />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* Right Assistant Panel */}
            <div className="w-[450px] flex flex-col bg-[#161618] border-l border-white/5">
              {/* Header */}
              <div className="flex h-16 items-center justify-between px-6 shrink-0 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-muted-foreground">
                    <Code2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium">Skill优化助手</span>
                </div>
                <DialogPrimitive.Close className="rounded-full p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground transition">
                  <X className="h-5 w-5" />
                </DialogPrimitive.Close>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 space-y-2">
                    <span className="text-sm">没有更多消息</span>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                      <div className={cn(
                        "max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        msg.role === 'user' 
                          ? "bg-white/10 text-foreground border border-white/5" 
                          : "text-foreground w-full"
                      )}>
                        {msg.content === 'GAME_SKILL_FLOW' ? (
                          <div className="space-y-6">
                            <p className="text-[14px] leading-relaxed text-white/90">
                              游戏宣发视频是个很棒的方向！我先帮你搭起一个基础框架，你可以在此基础上继续细化。
                            </p>
                            
                            <p className="text-[14px] leading-relaxed text-white/90">
                              已为你搭起一套完整的<strong className="text-white font-medium">游戏宣发视频</strong> Skill 框架，覆盖了从策划到剪辑的全流程。以下是各部分的核心设计思路：
                            </p>
                            
                            <ul className="space-y-4 text-[14px]">
                              <li className="flex gap-4">
                                <span className="text-muted-foreground mt-2 h-1.5 w-1.5 rounded-full bg-white/20 shrink-0" />
                                <span className="text-foreground/70"><strong className="text-white font-medium">规划阶段：</strong>先锁定宣发目标 and 规格，再逐步推进，每个关键节点暂停确认</span>
                              </li>
                              <li className="flex gap-4">
                                <span className="text-muted-foreground mt-2 h-1.5 w-1.5 rounded-full bg-white/20 shrink-0" />
                                <span className="text-foreground/70"><strong className="text-white font-medium">素材分析：</strong>支持导入原画、截图、品牌规范文档，自动提炼视觉风格作为后续生成的约束</span>
                              </li>
                              <li className="flex gap-4">
                                <span className="text-muted-foreground mt-2 h-1.5 w-1.5 rounded-full bg-white/20 shrink-0" />
                                <span className="text-foreground/70"><strong className="text-white font-medium">分镜设计：</strong>强调前 3 秒视觉钩子、长镜头内部节拍、史诗感摄影语言</span>
                              </li>
                              <li className="flex gap-4">
                                <span className="text-muted-foreground mt-2 h-1.5 w-1.5 rounded-full bg-white/20 shrink-0" />
                                <span className="text-foreground/70"><strong className="text-white font-medium">生成策略：</strong>以 Seedance 2.0 为主力视频模型，角色一致性靠元素参考图保障</span>
                              </li>
                              <li className="flex gap-4">
                                <span className="text-muted-foreground mt-2 h-1.5 w-1.5 rounded-full bg-white/20 shrink-0" />
                                <span className="text-foreground/70"><strong className="text-white font-medium">剪辑组装：</strong>动作段硬切、场景切换闪白/黑场，BGM 高潮对齐视觉高潮</span>
                              </li>
                            </ul>

                            <p className="text-[15px] text-foreground/90">你可以根据实际情况进一步细化，比如：</p>

                            <ChoiceCard 
                              currentSelection={selectedDirection} 
                              onSelect={handleSelect} 
                            />


                            {/* Page Controls */}
                            <div className="flex items-center justify-center gap-4 py-4">
                              <button className="h-9 w-9 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white/60 transition">
                                <ArrowUp className="h-5 w-5 rotate-180" />
                              </button>
                              <button className="h-9 w-9 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white/60 transition">
                                <ArrowUp className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ) : msg.content}
                      </div>
                    </div>
                  ))
                )}

                {/* Scroll Down Hint */}
                {messages.length > 0 && (
                  <div className="flex justify-center pt-4">
                    <div className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground">
                      <ArrowUp className="h-4 w-4 rotate-180" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6">
                <div className="relative rounded-2xl border border-white/5 bg-white/5 p-4 focus-within:border-white/10 transition">
                  <textarea 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="请输入你想创建的Skill想法..."
                    className="w-full bg-transparent text-sm resize-none focus:outline-none min-h-[80px] placeholder:text-muted-foreground/30"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted-foreground hover:bg-white/5 transition">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[11px] text-muted-foreground hover:bg-white/5 transition">
                        <LayoutGrid className="h-3 w-3" />
                        模型
                        <span className="rounded bg-emerald-500 px-1 text-[8px] text-white font-bold leading-tight uppercase">New</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition">
                        <Mic className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full transition",
                          inputValue.trim() ? "bg-white text-black hover:bg-white/90" : "bg-white/10 text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
