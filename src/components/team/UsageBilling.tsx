import * as React from "react";
import { BarChart3, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConsumptionStats } from "./ConsumptionStats";
import { BudgetFlow } from "./BudgetFlow";

export function UsageBilling() {
  const [view, setView] = React.useState<"stats" | "flow">("stats");

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1 rounded-xl border border-border/40 bg-muted/20 p-1">
        {[
          { id: "stats", label: "消费统计", icon: BarChart3 },
          { id: "flow", label: "预算流水", icon: ReceiptText },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id as "stats" | "flow")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all",
              view === v.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <v.icon className="h-3.5 w-3.5" />
            {v.label}
          </button>
        ))}
      </div>

      {view === "stats" ? <ConsumptionStats /> : <BudgetFlow />}
    </div>
  );
}
