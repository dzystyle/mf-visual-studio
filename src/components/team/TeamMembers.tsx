import * as React from "react";
import { Search, RefreshCw, UserCheck, ShieldCheck, Copy, Trash2, Clock, ChevronDown, AlertTriangle } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { QuotaSettingsDialog } from "./QuotaSettingsDialog";
import { ConfirmDialog } from "./PromptDialog";
import { BudgetBar, LevelBadge } from "./BudgetBar";
import { useTeam, relativeTime, type Member, type MemberRole } from "@/lib/team-data";

const roleLabel: Record<MemberRole, string> = { owner: "所有者", admin: "管理员", member: "成员" };

// --- Team Members Tab ---

export function TeamMembers() {
  const {
    members,
    team,
    seatsLeft,
    memberStatus,
    effectiveLimit,
    setMemberRole,
    setMemberQuota,
    removeMember,
    can,
  } = useTeam();
  const [quotaDialogOpen, setQuotaDialogOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [removeTarget, setRemoveTarget] = React.useState<Member | null>(null);
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  }, [members, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
          <span>
            席位：
            <span className="font-bold text-foreground ml-1">
              {members.length} / {team.seats}
            </span>
          </span>
          {seatsLeft === 0 && (
            <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-500">
              <AlertTriangle className="h-3 w-3" /> 席位已满
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="查找成员"
              className="h-9 w-48 bg-muted/30 pl-9 text-xs border-border/50 focus-visible:ring-primary/20"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs border-border/50 bg-card/50"
            onClick={() => toast.success("成员列表已刷新")}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            刷新
          </Button>
          {can("member.invite") && (
            <>
              <InviteButton />
              <InviteManagementButton />
            </>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/40 rounded-3xl bg-card/5">
          <p className="text-sm text-muted-foreground font-medium">没有匹配的成员</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((member) => {
            const status = memberStatus(member.id);
            const eff = effectiveLimit(member.id);
            return (
              <div key={member.id} className="rounded-2xl border border-border/40 bg-card/20 p-4 px-6 hover:bg-card/40 transition-colors">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4 w-64 shrink-0">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm",
                        member.role === "owner" ? "bg-primary/20 text-primary" : "bg-muted/40 text-muted-foreground",
                      )}
                    >
                      {member.initial}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[15px] font-bold text-foreground truncate">{member.name}</span>
                        {member.role === "owner" && <span className="text-amber-500 text-xs">👑</span>}
                        <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/80">
                          {member.type}
                        </span>
                        <LevelBadge status={status} />
                      </div>
                      <span className="text-xs text-muted-foreground/70 truncate">{member.email}</span>
                    </div>
                  </div>

                  <BudgetBar status={status} className="flex-1 max-w-sm" />

                  <div className="w-40 text-right shrink-0">
                    <div className="text-[11px] text-muted-foreground">实际可用</div>
                    <div className="text-sm font-bold text-foreground">
                      {eff.remaining === Infinity ? "不限" : `${eff.remaining} 积分`}
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 truncate">受限于 {eff.binding}</div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {member.role === "owner" ? (
                      <span className="text-sm font-bold text-muted-foreground w-20 text-center">所有者</span>
                    ) : (
                      <>
                        {can("member.role") ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1 text-xs font-bold text-muted-foreground hover:bg-transparent px-0"
                              >
                                {roleLabel[member.role]} <ChevronDown className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {(["member", "admin"] as MemberRole[]).map((r) => (
                                <DropdownMenuItem
                                  key={r}
                                  onClick={() => {
                                    setMemberRole(member.id, r);
                                    toast.success(`${member.name} 已设为${roleLabel[r]}`);
                                  }}
                                >
                                  {roleLabel[r]}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">{roleLabel[member.role]}</span>
                        )}

                        {can("budget.edit") && (
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setQuotaDialogOpen(true);
                            }}
                            className="text-[12px] font-bold text-primary hover:opacity-80 transition-opacity"
                          >
                            额度设置
                          </button>
                        )}
                        {can("member.remove") && (
                          <button
                            onClick={() => setRemoveTarget(member)}
                            className="text-[12px] font-bold text-muted-foreground hover:text-destructive transition-colors"
                          >
                            移除成员
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedMember && (
        <QuotaSettingsDialog
          open={quotaDialogOpen}
          onOpenChange={setQuotaDialogOpen}
          memberName={selectedMember.name}
          quota={selectedMember.quota}
          onSave={(q) => {
            setMemberQuota(selectedMember.id, q);
            toast.success(`${selectedMember.name} 的额度已更新`);
          }}
        />
      )}

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(v) => !v && setRemoveTarget(null)}
        title={`移除成员「${removeTarget?.name ?? ""}」？`}
        description="该成员将失去团队资源访问权限，并从所有项目中移除，席位同时释放。"
        confirmText="确认移除"
        onConfirm={() => {
          if (removeTarget) {
            removeMember(removeTarget.id);
            toast.success(`已移除 ${removeTarget.name}`);
          }
          setRemoveTarget(null);
        }}
      />
    </div>
  );
}

export function TeamApproval() {
  const { requests, approveRequest, rejectRequest, seatsLeft, team, members, can } = useTeam();
  const readOnly = !can("member.approve");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-foreground">待审核加入请求</h3>
          <p className="text-xs text-muted-foreground font-medium">
            用户通过邀请链接申请加入，审核通过后会占用一个团队席位
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn("text-xs font-bold", seatsLeft === 0 ? "text-amber-500" : "text-muted-foreground")}>
            剩余席位 {seatsLeft} / {team.seats}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-border/50 bg-card/50"
            onClick={() => toast.success("审核列表已刷新")}
          >
            <RefreshCw className="h-3 w-3" />
            刷新
          </Button>
        </div>
      </div>

      {seatsLeft === 0 && requests.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-medium text-amber-500">
          <AlertTriangle className="h-4 w-4" />
          席位已用满（{members.length}/{team.seats}），需先购买席位才能批准新成员。
        </div>
      )}

      {requests.length > 0 ? (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="rounded-2xl border border-border/40 bg-card/20 p-4 px-6 hover:bg-card/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/40 text-muted-foreground font-bold text-sm">
                      {req.initial}
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-destructive border-2 border-card" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] font-bold text-foreground">{req.name}</span>
                      <span className="text-[10px] text-primary font-bold bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                        新申请
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                      <span>{req.email}</span>
                      <span className="h-1 w-1 rounded-full bg-muted/30" />
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {relativeTime(req.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {readOnly ? (
                  <span className="text-xs text-muted-foreground">无审核权限</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-4 gap-1.5 text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        rejectRequest(req.id);
                        toast.success(`已拒绝 ${req.name} 的申请`);
                      }}
                    >
                      拒绝申请
                    </Button>
                    <Button
                      size="sm"
                      disabled={seatsLeft === 0}
                      className="h-9 px-6 gap-2 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40"
                      onClick={() => {
                        const ok = approveRequest(req.id);
                        if (ok) toast.success(`${req.name} 已加入团队`);
                        else toast.error("席位不足，请先购买席位");
                      }}
                    >
                      <UserCheck className="h-4 w-4" />
                      准许加入
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/40 rounded-3xl bg-card/5">
          <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">暂无待审核的加入请求</p>
          <p className="text-xs text-muted-foreground/50 mt-1">当有新成员申请加入时，这里会显示提醒</p>
        </div>
      )}
    </div>
  );
}

// --- Unified Invite Dialog（内部/外部只是链接类型）---

function InviteButton() {
  const { seatsLeft } = useTeam();
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<"内部" | "外部">("内部");
  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const inviteUrl = `${origin}/invite/${type === "内部" ? "in" : "ex"}-2cebbd087a2c`;

  return (
    <>
      <Button size="sm" className="h-9 gap-1.5 text-xs font-bold px-4" onClick={() => setOpen(true)}>
        邀请成员
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[480px] bg-card border-border/60 p-8">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold">邀请成员</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-6">
            分享链接邀请他人加入团队，对方提交后需在「加入审核」中批准。
          </p>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              {(["内部", "外部"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition-all",
                    type === t ? "border-primary bg-primary/10" : "border-border/40 bg-muted/20 hover:bg-muted/30",
                  )}
                >
                  <div className={cn("text-sm font-bold", type === t ? "text-primary" : "text-foreground")}>
                    {t}成员
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {t === "内部" ? "同公司同事，默认月度额度" : "外包/合作方，默认受限额度"}
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground">邀请链接</label>
              <div className="flex gap-2">
                <Input readOnly value={inviteUrl} className="h-11 bg-muted/30 border-border/40 text-sm font-medium" />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteUrl);
                    toast.success("邀请链接已复制");
                  }}
                  className="h-11 px-6 font-bold"
                >
                  复制
                </Button>
              </div>
            </div>

            <div className="rounded-xl bg-muted/20 p-4 border border-border/20 space-y-1 text-xs text-muted-foreground">
              <div>· 此链接 7 天内有效。</div>
              <div className={cn(seatsLeft === 0 && "text-amber-500 font-bold")}>
                · 当前剩余席位 {seatsLeft} 个{seatsLeft === 0 ? "，需先购买席位才能通过审核。" : "。"}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// --- Invite Management Dialog ---

interface Invitation {
  id: string;
  type: "内部" | "外部";
  status: "有效" | "已撤销";
  used: number;
  limit: string;
  expiry: string;
}

function InviteManagementButton() {
  const [open, setOpen] = React.useState(false);
  const [invitations, setInvitations] = React.useState<Invitation[]>([
    { id: "i1", type: "内部", status: "有效", used: 0, limit: "∞", expiry: "2026-09-26 19:09:20" },
    { id: "i2", type: "内部", status: "有效", used: 2, limit: "∞", expiry: "2026-09-25 19:09:02" },
    { id: "i3", type: "外部", status: "有效", used: 0, limit: "∞", expiry: "2026-09-24 19:08:57" },
  ]);

  return (
    <>
      <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs border-border/50" onClick={() => setOpen(true)}>
        邀请管理
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] bg-card border-border/60 p-8">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-bold">邀请管理</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-8">
            查看本团队已发出的邀请链接、使用情况，并可撤销未过期的链接。
          </p>

          <div className="w-full">
            <div className="grid grid-cols-5 gap-4 px-4 pb-4 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40">
              <span>类型</span>
              <span>状态</span>
              <span>已用/上限</span>
              <span>过期时间</span>
              <span className="text-right pr-2">操作</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2">
              {invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="grid grid-cols-5 gap-4 px-4 py-6 text-sm items-center border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors"
                >
                  <span className="font-medium text-foreground">{invite.type}</span>
                  <div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500">
                      {invite.status}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {invite.used} / {invite.limit}
                  </span>
                  <span className="text-muted-foreground/80 font-mono text-xs">{invite.expiry}</span>
                  <div className="flex justify-end gap-3">
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/invite/${invite.id}`);
                        toast.success("邀请链接已复制");
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => {
                        setInvitations((prev) => prev.filter((i) => i.id !== invite.id));
                        toast.success("邀请链接已撤销");
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {invitations.length === 0 && (
                <div className="py-16 text-center text-sm text-muted-foreground">暂无邀请链接</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
