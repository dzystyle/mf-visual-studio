import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ChevronRight, Save, LayoutGrid, Eye, Code2, Plus, Mic, ArrowUp, CheckCircle2, MoreHorizontal, Send, ChevronDown, Check, Undo2, Redo2, RotateCcw, Share2, Copy, Trash2, Edit2, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: any;
  onEdit?: (skill: any) => void;
}

export function SkillDetailDialog({ open, onOpenChange, skill, onEdit }: SkillDetailDialogProps) {
  if (!skill) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md transition-all duration-300" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[60] w-full max-w-[800px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0c] text-foreground shadow-2xl focus:outline-none focus-visible:ring-0">
          
          {/* Header Image Area */}
          <div className="relative aspect-[16/7] w-full overflow-hidden">
            <img 
              src={skill.image} 
              alt={skill.title} 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent" />
            
            {/* Close Button */}
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/60 backdrop-blur-md transition hover:bg-black/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title & Author Overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white shadow-xl">
                  {skill.authorAvatar || skill.author?.[1]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white">{skill.title}</h2>
                  <p className="text-sm text-white/60">{skill.author} · {skill.version || 'V1'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-8 pb-8 pt-2">
            <div className="flex gap-2 mb-8">
               <div className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] text-white/60">
                 {skill.model || "Seedance 2.5"}
               </div>
               {skill.tags?.map((tag: string) => (
                 <div key={tag} className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] text-white/60">
                   {tag}
                 </div>
               ))}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/30 uppercase tracking-widest">
                  内容
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-sm font-bold text-white/90">流程规划:</span>
                     <div className="flex items-center gap-1">
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                          <Eye className="h-4 w-4" />
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                          <Code2 className="h-4 w-4" />
                        </div>
                     </div>
                   </div>
                   <p className="text-sm leading-relaxed text-white/60 whitespace-pre-wrap">
                     {skill.desc || "专为具有完整故事线的视频而设计。通过深度分析剧本结构，自动规划镜头语言与视觉节奏。"}
                   </p>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-6">
                  <div className="text-[11px] text-white/20">
                    最近一次更新时间 <span className="text-white/40">2026-08-14 16:35</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/20">取消默认</span>
                    <div className="h-4 w-8 rounded-full bg-white/10 p-0.5">
                      <div className="h-3 w-3 rounded-full bg-white/20" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-2">
                  <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500 transition hover:bg-red-500/20">
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => onEdit?.(skill)}
                    className="flex items-center gap-2 rounded-xl bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10"
                  >
                    <Edit2 className="h-4 w-4" />
                    编辑
                  </button>
                  <button className="flex items-center gap-2 rounded-xl bg-white/5 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10">
                    <Copy className="h-4 w-4" />
                    创建副本
                  </button>
                  <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/60 transition hover:bg-white/10">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
                
                <button className="flex items-center gap-2 rounded-full bg-[#E1B166] px-8 py-3 text-[15px] font-bold text-black transition hover:bg-[#f0c07d] active:scale-95 shadow-xl shadow-[#E1B166]/10">
                  <PlayCircle className="h-5 w-5" />
                  去使用 Skill
                </button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
