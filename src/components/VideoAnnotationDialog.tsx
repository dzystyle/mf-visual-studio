import { useState, useRef, useEffect, useCallback } from "react";
import { 
  X, 
  Square, 
  Type, 
  ArrowUpRight, 
  MapPin, 
  Circle, 
  RotateCcw, 
  RotateCw, 
  Eraser, 
  MousePointer2,
  PenTool,
  Play,
  Pause,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Plus
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface VideoAnnotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string;
  posterUrl: string;
  onConfirm?: (imageUrl: string) => void;
  currentTime?: number;
}

export function VideoAnnotationDialog({
  open,
  onOpenChange,
  videoUrl,
  posterUrl,
  onConfirm,
  currentTime: initialTime = 0
}: VideoAnnotationDialogProps) {
  const [activeTool, setActiveTool] = useState("pen");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const duration = 15; // Mock duration

  useEffect(() => {
    if (open) {
      setCurrentTime(initialTime);
      setCapturedFrame(null);
    }
  }, [open, initialTime]);

  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedFrame(canvas.toDataURL("image/jpeg"));
        setIsPlaying(false);
      }
    }
  }, []);

  const tools = [
    { id: 'select', icon: <div className="relative"><MousePointer2 className="h-4 w-4" /><Plus className="h-2 w-2 absolute -top-1 -right-1" /></div> },
    { id: 'pen', icon: <PenTool className="h-4 w-4" /> },
    { id: 'arrow', icon: <ArrowUpRight className="h-4 w-4" /> },
    { id: 'text', icon: <Type className="h-4 w-4" /> },
    { id: 'eraser', icon: <Eraser className="h-4 w-4" /> },
    { id: 'pin', icon: <MapPin className="h-4 w-4" /> },
    { id: 'rect', icon: <Square className="h-4 w-4 rounded-sm" strokeWidth={2.5} /> },
    { id: 'spot', icon: <div className="h-3 w-3 rounded-full bg-red-500" /> },
    { id: 'undo', icon: <Undo2 className="h-4 w-4" /> },
    { id: 'redo', icon: <Redo2 className="h-4 w-4" /> },
  ];

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    onConfirm?.(capturedFrame || posterUrl);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-full max-h-[90vh] p-0 border-none bg-white dark:bg-[#1A1A1A] overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-300">
        <div className="flex flex-col h-full min-h-[70vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6">
            <h2 className="text-[17px] font-bold text-black dark:text-white">标注视频帧</h2>
            <button 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-black/40 dark:text-white/40 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex justify-center mb-6 px-8">
            <div className="flex items-center gap-1 p-1.5 bg-[#F5F5F7] dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={cn(
                    "h-9 w-9 flex items-center justify-center rounded-xl transition-all active:scale-90",
                    activeTool === tool.id 
                      ? "bg-white dark:bg-white/10 shadow-md text-black dark:text-white scale-105" 
                      : "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  {tool.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 px-8 pb-4 relative overflow-hidden group/canvas">
            <div className="relative w-full h-full aspect-video rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 bg-black shadow-inner">
              {!capturedFrame ? (
                <div className="relative w-full h-full">
                  <video 
                    ref={videoRef}
                    src={videoUrl} 
                    className="w-full h-full object-contain"
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => {
                      if (initialTime) e.currentTarget.currentTime = initialTime;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/canvas:opacity-100 transition-opacity">
                    <button 
                      onClick={captureFrame}
                      className="px-6 py-3 rounded-2xl bg-white text-black font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <ImageIcon className="h-5 w-5" />
                      捕捉当前帧进行标注
                    </button>
                  </div>
                </div>
              ) : (
                <img 
                  src={capturedFrame} 
                  alt="Captured Frame" 
                  className="w-full h-full object-contain" 
                />
              )}
              
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Mock Annotation Overlays based on tool */}
              <div className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                  {capturedFrame && activeTool === 'pen' && (
                    <motion.svg 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      <path 
                        d="M 150 200 Q 200 150 250 200 T 350 200" 
                        fill="none" 
                        stroke="#EF4444" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                      />
                    </motion.svg>
                  )}
                  {activeTool === 'spot' && (
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full border-4 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)]"
                    />
                  )}
                  {activeTool === 'rect' && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute top-1/4 left-1/4 w-48 h-40 border-4 border-red-500 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1">
                <span className="opacity-70">AI 生成</span>
              </div>
            </div>
          </div>

          {/* Video Controls Area */}
          <div className="px-8 py-6 space-y-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </button>
              
              <div className="flex-1 relative h-6 flex items-center group/progress">
                <div className="absolute w-full h-1.5 bg-[#F5F5F7] dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-300" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div 
                  className="absolute h-4 w-4 bg-white dark:bg-white border-2 border-black/10 dark:border-white/20 rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 transition-transform group-hover/progress:scale-125"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="text-[13px] font-bold text-black/60 dark:text-white/60 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pb-2">
              <button 
                onClick={() => onOpenChange(false)}
                className="px-6 py-2.5 rounded-2xl bg-[#F5F5F7] dark:bg-white/5 text-[14px] font-bold text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                取消
              </button>
              <button 
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-2xl bg-[#F5F5F7] dark:bg-white text-[14px] font-bold text-black dark:text-black hover:opacity-90 transition-all active:scale-95 shadow-sm"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
