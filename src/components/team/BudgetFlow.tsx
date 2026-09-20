import * as React from "react";
import { RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTeam, formatDateTime, downloadCsv, type TxType } from "@/lib/team-data";

const FILTERS: ("全部" | TxType)[] = ["全部", "消费", "分配", "退款", "调整", "结转"];

export function BudgetFlow() {
  const { transactions, creditsTotal } = useTeam();
  const [filter, setFilter] = React.useState<"全部" | TxType>("全部");

  // Running balance computed oldest -> newest, then displayed newest first.
  const rows = React.useMemo(() => {
    const sorted = [...transactions].sort((a, b) => a.at - b.at);
    let balance = 0;
    const withBalance = sorted.map((t) => {
      balance += t.amount;
      return { ...t, balance };
    });
    return withBalance
      .sort((a, b) => b.at - a.at)
      .filter((t) => filter === "全部" || t.type === filter);
  }, [transactions, filter]);

  const handleExport = () => {
    downloadCsv(
      `团队预算流水-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        ["类型", "操作人", "来源/说明", "金额", "余额", "时间"],
        ...rows.map((t) => [t.type, t.operatorName, t.description, t.amount, t.balance, formatDateTime(t.at)]),
      ],
    );
    toast.success("CSV 已导出");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={filter === f ? "secondary" : "ghost"}
              onClick={() => setFilter(f)}
              className={cn(
                "h-9 px-4 text-xs font-medium rounded-lg",
                filter === f ? "bg-muted" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium">累计入账 {creditsTotal} 积分</span>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs border-border/50"
            onClick={() => toast.success("流水已刷新")}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            刷新
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs border-border/50" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            导出 CSV
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">类型</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">操作人</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">来源/说明</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">金额</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase">余额</TableHead>
              <TableHead className="text-xs font-bold text-muted-foreground uppercase text-right">时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((t) => (
              <TableRow key={t.id} className="border-border/20 hover:bg-muted/10 transition-colors">
                <TableCell className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className={t.amount < 0 ? "text-rose-500" : "text-emerald-500"}>○</span>
                    {t.type}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.operatorName}</TableCell>
                <TableCell className="text-sm text-foreground">{t.description}</TableCell>
                <TableCell className={cn("text-sm font-bold", t.amount > 0 ? "text-emerald-500" : "text-rose-500")}>
                  {t.amount > 0 ? `+${t.amount}` : t.amount}
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">{t.balance}</TableCell>
                <TableCell className="text-sm text-muted-foreground text-right">{formatDateTime(t.at)}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                  该类型暂无记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
