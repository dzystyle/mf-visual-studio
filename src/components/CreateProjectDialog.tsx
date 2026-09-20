import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

export function CreateProjectDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const reset = () => setName("");

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.warning("请输入项目名称");
      return;
    }
    onConfirm(trimmed);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-md rounded-3xl p-0 gap-0 overflow-hidden bg-card border-border">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-[20px] font-bold text-foreground">新建项目</h2>
        </div>

        <div className="px-6 pb-6 space-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-2">
              项目名称
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入项目名称"
              className="w-full h-11 px-4 rounded-xl border border-border bg-background/60 text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { onOpenChange(false); reset(); }}
              className="flex-1 h-10 rounded-xl border border-border bg-transparent text-[13px] font-medium text-foreground/80 hover:bg-accent transition"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition shadow-md"
            >
              确定
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
