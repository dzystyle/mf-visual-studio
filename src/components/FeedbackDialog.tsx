import * as React from "react";
import { X, MessageSquare, Link as LinkIcon, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [view, setView] = React.useState<"list" | "form">("list");
  const [type, setType] = React.useState<string>("建议");

  // Reset view when opening
  React.useEffect(() => {
    if (open) setView("list");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] p-0 border-border bg-popover text-popover-foreground overflow-hidden">
        {view === "list" ? (
          <div className="flex flex-col min-h-[500px]">
            <div className="p-6 flex items-center justify-between border-b border-border">
              <div>
                <h2 className="text-xl font-bold">反馈记录</h2>
                <p className="text-sm text-muted-foreground mt-1">查看你的反馈进展与官方回复</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setView("form")}
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6 h-9"
                >
                  + 提交新反馈
                </Button>
                <button 
                  onClick={() => onOpenChange(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-foreground/5 text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  排序
                  <select className="bg-transparent border-none focus:ring-0 text-foreground cursor-pointer font-medium p-0">
                    <option>最新互动优先</option>
                  </select>
                </div>
                <div className="text-sm text-muted-foreground">共 0 条</div>
              </div>
              
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <p className="text-lg font-medium">还没有反馈记录</p>
                <p className="text-sm mt-1">提交反馈后，你可以在这里查看处理进展和官方回复。</p>
                <Button 
                  variant="outline" 
                  onClick={() => setView("form")}
                  className="mt-6 rounded-full px-8 h-10"
                >
                  + 提交新反馈
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 relative">
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute right-8 top-8 text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-center gap-2 text-2xl font-bold mb-2">
                <MessageSquare className="w-6 h-6" /> 反馈与建议
              </div>
              <p className="text-sm text-muted-foreground">感谢您的反馈！您的意见将帮助我们做得更好。</p>
            </div>
            
            <div className="space-y-8 max-w-[600px] mx-auto">
              <div>
                <label className="text-base font-medium mb-4 block">1. 问题类型 <span className="text-red-500">*</span></label>
                <div className="flex gap-3">
                  {["建议", "产品BUG", "会员或积分问题"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        "px-6 py-2 rounded-full border text-sm transition-all",
                        type === t 
                          ? "bg-foreground text-background border-foreground" 
                          : "border-border hover:border-foreground/40"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-base font-medium mb-4 block">2. 问题描述 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <textarea 
                    placeholder="请详细描述您遇到的问题或提出的建议..."
                    className="w-full min-h-[160px] bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-none"
                  />
                  <span className="absolute bottom-4 right-4 text-xs text-muted-foreground">0/1000</span>
                </div>
              </div>
              
              <div>
                <label className="text-base font-medium mb-4 block">3. 项目地址</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text"
                    placeholder="请输入项目地址（可选，如：https://www.artrail.ai/zh-CN/project/?id=xxx）"
                    className="w-full bg-background border border-border rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-base font-medium mb-4 block">4. 反馈邮箱 <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="email"
                    defaultValue="yangdu776@gmail.com"
                    className="w-full bg-background border border-border rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex flex-col items-center">
                <Button className="w-full py-6 rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-base">
                  提交反馈
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  提交即表示您同意我们的 <a href="#" className="underline">隐私政策</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
