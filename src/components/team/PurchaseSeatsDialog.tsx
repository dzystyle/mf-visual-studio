import * as React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X, Play, Users, ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

export function PurchaseSeatsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [seats, setSeats] = React.useState(1);
  
  // Starter Team configuration
  const PRICE_PER_SEAT = 160;
  const CREDITS_PER_SEAT = 3200;

  const handlePurchase = () => {
    onOpenChange(false);
    navigate({ 
      to: "/checkout",
      search: {
        amount: seats * PRICE_PER_SEAT,
        description: `Purchase ${seats} Additional Seats for Starter Team`
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] border-border bg-background p-0 overflow-hidden rounded-3xl">
        <div className="relative p-8">
          <DialogClose className="absolute right-6 top-6 rounded-full bg-muted p-2 text-muted-foreground hover:bg-muted/80 transition-colors">
            <X className="h-4 w-4" />
          </DialogClose>

          <div className="flex flex-col gap-1 mb-6">
            <h2 className="text-xl font-bold text-foreground">购买团队席位</h2>
            <p className="text-xs text-muted-foreground font-medium">Starter Team 套餐方案</p>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-muted/30 p-4 border border-border">
              <label className="text-xs font-medium text-muted-foreground mb-3 block">选择席位数量</label>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">新增 {seats} 个席位</div>
                    <div className="text-xs text-muted-foreground">¥{PRICE_PER_SEAT} / 席位 · 每月</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSeats(Math.max(1, seats - 1))}
                    className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-muted"
                  >-</button>
                  <span className="w-8 text-center font-bold">{seats}</span>
                  <button 
                    onClick={() => setSeats(seats + 1)}
                    className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-muted"
                  >+</button>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-xl bg-primary/5 p-4 border border-primary/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">新增团队积分 (每月)</span>
                <span className="text-primary font-bold">+{seats * CREDITS_PER_SEAT} Credits</span>
              </div>
              <div className="h-[1px] bg-primary/10 w-full" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-bold">补差合计</span>
                <span className="font-bold text-lg text-primary">¥{seats * PRICE_PER_SEAT}</span>
              </div>
            </div>

            <button 
              onClick={handlePurchase}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              立即购买
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
