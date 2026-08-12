import * as React from "react";
import { X, MessageSquare, Link as LinkIcon, Mail, Check, ExternalLink, ChevronDown, ArrowUp, ArrowLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import qrAsset from "@/assets/wechat-qr.png.asset.json";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [view, setView] = React.useState<"list" | "form" | "success" | "detail">("list");
  const [type, setType] = React.useState<string>("建议");
  const [messages, setMessages] = React.useState<Array<{role: 'user' | 'system', content: string}>>([
    { role: 'system', content: '请查看积分明细。' },
    { role: 'user', content: '这个计费是怎么计算的' }
  ]);
  const [input, setInput] = React.useState("");

  // Reset view when opening
  React.useEffect(() => {
    if (open) setView("list");
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView("success");
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "border-border bg-popover text-popover-foreground overflow-hidden transition-all duration-300",
        view === "success" ? "max-w-[400px] p-0 rounded-[32px]" : "max-w-[1000px] p-0"
      )}>
        {view === "list" ? (
          <div className="flex flex-col min-h-[600px]">
            <div className="p-6 flex items-center justify-between border-b border-border">
              <div className="px-2">
                <h2 className="text-4xl font-bold">反馈记录</h2>
                <p className="text-base text-muted-foreground mt-2">查看你的反馈进展与官方回复</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setView("form")}
                  className="rounded-full bg-white text-black hover:bg-white/90 px-6 h-10 font-medium"
                >
                  + 提交新反馈
                </Button>
                <button 
                  onClick={() => onOpenChange(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  排序
                  <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg text-foreground cursor-pointer hover:bg-white/10 transition-colors">
                    最新互动优先
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground bg-white/5 px-3 py-1 rounded-full">共 1 条</div>
              </div>
              
              <div className="space-y-4">
                <div 
                  onClick={() => setView("detail")}
                  className="group bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 cursor-pointer hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md text-[13px] text-muted-foreground">
                        <MessageSquare className="w-3.5 h-3.5" />
                        问题反馈
                      </div>
                      <span className="text-[13px] text-muted-foreground">建议</span>
                    </div>
                    <span className="text-[13px] text-muted-foreground">8月12日 09:35</span>
                  </div>
                  
                  <div className="text-lg font-medium mb-6">生成的视频怎么这么贵</div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="text-[13px] text-muted-foreground flex items-center gap-1">
                      《超能替罪羊》剧本视频制作
                    </div>
                    <div className="flex items-center gap-1 text-[13px] text-muted-foreground group-hover:text-white transition-colors">
                      查看项目 <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-2 text-[13px] text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                      <MessageSquare className="w-3 h-3" />
                    </div>
                    回复这条反馈
                    <ChevronDown className="w-4 h-4 ml-auto opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : view === "form" ? (
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
            
            <form onSubmit={handleSubmit} className="space-y-8 max-w-[600px] mx-auto">
              <div>
                <label className="text-base font-medium mb-4 block">1. 问题类型 <span className="text-red-500">*</span></label>
                <div className="flex gap-3">
                  {["建议", "产品BUG", "会员或积分问题"].map((t) => (
                    <button
                      type="button"
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
                    required
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
                    required
                    type="email"
                    defaultValue="yangdu776@gmail.com"
                    className="w-full bg-background border border-border rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex flex-col items-center">
                <Button type="submit" className="w-full py-6 rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold text-base">
                  提交反馈
                </Button>
                <p className="mt-4 text-xs text-muted-foreground">
                  提交即表示您同意我们的 <a href="#" className="underline">隐私政策</a>
                </p>
              </div>
            </form>
          </div>
        ) : view === "detail" ? (
          <div className="flex flex-col h-[700px]">
            <div className="p-6 flex flex-col gap-4 border-b border-border">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setView("list")}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回反馈记录
                </button>
                <button 
                  onClick={() => onOpenChange(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-4xl font-bold px-2">反馈对话</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 pt-4">

              {/* Original Feedback Card */}
              <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-8 max-w-[800px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md text-[13px] text-muted-foreground">
                      <MessageSquare className="w-3.5 h-3.5" />
                      建议
                    </div>
                    <div className="bg-white/10 text-white text-[13px] px-2.5 py-1 rounded-md">
                      处理中
                    </div>
                  </div>
                  <span className="text-[13px] text-muted-foreground">8月12日 09:35</span>
                </div>
                
                <div className="text-xl font-medium mb-8">生成的视频怎么这么贵</div>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="text-[13px] text-muted-foreground flex items-center gap-1">
                    《超能替罪羊》剧本视频制作
                  </div>
                  <div className="flex items-center gap-1 text-[13px] text-muted-foreground cursor-pointer hover:text-white transition-colors">
                    查看项目 <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex items-end gap-3",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      msg.role === 'user' ? "bg-white/10" : "bg-blue-500/20"
                    )}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <div className="text-xs font-bold text-blue-400">MF</div>}
                    </div>
                    <div className={cn(
                      "max-w-[80%] px-4 py-2.5 rounded-2xl text-[15px]",
                      msg.role === 'user' ? "bg-[#2A2A2A] text-white" : "bg-[#1A1A1A] border border-white/5 text-muted-foreground"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-8 pt-0">
              <div className="relative group">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="补充更多信息，或回复 Artrail 团队..."
                  className="w-full bg-[#1A1A1A] border border-white/5 rounded-[24px] py-6 px-8 text-base focus:outline-none focus:border-white/20 transition-all min-h-[120px] resize-none pr-16"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className={cn(
                    "absolute right-6 bottom-6 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    input.trim() ? "bg-white text-black" : "bg-white/5 text-muted-foreground"
                  )}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <div className="absolute right-8 top-[90px] text-[13px] text-muted-foreground opacity-50">
                  {input.length}/5000
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative p-10 flex flex-col items-center justify-center text-center">
            <button 
              onClick={() => onOpenChange(false)}
              className="absolute right-6 top-6 text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-6 mt-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <Check className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">已提交</h2>
              <p className="text-muted-foreground text-sm">感谢您的反馈，我们已收到！</p>
            </div>
            
            <div className="w-48 h-48 bg-white rounded-3xl p-4 mb-6 shadow-2xl shadow-black/20">
              <img 
                src={qrAsset.url} 
                alt="WeChat QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <p className="text-muted-foreground text-sm font-medium mb-4">
              微信扫码，加入群聊
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


