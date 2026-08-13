import * as React from "react";
import { X, Infinity, RotateCcw, Lock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type QuotaType = "unlimited" | "periodic" | "fixed";

interface QuotaSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
}

export function QuotaSettingsDialog({
  open,
  onOpenChange,
  memberName,
}: QuotaSettingsDialogProps) {
  const [type, setType] = React.useState<QuotaType>("unlimited");
  const [period, setPeriod] = React.useState("monthly");
  const [quotaValue, setQuotaValue] = React.useState("111");

  const handleSave = () => {
    // In a real app, this would call an API
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border/60 p-0 overflow-hidden rounded-[24px]">
        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">额度设置</h2>
            <p className="text-sm text-muted-foreground">设置 {memberName} 的额度</p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-foreground/70">类型</label>
            <div className="grid grid-cols-3 gap-4">
              {/* Unlimited */}
              <button
                onClick={() => setType("unlimited")}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all h-[140px]",
                  type === "unlimited"
                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    : "bg-muted/20 border-border/40 hover:bg-muted/30"
                )}
              >
                <Infinity className={cn("h-8 w-8", type === "unlimited" ? "text-primary" : "text-foreground/60")} />
                <span className={cn("text-[15px] font-bold", type === "unlimited" ? "text-primary" : "text-foreground/70")}>
                  无额度限制
                </span>
              </button>

              {/* Periodic */}
              <button
                onClick={() => setType("periodic")}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all h-[140px]",
                  type === "periodic"
                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    : "bg-muted/20 border-border/40 hover:bg-muted/30"
                )}
              >
                <RotateCcw className={cn("h-7 w-7", type === "periodic" ? "text-primary" : "text-foreground/60")} />
                <span className={cn("text-[15px] font-bold", type === "periodic" ? "text-primary" : "text-foreground/70")}>
                  周期额度
                </span>
              </button>

              {/* Fixed */}
              <button
                onClick={() => setType("fixed")}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all h-[140px]",
                  type === "fixed"
                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    : "bg-muted/20 border-border/40 hover:bg-muted/30"
                )}
              >
                <div className="relative h-8 w-8 flex items-center justify-center">
                  <Lock className={cn("h-7 w-7", type === "fixed" ? "text-amber-500" : "text-foreground/60")} fill={type === "fixed" ? "#F59E0B" : "none"} />
                </div>
                <span className={cn("text-[15px] font-bold", type === "fixed" ? "text-primary" : "text-foreground/70")}>
                  固定额度
                </span>
              </button>
            </div>
          </div>

          <div className="min-h-[100px] animate-in fade-in slide-in-from-top-2 duration-300">
            {type === "unlimited" && (
              <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
                <p className="text-sm text-foreground/80 text-center font-medium">
                  该成员可无限使用团队账户内的积分。
                </p>
              </div>
            )}

            {type === "periodic" && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground/70">恢复周期</label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="h-12 bg-muted/30 border-border/40 text-[15px] font-medium rounded-xl">
                      <SelectValue placeholder="选择周期" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/60">
                      <SelectItem value="daily">每日</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground/60 pl-1">
                    {period === "monthly" ? "每月1日恢复" : period === "weekly" ? "每周一恢复" : "每日0点恢复"}
                  </p>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground/70">单期额度</label>
                  <Input
                    type="number"
                    value={quotaValue}
                    onChange={(e) => setQuotaValue(e.target.value)}
                    className="h-12 bg-muted/30 border-border/40 text-[15px] font-medium rounded-xl"
                  />
                </div>
              </div>
            )}

            {type === "fixed" && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground/70">固定额度</label>
                <Input
                  type="number"
                  value={quotaValue}
                  onChange={(e) => setQuotaValue(e.target.value)}
                  className="h-12 bg-muted/30 border-border/40 text-[15px] font-medium rounded-xl"
                  placeholder="输入固定积分额度"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-border/40 font-bold text-foreground/70 bg-transparent hover:bg-muted/20"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-[15px] shadow-lg shadow-primary/20"
              onClick={handleSave}
            >
              保存并应用
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
