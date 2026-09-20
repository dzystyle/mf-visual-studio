import * as React from "react";
import { Wallet, LayoutGrid, Folder, User, CreditCard, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CreditPurchaseDialog } from "@/components/subscription/CreditPurchaseDialog";
import { QuotaSettingsDialog } from "./QuotaSettingsDialog";
import { BudgetBar, LevelBadge } from "./BudgetBar";
import { useTeam, overflowLabel, type Quota } from "@/lib/team-data";

type EditTarget = {
  id: string;
  name: string;
  scope: "成员" | "分组" | "项目";
  quota: Quota;
};

export function BudgetQuota() {
  const {
    members,
    groups,
    projects,
    creditsTotal,
    creditsUsed,
    creditsLeft,
    usagePercent,
    memberStatus,
    groupStatus,
    projectStatus,
    effectiveLimit,
    setMemberQuota,
    setGroupBudget,
    setProjectBudget,
    can,
  } = useTeam();

  const [target, setTarget] = React.useState<EditTarget | null>(null);
  const [purchaseOpen, setPurchaseOpen] = React.useState(false);
  const editable = can("budget.edit");

  const save = (q: Quota) => {
    if (!target) return;
    if (target.scope === "成员") setMemberQuota(target.id, q);
    if (target.scope === "分组") setGroupBudget(target.id, q);
    if (target.scope === "项目") setProjectBudget(target.id, q);
    toast.success(`${target.name} 的预算已更新`);
  };

  return (
    <div className="space-y-6">
      {/* 第一层：团队池 */}
      <div className="rounded-2xl border border-border/50 bg-card/30 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">团队共享池</h3>
              <p className="text-xs text-muted-foreground">所有消费最终从这里扣减</p>
            </div>
          </div>
          <Button
            size="sm"
            className="h-9 gap-1.5 text-xs font-bold"
            onClick={() => setPurchaseOpen(true)}
          >
            <CreditCard className="h-3.5 w-3.5" />
            充值额度
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-5">
          <Metric label="累计入账" value={creditsTotal} />
          <Metric label="已消费" value={creditsUsed} />
          <Metric label="剩余可用" value={creditsLeft} highlight />
        </div>

        <div className="h-2 w-full rounded-full bg-muted/20 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", usagePercent >= 90 ? "bg-destructive" : usagePercent >= 70 ? "bg-amber-500" : "bg-primary")}
            style={{ width: `${Math.min(100, usagePercent)}%` }}
          />
        </div>
      </div>

      {/* 第二层：分组 / 项目 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section icon={LayoutGrid} title="分组预算" subtitle="按部门分钱">
          {groups.map((g) => (
            <BudgetRow
              key={g.id}
              name={g.name}
              meta={`${members.filter((m) => m.groupId === g.id).length} 人`}
              status={groupStatus(g.id)}
              editable={editable && g.id !== "unassigned"}
              onEdit={() => setTarget({ id: g.id, name: g.name, scope: "分组", quota: g.budget })}
            />
          ))}
        </Section>

        <Section icon={Folder} title="项目预算" subtitle="按项目分钱">
          {projects.length === 0 && <EmptyHint text="暂无项目" />}
          {projects.map((p) => (
            <BudgetRow
              key={p.id}
              name={p.name}
              meta={`${p.members.length} 人`}
              status={projectStatus(p.id)}
              editable={editable}
              onEdit={() => setTarget({ id: p.id, name: p.name, scope: "项目", quota: p.budget })}
            />
          ))}
        </Section>
      </div>

      {/* 第三层：成员 */}
      <Section icon={User} title="成员额度" subtitle="个人额度与所在项目/分组预算取交集，谁先见底谁封顶">
        {members.map((m) => {
          const status = memberStatus(m.id);
          const eff = effectiveLimit(m.id);
          return (
            <div key={m.id} className="rounded-xl border border-border/30 bg-muted/10 px-5 py-4">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3 w-56 shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {m.initial}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-foreground truncate">{m.name}</span>
                      <LevelBadge status={status} />
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">{m.email}</div>
                  </div>
                </div>

                <BudgetBar status={status} className="flex-1" showPolicy />

                <div className="w-52 text-right shrink-0">
                  <div className="text-xs text-muted-foreground">实际可用</div>
                  <div className="text-sm font-bold text-foreground">
                    {eff.remaining === Infinity ? "不限" : `${eff.remaining} 积分`}
                  </div>
                  <div className="text-[10px] text-muted-foreground/70">受限于 {eff.binding}</div>
                </div>

                {editable && (
                  <button
                    onClick={() => setTarget({ id: m.id, name: m.name, scope: "成员", quota: m.quota })}
                    className="text-xs font-bold text-primary hover:opacity-80 shrink-0"
                  >
                    编辑
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </Section>

      {!editable && (
        <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
          <ShieldAlert className="h-4 w-4" />
          当前身份为「成员」，只能查看预算，无法修改。
        </div>
      )}

      <CreditPurchaseDialog open={purchaseOpen} onOpenChange={setPurchaseOpen} />
      {target && (
        <QuotaSettingsDialog
          open={!!target}
          onOpenChange={(v) => !v && setTarget(null)}
          memberName={target.name}
          scopeLabel={target.scope}
          quota={target.quota}
          onSave={save}
        />
      )}
    </div>
  );
}

function Metric({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className={cn("text-2xl font-bold", highlight ? "text-primary" : "text-foreground")}>{value}</div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: any;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/30 p-6 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <span className="text-[11px] text-muted-foreground">· {subtitle}</span>
      </div>
      {children}
    </div>
  );
}

function BudgetRow({
  name,
  meta,
  status,
  editable,
  onEdit,
}: {
  name: string;
  meta: string;
  status: ReturnType<ReturnType<typeof useTeam>["groupStatus"]>;
  editable: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-xl border border-border/30 bg-muted/10 px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">{name}</span>
          <span className="text-[11px] text-muted-foreground">{meta}</span>
          <LevelBadge status={status} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground/70">
            {status.limited ? `超额：${overflowLabel[status.overflow]}` : "未设预算"}
          </span>
          {editable && (
            <button onClick={onEdit} className="text-xs font-bold text-primary hover:opacity-80">
              设置预算
            </button>
          )}
        </div>
      </div>
      <BudgetBar status={status} />
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return <div className="py-8 text-center text-xs text-muted-foreground">{text}</div>;
}
