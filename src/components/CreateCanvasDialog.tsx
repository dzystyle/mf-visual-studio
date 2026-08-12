import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LayoutGrid, Network, ChevronDown } from "lucide-react";

interface CreateCanvasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCanvasDialog({ open, onOpenChange }: CreateCanvasDialogProps) {
  const [style, setStyle] = React.useState("free");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] rounded-[32px] border-none bg-white p-8 text-black shadow-2xl dark:bg-white dark:text-black sm:rounded-[32px] [&>button[data-radix-collection-item]]:hidden">
        <h2 className="mb-6 text-xl font-bold">新建画布</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              画布名称 <span className="text-red-500">*</span>
            </Label>
            <Input 
              placeholder="输入画布名称" 
              className="h-12 rounded-xl border-gray-200 bg-gray-50/50 text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">画布风格</Label>
            <div className="grid grid-cols-3 gap-3">
              {/* Free Layout Option */}
              <div 
                onClick={() => setStyle("free")}
                className={cn(
                  "relative cursor-pointer rounded-2xl border-2 p-3 transition-all duration-200",
                  style === "free" ? "border-blue-500 bg-blue-50/30" : "border-gray-100 bg-white hover:border-gray-200"
                )}
              >
                {style === "free" && (
                  <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white">
                    <CheckIcon className="h-2.5 w-2.5" />
                  </div>
                )}
                <div className="mb-6 flex justify-center py-2">
                   <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-3 w-4 rounded-sm bg-blue-200/60" />
                      ))}
                   </div>
                </div>
                <div className="text-sm font-bold text-blue-600">自由平铺</div>
                <div className="text-[10px] text-gray-400">元素独立铺开</div>
              </div>

              {/* Node Connection Option */}
              <div 
                onClick={() => setStyle("nodes")}
                className={cn(
                  "relative cursor-pointer rounded-2xl border-2 p-3 transition-all duration-200",
                  style === "nodes" ? "border-blue-500 bg-blue-50/30" : "border-gray-100 bg-white hover:border-gray-200"
                )}
              >
                {style === "nodes" && (
                  <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white">
                    <CheckIcon className="h-2.5 w-2.5" />
                  </div>
                )}
                <div className="mb-6 flex justify-center py-2">
                   <div className="relative flex items-center justify-center">
                      <div className="h-3 w-4 rounded-sm bg-gray-200" />
                      <div className="mx-1 flex flex-col gap-1.5">
                         <div className="h-[1px] w-3 bg-gray-300" />
                         <div className="h-[1px] w-3 bg-gray-300" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="h-3 w-4 rounded-sm bg-gray-200" />
                         <div className="h-3 w-4 rounded-sm bg-gray-200" />
                      </div>
                   </div>
                </div>
                <div className="text-sm font-bold text-gray-900">节点连线</div>
                <div className="text-[10px] text-gray-400">可视化引用关系</div>
              </div>

              {/* List View Option */}
              <div 
                onClick={() => setStyle("list")}
                className={cn(
                  "relative cursor-pointer rounded-2xl border-2 p-3 transition-all duration-200",
                  style === "list" ? "border-blue-500 bg-blue-50/30" : "border-gray-100 bg-white hover:border-gray-200"
                )}
              >
                {style === "list" && (
                  <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white">
                    <CheckIcon className="h-2.5 w-2.5" />
                  </div>
                )}
                <div className="mb-6 flex justify-center py-2">
                   <div className="flex flex-col gap-1.5">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-1">
                          <div className="h-3 w-4 rounded-sm bg-gray-200" />
                          <div className="h-1.5 w-8 rounded-full bg-gray-100" />
                        </div>
                      ))}
                   </div>
                </div>
                <div className="text-sm font-bold text-gray-900">列表模式</div>
                <div className="text-[10px] text-gray-400">纵向排列管理</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1 text-sm font-medium text-gray-700">
              所属项目 <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white text-black focus:ring-1 focus:ring-blue-500">
                <SelectValue placeholder="选择项目" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 bg-white p-1 text-black shadow-lg">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white">
                    <LayoutGrid className="h-3 w-3 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium">临时项目</span>
                </div>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-gray-400">输入的画布公共提示词将作用于该画布生成的每一个元素</p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-6 font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            取消
          </Button>
          <Button 
            className="rounded-xl bg-black px-8 font-medium text-white hover:bg-black/90"
            onClick={() => onOpenChange(false)}
          >
            创建
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
