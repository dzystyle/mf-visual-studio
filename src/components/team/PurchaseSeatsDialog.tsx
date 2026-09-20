import * as React from "react";
import { Minus, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTeam } from "@/lib/team-data";

interface PurchaseSeatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRICE_PER_SEAT = 160;
const CREDITS_PER_SEAT = 3200;

export function PurchaseSeatsDialog({ open, onOpenChange }: PurchaseSeatsDialogProps) {
  const { team, memberCount, seatsLeft, addSeats, setSeats } = useTeam();
  const [seats, setSeatCount] = React.useState(1);

  const handlePurchase = () => {
    addSeats(seats);
    toast.success(`已新增 ${seats} 个团队席位`);
    onOpenChange(false);
  };

  const handleRelease = () => {
    const next = Math.max(memberCount, team.seats - 1);
    if (next === team.seats) {
      toast.error("空闲席位不足，无法释放");
      return;
    }
    setSeats(next);
    toast.success("已释放 1 个空闲席位");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] bg-card border-border/60 p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">席位管理</DialogTitle>
        </DialogHeader>

        <div className="mt-2 rounded-xl border border-border/40 bg-muted/20 px-4 py-3 flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            当前席位
          </span>
          <span className="font-bold text-foreground">
            {memberCount} / {team.seats}（空闲 {seatsLeft}）
          </span>
        </div>

        <div className="mt-6 space-y-3">
          <label className="text-xs font-bold text-muted-foreground">购买数量</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSeatCount((s) => Math.max(1, s - 1))}
              className="h-11 w-11 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-center hover:bg-muted/40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 h-11 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-center text-lg font-bold">
              {seats}
            </div>
            <button
              onClick={() => setSeatCount((s) => s + 1)}
              className="h-11 w-11 rounded-xl border border-border/40 bg-muted/20 flex items-center justify-center hover:bg-muted/40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            每个席位 ¥{PRICE_PER_SEAT}/月，附赠 {CREDITS_PER_SEAT} 积分。
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
          <span className="text-xs text-muted-foreground font-medium">合计</span>
          <span className="text-lg font-bold text-primary">¥{seats * PRICE_PER_SEAT}</span>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 h-11 rounded-xl font-bold" onClick={handleRelease}>
            释放空闲席位
          </Button>
          <Button className="flex-1 h-11 rounded-xl font-bold" onClick={handlePurchase}>
            购买 {seats} 个席位
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
