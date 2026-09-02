import { useState } from "react";
import {
  Check,
  Loader2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  ChevronDown,
  FileText,
  Sparkles,
  Globe,
  Terminal,
  Film,
  Music,
  Image as ImageIcon,
  PenTool,
  Scissors,
  RotateCcw,
  MessageCirclePlus,
  Download,
  Eraser,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Block, FlowOption } from "@/lib/agent-flow";

/* ---------------- 基础行 ---------------- */

export function ToolRunLine({
  label,
  detail,
  state = "done",
}: {
  label: string;
  detail?: string;
  state?: "done" | "running" | "error";
}) {
  const Icon =
    label.includes("联网")
      ? Globe
      : label.includes("执行命令")
        ? Terminal
        : label.includes("视频")
          ? Film
          : label.includes("图片") || label.includes("图像")
            ? ImageIcon
            : FileText;
  return (
    <div className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-2.5 shadow-sm">
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          state === "error"
            ? "bg-[#FF3B30]/15 text-[#FF3B30]"
            : state === "running"
              ? "bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]"
              : "bg-[#34C759]/15 text-[#34C759]"
        )}
      >
        {state === "running" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : state === "error" ? (
          <XCircle className="h-3.5 w-3.5" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </span>
      <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted-foreground)]" />
      <span className="shrink-0 text-[13px] font-bold text-[var(--color-foreground)]">{label}</span>
      {detail && (
        <span className="truncate text-[12px] text-[var(--color-muted-foreground)]">{detail}</span>
      )}
    </div>
  );
}

export function ModeBadge({ mode, label }: { mode: "enter" | "exit"; label: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold shadow-sm",
        mode === "enter"
          ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          : "border border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]"
      )}
    >
      <Sparkles className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

export function SkillTag({ name }: { name: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-1.5 text-[12px] font-bold text-[var(--color-foreground)] shadow-sm">
      <span className="text-[var(--color-muted-foreground)]">技能学习</span>
      <span className="h-3 w-px bg-[var(--color-border)]" />
      {name}
    </div>
  );
}

export function TaskPlanLine({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-muted-foreground)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
      {label}
    </div>
  );
}

/* ---------------- 结构化卡片 ---------------- */

export function RequirementCard({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="w-full max-w-xl space-y-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
      {items.map((it) => (
        <div key={it.label} className="flex gap-3 text-[14px]">
          <span className="shrink-0 font-bold text-[var(--color-foreground)]">{it.label}</span>
          <span className="text-[var(--color-muted-foreground)]">{it.value}</span>
        </div>
      ))}
    </div>
  );
}

export function SearchResultBlock({
  count,
  summary,
  hits,
}: {
  count: number;
  summary: string;
  hits: { title: string; score: number; note: string }[];
}) {
  return (
    <div className="w-full max-w-xl space-y-3">
      <ToolRunLine label="联网搜索" detail={`完成 ${count} 次搜索`} />
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
        <div className="mb-3 text-[14px] leading-relaxed text-[var(--color-foreground)]">{summary}</div>
        <div className="space-y-2">
          {hits.map((h) => (
            <div
              key={h.title}
              className="flex items-center justify-between gap-3 rounded-xl bg-[var(--color-secondary)] px-3 py-2"
            >
              <div className="min-w-0">
                <div className="truncate text-[13px] font-bold">{h.title}</div>
                <div className="truncate text-[12px] text-[var(--color-muted-foreground)]">{h.note}</div>
              </div>
              <div className="shrink-0 rounded-full bg-[var(--color-card)] px-2.5 py-1 text-[11px] font-bold text-[var(--color-muted-foreground)]">
                hot_score {h.score.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GateResultBlock({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string; ok: boolean }[];
}) {
  return (
    <div className="w-full max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
      <div className="mb-3 text-[13px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
        {title}
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-3 text-[14px]">
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                r.ok ? "bg-[#34C759]/15 text-[#34C759]" : "bg-[#FF9500]/15 text-[#FF9500]"
              )}
            >
              {r.ok ? <Check className="h-2.5 w-2.5" /> : <AlertTriangle className="h-2.5 w-2.5" />}
            </span>
            <span className="shrink-0 font-bold">{r.label}</span>
            <span className="text-[var(--color-muted-foreground)]">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReasoningBlock({
  title,
  sections,
  table,
}: {
  title: string;
  sections: { title: string; lines: string[] }[];
  table?: { head: string[]; rows: string[][] };
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[var(--color-secondary)]"
      >
        <span className="text-[14px] font-bold">{title}</span>
        <span className="flex items-center gap-2 text-[12px] text-[var(--color-muted-foreground)]">
          {open ? "收起推演" : "展开推演"}
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-[var(--color-border)] px-4 py-4">
          {sections.map((sec) => (
            <div key={sec.title}>
              <div className="mb-1.5 text-[13px] font-bold text-[var(--color-foreground)]">{sec.title}</div>
              <ul className="space-y-1">
                {sec.lines.map((l, i) => (
                  <li key={i} className="text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">
                    · {l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {table && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="text-[var(--color-muted-foreground)]">
                    {table.head.map((h) => (
                      <th key={h} className="whitespace-nowrap py-2 pr-4 font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i} className="border-t border-[var(--color-border)]">
                      {row.map((cell, j) => (
                        <td key={j} className="whitespace-nowrap py-2 pr-4">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ArtifactCard({
  name,
  path,
  onOpen,
}: {
  name: string;
  path: string;
  onOpen?: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="mt-1 flex w-full max-w-sm items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-left shadow-sm transition-all hover:border-[var(--color-muted-foreground)]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-bold">{name}</div>
          <div className="truncate text-[11px] text-[var(--color-muted-foreground)]">{path}</div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-[12px] text-[var(--color-muted-foreground)]">
        查看文件 <ChevronRight className="h-3 w-3" />
      </div>
    </button>
  );
}

export function StoryboardTable({
  rows,
  total,
}: {
  rows: { id: string; seconds: number; link: string; assets: string; summary: string }[];
  total: number;
}) {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <span className="text-[14px] font-bold">分镜总览</span>
        <span className="text-[12px] text-[var(--color-muted-foreground)]">
          {rows.length} 段 · 共 {total} 秒
        </span>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {rows.map((r) => (
          <div key={r.id} className="flex items-start gap-3 px-4 py-3">
            <span className="shrink-0 rounded-md bg-[var(--color-secondary)] px-2 py-1 text-[12px] font-bold">
              {r.id}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold">{r.summary}</div>
              <div className="truncate text-[12px] text-[var(--color-muted-foreground)]">{r.assets}</div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[13px] font-bold">{r.seconds}s</div>
              <div className="text-[12px] text-[var(--color-muted-foreground)]">{r.link}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuditChecklist({
  errors,
  warns,
  checks,
}: {
  errors: string[];
  warns: string[];
  checks: string[];
}) {
  return (
    <div className="w-full max-w-2xl space-y-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
      <div className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
        机械验算 · 自审
      </div>
      {errors.length === 0 && (
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#34C759]">
          <Check className="h-3.5 w-3.5" /> ERROR 0
        </div>
      )}
      {errors.map((e, i) => (
        <div key={i} className="flex items-start gap-2 text-[13px] text-[#FF3B30]">
          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> ERROR：{e}
        </div>
      ))}
      {warns.map((w, i) => (
        <div key={i} className="flex items-start gap-2 text-[13px] text-[#FF9500]">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> WARN：{w}
        </div>
      ))}
      {checks.map((c, i) => (
        <div key={i} className="flex items-start gap-2 text-[13px] text-[var(--color-muted-foreground)]">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#34C759]" /> {c}
        </div>
      ))}
    </div>
  );
}

function ActionItem({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) {
  return (
    <div className="group/act relative">
      <button className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--color-foreground)] transition-colors hover:bg-black/5 dark:hover:bg-white/10">
        {icon}
      </button>
      <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/85 px-2 py-1 text-[11px] font-bold text-white opacity-0 transition-opacity group-hover/act:opacity-100">
        {tooltip}
      </span>
    </div>
  );
}

export function MediaResultCard({
  mediaType,
  title,
  subtitle,
  url,
  poster,
  duration,
  onAnnotate,
}: {
  mediaType: "image" | "audio" | "video";
  title: string;
  subtitle?: string;
  url?: string;
  poster?: string;
  duration?: string;
  onAnnotate?: () => void;
}) {
  if (mediaType === "audio") {
    return (
      <div className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
          <Music className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-[14px] font-bold">{title}</div>
          <div className="truncate text-[12px] text-[var(--color-muted-foreground)]">{subtitle}</div>
        </div>
      </div>
    );
  }

  if (mediaType === "image") {
    return (
      <div className="group/img relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
        {url ? (
          <img src={url} alt={title} loading="lazy" className="w-full object-cover" />
        ) : (
          <div className="flex aspect-video items-center justify-center bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
        <div className="px-3 py-2">
          <div className="text-[13px] font-bold">{title}</div>
          {subtitle && <div className="text-[12px] text-[var(--color-muted-foreground)]">{subtitle}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="group/video relative w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-lg">
      {url ? (
        <video src={url} poster={poster} className="aspect-video w-full object-cover" controls muted loop />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]">
          <Film className="h-8 w-8" />
        </div>
      )}
      <div className="pointer-events-none absolute left-2 top-2 rounded bg-black/45 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
        AI 生成
      </div>
      {duration && (
        <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
          {duration}
        </div>
      )}
      <div className="pointer-events-none absolute bottom-2 right-2 max-w-[70%] truncate rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
        {title}
      </div>
      <div className="absolute right-3 top-3 z-20 flex -translate-y-2 items-center gap-1.5 rounded-2xl border border-white/20 bg-white/95 p-1.5 opacity-0 shadow-2xl backdrop-blur-2xl transition-all duration-300 group-hover/video:translate-y-0 group-hover/video:opacity-100 dark:bg-black/80">
        <div onClick={onAnnotate}>
          <ActionItem icon={<PenTool className="h-4 w-4" />} tooltip="标注视频帧" />
        </div>
        <ActionItem icon={<Scissors className="h-4 w-4" />} tooltip="去剪辑" />
        <ActionItem icon={<RotateCcw className="h-4 w-4" />} tooltip="重新生成" />
        <ActionItem icon={<MessageCirclePlus className="h-4 w-4" />} tooltip="引用到输入框" />
        <div className="mx-0.5 h-4 w-px bg-black/10 dark:bg-white/10" />
        <ActionItem icon={<span className="text-[10px] font-bold">HD</span>} tooltip="提升画质" />
        <ActionItem icon={<Eraser className="h-4 w-4" />} tooltip="字幕擦除" />
        <ActionItem icon={<Download className="h-4 w-4" />} tooltip="下载" />
        <ActionItem icon={<VolumeX className="h-4 w-4" />} tooltip="静音" />
      </div>
    </div>
  );
}

export function FinalCutSummary({
  duration,
  segments,
  suggestions,
}: {
  duration: string;
  segments: string[];
  suggestions: string[];
}) {
  return (
    <div className="w-full max-w-2xl space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
      <div className="text-[15px] font-bold">成片已完成！{duration}，多段拼接，故事完整呈现。</div>
      <div className="space-y-2">
        <div className="text-[13px] font-bold text-[var(--color-muted-foreground)]">成片概要</div>
        {segments.map((s, i) => (
          <div key={i} className="text-[13px] leading-relaxed text-[var(--color-muted-foreground)]">
            {s}
          </div>
        ))}
      </div>
      <div className="space-y-1.5 border-t border-[var(--color-border)] pt-3">
        <div className="text-[13px] font-bold text-[var(--color-muted-foreground)]">你可以选择</div>
        {suggestions.map((s, i) => (
          <div key={i} className="text-[13px] text-[var(--color-foreground)]">
            · {s}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OptionsCard({
  title,
  options,
  selected,
  onSelect,
  index,
  total,
}: {
  title: string;
  options: FlowOption[];
  selected?: string;
  onSelect: (opt: FlowOption) => void;
  index?: number;
  total?: number;
}) {
  const submitted = !!selected;
  const [draft, setDraft] = useState<string | undefined>(undefined);
  const current = selected ?? draft;
  return (
    <div className="w-full max-w-2xl rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-6">
        <h3 className="text-[16px] font-bold leading-relaxed text-[var(--color-foreground)]">{title}</h3>
        {submitted && (
          <div className="shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] px-3 py-1 text-[12px] font-bold text-[var(--color-muted-foreground)]">
            已提交
          </div>
        )}
      </div>
      <div className="mt-5 space-y-2">
        {options.map((opt, i) => {
          const active = current === opt.key;
          return (
            <button
              key={opt.key}
              disabled={submitted}
              onClick={() => setDraft(opt.key)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all",
                active
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/8"
                  : "border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-secondary)]",
                submitted && !active && "opacity-45"
              )}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--color-secondary)] text-[12px] font-bold text-[var(--color-muted-foreground)]">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-medium text-[var(--color-foreground)]">{opt.label}</span>
                {opt.desc && (
                  <span className="mt-0.5 block text-[13px] text-[var(--color-muted-foreground)]">{opt.desc}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        {typeof index === "number" && typeof total === "number" ? (
          <div className="text-[12px] font-bold text-[var(--color-muted-foreground)]">
            {index}/{total}
          </div>
        ) : (
          <span />
        )}
        {!submitted && (
          <button
            disabled={!draft}
            onClick={() => {
              const opt = options.find((o) => o.key === draft);
              if (opt) onSelect(opt);
            }}
            className={cn(
              "rounded-full px-5 py-2 text-[13px] font-bold transition-all",
              draft
                ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90"
                : "cursor-not-allowed bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]"
            )}
          >
            确认选择
          </button>
        )}
      </div>
    </div>
  );
}


/* ---------------- 分发器 ---------------- */

export function FlowBlockView({
  block,
  selected,
  onSelect,
  onOpenArtifact,
  onAnnotate,
  mediaUrls,
}: {
  block: Block;
  selected?: string;
  onSelect?: (id: string, opt: FlowOption) => void;
  onOpenArtifact?: (name: string) => void;
  onAnnotate?: () => void;
  mediaUrls?: { image?: string; video?: string; poster?: string };
}) {
  switch (block.kind) {
    case "text":
      return (
        <div className="max-w-2xl whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--color-foreground)]">
          {block.text}
        </div>
      );
    case "mode":
      return <ModeBadge mode={block.mode} label={block.label} />;
    case "skill":
      return <SkillTag name={block.name} />;
    case "requirement":
      return <RequirementCard items={block.items} />;
    case "search":
      return <SearchResultBlock count={block.count} summary={block.summary} hits={block.hits} />;
    case "tool":
      return <ToolRunLine label={block.label} detail={block.detail} state={block.state} />;
    case "taskplan":
      return <TaskPlanLine label={block.label} />;
    case "gate":
      return <GateResultBlock title={block.title} rows={block.rows} />;
    case "reasoning":
      return <ReasoningBlock title={block.title} sections={block.sections} table={block.table} />;
    case "artifact":
      return <ArtifactCard name={block.name} path={block.path} onOpen={() => onOpenArtifact?.(block.name)} />;
    case "storyboard":
      return <StoryboardTable rows={block.rows} total={block.total} />;
    case "audit":
      return <AuditChecklist errors={block.errors} warns={block.warns} checks={block.checks} />;
    case "media":
      return (
        <MediaResultCard
          mediaType={block.mediaType}
          title={block.title}
          subtitle={block.subtitle}
          url={block.url ?? (block.mediaType === "video" ? mediaUrls?.video : mediaUrls?.image)}
          poster={block.poster ?? mediaUrls?.poster}
          duration={block.duration}
          onAnnotate={onAnnotate}
        />
      );
    case "finalcut":
      return (
        <FinalCutSummary duration={block.duration} segments={block.segments} suggestions={block.suggestions} />
      );
    case "options":
      return (
        <OptionsCard
          title={block.title}
          options={block.options}
          selected={selected}
          onSelect={(opt) => onSelect?.(block.id, opt)}
        />
      );
    default:
      return null;
  }
}
