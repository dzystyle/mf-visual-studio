import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronRight, Save, LayoutGrid, Eye, Code2, Plus, Mic, ArrowUp, CheckCircle2, MoreHorizontal, Send, ChevronDown, Check, Undo2, Redo2, RotateCcw, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InfoIcon() {
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] font-bold">
      i
    </div>
  );
}

export function CreateSkillDialog({ open, onOpenChange }: CreateSkillDialogProps) {
  const [skillName, setSkillName] = React.useState("");
  const [skillIntro, setSkillIntro] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [allowPublic, setAllowPublic] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"preview" | "markdown">("preview");
  const [markdownContent, setMarkdownContent] = React.useState<string>("");
  
  const tags = ["专业影视", "专业营销", "产品推广", "短剧漫剧", "创意发散", "特效玩法", "社媒热点", "视频", "图片"];
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : (prev.length < 3 ? [...prev, tag] : prev)
    );
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm transition-all duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-x-0 bottom-0 z-[201] flex h-[92vh] flex-col overflow-hidden rounded-t-[2.5rem] border-t border-x border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.3)] focus:outline-none transition-all duration-500 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 shrink-0 border-b border-[var(--color-border)]">
             <div className="text-xl font-bold">创建技能</div>
             <button 
                onClick={() => onOpenChange(false)}
                className="rounded-full bg-[var(--color-secondary)] p-2.5 text-[var(--color-muted-foreground)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-foreground)] border border-[var(--color-border)]"
             >
               <X className="h-5 w-5" />
             </button>
          </div>
          
          <div className="flex w-full overflow-hidden flex-1">
            <div className="flex-1 p-8 space-y-12 overflow-y-auto scrollbar-hide">
              <div className="flex gap-12">
                {/* Left Part: Content Form */}
                <div className="flex-1 space-y-10">
                  <section className="space-y-6">
                    <h3 className="text-[17px] font-bold tracking-tight">技能内容<span className="text-red-500 ml-1">*</span></h3>
                    <div className="flex gap-6">
                      <div className="w-48 shrink-0 rounded-2xl bg-[var(--color-secondary)]/50 border border-[var(--color-border)] p-4">
                        <div className="text-xs font-medium text-muted-foreground mb-4">目录</div>
                        <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                          <span className="w-1 h-1 rounded-full bg-foreground" />
                          SKILL.md
                        </div>
                      </div>
                      <div className="flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)]/30 p-6 min-h-[400px]">
                        <textarea 
                          placeholder="在此输入Skill内容\n\n## 做什么\n(一句话说明用途)例:把一句话故事想法做成一条短漫剧成讲\n\n## 需要什么输入\n(最少提供什么)例:一句话想法,可选画风、时长、主角设定\n\n## 怎么做\n(写你在意的环节和要求,不用写全)例:脚本要反转多,画风固定成韩漫\n\n## 产出什么\n(最终交付什么)例:成片,附脚本和分镜\n\n## 什么时候问你\n(什么情况下停下来问你)例:拿不准题材或风格时间一次,其余自己定"
                          className="w-full h-full bg-transparent text-[14px] leading-relaxed resize-none focus:outline-none placeholder:text-muted-foreground/30 min-h-[350px]"
                        />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Part: Meta Form */}
                <div className="w-[320px] space-y-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold">技能名称<span className="text-red-500 ml-1">*</span></label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value.slice(0, 20))}
                        placeholder="给你的技能起个名字"
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/40">{skillName.length}/20</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold">一句话介绍<span className="text-red-500 ml-1">*</span></label>
                    <div className="relative">
                      <textarea 
                        value={skillIntro}
                        onChange={(e) => setSkillIntro(e.target.value.slice(0, 50))}
                        placeholder="简短描述技能能做什么"
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] px-4 py-3 text-sm h-20 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/10"
                      />
                      <span className="absolute right-3 bottom-3 text-[10px] text-muted-foreground/40">{skillIntro.length}/50</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold">选择符合这个技能的类型标签 (0/3)</label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all",
                            selectedTags.includes(tag) 
                              ? "bg-foreground text-background border-foreground" 
                              : "bg-transparent border-[var(--color-border)] text-muted-foreground hover:border-muted-foreground/50"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-muted-foreground">技能封面 (建议比例16:9)</label>
                    <button className="w-full aspect-[16/9] rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-secondary)]/30 flex items-center justify-center text-muted-foreground hover:bg-[var(--color-secondary)]/50 transition">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-muted-foreground">更多成果示意图或视频 (建议比例16:9)</label>
                    <button className="w-full aspect-[16/9] rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-secondary)]/30 flex items-center justify-center text-muted-foreground hover:bg-[var(--color-secondary)]/50 transition">
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5">
                      <label className="text-sm font-bold text-muted-foreground">提示词指引</label>
                      <InfoIcon />
                    </div>
                    <div className="relative">
                      <textarea 
                        placeholder="简要描述填写什么提示词可以让你的技能发挥得更好"
                        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] px-4 py-3 text-sm h-20 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/10"
                      />
                      <span className="absolute right-3 bottom-3 text-[10px] text-muted-foreground/40">0/50</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 pb-8">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setAllowPublic(!allowPublic)}
                        className={cn(
                          "h-4 w-4 rounded-full border flex items-center justify-center transition",
                          allowPublic ? "bg-foreground border-foreground" : "border-[var(--color-border)]"
                        )}
                      >
                        {allowPublic && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                      </button>
                      <span className="text-[13px] text-muted-foreground">允许官方公开我的技能</span>
                    </div>
                    <button className="px-6 py-2 rounded-full bg-foreground text-background text-[13px] font-bold opacity-20 cursor-not-allowed">
                      保存并使用
                    </button>
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
