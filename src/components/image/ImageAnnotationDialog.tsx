import { useState } from "react";
import {
  X,
  Square,
  Type,
  ArrowUpRight,
  MapPin,
  Eraser,
  MousePointer2,
  PenTool,
  Undo2,
  Redo2,
  Plus,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ImageAnnotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  onConfirm?: (imageUrl: string) => void;
}

export function ImageAnnotationDialog({
  open,
  onOpenChange,
  imageUrl,
  onConfirm,
}: ImageAnnotationDialogProps) {
  const [activeTool, setActiveTool] = useState("pen");
  const [color, setColor] = useState("#EF4444");

  const tools = [
    {
      id: "select",
      icon: (
        <div className="relative">
          <MousePointer2 className="h-4 w-4" />
          <Plus className="absolute -right-1 -top-1 h-2 w-2" />
        </div>
      ),
    },
    { id: "pen", icon: <PenTool className="h-4 w-4" /> },
    { id: "arrow", icon: <ArrowUpRight className="h-4 w-4" /> },
    { id: "text", icon: <Type className="h-4 w-4" /> },
    { id: "eraser", icon: <Eraser className="h-4 w-4" /> },
    { id: "pin", icon: <MapPin className="h-4 w-4" /> },
    { id: "rect", icon: <Square className="h-4 w-4 rounded-sm" strokeWidth={2.5} /> },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-full max-w-[92vw] overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl dark:bg-[#1A1A1A] [&>button.absolute]:hidden">
        <div className="flex h-full min-h-[70vh] flex-col">
          <div className="flex items-center justify-between px-8 py-6">
            <h2 className="text-[17px] font-bold text-black dark:text-white">标注图片</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 dark:text-white/40 dark:hover:bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Toolbar */}
          <div className="mb-6 flex justify-center px-8">
            <div className="flex items-center gap-1 rounded-2xl border border-black/5 bg-[#F5F5F7] p-1.5 shadow-sm dark:border-white/10 dark:bg-white/5">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-90",
                    activeTool === tool.id
                      ? "scale-105 bg-white text-black shadow-md dark:bg-white/10 dark:text-white"
                      : "text-black/40 hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
                  )}
                >
                  {tool.icon}
                </button>
              ))}
              <div className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />
              {["#EF4444", "#3B82F6", "#22C55E"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                    color === c && "bg-white shadow-md dark:bg-white/10"
                  )}
                >
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: c }} />
                </button>
              ))}
              <div className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />
              <button className="flex h-9 w-9 items-center justify-center rounded-xl text-black/40 hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white">
                <Undo2 className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl text-black/30 dark:text-white/30">
                <Redo2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative flex-1 px-8 pb-4">
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-black/5 bg-[#FAFAFA] dark:border-white/10 dark:bg-black/40">
              <img
                src={imageUrl}
                alt="待标注图片"
                loading="lazy"
                className="h-full max-h-[52vh] w-full object-contain"
              />
              <div className="pointer-events-none absolute inset-0">
                <AnimatePresence>
                  {activeTool === "pen" && (
                    <motion.svg
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 h-full w-full"
                    >
                      <path
                        d="M 180 220 Q 240 160 300 220 T 420 220"
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  )}
                  {activeTool === "rect" && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute left-1/4 top-1/4 h-40 w-48 rounded-2xl border-4"
                      style={{ borderColor: color }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-black/5 px-8 py-5 dark:border-white/5">
            <button
              onClick={() => onOpenChange(false)}
              className="min-w-[100px] rounded-2xl bg-[#F5F5F7] px-8 py-2.5 text-[14px] font-bold text-black transition-all hover:bg-black/10 active:scale-95 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              取消
            </button>
            <button
              onClick={() => {
                onConfirm?.(imageUrl);
                onOpenChange(false);
              }}
              className="min-w-[100px] rounded-2xl bg-black px-8 py-2.5 text-[14px] font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 dark:bg-white dark:text-black"
            >
              确认
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
