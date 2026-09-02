import { useState } from "react";
import { X, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Region {
  id: number;
  name: string;
  // percentage based box
  x: number;
  y: number;
  w: number;
  h: number;
}

const DEFAULT_REGIONS: Region[] = [
  { id: 1, name: "头", x: 12, y: 6, w: 16, h: 22 },
  { id: 2, name: "帽子", x: 42, y: 10, w: 16, h: 26 },
];

interface RegionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onConfirm?: (imageUrl: string, regions: Region[], instruction: string) => void;
}

export function RegionEditDialog({
  open,
  onOpenChange,
  imageUrl,
  onConfirm,
}: RegionEditDialogProps) {
  const [regions, setRegions] = useState<Region[]>(DEFAULT_REGIONS);
  const [draft, setDraft] = useState<Region | null>(null);
  const [draftName, setDraftName] = useState("");
  const [instruction, setInstruction] = useState("");

  const addRegion = () => {
    const id = regions.length + 1;
    setDraft({ id, name: "", x: 66 - regions.length * 4, y: 40, w: 14, h: 20 });
    setDraftName("");
  };

  const commitDraft = () => {
    if (!draft) return;
    setRegions((prev) => [...prev, { ...draft, name: draftName || `局部 ${draft.id}` }]);
    setDraft(null);
    setDraftName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-full max-w-[1200px] overflow-hidden rounded-[2rem] border-none bg-white p-0 shadow-2xl dark:bg-[#1A1A1A] [&>button.absolute]:hidden">
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-8 py-6">
            <h2 className="text-[17px] font-bold text-black dark:text-white">局部编辑</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 dark:text-white/40 dark:hover:bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-[1fr_320px] gap-6 px-8">
            {/* Canvas */}
            <div
              onDoubleClick={addRegion}
              className="relative overflow-hidden rounded-2xl border border-black/5 bg-[#FAFAFA] dark:border-white/10 dark:bg-black/40"
            >
              <img
                src={imageUrl}
                alt="局部编辑"
                loading="lazy"
                className="max-h-[58vh] w-full object-contain"
              />
              {[...regions, ...(draft ? [draft] : [])].map((r) => (
                <div
                  key={r.id}
                  className="absolute rounded-md border-2 border-dashed border-[#7C5CFF]"
                  style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
                >
                  <div className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#7C5CFF] text-[11px] font-bold text-white shadow-lg">
                    {r.id}
                  </div>
                </div>
              ))}

              {draft && (
                <div className="absolute left-1/2 top-1/2 flex w-[60%] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl bg-white/95 p-2 shadow-2xl backdrop-blur dark:bg-[#222]/95">
                  <input
                    autoFocus
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && commitDraft()}
                    placeholder="为选中区域命名，如：手套"
                    className="flex-1 bg-transparent px-3 text-[14px] text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/30"
                  />
                  <button
                    onClick={commitDraft}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                双击画面新增局部选区
              </div>
            </div>

            {/* Side panel */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                {regions.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[#FAFAFA] p-3 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-black/5 dark:border-white/10">
                      <img src={imageUrl} alt={r.name} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] font-bold text-black dark:text-white">局部 {r.id}</div>
                      <div className="truncate text-[12px] text-black/50 dark:text-white/50">{r.name}</div>
                    </div>
                  </div>
                ))}
              </div>

              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="描述你想如何修改选中区域"
                className={cn(
                  "mt-auto h-36 resize-none rounded-2xl border border-black/10 bg-white p-4 text-[14px] text-black outline-none placeholder:text-black/30",
                  "dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
                )}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 px-8 pb-7">
            <button
              onClick={() => onOpenChange(false)}
              className="min-w-[100px] rounded-2xl border border-black/10 bg-white px-8 py-2.5 text-[14px] font-bold text-black transition-all hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
            >
              取消
            </button>
            <button
              onClick={() => {
                onConfirm?.(imageUrl, regions, instruction);
                onOpenChange(false);
              }}
              className="min-w-[100px] rounded-2xl bg-black px-8 py-2.5 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-95 dark:bg-white dark:text-black"
            >
              确认
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
