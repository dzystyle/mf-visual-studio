import * as React from "react";
import { Search, RefreshCw, UserPlus, UserCheck, ShieldCheck, MoreHorizontal, Copy, Trash2, Link as LinkIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// --- Team Members Tab ---

export function TeamMembers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-foreground/80">
          团队积分: <span className="font-bold text-foreground ml-1">0 / 0 积分</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="查找成员" 
              className="h-9 w-48 bg-muted/30 pl-9 text-xs border-border/50 focus-visible:ring-primary/20"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs border-border/50">
            <RefreshCw className="h-3.5 w-3.5" />
            刷新
          </Button>
          <InviteInternalButton />
          <Button size="sm" className="h-9 gap-1.5 text-xs bg-primary hover:bg-primary/90">
            <UserPlus className="h-3.5 w-3.5" />
            邀请外部成员
          </Button>
          <InviteManagementButton />
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
              D
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground">D</span>
                <span className="text-amber-500">👑</span>
                <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">内部</span>
              </div>
              <span className="text-xs text-muted-foreground">dzystyle@163.com</span>
            </div>
          </div>

          <div className="flex items-center gap-12">
            <div className="flex flex-col gap-1 w-48">
              <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                <span>无额度限制</span>
                <span>∞</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
                <div className="h-full w-full bg-primary/60" />
              </div>
            </div>
            <span className="text-sm font-medium text-muted-foreground">所有者</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Invite Internal Dialog ---

function InviteInternalButton() {
  const [open, setOpen] = React.useState(false);
  const inviteUrl = "http://localhost:8080/invite/2cebbd087a2c369f575e";

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success("邀请链接已复制");
  };

  return (
    <>
      <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs border-border/50" onClick={() => setOpen(true)}>
        邀请内部成员
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border/60 p-8">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold">邀请内部成员</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-8">
            分享此链接邀请他人加入你的团队。加入后将立即获得团队资源访问权限。
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">邀请链接</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input 
                    readOnly 
                    value={inviteUrl} 
                    className="h-11 bg-muted/30 border-border/40 text-sm font-medium pr-4" 
                  />
                </div>
                <Button onClick={copyLink} className="h-11 px-6 bg-primary hover:bg-primary/90 font-bold">
                  复制
                </Button>
              </div>
            </div>
            
            <div className="rounded-xl bg-muted/20 p-4 border border-border/20">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span className="text-lg">•</span>
                此链接 7 天内有效。
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// --- Invite Management Dialog ---

function InviteManagementButton() {
  const [open, setOpen] = React.useState(false);

  const invitations = [
    { type: "内部", status: "有效", used: 0, limit: "∞", expiry: "2026-08-19 19:09:20" },
    { type: "内部", status: "有效", used: 0, limit: "∞", expiry: "2026-08-19 19:09:02" },
    { type: "外部", status: "有效", used: 0, limit: "∞", expiry: "2026-08-19 19:08:57" },
    { type: "内部", status: "有效", used: 0, limit: "∞", expiry: "2026-08-18 19:12:02" },
    { type: "外部", status: "有效", used: 0, limit: "∞", expiry: "2026-08-18 19:11:54" },
  ];

  return (
    <>
      <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs border-border/50" onClick={() => setOpen(true)}>
        邀请管理
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] bg-card border-border/60 p-8">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold">邀请管理</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-8">
            查看本团队已发出的邀请链接、使用情况，并可撤销未过期的链接。
          </p>
          
          <div className="w-full">
            <div className="grid grid-cols-5 gap-4 px-4 pb-4 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40">
              <span>类型</span>
              <span>状态</span>
              <span>已用/上限</span>
              <span>过期时间</span>
              <span className="text-right pr-2">操作</span>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {invitations.map((invite, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 px-4 py-6 text-sm items-center border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors">
                  <span className="font-medium text-foreground">{invite.type}</span>
                  <div>
                    <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-500">
                      {invite.status}
                    </span>
                  </div>
                  <span className="text-muted-foreground">{invite.used} / {invite.limit}</span>
                  <span className="text-muted-foreground/80 font-mono text-xs">{invite.expiry}</span>
                  <div className="flex justify-end gap-3">
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
