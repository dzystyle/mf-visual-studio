import * as React from "react";
import { FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PRD_SECTIONS, type PrdNode } from "./prd-content";

function Node({ node }: { node: PrdNode }) {
  if (node.type === "h3") {
    return <h3 className="mt-5 mb-2 text-sm font-bold text-foreground">{node.text}</h3>;
  }
  if (node.type === "p") {
    return <p className="my-2 text-[13px] leading-relaxed text-muted-foreground">{node.text}</p>;
  }
  if (node.type === "list") {
    return (
      <ul className="my-2 space-y-1.5 pl-1">
        {node.items.map((item, i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="my-3 overflow-hidden rounded-xl border border-border/40">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="bg-muted/30">
            {node.head.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left font-bold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {node.rows.map((row, i) => (
            <tr key={i} className="border-t border-border/30">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PrdDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [active, setActive] = React.useState(PRD_SECTIONS[0].id);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const jump = (id: string) => {
    setActive(id);
    scrollRef.current?.querySelector(`#prd-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onScroll = () => {
    const root = scrollRef.current;
    if (!root) return;
    let current = PRD_SECTIONS[0].id;
    for (const s of PRD_SECTIONS) {
      const el = root.querySelector(`#prd-${s.id}`);
      if (el && el.getBoundingClientRect().top - root.getBoundingClientRect().top <= 80) current = s.id;
    }
    setActive(current);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-[85vh] max-w-[880px] flex-col gap-0 overflow-hidden rounded-2xl border-border/50 bg-card/95 p-0 backdrop-blur-xl [&>button]:hidden"
        aria-describedby={undefined}
      >
        <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            团队与预算 · 产品需求文档
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
            aria-label="关闭"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          <nav className="w-52 shrink-0 space-y-1 overflow-y-auto border-r border-border/40 p-4">
            {PRD_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => jump(s.id)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition-all",
                  active === s.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/20 hover:text-foreground",
                )}
              >
                {s.title}
              </button>
            ))}
          </nav>

          <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto px-8 py-6">
            {PRD_SECTIONS.map((s) => (
              <section key={s.id} id={`prd-${s.id}`} className="mb-8 scroll-mt-4">
                <h2 className="mb-3 border-b border-border/30 pb-2 text-base font-bold text-foreground">
                  {s.title}
                </h2>
                {s.nodes.map((n, i) => (
                  <Node key={i} node={n} />
                ))}
              </section>
            ))}
            <div className="pb-4 text-center text-[11px] text-muted-foreground/60">
              — 文档结束 · artrail.ai 团队与预算 PRD —
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
