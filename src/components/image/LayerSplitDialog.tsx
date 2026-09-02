import { useState } from "react";
import { X, Info, Gem, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface LayerSplitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onConfirm?: (imageUrl: string, instruction: string) => void;
}

export function LayerSplitDialog({
  open,
  onOpenChange,
  imageUrl,
  onConfirm,
}: LayerSplitDialogProps) {
  const [instruction, setInstruction] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[720px] overflow-hidden rounded-[2rem] border-none bg-white p-0 shadow-2xl dark:bg-[#1A1A1A] [&>button.absolute]:hidden">
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-black dark:text-white">图层分离</h2>
              <Gem className="h-4 w-4 text-[#7C5CFF]" />
              <Info className="h-4 w-4 text-black/30 dark:text-white/30" />
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-black/40 transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white/40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-8">
            <div className="overflow-hidden rounded-2xl bg-[#F5F5F7] dark:bg-white/5">
              <img
                src={imageUrl}
                alt="待拆分图片"
                loading="lazy"
                className="mx-auto max-h-[42vh] object-contain"
              />
            </div>

            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="将当前图片拆分为底图和主要元素图层"
              className="mt-5 h-28 w-full resize-none rounded-2xl border border-black/10 bg-white p-4 text-[15px] text-black outline-none placeholder:text-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
            />
          </div>

          <div className="flex items-center justify-end gap-5 px-8 py-7">
            <button
              onClick={() => onOpenChange(false)}
              className="min-w-[110px] rounded-full border border-black/10 bg-white px-8 py-2.5 text-[14px] font-bold text-black transition-all hover:bg-black/5 active:scale-95 dark:border-white/10 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
            >
              取消
            </button>
            <div className="flex items-center gap-1.5 text-[15px] font-bold text-black dark:text-white">
              <Sparkles className="h-4 w-4 text-[#7C5CFF]" />
              22
            </div>
            <button
              onClick={() => {
                onConfirm?.(imageUrl, instruction);
                onOpenChange(false);
              }}
              className="min-w-[120px] rounded-full bg-black px-8 py-2.5 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-95 dark:bg-white dark:text-black"
            >
              开始拆分
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
