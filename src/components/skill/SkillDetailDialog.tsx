import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronRight, Save, LayoutGrid, Eye, Code2, Plus, Mic, ArrowUp, CheckCircle2, MoreHorizontal, Send, ChevronDown, Check, Undo2, Redo2, RotateCcw, Share2, Copy, Trash2, Edit2, PlayCircle, Info } from "lucide-react";
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
  
  if (!skill) return null;

  const handleUseSkill = () => {
    // 1. Save skill to localStorage to persist across navigation
    localStorage.setItem('selected-skill', skill.title);
    
    // 2. Dispatch event for immediate use if on the same page
    const event = new CustomEvent('select-skill', { detail: skill.title });
    window.dispatchEvent(event);
    
    // 3. Navigate to home page
    navigate({ to: "/" });
    
    // 4. Close dialog
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md transition-all duration-300" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[60] w-full max-w-[640px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0a0a0c] text-foreground shadow-2xl focus:outline-none focus-visible:ring-0">
          
          {/* Header Image Area */}
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <img 
              src={skill.image || skill.img} 
              alt={skill.title} 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent" />
            
            {/* Top Badge */}
            <div className="absolute top-6 left-6 flex gap-2">
              <div className="rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-white/80 border border-white/5">
                {skill.model || "Seedance 2.5"}
              </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white/60 backdrop-blur-md transition hover:bg-black/60 hover:text-white border border-white/5"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title & Author Overlay */}
            <div className="absolute bottom-6 left-8 right-8">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-1.5">{skill.title}</h2>
              <p className="text-sm text-white/40">@{skill.author?.replace('@', '') || 'Artrail'}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-8 pt-4 border-b border-white/5 bg-[#0a0a0c]">
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveTab("intro")}
                className={cn(
                  "pb-4 text-[13px] font-bold transition-all relative",
                  activeTab === "intro" ? "text-white" : "text-white/30 hover:text-white/50"
                )}
              >
                简介
                {activeTab === "intro" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab("content")}
                className={cn(
                  "pb-4 text-[13px] font-bold transition-all relative",
                  activeTab === "content" ? "text-white" : "text-white/30 hover:text-white/50"
                )}
              >
                内容
                {activeTab === "content" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-8 pb-8 pt-6 min-h-[300px] bg-[#0a0a0c]">
            {activeTab === "intro" ? (
              <div className="space-y-6">
                <p className="text-[14px] leading-relaxed text-white/60 whitespace-pre-wrap">
                  {skill.desc || "专为具有完整故事线的视频而设计。通过深度分析剧本结构，自动规划镜头语言与视觉节奏。"}
                </p>
                
                <div className="flex flex-wrap gap-2">
                   {skill.tags?.map((tag: string) => (
                     <div key={tag} className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] text-white/40">
                       {tag}
                     </div>
                   ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/40 font-medium">历史使用</div>
                    </div>
                    <div className="text-[11px] text-white/20">
                      最近一次更新时间 <span className="text-white/30">2026-08-14 17:29</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold text-white/90">默认调用</span>
                      <span className="text-[11px] text-white/40">开启后将在符合条件时自动触发此 Skill</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-3 cursor-pointer group",
                      skill.isDefault ? "text-emerald-500" : "text-white/20"
                    )}>
                      <span className="text-[11px] font-bold">{skill.isDefault ? "已开启" : "未开启"}</span>
                      <div className={cn(
                        "h-5 w-10 rounded-full p-0.5 border transition-all duration-300",
                        skill.isDefault ? "bg-emerald-500/20 border-emerald-500/30" : "bg-white/5 border-white/10"
                      )}>
                        <div className={cn(
                          "h-3.5 w-3.5 rounded-full transition-all duration-300",
                          skill.isDefault ? "bg-emerald-500 translate-x-5" : "bg-white/20 translate-x-0"
                        )} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-white/90">
                      <LayoutGrid className="h-4 w-4 text-white/40" />
                      流程规划
                    </div>
                    <div className="flex items-center gap-1">
                       <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition cursor-pointer">
                         <Eye className="h-4 w-4" />
                       </div>
                       <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition cursor-pointer">
                         <Code2 className="h-4 w-4" />
                       </div>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-white/50">
                    基于视频主题自动生成多组分镜脚本，涵盖特写、中景、远景等专业镜头语言。
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-white/90">
                      <ImageIcon className="h-4 w-4 text-white/40" />
                      素材分析
                    </div>
                    <div className="flex items-center gap-1">
                       <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 transition cursor-pointer">
                         <Eye className="h-4 w-4" />
                       </div>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-white/50">
                    智能提取上传素材的关键视觉元素，并与预设风格进行深度融合。
                  </p>
                </div>
              </div>
            )}

            <div className="h-[1px] w-full bg-white/5 my-8" />

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => console.log("Delete skill")}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 transition hover:bg-red-500/20 active:scale-95"
                  title="删除"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => onEdit?.(skill)}
                  className="flex items-center gap-2 h-10 rounded-xl bg-white/5 px-4 text-[12px] font-bold text-white/80 transition hover:bg-white/10 active:scale-95"
                >
                  <Copy className="h-3.5 w-3.5" />
                  创建副本
                </button>
                <button 
                  onClick={() => console.log("Share skill")}
                  className="flex items-center gap-2 h-10 rounded-xl bg-white/5 px-4 text-[12px] font-bold text-white/80 transition hover:bg-white/10 active:scale-95"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  分享
                </button>
              </div>
              
              <button 
                onClick={handleUseSkill}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E1B166] to-[#f0c07d] px-8 py-3 text-[14px] font-bold text-black transition hover:opacity-90 active:scale-95 shadow-xl shadow-[#E1B166]/20"
              >
                <PlayCircle className="h-4 w-4 fill-black" />
                去使用 Skill
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );

}
