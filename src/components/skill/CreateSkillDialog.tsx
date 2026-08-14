import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronRight, Save, LayoutGrid, Eye, Code2, Plus, Mic, ArrowUp } from "lucide-react";
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
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-muted-foreground/40 space-y-2">
                <span className="text-sm">暂无消息</span>
              </div>

              {/* Input Area */}
              <div className="p-6">
                <div className="relative rounded-2xl border border-white/5 bg-white/5 p-4 focus-within:border-white/10 transition">
                  <textarea 
                    placeholder="请输入你想创建的Skill想法..."
                    className="w-full bg-transparent text-sm resize-none focus:outline-none min-h-[80px]"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted-foreground hover:bg-white/5 transition">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-[11px] text-muted-foreground hover:bg-white/5 transition">
                        <LayoutGrid className="h-3 w-3" />
                        模型
                        <span className="rounded bg-emerald-500 px-1 text-[8px] text-white font-bold leading-tight">新</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition">
                        <Mic className="h-4 w-4" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-muted-foreground cursor-not-allowed">
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
