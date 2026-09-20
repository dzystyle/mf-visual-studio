import * as React from "react";
import { cn } from "@/lib/utils";
import { overflowLabel, type BudgetStatus } from "@/lib/team-data";

const levelBar: Record<BudgetStatus["level"], string> = {
  ok: "bg-primary",
  warn: "bg-amber-500",
  over: "bg-destructive",
};

const levelText: Record<BudgetStatus["level"], string> = {
  ok: "text-muted-foreground",
  warn: "text-amber-500",
  over: "text-destructive",
};

/** 统一的「已用 / 上限」进度条，数据来自真实流水聚合 */
export function BudgetBar({
  status,
  className,
  showPolicy = false,
}: {
  status: BudgetStatus;
  className?: string;
  showPolicy?: boolean;
}) {
  if (!status.limited) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <div className="flex justify-between text-[11px] font-medium">
          <span className="text-muted-foreground">无额度限制</span>
          <span className="text-muted-foreground">{status.periodLabel}已用 {status.used}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/20 overflow-hidden">
          <div className="h-full w-full rounded-full bg-muted-foreground/20" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex justify-between text-[11px] font-medium">
        <span className={levelText[status.level]}>
          {status.periodLabel}已用 {status.used} / {status.limit}
        </span>
        <span className={cn("font-bold", levelText[status.level])}>{status.percent}%</span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-muted/20 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", levelBar[status.level])}
          style={{ width: `${Math.min(100, status.percent)}%` }}
        />
        <div
          className="absolute top-0 h-full w-px bg-foreground/40"
          style={{ left: `${Math.min(100, status.threshold)}%` }}
        />
      </div>
      {showPolicy && (
        <div className="flex justify-between text-[10px] text-muted-foreground/70">
          <span>告警线 {status.threshold}%</span>
          <span>超额：{overflowLabel[status.overflow]}</span>
        </div>
      )}
    </div>
  );
}

export function LevelBadge({ status }: { status: BudgetStatus }) {
  if (!status.limited || status.level === "ok") return null;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-bold border",
        status.level === "over"
          ? "bg-destructive/10 text-destructive border-destructive/30"
          : "bg-amber-500/10 text-amber-500 border-amber-500/30",
      )}
    >
      {status.level === "over" ? "已超额" : "接近上限"}
    </span>
  );
}
