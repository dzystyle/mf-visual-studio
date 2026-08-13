import * as React from "react";
import { Edit3, Share2, Trash2, Users, Folder, LayoutGrid, TrendingUp, CreditCard, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreditPurchaseDialog } from "@/components/subscription/CreditPurchaseDialog";
import { PurchaseSeatsDialog } from "./PurchaseSeatsDialog";

export function TeamOverview() {
  const [purchaseDialogOpen, setPurchaseDialogOpen] = React.useState(false);
  const [seatsDialogOpen, setSeatsDialogOpen] = React.useState(false);
  return (
    <div className="space-y-6">
      {/* Team Header Card */}
      <div className="rounded-2xl border border-border/50 bg-card/30 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
              D
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-foreground">D</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">专业版</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">团队 ID: 29384756</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ActionButton icon={Edit3} label="重命名" onClick={() => console.log('Rename team')} />
            <ActionButton icon={Share2} label="转让负责人" onClick={() => console.log('Transfer ownership')} />
            <ActionButton icon={Trash2} label="解散团队" className="text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => console.log('Dissolve team')} />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-6">
          <StatBox icon={Users} label="团队成员" value="1" subValue="/ 50 人" action={
            <button onClick={() => setSeatsDialogOpen(true)} className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary/20">
              <UserPlus className="h-3 w-3" /> 购买席位
            </button>
          } />
          <StatBox icon={Folder} label="团队项目" value="0" subValue="个活跃项目" />
          <StatBox icon={LayoutGrid} label="分组数" value="0" subValue="个管理分组" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Usage Card */}
        <div className="col-span-1 rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center">
          <h4 className="w-full text-sm font-bold text-foreground mb-8 text-left">共享额度使用情况</h4>
          
          <div className="relative mb-12 flex h-32 w-32 items-center justify-center">
            {/* Simple circular progress visualization */}
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="currentColor" 
                className="text-muted-foreground/10"
                strokeWidth="8" 
              />
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="currentColor" 
                className="text-primary"
                strokeWidth="8" 
                strokeDasharray="282.7" 
                strokeDashoffset="282.7" 
                strokeLinecap="round"
              />
              <circle cx="50" cy="5" r="3" fill="currentColor" className="text-primary" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">0%</span>
              <span className="text-[10px] text-muted-foreground">已用</span>
            </div>
          </div>

          <div className="w-full space-y-3 mb-8">
            <UsageRow color="bg-primary" label="已用" value="0" />
            <UsageRow color="bg-green-500" label="剩余可用" value="0" />
            <UsageRow color="bg-muted-foreground/20" label="总额度" value="0" />
          </div>

          <button 
            onClick={() => setPurchaseDialogOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-bold text-background transition-opacity hover:opacity-90"
          >
            <CreditCard className="h-4 w-4" />
            购买额度
          </button>
        </div>

        {/* Purchase Dialogs */}
        <CreditPurchaseDialog 
          open={purchaseDialogOpen} 
          onOpenChange={setPurchaseDialogOpen} 
        />
        <PurchaseSeatsDialog 
          open={seatsDialogOpen}
          onOpenChange={setSeatsDialogOpen}
        />

        {/* Active Projects Card */}
        <div className="col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary mb-8">
            <TrendingUp className="h-4 w-4" />
            <h4 className="text-sm font-bold text-foreground">活跃项目</h4>
          </div>
          
          <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
            <span className="text-sm font-medium">暂无项目</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, className, onClick }: { icon: any, label: string, className?: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted/40 active:scale-95",
        className
      )}
    >
      <Icon className="h-4 w-4 opacity-70" />
      {label}
    </button>
  );
}

function StatBox({ icon: Icon, label, value, subValue, action }: { icon: any, label: string, value: string, subValue?: string, action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/20 p-6 border border-border/30 hover:border-primary/30 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="p-2 rounded-lg bg-background/50 border border-border/20 group-hover:text-primary transition-colors">
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        {action}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {subValue && <div className="text-xs text-muted-foreground font-medium">{subValue}</div>}
      </div>
    </div>
  );
}

function UsageRow({ color, label, value }: { color: string, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span className="text-xs text-foreground/80">{label}</span>
      </div>
      <span className="text-xs font-bold text-foreground">{value}</span>
    </div>
  );
}
