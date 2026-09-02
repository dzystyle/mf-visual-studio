import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_HISTORY } from "@/components/AppSidebar";

type CanvasStyle = "free" | "node";

function FreeLayoutPreview({ active }: { active: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2 w-28">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`h-5 rounded-[6px] border transition-colors ${
            active
              ? "bg-blue-100 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/40"
              : "bg-black/[0.04] dark:bg-white/[0.06] border-black/10 dark:border-white/10"
          }`}
        />
      ))}
    </div>
  );
}

function NodeLayoutPreview({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 120 60" className="w-28 h-14">
      <path
        d="M34 30 C 58 30, 58 14, 82 14"
        fill="none"
        strokeWidth="1.5"
        className={active ? "stroke-blue-400" : "stroke-muted-foreground/50"}
      />
      <path
        d="M34 30 C 58 30, 58 46, 82 46"
        fill="none"
        strokeWidth="1.5"
        className={active ? "stroke-blue-400" : "stroke-muted-foreground/50"}
      />
      <rect x="14" y="21" width="22" height="18" rx="4" className={active ? "fill-blue-100 dark:fill-blue-500/20 stroke-blue-300 dark:stroke-blue-500/40" : "fill-black/[0.04] dark:fill-white/[0.06] stroke-black/10 dark:stroke-white/10"} strokeWidth="1" />
      <rect x="80" y="5" width="26" height="18" rx="4" className={active ? "fill-blue-100 dark:fill-blue-500/20 stroke-blue-300 dark:stroke-blue-500/40" : "fill-black/[0.04] dark:fill-white/[0.06] stroke-black/10 dark:stroke-white/10"} strokeWidth="1" />
      <rect x="80" y="37" width="26" height="18" rx="4" className={active ? "fill-blue-100 dark:fill-blue-500/20 stroke-blue-300 dark:stroke-blue-500/40" : "fill-black/[0.04] dark:fill-white/[0.06] stroke-black/10 dark:stroke-white/10"} strokeWidth="1" />
    </svg>
  );
}

export function CreateCanvasDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [style, setStyle] = useState<CanvasStyle>("free");
  const [project, setProject] = useState("");
  const [projectOpen, setProjectOpen] = useState(false);
  const [commonPrompt, setCommonPrompt] = useState("");

  const projects = DEFAULT_HISTORY;

  const reset = () => {
    setName("");
    setStyle("free");
    setProject("");
    setCommonPrompt("");
    setProjectOpen(false);
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast.warning("请输入画布名称");
      return;
    }
    if (!project) {
      toast.warning("请选择所属项目");
      return;
    }
    toast.success(`画布「${name}」创建成功`);
    onOpenChange(false);
    reset();
    navigate({
      to: "/canvas",
      search: { name: name.trim(), style, project, prompt: commonPrompt.trim() } as any,
    });
  };

  const styles: { key: CanvasStyle; label: string; desc: string }[] = [
    { key: "free", label: "自由平铺", desc: "元素独立铺开" },
    { key: "node", label: "节点连线", desc: "可视化引用关系" },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-md rounded-3xl p-0 gap-0 overflow-hidden bg-card border-border">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-[20px] font-bold text-foreground">新建画布</h2>
        </div>

        <div className="px-6 pb-4 space-y-5">
          {/* 画布名称 */}
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-2">
              画布名称 <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入画布名称"
              className="w-full h-11 px-4 rounded-xl border border-border bg-background/60 text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          {/* 画布风格 */}
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-2">画布风格</label>
            <div className="grid grid-cols-2 gap-3">
              {styles.map((s) => {
                const active = style === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setStyle(s.key)}
                    className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                      active
                        ? "border-blue-500 bg-blue-50/60 dark:bg-blue-500/10 shadow-[0_4px_16px_-6px_rgba(59,130,246,0.4)]"
                        : "border-border hover:border-muted-foreground/40 bg-background/40"
                    }`}
                  >
                    {active && (
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                        <Check size={13} strokeWidth={3} className="text-white" />
                      </span>
                    )}
                    <div className="flex justify-center py-1">
                      {s.key === "free" ? <FreeLayoutPreview active={active} /> : <NodeLayoutPreview active={active} />}
                    </div>
                    <div className={`mt-3 text-[14px] font-bold ${active ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
                      {s.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 所属项目 */}
          <div className="relative">
            <label className="block text-[13px] font-semibold text-foreground mb-2">
              所属项目 <span className="text-red-500">*</span>
            </label>
            <button
              onClick={() => setProjectOpen((v) => !v)}
              className={`w-full h-11 px-4 rounded-xl border border-border bg-background/60 text-[13px] flex items-center justify-between outline-none focus:border-blue-500/60 transition ${project ? "text-foreground" : "text-muted-foreground/60"}`}
            >
              <span className="truncate">{project || "选择项目"}</span>
              <ChevronDown size={15} className={`text-muted-foreground transition-transform ${projectOpen ? "rotate-180" : ""}`} />
            </button>
            {projectOpen && (
              <div className="absolute z-20 left-0 right-0 top-full mt-1.5 rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
                <div className="max-h-52 overflow-y-auto py-1.5">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setProject(p.title); setProjectOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-[13px] text-left transition-colors hover:bg-accent ${project === p.title ? "text-blue-600 dark:text-blue-400 font-medium" : "text-foreground/80"}`}
                    >
                      <span className="truncate">{p.title}</span>
                      {project === p.title && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 画布公共提示词 */}
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-2">画布公共提示词</label>
            <textarea
              value={commonPrompt}
              onChange={(e) => setCommonPrompt(e.target.value)}
              placeholder="输入的画布公共提示词将作用于该画布生成的每一个元素"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/60 text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/60">
          <button
            onClick={() => { onOpenChange(false); reset(); }}
            className="h-10 px-6 rounded-xl bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] text-[13px] font-medium text-foreground/80 transition"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            className="h-10 px-7 rounded-xl bg-black dark:bg-white text-white dark:text-black text-[13px] font-semibold hover:opacity-85 transition shadow-md"
          >
            创建
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
