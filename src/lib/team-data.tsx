import * as React from "react";

// ---------------- Types ----------------

export type MemberRole = "owner" | "admin" | "member";
export type QuotaType = "unlimited" | "periodic" | "fixed";
export type QuotaPeriod = "daily" | "weekly" | "monthly";
/** 超额行为：仅提醒 / 禁止生成 / 允许申请追加 */
export type OverflowPolicy = "notify" | "block" | "request";

export interface Quota {
  type: QuotaType;
  value: number;
  period?: QuotaPeriod;
  /** 告警阈值，百分比 0-100 */
  threshold?: number;
  overflow?: OverflowPolicy;
}

export const DEFAULT_THRESHOLD = 80;

export interface Member {
  id: string;
  name: string;
  email: string;
  initial: string;
  role: MemberRole;
  type: "内部" | "外部";
  quota: Quota;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  budget: Quota;
}

export interface ProjectMember {
  memberId: string;
  role: "owner" | "member";
  lastActive: string;
}

export interface Project {
  id: string;
  name: string;
  budget: Quota;
  members: ProjectMember[];
}

export interface PendingRequest {
  id: string;
  name: string;
  email: string;
  initial: string;
  createdAt: number;
}

export type TxType = "消费" | "分配" | "退款" | "调整" | "结转";

export interface Transaction {
  id: string;
  type: TxType;
  operatorId: string;
  operatorName: string;
  description: string;
  category: "图片" | "视频" | "音频" | "其他";
  projectId?: string;
  amount: number; // negative = 消费
  at: number; // timestamp
}

export interface TeamInfo {
  id: string;
  name: string;
  plan: string;
  seats: number;
}

export interface BudgetStatus {
  /** 是否有上限 */
  limited: boolean;
  limit: number;
  used: number;
  remaining: number;
  percent: number;
  level: "ok" | "warn" | "over";
  threshold: number;
  overflow: OverflowPolicy;
  periodLabel: string;
}

export interface BudgetAlert {
  id: string;
  scope: "成员" | "分组" | "项目" | "团队";
  name: string;
  status: BudgetStatus;
}

/** 权限能力位 */
export type Capability =
  | "team.rename"
  | "team.transfer"
  | "team.dissolve"
  | "team.seats"
  | "member.invite"
  | "member.approve"
  | "member.role"
  | "member.remove"
  | "budget.edit"
  | "group.manage"
  | "project.manage"
  | "billing.export";

const CAPABILITIES: Record<MemberRole, Capability[]> = {
  owner: [
    "team.rename",
    "team.transfer",
    "team.dissolve",
    "team.seats",
    "member.invite",
    "member.approve",
    "member.role",
    "member.remove",
    "budget.edit",
    "group.manage",
    "project.manage",
    "billing.export",
  ],
  admin: [
    "team.rename",
    "team.seats",
    "member.invite",
    "member.approve",
    "member.role",
    "member.remove",
    "budget.edit",
    "group.manage",
    "project.manage",
    "billing.export",
  ],
  member: [],
};

// ---------------- Helpers ----------------

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const ago = (days: number, hours = 0) => now - days * DAY - hours * 60 * 60 * 1000;

export function formatDateTime(ts: number) {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function formatDate(ts: number) {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60 * 60 * 1000) return `${Math.max(1, Math.round(diff / 60000))} 分钟前`;
  if (diff < DAY) return `${Math.round(diff / (60 * 60 * 1000))} 小时前`;
  return `${Math.round(diff / DAY)} 天前`;
}

export function quotaLabel(q: Quota) {
  if (q.type === "unlimited") return "无额度限制";
  if (q.type === "fixed") return `固定额度 ${q.value}`;
  const p = q.period === "daily" ? "每日" : q.period === "weekly" ? "每周" : "每月";
  return `${p} ${q.value} 积分`;
}

export const overflowLabel: Record<OverflowPolicy, string> = {
  notify: "仅提醒",
  block: "禁止生成",
  request: "允许申请追加",
};

/** 当前计费窗口的起点 */
export function periodStart(q: Quota): number {
  const d = new Date();
  if (q.type !== "periodic") return 0;
  if (q.period === "daily") {
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (q.period === "weekly") {
    const day = (d.getDay() + 6) % 7; // 周一为一周起点
    d.setHours(0, 0, 0, 0);
    return d.getTime() - day * DAY;
  }
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}

export function periodLabelOf(q: Quota) {
  if (q.type === "unlimited") return "不限";
  if (q.type === "fixed") return "累计";
  return q.period === "daily" ? "本日" : q.period === "weekly" ? "本周" : "本月";
}

function buildStatus(q: Quota, usedInWindow: number): BudgetStatus {
  const threshold = q.threshold ?? DEFAULT_THRESHOLD;
  const overflow = q.overflow ?? "notify";
  if (q.type === "unlimited" || q.value <= 0) {
    return {
      limited: false,
      limit: 0,
      used: usedInWindow,
      remaining: Infinity,
      percent: 0,
      level: "ok",
      threshold,
      overflow,
      periodLabel: periodLabelOf(q),
    };
  }
  const percent = Math.min(999, Math.round((usedInWindow / q.value) * 100));
  return {
    limited: true,
    limit: q.value,
    used: usedInWindow,
    remaining: Math.max(0, q.value - usedInWindow),
    percent,
    level: percent >= 100 ? "over" : percent >= threshold ? "warn" : "ok",
    threshold,
    overflow,
    periodLabel: periodLabelOf(q),
  };
}

// ---------------- Seed ----------------

const seedMembers: Member[] = [
  { id: "m-owner", name: "Zhangyu_4n6h", email: "zy28511116@gmail.com", initial: "Z", role: "owner", type: "内部", quota: { type: "unlimited", value: 0 }, groupId: "unassigned" },
  { id: "m-t1", name: "猫咪", email: "t1@aaa.com", initial: "猫", role: "admin", type: "内部", quota: { type: "periodic", value: 400, period: "monthly", threshold: 80, overflow: "notify" }, groupId: "tech" },
  { id: "m-t3", name: "猫咪2", email: "t3@aaa.com", initial: "猫", role: "member", type: "内部", quota: { type: "periodic", value: 300, period: "monthly", threshold: 80, overflow: "block" }, groupId: "tech" },
  { id: "m-t6", name: "猫咪3", email: "t6@aaa.com", initial: "猫", role: "member", type: "内部", quota: { type: "fixed", value: 500, threshold: 70, overflow: "request" }, groupId: "data" },
  { id: "m-a22", name: "aaa22", email: "a22@aaa.com", initial: "A", role: "member", type: "外部", quota: { type: "periodic", value: 200, period: "monthly", threshold: 80, overflow: "block" }, groupId: "data" },
];

const seedGroups: Group[] = [
  { id: "tech", name: "技术部", budget: { type: "periodic", value: 1200, period: "monthly", threshold: 80, overflow: "notify" } },
  { id: "data", name: "数据组", budget: { type: "periodic", value: 800, period: "monthly", threshold: 80, overflow: "notify" } },
  { id: "unassigned", name: "未分组", budget: { type: "unlimited", value: 0 } },
];

const seedProjects: Project[] = [
  {
    id: "p1",
    name: "P1",
    budget: { type: "periodic", value: 1000, period: "monthly", threshold: 80, overflow: "block" },
    members: [
      { memberId: "m-owner", role: "owner", lastActive: formatDateTime(ago(1, 3)) },
      { memberId: "m-t1", role: "member", lastActive: formatDateTime(ago(2)) },
      { memberId: "m-t3", role: "member", lastActive: "从未" },
      { memberId: "m-t6", role: "member", lastActive: "从未" },
      { memberId: "m-a22", role: "member", lastActive: "从未" },
    ],
  },
  {
    id: "p2",
    name: "P2",
    budget: { type: "periodic", value: 600, period: "monthly", threshold: 75, overflow: "notify" },
    members: [
      { memberId: "m-owner", role: "owner", lastActive: formatDateTime(ago(6)) },
      { memberId: "m-t1", role: "member", lastActive: "从未" },
      { memberId: "m-t3", role: "member", lastActive: "从未" },
    ],
  },
];

const seedRequests: PendingRequest[] = [
  { id: "r1", name: "李明", email: "liming@example.com", initial: "李", createdAt: ago(0, 1) },
  { id: "r2", name: "王小雨", email: "xiaoyu@example.com", initial: "王", createdAt: ago(0, 3) },
];

const seedTransactions: Transaction[] = [
  { id: "t0", type: "分配", operatorId: "m-owner", operatorName: "Zhangyu_4n6h", description: "套餐月度额度发放", category: "其他", amount: 3200, at: ago(31) },
  { id: "t1", type: "分配", operatorId: "m-owner", operatorName: "Zhangyu_4n6h", description: "兑换码充值", category: "其他", amount: 200, at: ago(20) },
  { id: "t2", type: "消费", operatorId: "m-t1", operatorName: "猫咪", description: "图片生成 · 画布《c1》", category: "图片", projectId: "p1", amount: -120, at: ago(1, 2) },
  { id: "t3", type: "消费", operatorId: "m-t1", operatorName: "猫咪", description: "图片生成 · 画布《c1》", category: "图片", projectId: "p1", amount: -80, at: ago(2, 5) },
  { id: "t4", type: "消费", operatorId: "m-t3", operatorName: "猫咪2", description: "视频生成 · 项目 P1", category: "视频", projectId: "p1", amount: -260, at: ago(4) },
  { id: "t5", type: "消费", operatorId: "m-t6", operatorName: "猫咪3", description: "图片生成", category: "图片", projectId: "p2", amount: -90, at: ago(9) },
  { id: "t6", type: "消费", operatorId: "m-t6", operatorName: "猫咪3", description: "音频生成 · 配音", category: "音频", projectId: "p2", amount: -40, at: ago(15) },
  { id: "t7", type: "消费", operatorId: "m-a22", operatorName: "aaa22", description: "视频生成 · 项目 P2", category: "视频", projectId: "p2", amount: -310, at: ago(26) },
  { id: "t8", type: "退款", operatorId: "m-owner", operatorName: "Zhangyu_4n6h", description: "生成失败退回", category: "其他", amount: 60, at: ago(27) },
  { id: "t9", type: "消费", operatorId: "m-t1", operatorName: "猫咪", description: "图片生成", category: "图片", projectId: "p1", amount: -150, at: ago(45) },
  { id: "t10", type: "消费", operatorId: "m-a22", operatorName: "aaa22", description: "视频生成", category: "视频", projectId: "p2", amount: -220, at: ago(68) },
];

// ---------------- Context ----------------

interface TeamState {
  team: TeamInfo;
  members: Member[];
  groups: Group[];
  projects: Project[];
  requests: PendingRequest[];
  transactions: Transaction[];
  dissolved: boolean;
  currentUser: Member;
}

interface TeamActions {
  setCurrentUserId: (id: string) => void;
  renameTeam: (name: string) => void;
  transferOwner: (memberId: string) => void;
  dissolveTeam: () => void;
  setSeats: (n: number) => void;
  addSeats: (n: number) => void;
  approveRequest: (id: string) => boolean;
  rejectRequest: (id: string) => void;
  removeMember: (id: string) => void;
  setMemberRole: (id: string, role: MemberRole) => void;
  setMemberQuota: (id: string, quota: Quota) => void;
  setMemberGroup: (id: string, groupId: string) => void;
  createGroup: (name: string) => void;
  renameGroup: (id: string, name: string) => void;
  deleteGroup: (id: string) => void;
  setGroupBudget: (id: string, budget: Quota) => void;
  createProject: (name: string) => void;
  deleteProject: (id: string) => void;
  setProjectBudget: (id: string, budget: Quota) => void;
  addProjectMember: (projectId: string, memberId: string) => void;
  removeProjectMember: (projectId: string, memberId: string) => void;
  setProjectMemberRole: (projectId: string, memberId: string, role: "owner" | "member") => void;
}

interface TeamDerived {
  creditsTotal: number;
  creditsUsed: number;
  creditsLeft: number;
  usagePercent: number;
  memberCount: number;
  groupCount: number;
  projectCount: number;
  seatsLeft: number;
  dailyBurn: number;
  daysLeft: number | null;
  runOutDate: string | null;
  alerts: BudgetAlert[];
  groupMembers: (groupId: string) => Member[];
  memberById: (id: string) => Member | undefined;
  memberStatus: (memberId: string) => BudgetStatus;
  groupStatus: (groupId: string) => BudgetStatus;
  projectStatus: (projectId: string) => BudgetStatus;
  /** 个人额度与所属项目/分组预算取交集，返回最先见底的一层 */
  effectiveLimit: (memberId: string) => { remaining: number; binding: string };
  can: (cap: Capability) => boolean;
}

export type TeamContextValue = TeamState & TeamActions & TeamDerived;

const TeamContext = React.createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = React.useState<TeamInfo>({ id: "29384756", name: "D", plan: "Starter Team", seats: 8 });
  const [members, setMembers] = React.useState<Member[]>(seedMembers);
  const [groups, setGroups] = React.useState<Group[]>(seedGroups);
  const [projects, setProjects] = React.useState<Project[]>(seedProjects);
  const [requests, setRequests] = React.useState<PendingRequest[]>(seedRequests);
  const [transactions] = React.useState<Transaction[]>(seedTransactions);
  const [dissolved, setDissolved] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState("m-owner");

  const currentUser = members.find((m) => m.id === currentUserId) ?? members[0];

  const spend = React.useMemo(() => transactions.filter((t) => t.amount < 0), [transactions]);

  const creditsTotal = React.useMemo(
    () => transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const creditsUsed = React.useMemo(() => spend.reduce((s, t) => s - t.amount, 0), [spend]);
  const creditsLeft = Math.max(0, creditsTotal - creditsUsed);
  const usagePercent = creditsTotal > 0 ? Math.round((creditsUsed / creditsTotal) * 100) : 0;

  // ---- 用量聚合（与流水实时打通）----

  const usedBy = React.useCallback(
    (predicate: (t: Transaction) => boolean, since: number) =>
      spend.filter((t) => t.at >= since && predicate(t)).reduce((s, t) => s - t.amount, 0),
    [spend],
  );

  const memberStatus = React.useCallback(
    (memberId: string): BudgetStatus => {
      const m = members.find((x) => x.id === memberId);
      const q = m?.quota ?? { type: "unlimited" as QuotaType, value: 0 };
      return buildStatus(q, usedBy((t) => t.operatorId === memberId, periodStart(q)));
    },
    [members, usedBy],
  );

  const groupStatus = React.useCallback(
    (groupId: string): BudgetStatus => {
      const g = groups.find((x) => x.id === groupId);
      const q = g?.budget ?? { type: "unlimited" as QuotaType, value: 0 };
      const ids = members.filter((m) => m.groupId === groupId).map((m) => m.id);
      return buildStatus(q, usedBy((t) => ids.includes(t.operatorId), periodStart(q)));
    },
    [groups, members, usedBy],
  );

  const projectStatus = React.useCallback(
    (projectId: string): BudgetStatus => {
      const p = projects.find((x) => x.id === projectId);
      const q = p?.budget ?? { type: "unlimited" as QuotaType, value: 0 };
      return buildStatus(q, usedBy((t) => t.projectId === projectId, periodStart(q)));
    },
    [projects, usedBy],
  );

  const effectiveLimit = React.useCallback(
    (memberId: string) => {
      const m = members.find((x) => x.id === memberId);
      const candidates: { remaining: number; binding: string }[] = [
        { remaining: creditsLeft, binding: "团队池" },
      ];
      const ms = memberStatus(memberId);
      if (ms.limited) candidates.push({ remaining: ms.remaining, binding: "个人额度" });
      if (m) {
        const gs = groupStatus(m.groupId);
        const g = groups.find((x) => x.id === m.groupId);
        if (gs.limited && g) candidates.push({ remaining: gs.remaining, binding: `分组「${g.name}」` });
      }
      projects
        .filter((p) => p.members.some((pm) => pm.memberId === memberId))
        .forEach((p) => {
          const ps = projectStatus(p.id);
          if (ps.limited) candidates.push({ remaining: ps.remaining, binding: `项目「${p.name}」` });
        });
      return candidates.reduce((a, b) => (b.remaining < a.remaining ? b : a));
    },
    [members, groups, projects, creditsLeft, memberStatus, groupStatus, projectStatus],
  );

  const alerts = React.useMemo<BudgetAlert[]>(() => {
    const out: BudgetAlert[] = [];
    members.forEach((m) => {
      const s = memberStatus(m.id);
      if (s.limited && s.level !== "ok") out.push({ id: `m-${m.id}`, scope: "成员", name: m.name, status: s });
    });
    groups.forEach((g) => {
      const s = groupStatus(g.id);
      if (s.limited && s.level !== "ok") out.push({ id: `g-${g.id}`, scope: "分组", name: g.name, status: s });
    });
    projects.forEach((p) => {
      const s = projectStatus(p.id);
      if (s.limited && s.level !== "ok") out.push({ id: `p-${p.id}`, scope: "项目", name: p.name, status: s });
    });
    return out.sort((a, b) => b.status.percent - a.status.percent);
  }, [members, groups, projects, memberStatus, groupStatus, projectStatus]);

  // ---- 燃尽预测 ----
  const dailyBurn = React.useMemo(() => {
    const since = Date.now() - 14 * DAY;
    const total = spend.filter((t) => t.at >= since).reduce((s, t) => s - t.amount, 0);
    return Math.round(total / 14);
  }, [spend]);
  const daysLeft = dailyBurn > 0 ? Math.floor(creditsLeft / dailyBurn) : null;
  const runOutDate = daysLeft !== null ? formatDate(Date.now() + daysLeft * DAY) : null;

  const can = React.useCallback(
    (cap: Capability) => CAPABILITIES[currentUser?.role ?? "member"].includes(cap),
    [currentUser],
  );

  const value: TeamContextValue = {
    team,
    members,
    groups,
    projects,
    requests,
    transactions,
    dissolved,
    currentUser,
    creditsTotal,
    creditsUsed,
    creditsLeft,
    usagePercent,
    memberCount: members.length,
    groupCount: groups.length,
    projectCount: projects.length,
    seatsLeft: Math.max(0, team.seats - members.length),
    dailyBurn,
    daysLeft,
    runOutDate,
    alerts,
    groupMembers: (groupId) => members.filter((m) => m.groupId === groupId),
    memberById: (id) => members.find((m) => m.id === id),
    memberStatus,
    groupStatus,
    projectStatus,
    effectiveLimit,
    can,

    setCurrentUserId,
    renameTeam: (name) => setTeam((t) => ({ ...t, name })),
    transferOwner: (memberId) =>
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, role: "owner" } : m.role === "owner" ? { ...m, role: "admin" } : m,
        ),
      ),
    dissolveTeam: () => setDissolved(true),
    setSeats: (n) => setTeam((t) => ({ ...t, seats: Math.max(members.length, n) })),
    addSeats: (n) => setTeam((t) => ({ ...t, seats: t.seats + n })),

    approveRequest: (id) => {
      const req = requests.find((r) => r.id === id);
      if (!req) return false;
      if (members.length >= team.seats) return false;
      setMembers((ms) =>
        ms.some((m) => m.id === `m-${req.id}`)
          ? ms
          : [
              ...ms,
              {
                id: `m-${req.id}`,
                name: req.name,
                email: req.email,
                initial: req.initial,
                role: "member" as MemberRole,
                type: "内部" as const,
                quota: { type: "periodic" as QuotaType, value: 200, period: "monthly" as QuotaPeriod, threshold: DEFAULT_THRESHOLD, overflow: "notify" as OverflowPolicy },
                groupId: "unassigned",
              },
            ],
      );
      setRequests((prev) => prev.filter((r) => r.id !== id));
      return true;
    },
    rejectRequest: (id) => setRequests((prev) => prev.filter((r) => r.id !== id)),

    removeMember: (id) => {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setProjects((prev) => prev.map((p) => ({ ...p, members: p.members.filter((pm) => pm.memberId !== id) })));
    },
    setMemberRole: (id, role) => setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m))),
    setMemberQuota: (id, quota) => setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, quota } : m))),
    setMemberGroup: (id, groupId) => setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, groupId } : m))),

    createGroup: (name) =>
      setGroups((prev) => [{ id: `g-${Date.now()}`, name, budget: { type: "unlimited", value: 0 } }, ...prev]),
    renameGroup: (id, name) => setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g))),
    deleteGroup: (id) => {
      if (id === "unassigned") return;
      setMembers((prev) => prev.map((m) => (m.groupId === id ? { ...m, groupId: "unassigned" } : m)));
      setGroups((prev) => prev.filter((g) => g.id !== id));
    },
    setGroupBudget: (id, budget) => setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, budget } : g))),

    createProject: (name) =>
      setProjects((prev) => [
        {
          id: `p-${Date.now()}`,
          name,
          budget: { type: "unlimited", value: 0 },
          members: [
            { memberId: members.find((m) => m.role === "owner")?.id ?? "m-owner", role: "owner", lastActive: "刚刚" },
          ],
        },
        ...prev,
      ]),
    deleteProject: (id) => setProjects((prev) => prev.filter((p) => p.id !== id)),
    setProjectBudget: (id, budget) => setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, budget } : p))),
    addProjectMember: (projectId, memberId) =>
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId && !p.members.some((m) => m.memberId === memberId)
            ? { ...p, members: [...p.members, { memberId, role: "member", lastActive: "从未" }] }
            : p,
        ),
      ),
    removeProjectMember: (projectId, memberId) =>
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, members: p.members.filter((m) => m.memberId !== memberId) } : p)),
      ),
    setProjectMemberRole: (projectId, memberId, role) =>
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, members: p.members.map((m) => (m.memberId === memberId ? { ...m, role } : m)) }
            : p,
        ),
      ),
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const ctx = React.useContext(TeamContext);
  if (!ctx) throw new Error("useTeam must be used inside <TeamProvider>");
  return ctx;
}

// ---------------- Shared utilities ----------------

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Normalises percentages so they always add up to exactly 100. */
export function normalizePercentages(values: number[]): number[] {
  const total = values.reduce((s, v) => s + v, 0);
  if (total <= 0) return values.map(() => 0);
  const raw = values.map((v) => (v / total) * 100);
  const floored = raw.map((v) => Math.floor(v));
  let remainder = 100 - floored.reduce((s, v) => s + v, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (const { i } of order) {
    if (remainder <= 0) break;
    floored[i] += 1;
    remainder -= 1;
  }
  return floored;
}
