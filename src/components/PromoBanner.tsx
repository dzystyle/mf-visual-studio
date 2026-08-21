import { X } from "lucide-react";
import { useState } from "react";

export function PromoBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="promo-bg relative flex items-center justify-center gap-3 px-6 py-2 text-[13px] text-foreground">
      <span className="font-medium">
        Artrail 1.0 - Skill 沉淀你的品味和习惯,限时福利:
      </span>
      <span className="font-semibold">会员低至 4.6 折,</span>
      <span className="font-semibold">年包多送 10万 积分</span>
      <button className="ml-3 rounded-full bg-background/90 px-4 py-1 text-xs font-medium text-foreground hover:bg-background">
        立即订阅
      </button>
      <button
        onClick={() => setOpen(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/80 hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
