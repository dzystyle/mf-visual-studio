import * as React from "react";
import {
  Edit3,
  Share2,
  Trash2,
  Users,
  CreditCard,
  UserPlus,
  AlertTriangle,
  Flame,
  Wallet,
  CalendarClock,
  ChevronRight,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CreditPurchaseDialog } from "@/components/subscription/CreditPurchaseDialog";
import { PurchaseSeatsDialog } from "./PurchaseSeatsDialog";
import { PromptDialog, ConfirmDialog } from "./PromptDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTeam } from "@/lib/team-data";

interface TeamOverviewProps {
  onGoMembers?: (view: "list" | "approval") => void;
  onGoBudget?: () => void;
}

export function TeamOverview({ onGoMembers, onGoBudget }: TeamOverviewProps) {
  const {
    team,
    members,
    requests,
    currentUser,
    setCurrentUserId,
    memberCount,
    seatsLeft,
    creditsLeft,
    creditsUsed,
    creditsTotal,
    usagePercent,
    dailyBurn,
    daysLeft,
    runOutDate,
    alerts,
    renameTeam,
    transferOwner,
    dissolveTeam,
    can,
  } = useTeam();

  const [purchaseDialogOpen, setPurchaseDialogOpen] = React.useState(false);
  const [seatsDialogOpen, setSeatsDialogOpen] = React.useState(false);
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [dissolveOpen, setDissolveOpen] = React.useState(false);

  const roleText = currentUser.role === "owner" ? "所有者" : currentUser.role === "admin" ? "管理员" : "成员";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border/50 bg-card/30 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
              {team.name.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-foreground">{team.name}</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                  {team.plan}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                团队 ID: {team.id} · 席位 {memberCount}/{team.seats}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 当前身份切换（演示权限矩阵） */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted/40">
                  <Eye className="h-3.5 w-3.5" />
                  当前身份：{currentUser.name}（{roleText}）
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                {members.map((m) => (
                  <DropdownMenuItem key={m.id} onClick={() => setCurrentUserId(m.id)}>
                    {m.name}
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {m.role === "owner" ? "所有者" : m.role === "admin" ? "管理员" : "成员"}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {can("team.rename") && <ActionButton icon={Edit3} label="重命名" onClick={() => setRenameOpen(true)} />}
            {can("team.transfer") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted/40 active:scale-95">
                    <Share2 className="h-4 w-4 opacity-70" />
                    转让负责人
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {members.filter((m) => m.role !== "owner").length === 0 && (
                    <DropdownMenuItem disabled>暂无可转让的成员</DropdownMenuItem>
                  )}
                  {members
                    .filter((m) => m.role !== "owner")
                    .map((m) => (
                      <DropdownMenuItem
                        key={m.id}
                        onClick={() => {
                          transferOwner(m.id);
                          toast.success(`已将负责人转让给 ${m.name}`);
                        }}
                      >
                        {m.name}
                        <span className="ml-auto text-xs text-muted-foreground">{m.email}</span>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {can("team.dissolve") && (
              <ActionButton
                icon={Trash2}
                label="解散团队"
                className="text-destructive hover:bg-destructive/10 border-destructive/20"
                onClick={() => setDissolveOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* 三件事：还剩多少 / 能用到哪天 / 谁快超了 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HeroCard
          icon={Wallet}
          label="剩余可用"
          value={`${creditsLeft}`}
          unit="积分"
          hint={`累计 ${creditsTotal} · 已用 ${creditsUsed}（${usagePercent}%）`}
          action={
            <button
              onClick={() => setPurchaseDialogOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-[11px] font-bold text-background hover:opacity-90"
            >
              <CreditCard className="h-3 w-3" /> 充值
            </button>
          }
        />
        <HeroCard
          icon={Flame}
          label="日均消耗"
          value={`${dailyBurn}`}
          unit="积分/天"
          hint="近 14 天平均"
        />
        <HeroCard
          icon={CalendarClock}
          label="预计可用"
          value={daysLeft === null ? "充足" : `${daysLeft}`}
          unit={daysLeft === null ? "" : "天"}
          hint={runOutDate ? `按当前速度约在 ${runOutDate} 用尽` : "近期无消费，无法预测"}
          danger={daysLeft !== null && daysLeft <= 7}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待办 */}
        <div className="rounded-2xl border border-border/50 bg-card/30 p-6">
          <h4 className="text-sm font-bold text-foreground mb-5">待处理</h4>
          <div className="space-y-3">
            <TodoRow
              icon={Users}
              title={`${requests.length} 条加入申请待审核`}
              tone={requests.length > 0 ? "warn" : "ok"}
              actionLabel={requests.length > 0 ? "去审核" : undefined}
              onAction={() => onGoMembers?.("approval")}
            />
            <TodoRow
              icon={UserPlus}
              title={seatsLeft === 0 ? "席位已用满，无法批准新成员" : `剩余 ${seatsLeft} 个空闲席位`}
              tone={seatsLeft === 0 ? "warn" : "ok"}
              actionLabel={can("team.seats") ? "管理席位" : undefined}
              onAction={() => setSeatsDialogOpen(true)}
            />
            <TodoRow
              icon={AlertTriangle}
              title={alerts.length > 0 ? `${alerts.length} 个预算对象触发告警` : "所有预算均在安全范围"}
              tone={alerts.some((a) => a.status.level === "over") ? "danger" : alerts.length > 0 ? "warn" : "ok"}
              actionLabel={alerts.length > 0 ? "查看预算" : undefined}
              onAction={() => onGoBudget?.()}
            />
          </div>
        </div>

        {/* 告警明细 */}
        <div className="rounded-2xl border border-border/50 bg-card/30 p-6">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-sm font-bold text-foreground">超额与告警</h4>
            <button onClick={() => onGoBudget?.()} className="text-xs font-bold text-primary hover:opacity-80">
              预算与额度
            </button>
          </div>
          {alerts.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              暂无接近或超出预算的成员、分组与项目
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 6).map((a) => (
                <div
                  key={a.id}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-4 py-3",
                    a.status.level === "over"
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-amber-500/30 bg-amber-500/5",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-muted/40 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {a.scope}
                    </span>
                    <span className="text-sm font-bold text-foreground">{a.name}</span>
                  </div>
                  <span className={cn("text-xs font-bold", a.status.level === "over" ? "text-destructive" : "text-amber-500")}>
                    {a.status.periodLabel} {a.status.used}/{a.status.limit} · {a.status.percent}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreditPurchaseDialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen} />
      <PurchaseSeatsDialog open={seatsDialogOpen} onOpenChange={setSeatsDialogOpen} />
      <PromptDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title="重命名团队"
        label="团队名称"
        defaultValue={team.name}
        onConfirm={(v) => {
          renameTeam(v);
          toast.success("团队名称已更新");
        }}
      />
      <ConfirmDialog
        open={dissolveOpen}
        onOpenChange={setDissolveOpen}
        title={`解散团队「${team.name}」？`}
        description="解散后所有成员、分组与项目权限将被移除，且无法恢复。"
        confirmText="确认解散"
        onConfirm={() => {
          dissolveTeam();
          toast.success("团队已解散");
        }}
      />
    </div>
  );
}

function HeroCard({
  icon: Icon,
  label,
  value,
  unit,
  hint,
  action,
  danger,
}: {
  icon: any;
  label: string;
  value: string;
  unit?: string;
  hint: string;
  action?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="p-2 rounded-lg bg-background/50 border border-border/20">
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        {action}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={cn("text-3xl font-bold", danger ? "text-destructive" : "text-foreground")}>{value}</span>
        {unit && <span className="text-xs text-muted-foreground font-medium">{unit}</span>}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function TodoRow({
  icon: Icon,
  title,
  tone,
  actionLabel,
  onAction,
}: {
  icon: any;
  title: string;
  tone: "ok" | "warn" | "danger";
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3.5",
        tone === "danger"
          ? "border-destructive/30 bg-destructive/5"
          : tone === "warn"
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-border/30 bg-muted/10",
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "h-4 w-4",
            tone === "danger" ? "text-destructive" : tone === "warn" ? "text-amber-500" : "text-muted-foreground",
          )}
        />
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      {actionLabel && (
        <button onClick={onAction} className="flex items-center gap-0.5 text-xs font-bold text-primary hover:opacity-80">
          {actionLabel}
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function ActionButton({ icon: Icon, label, className, onClick }: { icon: any; label: string; className?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-muted/40 active:scale-95",
        className,
      )}
    >
      <Icon className="h-4 w-4 opacity-70" />
      {label}
    </button>
  );
}
