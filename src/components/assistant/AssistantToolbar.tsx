import { useEffect, useState } from "react";
import {
  RotateCw,
  X,
  Check,
  Sparkles,
  Wand2,
  Plus,
  Archive,
  Pencil,
  Trash2,
  CirclePlay,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreateSkillDialog } from "@/components/skill/CreateSkillDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ============================= Types =============================

type Session = {
  id: string;
  title: string;
  time: string;
  archived: boolean;
  current?: boolean;
};

type AgentSettings = {
  confirmMode: "all" | "skip-billing" | "skip-all";
  maxCredits: number;
  maxSteps: number;
  autoConfirmThreshold: number;
  autoRerunOnInputChange: boolean;
};

type SkillItem = {
  id: string;
  name: string;
  desc: string;
  tags: { label: string; tone: "purple" | "gray" | "blue" | "green" }[];
  version: string;
  steps: number;
  scope: string;
};

// ============================= Mock data =============================

const INITIAL_SESSIONS: Session[] = [
  { id: "ea68b987", title: "创作助手会话", time: "3 分钟前", archived: false, current: true },
  { id: "dd08390f", title: "帮我生成奇迹游戏的打斗的视频,视频中需要突出技能...", time: "2 小时前", archived: false },
  { id: "34ad7477", title: "创作助手会话", time: "1 天前", archived: false },
  { id: "dff81ae1", title: "创作助手会话", time: "1 天前", archived: false },
  { id: "9c21b0aa", title: "一拳超人游戏宣发视频策划", time: "3 天前", archived: true },
];

const DEFAULT_SKILLS: SkillItem[] = [
  {
    id: "sys-default",
    name: "默认创作流程",
    desc: "平台内置标准创作流程,适用于从零开始的视频或图片创作任务。流程包含: 1) 创作准备(收集媒体类型、画面比例、时长、素材...) 2) 剧本策划 3) 分镜生成 4) 视频合成。",
    tags: [
      { label: "创作", tone: "purple" },
      { label: "全局", tone: "gray" },
      { label: "系统", tone: "blue" },
    ],
    version: "v2.0.0",
    steps: 0,
    scope: "internal",
  },
];

const SETTINGS_KEY = "artrail-agent-settings";

const DEFAULT_SETTINGS: AgentSettings = {
  confirmMode: "all",
  maxCredits: 500,
  maxSteps: 20,
  autoConfirmThreshold: 50,
  autoRerunOnInputChange: false,
};

// ============================= Small pieces =============================

const TAG_TONE: Record<string, string> = {
  purple:
    "bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20",
  gray: "bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] border-[var(--color-border)]",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
};

function Tag({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold leading-none",
        TAG_TONE[tone]
      )}
    >
      {label}
    </span>
  );
}

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
        checked
          ? "border-[var(--color-primary)]"
          : "border-[var(--color-muted-foreground)]/40"
      )}
    >
      {checked && (
        <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
      )}
    </span>
  );
}

// ============================= Main toolbar =============================

export function AssistantToolbar({
  onRefreshHistory,
  onNewSession,
}: {
  onRefreshHistory?: () => void;
  onNewSession?: () => void;
}) {
  const [openPanel, setOpenPanel] = useState<"session" | "settings" | "skill" | null>(null);

  // ---------- sessions ----------
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [sessionTab, setSessionTab] = useState<"active" | "archived">("active");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // ---------- settings ----------
  const [settings, setSettings] = useState<AgentSettings>(DEFAULT_SETTINGS);
  const [draftSettings, setDraftSettings] = useState<AgentSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        setDraftSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      /* ignore */
    }
  }, []);

  // ---------- skills ----------
  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_SKILLS);
  const [createSkillOpen, setCreateSkillOpen] = useState(false);

  // ---------- session actions ----------
  const visibleSessions = sessions.filter((s) =>
    sessionTab === "active" ? !s.archived : s.archived
  );

  const archiveSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, archived: !s.archived } : s))
    );
    toast.success(sessionTab === "active" ? "会话已归档" : "会话已恢复");
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success("会话已删除");
  };

  const commitRename = (id: string) => {
    const v = renameValue.trim();
    if (v) {
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, title: v } : s))
      );
      toast.success("会话已重命名");
    }
    setRenamingId(null);
  };

  const refreshSessions = () => {
    setSessions((prev) => [...prev]);
    toast.success("会话列表已刷新");
  };

  const switchSession = (s: Session) => {
    setSessions((prev) => prev.map((x) => ({ ...x, current: x.id === s.id })));
    setOpenPanel(null);
    toast.success(`已切换到会话「${s.title.slice(0, 12)}${s.title.length > 12 ? "..." : ""}」`);
  };

  // ---------- settings actions ----------
  const saveSettings = () => {
    const clamp = (v: number, min: number, max: number) =>
      Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));
    const next: AgentSettings = {
      ...draftSettings,
      maxCredits: clamp(draftSettings.maxCredits, 1, 100000),
      maxSteps: clamp(draftSettings.maxSteps, 1, 200),
      autoConfirmThreshold: clamp(draftSettings.autoConfirmThreshold, 0, 100000),
    };
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    setOpenPanel(null);
    toast.success("Agent 设置已保存");
  };

  // ---------- skill actions ----------
  const useSkill = (skill: SkillItem) => {
    window.dispatchEvent(new CustomEvent("select-skill", { detail: skill.name }));
    setOpenPanel(null);
    toast.success(`已将「${skill.name}」带入输入框`);
  };

  const generateDraft = (kind: "draft" | "creative") => {
    const label = kind === "draft" ? "生成草稿" : "生成创作草稿";
    const id = toast.loading(`AI 正在${label}...`);
    setTimeout(() => {
      const newSkill: SkillItem = {
        id: `draft-${Date.now()}`,
        name: kind === "draft" ? "AI 生成草稿" : "AI 创作流程草稿",
        desc:
          kind === "draft"
            ? "基于当前会话上下文自动生成的 Skill 草稿,包含基础创作准备与分镜规划步骤,可继续编辑完善。"
            : "结合当前创作偏好与历史会话生成的完整创作流程草稿,覆盖策划、分镜、合成全链路。",
        tags: [
          { label: "创作", tone: "purple" },
          { label: "私有", tone: "green" },
          { label: "草稿", tone: "gray" },
        ],
        version: "v0.1.0",
        steps: 4,
        scope: "draft",
      };
      setSkills((prev) => [newSkill, ...prev]);
      toast.success(`${label}已完成,已加入列表`, { id });
    }, 1500);
  };

  // ---------- trigger button ----------
  const TriggerItem = ({
    panel,
    label,
  }: {
    panel: "session" | "settings" | "skill";
    label: string;
  }) => (
    <button
      className={cn(
        "px-2.5 py-1 text-[13px] font-medium transition-colors rounded-lg",
        openPanel === panel
          ? "text-[var(--color-primary)]"
          : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
      )}
    >
      {label}
    </button>
  );

  const inputCls =
    "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-[13px] font-medium text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]/50 focus:ring-2 focus:ring-[var(--color-primary)]/15 transition";

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/85 backdrop-blur-xl px-1.5 py-1 shadow-sm">
      {/* ================= 会话 ================= */}
      <Popover
        open={openPanel === "session"}
        onOpenChange={(o) => setOpenPanel(o ? "session" : null)}
      >
        <PopoverTrigger asChild>
          <span>
            <TriggerItem panel="session" label="会话" />
          </span>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={10}
          className="w-[400px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-0 shadow-2xl"
        >
          {/* tabs */}
          <div className="flex items-center border-b border-[var(--color-border)] px-4">
            {(
              [
                { key: "active", label: "进行中" },
                { key: "archived", label: "已归档" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setSessionTab(t.key)}
                className={cn(
                  "relative px-4 py-3 text-[14px] font-semibold transition-colors",
                  sessionTab === t.key
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                )}
              >
                {t.label}
                {sessionTab === t.key && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-[var(--color-primary)]" />
                )}
              </button>
            ))}
            <button
              onClick={refreshSessions}
              className="ml-auto flex items-center gap-1 px-2 py-1.5 text-[12px] font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              <RotateCw className="h-3 w-3" />
              刷新
            </button>
          </div>

          {/* list */}
          <div className="max-h-[380px] overflow-y-auto scrollbar-hide py-1.5">
            {visibleSessions.length === 0 && (
              <div className="py-10 text-center text-[13px] text-[var(--color-muted-foreground)]">
                暂无{sessionTab === "active" ? "进行中" : "已归档"}的会话
              </div>
            )}
            {visibleSessions.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "group mx-1.5 mb-1 rounded-xl px-3.5 py-3 transition-colors cursor-pointer",
                  s.current
                    ? "bg-[var(--color-primary)]/[0.07]"
                    : "hover:bg-[var(--color-secondary)]/70"
                )}
                onClick={() => !renamingId && switchSession(s)}
              >
                <div className="flex items-start justify-between gap-3">
                  {renamingId === s.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename(s.id);
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      onBlur={() => commitRename(s.id)}
                      className="flex-1 rounded-lg border border-[var(--color-primary)]/40 bg-[var(--color-background)] px-2 py-1 text-[13px] font-semibold outline-none"
                    />
                  ) : (
                    <div
                      className={cn(
                        "text-[14px] font-bold leading-snug line-clamp-1",
                        s.current
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-foreground)]"
                      )}
                    >
                      {s.title}
                    </div>
                  )}
                  <span className="shrink-0 text-[11px] text-[var(--color-muted-foreground)] pt-0.5">
                    {s.current ? (
                      <span className="font-semibold text-[var(--color-primary)]">当前</span>
                    ) : (
                      s.time
                    )}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[var(--color-muted-foreground)]/80">
                    {s.id}
                  </span>
                  <span className="text-[11px] text-[var(--color-muted-foreground)]">
                    {s.current ? s.time : ""}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      archiveSession(s.id);
                    }}
                    className="flex items-center gap-1 text-[12px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                  >
                    <Archive className="h-3 w-3" />
                    {sessionTab === "active" ? "归档" : "恢复"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingId(s.id);
                      setRenameValue(s.title);
                    }}
                    className="flex items-center gap-1 text-[12px] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                    重命名
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(s.id);
                    }}
                    className="flex items-center gap-1 text-[12px] text-[var(--color-muted-foreground)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* ================= 设置 ================= */}
      <Popover
        open={openPanel === "settings"}
        onOpenChange={(o) => {
          setOpenPanel(o ? "settings" : null);
          if (o) setDraftSettings(settings);
        }}
      >
        <PopoverTrigger asChild>
          <span>
            <TriggerItem panel="settings" label="设置" />
          </span>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={10}
          className="w-[400px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-0 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3.5">
            <span className="text-[15px] font-bold text-[var(--color-foreground)]">
              Agent 设置
            </span>
            <button
              onClick={() => setOpenPanel(null)}
              className="flex items-center gap-1 text-[12px] font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              关闭
            </button>
          </div>

          <div className="max-h-[440px] overflow-y-auto scrollbar-hide px-5 py-4 space-y-5">
            {/* 确认模式 */}
            <div className="rounded-xl border border-[var(--color-border)] p-4">
              <div className="text-[13px] font-bold text-[var(--color-foreground)]">
                确认模式{" "}
                <span className="font-normal text-[var(--color-muted-foreground)]">
                  (当前会话,选中即生效)
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {(
                  [
                    {
                      key: "all",
                      label: "全部弹框",
                      desc: "扣费确认 + 流程确认都弹",
                    },
                    {
                      key: "skip-billing",
                      label: "只跳过扣费确认",
                      desc: "自动执行生成,流程审阅仍确认",
                    },
                    {
                      key: "skip-all",
                      label: "全部跳过",
                      desc: "自动推进,引导卡仍会询问",
                    },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      const next = { ...settings, confirmMode: opt.key };
                      setSettings(next);
                      setDraftSettings(next);
                      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
                    }}
                    className="flex w-full items-start gap-2.5 rounded-lg px-1 py-0.5 text-left transition-colors hover:bg-[var(--color-secondary)]/60"
                  >
                    <RadioDot checked={settings.confirmMode === opt.key} />
                    <span className="text-[13px] leading-snug">
                      <span className="font-semibold text-[var(--color-foreground)]">
                        {opt.label}
                      </span>
                      <span className="text-[var(--color-muted-foreground)]">
                        {" "}
                        · {opt.desc}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 数值设置 */}
            <div>
              <div className="text-[13px] font-bold text-[var(--color-foreground)]">
                数值设置{" "}
                <span className="font-normal text-[var(--color-muted-foreground)]">
                  (全局,需点保存)
                </span>
              </div>
              <div className="mt-3 space-y-3.5">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[var(--color-muted-foreground)]">
                    最大积分消耗 (1-100000)
                  </label>
                  <input
                    type="number"
                    value={draftSettings.maxCredits}
                    onChange={(e) =>
                      setDraftSettings((p) => ({ ...p, maxCredits: Number(e.target.value) }))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[var(--color-muted-foreground)]">
                    最大步骤数 (1-200)
                  </label>
                  <input
                    type="number"
                    value={draftSettings.maxSteps}
                    onChange={(e) =>
                      setDraftSettings((p) => ({ ...p, maxSteps: Number(e.target.value) }))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[var(--color-muted-foreground)]">
                    自动确认阈值 (0-100000)
                  </label>
                  <input
                    type="number"
                    value={draftSettings.autoConfirmThreshold}
                    onChange={(e) =>
                      setDraftSettings((p) => ({
                        ...p,
                        autoConfirmThreshold: Number(e.target.value),
                      }))
                    }
                    className={inputCls}
                  />
                </div>
                <button
                  onClick={() =>
                    setDraftSettings((p) => ({
                      ...p,
                      autoRerunOnInputChange: !p.autoRerunOnInputChange,
                    }))
                  }
                  className="flex w-full items-center justify-between pt-1"
                >
                  <span className="text-[13px] font-medium text-[var(--color-foreground)]">
                    输入变更时自动重跑
                  </span>
                  <span
                    className={cn(
                      "flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border-2 transition-colors",
                      draftSettings.autoRerunOnInputChange
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
                        : "border-[var(--color-muted-foreground)]/40"
                    )}
                  >
                    {draftSettings.autoRerunOnInputChange && (
                      <Check className="h-3 w-3 text-[var(--color-primary-foreground)]" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[var(--color-border)] px-5 py-3.5">
            <button
              onClick={() => {
                setDraftSettings(settings);
                setOpenPanel(null);
              }}
              className="rounded-xl px-4 py-2 text-[13px] font-semibold text-[var(--color-muted-foreground)] hover:bg-[var(--color-secondary)] transition-colors"
            >
              取消
            </button>
            <button
              onClick={saveSettings}
              className="rounded-xl bg-[var(--color-primary)] px-5 py-2 text-[13px] font-semibold text-[var(--color-primary-foreground)] shadow-sm hover:opacity-90 transition-opacity"
            >
              保存
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {/* ================= Skill ================= */}
      <Popover
        open={openPanel === "skill"}
        onOpenChange={(o) => setOpenPanel(o ? "skill" : null)}
      >
        <PopoverTrigger asChild>
          <span>
            <TriggerItem panel="skill" label="Skill" />
          </span>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={10}
          className="w-[480px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-0 shadow-2xl"
        >
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-5 py-3.5">
            <span className="text-[15px] font-bold text-[var(--color-foreground)]">
              Skill 列表
            </span>
            <span className="text-[12px] font-medium text-[var(--color-muted-foreground)]">
              共 {skills.length} 个
            </span>
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={() => generateDraft("draft")}
                className="flex items-center gap-1 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-opacity"
              >
                <Sparkles className="h-3 w-3" />
                生成草稿
              </button>
              <button
                onClick={() => generateDraft("creative")}
                className="flex items-center gap-1 text-[12px] font-semibold text-purple-600 dark:text-purple-400 hover:opacity-80 transition-opacity"
              >
                <Wand2 className="h-3 w-3" />
                生成创作草稿
              </button>
              <button
                onClick={() => {
                  setOpenPanel(null);
                  setCreateSkillOpen(true);
                }}
                className="flex items-center gap-1 text-[12px] font-semibold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
              >
                <Plus className="h-3 w-3" />
                新建
              </button>
              <button
                onClick={() => setOpenPanel(null)}
                className="text-[12px] font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
              >
                关闭
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-hide px-3 py-3 space-y-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50 p-4 transition-colors hover:border-[var(--color-primary)]/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-bold text-[var(--color-foreground)]">
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {skill.tags.map((t) => (
                      <Tag key={t.label} label={t.label} tone={t.tone} />
                    ))}
                  </div>
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-muted-foreground)] line-clamp-2">
                  {skill.desc}
                </p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[var(--color-muted-foreground)]/80">
                    {skill.version}
                    <span className="mx-2 font-sans font-semibold">{skill.steps} 步</span>
                    {skill.scope}
                  </span>
                  <button
                    onClick={() => useSkill(skill)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[12px] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                  >
                    <CirclePlay className="h-3.5 w-3.5" />
                    使用
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--color-border)] px-5 py-3 text-center text-[11px] text-[var(--color-muted-foreground)]">
            私有 Skill 可编辑 / 停用;全局 Skill 只读
          </div>
        </PopoverContent>
      </Popover>

      <span className="mx-1 h-3.5 w-px bg-[var(--color-border)]" />

      {/* ================= 刷新历史 ================= */}
      <button
        onClick={() => onRefreshHistory?.()}
        className="px-2.5 py-1 text-[13px] font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors rounded-lg"
      >
        刷新历史
      </button>

      {/* ================= 新会话 ================= */}
      <button
        onClick={() => {
          onNewSession?.();
          const id = Math.random().toString(16).slice(2, 10);
          setSessions((prev) => [
            {
              id,
              title: "创作助手会话",
              time: "刚刚",
              archived: false,
              current: true,
            },
            ...prev.map((s) => ({ ...s, current: false })),
          ]);
          setSessionTab("active");
        }}
        className="px-2.5 py-1 text-[13px] font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors rounded-lg"
      >
        新会话
      </button>

      <CreateSkillDialog open={createSkillOpen} onOpenChange={setCreateSkillOpen} />
    </div>
  );
}
