import * as React from "react";
import { Infinity, RotateCcw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  DEFAULT_THRESHOLD,
  overflowLabel,
  type OverflowPolicy,
  type Quota,
  type QuotaPeriod,
  type QuotaType,
} from "@/lib/team-data";

interface QuotaSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 被设置的对象名称，可为成员、分组或项目 */
  memberName: string;
  scopeLabel?: string;
  quota?: Quota;
  onSave?: (quota: Quota) => void;
}

export function QuotaSettingsDialog({
  open,
  onOpenChange,
  memberName,
  scopeLabel = "成员",
  quota,
  onSave,
}: QuotaSettingsDialogProps) {
  const [type, setType] = React.useState<QuotaType>(quota?.type ?? "unlimited");
  const [period, setPeriod] = React.useState<QuotaPeriod>(quota?.period ?? "monthly");
  const [quotaValue, setQuotaValue] = React.useState(String(quota?.value ?? 0));
  const [threshold, setThreshold] = React.useState(quota?.threshold ?? DEFAULT_THRESHOLD);
  const [overflow, setOverflow] = React.useState<OverflowPolicy>(quota?.overflow ?? "notify");

  React.useEffect(() => {
    if (open) {
      setType(quota?.type ?? "unlimited");
      setPeriod(quota?.period ?? "monthly");
      setQuotaValue(String(quota?.value ?? 0));
      setThreshold(quota?.threshold ?? DEFAULT_THRESHOLD);
      setOverflow(quota?.overflow ?? "notify");
    }
  }, [open, quota]);

  const handleSave = () => {
    onSave?.({
      type,
      value: type === "unlimited" ? 0 : Math.max(0, Number(quotaValue) || 0),
      period: type === "periodic" ? period : undefined,
      threshold,
      overflow,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border/60 p-0 rounded-[24px]">
        <div className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">预算设置</h2>
            <p className="text-sm text-muted-foreground">
              设置{scopeLabel} {memberName} 的额度与超额策略
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-foreground/70">类型</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setType("unlimited")}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all h-[120px]",
                  type === "unlimited" ? "bg-primary/10 border-primary" : "bg-muted/20 border-border/40 hover:bg-muted/30",
                )}
              >
                <Infinity className={cn("h-7 w-7", type === "unlimited" ? "text-primary" : "text-foreground/60")} />
                <span className={cn("text-sm font-bold", type === "unlimited" ? "text-primary" : "text-foreground/70")}>
                  无额度限制
                </span>
              </button>

              <button
                onClick={() => setType("periodic")}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all h-[120px]",
                  type === "periodic" ? "bg-primary/10 border-primary" : "bg-muted/20 border-border/40 hover:bg-muted/30",
                )}
              >
                <RotateCcw className={cn("h-6 w-6", type === "periodic" ? "text-primary" : "text-foreground/60")} />
                <span className={cn("text-sm font-bold", type === "periodic" ? "text-primary" : "text-foreground/70")}>
                  周期额度
                </span>
              </button>

              <button
                onClick={() => setType("fixed")}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all h-[120px]",
                  type === "fixed" ? "bg-primary/10 border-primary" : "bg-muted/20 border-border/40 hover:bg-muted/30",
                )}
              >
                <Lock className={cn("h-6 w-6", type === "fixed" ? "text-primary" : "text-foreground/60")} />
                <span className={cn("text-sm font-bold", type === "fixed" ? "text-primary" : "text-foreground/70")}>
                  固定额度
                </span>
              </button>
            </div>
          </div>

          {type === "unlimited" ? (
            <div className="bg-muted/20 rounded-xl p-4 border border-border/20">
              <p className="text-sm text-foreground/80 text-center font-medium">
                不设上限，消费直接从团队共享池扣减。
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {type === "periodic" && (
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-foreground/70">恢复周期</label>
                    <Select value={period} onValueChange={(v) => setPeriod(v as QuotaPeriod)}>
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
                )}
                <div className={cn("space-y-3", type === "fixed" && "col-span-2")}>
                  <label className="text-sm font-bold text-foreground/70">
                    {type === "periodic" ? "单期额度" : "固定额度"}
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={quotaValue}
                      onChange={(e) => setQuotaValue(e.target.value)}
                      className="h-12 bg-muted/30 border-border/40 text-[15px] font-bold rounded-xl pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Credits
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground/70">告警阈值</label>
                  <span className="text-sm font-bold text-primary">{threshold}%</span>
                </div>
                <Slider
                  value={[threshold]}
                  min={50}
                  max={100}
                  step={5}
                  onValueChange={([v]) => setThreshold(v)}
                />
                <p className="text-xs text-muted-foreground/60">
                  用量达到 {threshold}% 时在团队概览发出提醒。
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-foreground/70">超额时</label>
                <Select value={overflow} onValueChange={(v) => setOverflow(v as OverflowPolicy)}>
                  <SelectTrigger className="h-12 bg-muted/30 border-border/40 text-[15px] font-medium rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/60">
                    {(["notify", "block", "request"] as OverflowPolicy[]).map((o) => (
                      <SelectItem key={o} value={o}>
                        {overflowLabel[o]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl border-border/40 font-bold text-foreground/70 bg-transparent hover:bg-muted/20"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[15px]"
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
