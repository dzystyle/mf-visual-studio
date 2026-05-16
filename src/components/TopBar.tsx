import { BookOpen, Coins } from "lucide-react";

export function TopBar({ title }: { title?: string }) {
  return (
    <div className="absolute right-6 top-4 z-20 flex items-center gap-3">
      <button className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs text-foreground backdrop-blur hover:bg-card">
        <BookOpen className="h-3.5 w-3.5 text-aurora-orange" />
        <span className="font-medium">全新 MovieFlow 1.0 使用教程</span>
      </button>
      <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs backdrop-blur">
        <Coins className="h-3.5 w-3.5 text-aurora-orange" />
        <span className="font-semibold">200</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">Free</span>
      </div>
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-aurora-pink to-aurora-blue" />
      {title ? <span className="sr-only">{title}</span> : null}
    </div>
  );
}

export function BrandMark() {
  return (
    <div className="absolute left-6 top-5 z-20 flex items-center gap-2">
      <div className="grid h-5 w-5 grid-cols-2 gap-[2px]">
        <div className="rounded-[1px] bg-aurora-pink" />
        <div className="rounded-[1px] bg-aurora-orange" />
        <div className="rounded-[1px] bg-aurora-blue" />
        <div className="rounded-[1px] bg-foreground" />
      </div>
      <span className="text-[15px] font-semibold tracking-tight">movieflow.ai</span>
    </div>
  );
}
