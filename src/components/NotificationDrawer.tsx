import * as React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { ExternalLink } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  icon?: string;
  link?: string;
  tag?: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "邀请你参与体验调研",
    content: "你反馈的问题小云雀都会收到并积极做出优化，期待你的宝贵意见！",
    date: "06/23",
    time: "15:06",
    link: "#",
  },
  {
    id: "2",
    title: "积分到账！",
    content: "您因会员订阅获得830积分。⏰ 温馨提醒：该积分的有效期至2026-07-13，请及时使用",
    date: "06/13",
    time: "20:44",
    tag: "🎉",
  }
];

export function NotificationDrawer({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] border-l border-border bg-popover/95 p-0 backdrop-blur-2xl">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-xl font-bold">消息中心</SheetTitle>
          <SheetDescription className="text-sm text-foreground/40">
            系统消息和活动通知
          </SheetDescription>
        </SheetHeader>
        
        <div className="h-[1px] w-full bg-border/50" />
        
        <div className="flex flex-col gap-6 p-6">
          {notifications.map((n) => (
            <div key={n.id} className="group relative flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/5 transition-colors group-hover:bg-foreground/10">
                <div className="h-5 w-5 rounded-[4px] bg-foreground/90 flex items-center justify-center">
                  <div className="h-2.5 w-1.5 rounded-full border-r border-background/20" />
                </div>
              </div>
              
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {n.tag && <span className="text-sm">{n.tag}</span>}
                    <h4 className="text-[15px] font-semibold text-foreground/90">{n.title}</h4>
                  </div>
                  <span className="text-[12px] text-foreground/30 font-medium">
                    {n.date} {n.time}
                  </span>
                </div>
                
                <p className="text-[13px] leading-relaxed text-foreground/50">
                  {n.content}
                </p>
                
                {n.link && (
                  <button className="mt-1 flex items-center gap-1 text-[13px] font-medium text-purple-400 hover:text-purple-300 transition-colors">
                    查看详情
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
