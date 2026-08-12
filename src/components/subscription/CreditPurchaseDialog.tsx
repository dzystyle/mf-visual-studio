import * as React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface PurchaseOption {
  credits: number;
  bonus?: number;
  price: number;
  bonusTag?: string;
  isPopular?: boolean;
}

const GENERAL_OPTIONS: PurchaseOption[] = [
  { credits: 1000, price: 70 },
  { credits: 2000, price: 140 },
  { credits: 5000, bonus: 500, price: 350, bonusTag: "额外赠送 10%" },
  { credits: 10000, bonus: 2000, price: 700, bonusTag: "额外赠送 20%" },
  { credits: 20000, bonus: 5000, price: 1400, bonusTag: "额外赠送 25%" },
  { credits: 50000, bonus: 15000, price: 3500, bonusTag: "额外赠送 30%" },
  { credits: 100000, bonus: 35000, price: 7000, bonusTag: "额外赠送 35%" },
  { credits: 200000, bonus: 80000, price: 14000, bonusTag: "额外赠送 40%" },
];

const MODEL_SPECIFIC_OPTIONS = [
  { name: "SD 2.5&2.0", credits: 200000, bonus: 100000, price: 14000, savings: 7000, icon: "📊", color: "from-green-500/20" },
  { name: "MiniMax H3", credits: 200000, bonus: 100000, price: 14000, savings: 7000, icon: "🌀", color: "from-blue-500/20" },
  { name: "GPT Image 2", credits: 200000, bonus: 100000, price: 14000, savings: 7000, icon: "❄️", color: "from-red-500/20" },
  { name: "Nano Banana 2.0&Pro", credits: 200000, bonus: 100000, price: 14000, savings: 7000, icon: "🍌", color: "from-yellow-500/20" },
];

export function CreditPurchaseDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [activeTab, setActiveTab] = React.useState<"general" | "model">("general");
  const [selectedOption, setSelectedOption] = React.useState<number | null>(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[1000px] h-fit border-border bg-[#1A1A1A] p-0 text-foreground overflow-hidden animate-in slide-in-from-bottom duration-500 rounded-t-3xl sm:rounded-3xl translate-y-0 sm:-translate-y-1/2 bottom-0 sm:bottom-auto top-auto sm:top-1/2 left-0 sm:left-1/2 translate-x-0 sm:-translate-x-1/2 [&>button[data-radix-collection-item]]:hidden"
        style={{ margin: 0 }}
      >
        <div className="relative p-6 pt-10">
          <DialogClose className="absolute right-6 top-6 rounded-full bg-white/5 p-2 text-white/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </DialogClose>

          {/* Custom Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              <button
                onClick={() => setActiveTab("general")}
                className={cn(
                  "px-8 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === "general" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/60"
                )}
              >
                通用积分充值
              </button>
              <button
                onClick={() => setActiveTab("model")}
                className={cn(
                  "px-8 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === "model" ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/60"
                )}
              >
                模型专属卡 <span className="text-[#E6B380] ml-1">额外赠送 50%</span>
              </button>
            </div>
          </div>

          <div className="min-h-[400px]">
            {activeTab === "general" ? (
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-4 grid grid-cols-4 gap-3">
                  {GENERAL_OPTIONS.map((opt, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedOption(idx)}
                      className={cn(
                        "relative flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer h-[120px]",
                        selectedOption === idx 
                          ? "bg-white/5 border-[#E6B380] shadow-[0_0_15px_rgba(230,179,128,0.2)]" 
                          : "bg-white/[0.02] border-white/5 hover:border-white/10"
                      )}
                    >
                      {opt.bonusTag && (
                        <div className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-[#E6B380] text-[9px] font-bold text-black uppercase">
                          {opt.bonusTag}
                        </div>
                      )}
                      <div>
                        <div className="text-lg font-bold">
                          {opt.credits.toLocaleString()}
                          {opt.bonus && <span className="text-[#E6B380]"> + {opt.bonus.toLocaleString()}</span>}
                        </div>
                        <div className="text-[10px] text-white/40 mt-1 flex items-center gap-1">
                          积分 <div className="h-2 w-2 rounded-[1px] bg-gradient-to-br from-yellow-400 to-orange-400" />
                        </div>
                      </div>
                      <div className="text-lg font-medium text-right text-foreground/90">
                        <span className="text-sm">¥</span>{opt.price.toLocaleString()}
                      </div>
                      
                      {selectedOption === idx && (
                        <div className="absolute inset-0 rounded-xl border border-[#E6B380] pointer-events-none" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Custom Plan / Enterprise */}
                <div className="col-span-1 rounded-xl bg-gradient-to-b from-[#2A1F1F] to-[#1A1A1A] border border-white/5 p-6 flex flex-col items-center justify-center text-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                    <CrownIcon className="h-6 w-6 text-[#E6B380]" />
                  </div>
                  <div>
                    <div className="text-lg font-bold mb-1">定制</div>
                    <div className="text-[10px] text-white/40 leading-relaxed">
                      大额积分采购<br />
                      更高并发通道
                    </div>
                  </div>
                  <button className="w-full py-2 rounded-full bg-white/5 text-xs font-medium hover:bg-white/10 transition-colors">
                    联系我们
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {MODEL_SPECIFIC_OPTIONS.map((opt, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={cn(
                      "group relative flex flex-col p-5 rounded-2xl border transition-all cursor-pointer h-[240px] overflow-hidden",
                      selectedOption === idx 
                        ? "bg-white/5 border-[#E6B380] shadow-[0_0_20px_rgba(230,179,128,0.1)]" 
                        : "bg-white/[0.02] border-white/5 hover:border-white/10"
                    )}
                  >
                    {/* Background Glow */}
                    <div className={cn("absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br blur-3xl opacity-20 transition-opacity group-hover:opacity-40", opt.color)} />
                    
                    <div className="absolute top-0 right-4 px-2 py-0.5 rounded-b-lg bg-[#E6B380] text-[9px] font-bold text-black uppercase">
                      额外赠送 50%
                    </div>

                    <div className="text-[10px] text-white/40 mb-2">{opt.name}</div>
                    <div className="text-2xl font-bold mb-1">
                      {opt.credits.toLocaleString()}
                    </div>
                    <div className="text-[#E6B380] text-lg font-medium mb-1">
                      + {opt.bonus.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-white/40 flex items-center gap-1">
                      积分 <div className="h-2 w-2 rounded-[1px] bg-gradient-to-br from-yellow-400 to-orange-400" />
                    </div>

                    <div className="mt-auto flex flex-col items-center gap-2">
                       <div className="text-3xl opacity-60 mb-2">{opt.icon}</div>
                       <div className="text-right w-full">
                          <div className="text-xl font-bold">
                            <span className="text-xs font-normal mr-1">¥</span>{opt.price.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-green-500/80">(节省 ¥{opt.savings.toLocaleString()})</div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-6">
            <div className="text-[10px] text-white/20">
              积分有效期说明：仅限会员购买，积分有效期2年，购买后不退不换
            </div>
            
            <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD8B1] via-[#FFF3E6] to-white px-8 py-2.5 text-sm font-bold text-black shadow-lg transition-transform hover:scale-105 active:scale-95">
              <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-black/10">
                <Play fill="black" className="h-2 w-2 text-black ml-0.5" />
              </div>
              去支付
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CrownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.277 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  );
}
