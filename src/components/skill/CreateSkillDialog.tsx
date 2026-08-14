import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronRight, Save, LayoutGrid, Eye, Code2, Plus, Mic, ArrowUp, CheckCircle2, MoreHorizontal } from "lucide-react";
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

export function CreateSkillDialog({ open, onOpenChange }: CreateSkillDialogProps) {
  const [viewMode, setViewMode] = React.useState<"preview" | "markdown">("preview");
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant', content: string | React.ReactNode }>>([]);
  const [inputValue, setInputValue] = React.useState("");

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
          content: (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 font-bold text-lg">
                  <span className="text-[#ff4d4d]">F</span>
                  <span className="text-[#ff9933]">l</span>
                  <span className="text-[#ffff00]">o</span>
                  <span className="text-[#33cc33]">v</span>
                  <span className="text-[#3399ff]">a</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/5 p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <LayoutGrid className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-emerald-500">Skill 已完成</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition" />
              </div>

              <p className="text-sm leading-relaxed text-foreground/90">
                游戏宣发视频是个很棒的方向！我先帮你搭起一个基础框架，你可以在此基础上继续细化。
              </p>
              
              <p className="text-sm leading-relaxed text-foreground/90">
                已为你搭起一套完整的游戏宣发视频 Skill 框架，覆盖了从策划到剪辑的全流程。以下是各部分的核心设计思路：
              </p>

              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-muted-foreground mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                  <span className="text-foreground/80"><strong className="text-foreground">规划阶段：</strong>先锁定宣发目标和规格，再逐步推进，每个关键节点暂停确认</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                  <span className="text-foreground/80"><strong className="text-foreground">素材分析：</strong>支持导入原画、截图、品牌规范文档，自动提炼视觉风格作为后续生成的约束</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                  <span className="text-foreground/80"><strong className="text-foreground">分镜设计：</strong>强调前 3 秒视觉钩子、长镜头内部节拍、史诗感摄影语言</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                  <span className="text-foreground/80"><strong className="text-foreground">生成策略：</strong>以 Seedance 2.0 为主力视频模型，角色一致性靠元素参考图保障</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-muted-foreground mt-1.5 h-1 w-1 rounded-full bg-current shrink-0" />
                  <span className="text-foreground/80"><strong className="text-foreground">剪辑组装：</strong>动作段硬切、场景切换闪白/黑场，BGM 高潮对齐视觉高潮</span>
                </li>
              </ul>

              <p className="text-sm text-foreground/90 mt-4">你可以根据实际情况进一步细化，比如：</p>

              <div className="space-y-2 rounded-xl border border-white/5 bg-white/5 p-4">
                <h4 className="text-sm font-medium mb-3">你想优先完善哪个方向？</h4>
                {[
                  { title: "指定游戏类型", desc: "告诉我是 RPG、FPS、MOBA 还是其他类型，我来针对性调整视觉风格和节奏规则" },
                  { title: "调整视频模型", desc: "换用其他视频生成模型（如 Seedance 2.5），或指定分辨率、时长等参数" },
                  { title: "加入角色声音一致性", desc: "为角色添加 key_element_audio（声音参考绑定），保证多镜头中同一角色对白音色一致" },
                  { title: "补充用户提供素材的处理流程", desc: "详细规定当用户上传官方截图、立绘或已有宣传片时，如何分析并融入生成工作流" }
                ].map((option, idx) => (
                  <div key={idx} className="flex gap-3 items-start group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition">
                    <div className="mt-1 h-4 w-4 rounded-full border border-white/20 flex items-center justify-center group-hover:border-emerald-500 transition">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground/90">{option.title}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{option.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }]);
      }, 600);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300" />
        <DialogPrimitive.Content className="fixed inset-[40px] z-50 flex overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f12] text-foreground shadow-2xl focus:outline-none">
          
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
                  <span className="text-foreground font-medium">未命名Skill</span>
                </div>
                <button className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium border border-white/10 hover:bg-white/10 transition">
                  <Save className="h-4 w-4" />
                  保存
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 space-y-10">
                {/* View Switcher */}
                <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1 w-fit">
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

                {/* Form Sections */}
                {SIDEBAR_ITEMS.map((item) => (
                  <div key={item.id} className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-foreground">{item.label}</h3>
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <InfoIcon />
                        <p>{item.sub}</p>
                      </div>
                    </div>

                    {item.id === "rules" ? (
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
                    )}
                  </div>
                ))}
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
                        {msg.content}
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
