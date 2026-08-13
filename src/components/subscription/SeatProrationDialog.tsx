import * as React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, TrendingUp, TrendingDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProrationDetails {
  type: 'increase' | 'decrease';
  currentSeats: number;
  newSeats: number;
  effectiveDate: 'immediate' | 'next_cycle';
  refundAmount?: number;
  chargeAmount?: number;
  creditAdjustment?: number;
}

interface SeatProrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  details: ProrationDetails;
  onConfirm: () => void;
}

export function SeatProrationDialog({ 
  open, 
  onOpenChange, 
  details, 
  onConfirm 
}: SeatProrationDialogProps) {
  const isIncrease = details.type === 'increase';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-[#0F1115] text-foreground p-6 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className={cn(
            "mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-opacity-10",
            isIncrease ? "bg-primary text-primary" : "bg-amber-500 text-amber-500"
          )}>
            {isIncrease ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            {isIncrease ? "确认增加席位" : "确认缩减席位"}
          </DialogTitle>
          <DialogDescription className="text-center text-white/50 text-sm">
            {isIncrease 
              ? `增加席位将立即生效，系统将按比例收取本月剩余时间的费用。` 
              : `缩减席位将在下个账期生效，本月已收费用将不予退还。`}
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 space-y-4 rounded-2xl bg-white/5 p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40">当前席位</span>
            <span className="font-bold">{details.currentSeats} 席</span>
          </div>
          <div className="flex items-center justify-center py-1">
            <ArrowRight className="h-4 w-4 text-white/20" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40">变更后席位</span>
            <span className={cn(
              "font-bold text-lg",
              isIncrease ? "text-primary" : "text-amber-500"
            )}>{details.newSeats} 席</span>
          </div>

          <div className="h-px bg-white/5 my-2" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">{isIncrease ? "补缴金额" : "下月预估"}</span>
              <span className="font-mono text-sm">
                {isIncrease ? `¥${details.chargeAmount}` : `¥${details.chargeAmount}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">生效时间</span>
              <span className="text-sm font-medium">
                {isIncrease ? "立即生效" : "下个计费周期"}
              </span>
            </div>
          </div>
        </div>

        {isIncrease && (
          <div className="flex items-start gap-3 rounded-xl bg-primary/5 p-3 border border-primary/10 mb-6">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-primary/80">
              增购积分将按比例立即到账。系统已为您自动计算了本月剩余天数的差价。
            </p>
          </div>
        )}

        {!isIncrease && (
          <div className="flex items-start gap-3 rounded-xl bg-amber-500/5 p-3 border border-amber-500/10 mb-6">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-amber-500/80">
              席位缩减后，超出限额的成员将被自动移至“待分配”名单。请确保在下个账期前完成调整。
            </p>
          </div>
        )}

        <DialogFooter className="flex sm:justify-between gap-3">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl bg-white/5 hover:bg-white/10 border-white/5"
          >
            返回
          </Button>
          <Button 
            onClick={onConfirm}
            className={cn(
              "flex-1 rounded-xl font-bold shadow-lg shadow-primary/20",
              isIncrease ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
            )}
          >
            确认变更
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
