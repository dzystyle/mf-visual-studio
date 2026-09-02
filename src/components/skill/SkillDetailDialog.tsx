import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronRight, Save, LayoutGrid, Eye, Code2, Plus, Mic, ArrowUp, CheckCircle2, MoreHorizontal, Send, ChevronDown, Check, Undo2, Redo2, RotateCcw, Share2, Copy, Trash2, Edit2, PlayCircle, Info, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

interface SkillDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: any;
  onEdit?: (skill: any) => void;
}

export function SkillDetailDialog({ open, onOpenChange, skill, onEdit }: SkillDetailDialogProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<"intro" | "content">("intro");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [cover, setCover] = React.useState<{ url: string; type: "image" | "video" } | null>(null);

  React.useEffect(() => {
    setCover(null);
  }, [skill?.id]);

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCover({ url, type: file.type.startsWith("video") ? "video" : "image" });
    e.target.value = "";
  };

  if (!skill) return null;

  const handleUseSkill = () => {
    localStorage.setItem('selected-skill', skill.title);
    const event = new CustomEvent('select-skill', { detail: skill.title });
    window.dispatchEvent(event);
    navigate({ to: "/" });
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md transition-all duration-300" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[60] w-full max-w-[800px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2.5rem] border border-border bg-background text-foreground shadow-2xl focus:outline-none focus-visible:ring-0">
          
          <div className="relative aspect-[16/9] w-full overflow-hidden group/cover">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handlePickFile}
            />
            {cover ? (
              cover.type === "video" ? (
                <video src={cover.url} className="h-full w-full object-cover" autoPlay muted loop playsInline />
              ) : (
                <img src={cover.url} alt={skill.title} className="h-full w-full object-cover" />
              )
            ) : (
              <img 
                src={skill.image} 
                alt={skill.title} 
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white/80 opacity-0 transition-opacity duration-200 group-hover/cover:opacity-100 focus:opacity-100"
            >
              <Upload className="h-7 w-7" />
              <span className="text-sm">点击上传图或视频</span>
            </button>
            
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/60 backdrop-blur-md transition hover:bg-black/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="absolute bottom-6 left-8 right-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">{skill.title}</h2>
              <p className="text-sm text-muted-foreground">@{skill.author?.replace('@', '') || 'Artrail'}</p>
            </div>
          </div>

          <div className="px-8 pt-4 border-b border-border">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab("intro")}
                className={cn(
                  "pb-4 text-sm font-medium transition-colors relative",
                  activeTab === "intro" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                简介
                {activeTab === "intro" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab("content")}
                className={cn(
                  "pb-4 text-sm font-medium transition-colors relative",
                  activeTab === "content" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                内容
                {activeTab === "content" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </div>

          <div className="px-8 pb-8 pt-6 min-h-[320px]">
            {activeTab === "intro" ? (
              <div className="space-y-6">
                <p className="text-[15px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {skill.desc || "专为具有完整故事线的视频而设计。通过深度分析剧本结构，自动规划镜头语言与视觉节奏。"}
                </p>
                
                <div className="flex flex-wrap gap-2">
                   <div className="flex items-center gap-1 rounded-lg bg-secondary border border-border px-3 py-1.5 text-xs text-muted-foreground">
                     {skill.model || "Seedance 2.5"}
                   </div>
                   {skill.tags?.map((tag: string) => (
                     <div key={tag} className="flex items-center gap-1 rounded-lg bg-secondary border border-border px-3 py-1.5 text-xs text-muted-foreground">
                       {tag}
                     </div>
                   ))}
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded bg-secondary text-[10px] text-muted-foreground">历史使用</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] text-muted-foreground/50">
                      最近一次更新时间 <span className="text-muted-foreground">2026-08-14 17:29</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-emerald-500 font-medium">取消默认</span>
                      <div className="h-4 w-8 rounded-full bg-emerald-500/20 p-0.5 border border-emerald-500/30">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 translate-x-4 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-foreground">流程规划:</span>
                    <div className="flex items-center gap-1">
                       <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-accent transition cursor-pointer">
                         <Eye className="h-4 w-4" />
                       </div>
                       <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-accent transition cursor-pointer">
                         <Code2 className="h-4 w-4" />
                       </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    基于视频主题自动生成多组分镜脚本，涵盖特写、中景、远景等专业镜头语言。
                  </p>
                </div>
              </div>
            )}

            <div className="h-[1px] w-full bg-border my-8" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => console.log("Delete skill")}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive/60 transition hover:bg-destructive/10 hover:text-destructive"
                  title="删除"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onEdit?.(skill)}
                  className="flex items-center gap-2 h-11 rounded-xl border border-border bg-secondary px-6 text-sm font-medium text-foreground transition hover:bg-accent"
                >
                  <Edit2 className="h-4 w-4" />
                  创建副本
                </button>
                <button 
                  onClick={() => console.log("Share skill")}
                  className="flex items-center gap-2 h-11 rounded-xl border border-border bg-secondary px-6 text-sm font-medium text-foreground transition hover:bg-accent"
                >
                  <Share2 className="h-4 w-4" />
                  分享
                </button>
              </div>
              
              <button 
                onClick={handleUseSkill}
                className="flex items-center gap-2 rounded-full bg-primary px-10 py-3 text-[15px] font-bold text-primary-foreground transition hover:opacity-90 active:scale-95 shadow-xl shadow-primary/10"
              >
                <PlayCircle className="h-5 w-5 fill-primary-foreground" />
                去使用 Skill
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
