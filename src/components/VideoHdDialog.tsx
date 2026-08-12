import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function VideoHdDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [resolution, setResolution] = React.useState("1080P");
  const [mode, setMode] = React.useState("高质量补帧");
  const [fps, setFps] = React.useState("30fps");
  const [modeOpen, setModeOpen] = React.useState(false);
  const [fpsOpen, setFpsOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] border-white/10 bg-[#121212] p-8 text-white shadow-2xl rounded-[24px] [&>button[data-radix-collection-item]]:hidden">
        <h2 className="text-2xl font-bold mb-8">视频超清</h2>

        <div className="space-y-6">
          {/* 分辨率 */}
          <div className="flex items-center gap-8">
            <label className="w-16 text-sm text-white/40">分辨率</label>
            <div className="flex gap-3">
              {["1080P", "2K", "4K"].map((res) => (
                <button
                  key={res}
                  onClick={() => setResolution(res)}
                  className={cn(
                    "min-w-[100px] rounded-full px-6 py-2 text-sm transition-all border",
                    resolution === res
                      ? "bg-white/10 border-white/20 text-white font-medium"
                      : "border-white/5 text-white/40 hover:text-white/60 hover:bg-white/5"
                  )}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* 补帧模式 */}
          <div className="flex items-center gap-8">
            <label className="w-16 text-sm text-white/40">补帧模式</label>
            <Popover open={modeOpen} onOpenChange={setModeOpen}>
              <PopoverTrigger asChild>
                <button className="flex-1 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-white hover:bg-white/10 transition">
                  <span>{mode}</span>
                  {modeOpen ? (
                    <ChevronUp className="h-4 w-4 text-white/40" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-white/40" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[332px] p-1 border-white/10 bg-[#1A1A1A] rounded-xl shadow-2xl backdrop-blur-xl"
                align="start"
                sideOffset={4}
              >
                {["不补帧", "高质量补帧"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setMode(item);
                      setModeOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors",
                      mode === item
                        ? "bg-white/5 text-white/90"
                        : "text-white/40 hover:text-white/60 hover:bg-white/5"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          {/* 帧率 */}
          <div className="flex items-center gap-8">
            <label className="w-16 text-sm text-white/40">帧率</label>
            <Popover open={fpsOpen} onOpenChange={setFpsOpen}>
              <PopoverTrigger asChild>
                <button className="flex-1 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-white hover:bg-white/10 transition">
                  <span>{fps}</span>
                  {fpsOpen ? (
                    <ChevronUp className="h-4 w-4 text-white/40" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-white/40" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[332px] p-1 border-white/10 bg-[#1A1A1A] rounded-xl shadow-2xl backdrop-blur-xl"
                align="start"
                sideOffset={4}
              >
                {["30fps", "60fps"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setFps(item);
                      setFpsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors",
                      fps === item
                        ? "bg-white/5 text-white/90"
                        : "text-white/40 hover:text-white/60 hover:bg-white/5"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-full border border-white/5 bg-white/5 py-3.5 text-sm font-medium text-white/60 hover:bg-white/10 transition"
          >
            取消
          </button>
          <button
            className="relative flex-1 group overflow-hidden rounded-full py-3.5 text-sm font-bold text-black transition-transform active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD59E] via-[#FFB7B7] to-[#FFFFFF] animate-gradient-xy" />
            <div className="relative flex items-center justify-center gap-2">
              创建
              <span className="flex items-center gap-0.5 rounded-full bg-black/10 px-1.5 py-0.5 text-[9px] font-bold uppercase">
                <span className="text-orange-600">💎</span> 尊享
              </span>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
