import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Grid3x3, ListChecks, Palette, Settings2, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconSheetDraft = {
  gridCount: number;
  gridLayout: string;
  theme: string;
  style: string;
  normalCount: number;
  fineCount: number;
  items: { name: string; tier: "normal" | "fine" }[];
  palette: { name: string; hex: string }[];
};

const FOOD_POOL = [
  "浆果罐头", "焦糖苹果", "熏肉卷", "蜂蜜面包", "腌黄瓜", "南瓜派", "蘑菇汤", "烤鱼串",
  "夜莓果酱", "黑麦饼干", "月光牛奶", "糖霜纸杯", "血橙汽水", "松露炖肉", "星屑布丁", "幽灵棉花糖",
];

const DONT_STARVE_PALETTE = [
  { name: "焦土棕", hex: "#3B2B20" },
  { name: "羊皮纸", hex: "#D9C29A" },
  { name: "苔藓绿", hex: "#6B7A4B" },
  { name: "锈红", hex: "#A4462E" },
  { name: "暮色紫", hex: "#4A3B57" },
  { name: "月牙白", hex: "#F1E7D0" },
];

export function buildIconSheetDraft(prompt: string): IconSheetDraft {
  const numMatch = prompt.match(/(\d{1,3})\s*(?:个|张|枚)/);
  const gridCount = numMatch ? Math.min(64, Math.max(4, Number(numMatch[1]))) : 16;
  const fineMatch = prompt.match(/后\s*(\d{1,3})\s*(?:个)?\s*精致/);
  const normalMatch = prompt.match(/前\s*(\d{1,3})\s*(?:个)?\s*普通/);
  const fineCount = fineMatch ? Number(fineMatch[1]) : Math.round(gridCount * 0.375);
  const normalCount = normalMatch ? Number(normalMatch[1]) : gridCount - fineCount;
  const theme = /食物|美食|料理/.test(prompt) ? "食物" : /武器/.test(prompt) ? "武器" : /道具/.test(prompt) ? "道具" : "食物";
  const style = prompt.match(/([^\s，,。]{2,10}风)/)?.[1] ?? "黑暗童话风";
  const side = Math.ceil(Math.sqrt(gridCount));

  const items = Array.from({ length: gridCount }, (_, i) => ({
    name: FOOD_POOL[i % FOOD_POOL.length],
    tier: (i < normalCount ? "normal" : "fine") as "normal" | "fine",
  }));

  return {
    gridCount,
    gridLayout: `${side} × ${Math.ceil(gridCount / side)}`,
    theme,
    style,
    normalCount,
    fineCount,
    items,
    palette: DONT_STARVE_PALETTE,
  };
}

function Card({
  icon: Icon,
  index,
  title,
  subtitle,
  children,
}: {
  icon: any;
  index: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-muted)]">
          <Icon className="h-4.5 w-4.5 text-[var(--color-foreground)]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[15px] font-semibold text-[var(--color-foreground)]">
            <span className="text-[11px] font-bold text-[var(--color-muted-foreground)]">0{index}</span>
            {title}
          </div>
          <div className="mt-0.5 text-[12px] text-[var(--color-muted-foreground)]">{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-[12px] transition",
        active
          ? "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          : "border-[var(--color-border)] bg-transparent text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
      )}
    >
      {children}
    </button>
  );
}

export function IconSheetFlow({
  prompt,
  onConfirm,
}: {
  prompt: string;
  onConfirm: (draft: IconSheetDraft) => void;
}) {
  const initial = useMemo(() => buildIconSheetDraft(prompt), [prompt]);
  const [draft, setDraft] = useState<IconSheetDraft>(initial);
  const [advanced, setAdvanced] = useState(false);
  const [advStep, setAdvStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [customOpen, setCustomOpen] = useState<Record<string, boolean>>({});
  const toggleCustom = (k: string) => setCustomOpen((s) => ({ ...s, [k]: !s[k] }));

  const setTier = (i: number, tier: "normal" | "fine") => {
    setDraft((d) => {
      const items = d.items.map((it, idx) => (idx === i ? { ...it, tier } : it));
      return {
        ...d,
        items,
        normalCount: items.filter((it) => it.tier === "normal").length,
        fineCount: items.filter((it) => it.tier === "fine").length,
      };
    });
  };

  const setGridCount = (n: number) => {
    setDraft((d) => {
      const items = Array.from({ length: n }, (_, i) => d.items[i] ?? { name: FOOD_POOL[i % FOOD_POOL.length], tier: "normal" as const });
      const side = Math.ceil(Math.sqrt(n));
      return {
        ...d,
        gridCount: n,
        gridLayout: `${side} × ${Math.ceil(n / side)}`,
        items,
        normalCount: items.filter((it) => it.tier === "normal").length,
        fineCount: items.filter((it) => it.tier === "fine").length,
      };
    });
  };

  const setNormalCount = (n: number) => {
    setDraft((d) => {
      const normal = Math.max(0, Math.min(d.gridCount, n));
      const items = d.items.map((it, i) => ({ ...it, tier: (i < normal ? "normal" : "fine") as "normal" | "fine" }));
      return { ...d, items, normalCount: normal, fineCount: d.gridCount - normal };
    });
  };

  const numberInput = "w-20 rounded-full border border-[var(--color-border)] bg-transparent px-3 py-1 text-[12px] text-[var(--color-foreground)] outline-none focus:border-[var(--color-foreground)]/40";

  return (
    <div className="w-full max-w-[720px] space-y-3">
      <div className="grid gap-3">
        <Card icon={Grid3x3} index={1} title="Sheet 规格" subtitle="确认张数、题材、品质与网格，均支持自定义">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-14 text-[12px] text-[var(--color-muted-foreground)]">张数</span>
              {[9, 12, 16, 24].map((n) => (
                <Pill key={n} active={draft.gridCount === n} onClick={() => setGridCount(n)}>
                  {n} 格
                </Pill>
              ))}
              <Pill active={customOpen.count} onClick={() => toggleCustom("count")}>
                自定义
              </Pill>
              {customOpen.count && (
                <input
                  type="number"
                  min={4}
                  max={64}
                  value={draft.gridCount}
                  onChange={(e) => setGridCount(Math.min(64, Math.max(4, Number(e.target.value) || 4)))}
                  className={numberInput}
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="w-14 text-[12px] text-[var(--color-muted-foreground)]">题材</span>
              {["食物", "武器", "道具", "材料"].map((t) => (
                <Pill key={t} active={draft.theme === t} onClick={() => setDraft((d) => ({ ...d, theme: t }))}>
                  {t}
                </Pill>
              ))}
              <Pill active={customOpen.theme} onClick={() => toggleCustom("theme")}>
                自定义
              </Pill>
              {customOpen.theme && (
                <input
                  value={draft.theme}
                  placeholder="输入题材"
                  onChange={(e) => setDraft((d) => ({ ...d, theme: e.target.value }))}
                  className={cn(numberInput, "w-32")}
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="w-14 text-[12px] text-[var(--color-muted-foreground)]">品质</span>
              <span className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-[12px] text-[var(--color-foreground)]">
                普通 {draft.normalCount}
              </span>
              <span className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-[12px] text-[var(--color-foreground)]">
                精致 {draft.fineCount}
              </span>
              <Pill active={customOpen.quality} onClick={() => toggleCustom("quality")}>
                自定义
              </Pill>
              {customOpen.quality ? (
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[var(--color-muted-foreground)]">前</span>
                  <input
                    type="number"
                    min={0}
                    max={draft.gridCount}
                    value={draft.normalCount}
                    onChange={(e) => setNormalCount(Number(e.target.value) || 0)}
                    className={numberInput}
                  />
                  <span className="text-[12px] text-[var(--color-muted-foreground)]">个普通，其余精致</span>
                </div>
              ) : (
                <span className="text-[12px] text-[var(--color-muted-foreground)]">可在下方清单逐个调整</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="w-14 text-[12px] text-[var(--color-muted-foreground)]">网格</span>
              {(() => {
                const side = Math.ceil(Math.sqrt(draft.gridCount));
                const presets = [`${side} × ${Math.ceil(draft.gridCount / side)}`, `4 × ${Math.ceil(draft.gridCount / 4)}`, `8 × ${Math.ceil(draft.gridCount / 8)}`];
                return Array.from(new Set(presets)).map((g) => (
                  <Pill key={g} active={draft.gridLayout === g} onClick={() => setDraft((d) => ({ ...d, gridLayout: g }))}>
                    {g}
                  </Pill>
                ));
              })()}
              <Pill active={customOpen.grid} onClick={() => toggleCustom("grid")}>
                自定义
              </Pill>
              {customOpen.grid && (
                <input
                  value={draft.gridLayout}
                  placeholder="如 4 × 3"
                  onChange={(e) => setDraft((d) => ({ ...d, gridLayout: e.target.value }))}
                  className={cn(numberInput, "w-28")}
                />
              )}
            </div>
          </div>
        </Card>


        <Card icon={ListChecks} index={2} title="道具清单" subtitle="名称可直接编辑，Tag 可切换品质">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {draft.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-2.5 py-1.5"
              >
                <span className="text-[11px] text-[var(--color-muted-foreground)]">{String(i + 1).padStart(2, "0")}</span>
                <input
                  value={item.name}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      items: d.items.map((it, idx) => (idx === i ? { ...it, name: e.target.value } : it)),
                    }))
                  }
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--color-foreground)] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setTier(i, item.tier === "normal" ? "fine" : "normal")}
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] transition",
                    item.tier === "fine"
                      ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                      : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                  )}
                >
                  {item.tier === "fine" ? "精致" : "普通"}
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card icon={Palette} index={3} title="视觉摘要" subtitle="画风描述与色板预览">
          <div className="space-y-3">
            <input
              value={draft.style}
              onChange={(e) => setDraft((d) => ({ ...d, style: e.target.value }))}
              className="w-full rounded-xl border border-[var(--color-border)] bg-transparent px-3 py-2 text-[13px] text-[var(--color-foreground)] outline-none focus:border-[var(--color-foreground)]/30"
            />
            <div className="flex flex-wrap gap-2">
              {draft.palette.map((c, i) => (
                <label
                  key={i}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--color-border)] px-2 py-1.5"
                >
                  <span className="h-5 w-5 rounded-md border border-black/10" style={{ background: c.hex }} />
                  <span className="text-[12px] text-[var(--color-foreground)]">{c.name}</span>
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        palette: d.palette.map((p, idx) => (idx === i ? { ...p, hex: e.target.value } : p)),
                      }))
                    }
                    className="h-0 w-0 opacity-0"
                  />
                </label>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <AnimatePresence initial={false}>
        {advanced && (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-[var(--color-foreground)]">
                  <Settings2 className="h-4 w-4" /> 高级模式 · 5 步向导
                </div>
                <div className="text-[12px] text-[var(--color-muted-foreground)]">第 {advStep} / 5 步</div>
              </div>
              <div className="space-y-2">
                {[
                  { t: "1. 网格与出图规格", d: `${draft.gridLayout} · 共 ${draft.gridCount} 张 · 512px 透明底 PNG` },
                  { t: "2. 题材与世界观", d: `${draft.theme} · ${draft.style}` },
                  { t: "3. 品质分配规则", d: `普通 ${draft.normalCount} / 精致 ${draft.fineCount}，精致款增加描边与高光` },
                  { t: "4. 参考对齐 (ref-align)", d: "锁定构图角度 3/4 俯视、统一投影方向与厚描边" },
                  { t: "5. 色卡与后处理", d: draft.palette.map((p) => p.name).join(" / ") },
                ].map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAdvStep(i + 1)}
                    className={cn(
                      "w-full rounded-xl border px-4 py-3 text-left transition",
                      advStep === i + 1
                        ? "border-[var(--color-foreground)]/25 bg-[var(--color-muted)]"
                        : "border-[var(--color-border)] hover:bg-[var(--color-muted)]/60"
                    )}
                  >
                    <div className="text-[13px] font-medium text-[var(--color-foreground)]">{s.t}</div>
                    <div className="mt-0.5 text-[12px] text-[var(--color-muted-foreground)]">{s.d}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={confirmed}
          onClick={() => {
            setConfirmed(true);
            onConfirm(draft);
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium transition",
            confirmed
              ? "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
              : "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90"
          )}
        >
          {confirmed ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          {confirmed ? "已确认，生成中" : "确认并生成"}
        </button>
        <button
          type="button"
          onClick={() => setAdvanced((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2.5 text-[13px] text-[var(--color-muted-foreground)] transition hover:text-[var(--color-foreground)]"
        >
          高级
          <ChevronDown className={cn("h-3.5 w-3.5 transition", advanced && "rotate-180")} />
        </button>
      </div>
    </div>
  );
}

export function IconSheetResult({ draft }: { draft: IconSheetDraft }) {
  return (
    <div className="w-full max-w-[720px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <div className="mb-3 flex items-center gap-2 text-[14px] font-semibold text-[var(--color-foreground)]">
        <Loader2 className="h-4 w-4 animate-spin" />
        正在生成 {draft.gridCount} 个「{draft.theme}」图标 · {draft.style}
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {draft.items.map((it, i) => (
          <div
            key={i}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-[var(--color-border)] p-1 text-center"
            style={{ background: `${draft.palette[i % draft.palette.length].hex}22` }}
          >
            <span className="h-5 w-5 rounded-md" style={{ background: draft.palette[i % draft.palette.length].hex }} />
            <span className="line-clamp-2 text-[9px] leading-tight text-[var(--color-muted-foreground)]">{it.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
