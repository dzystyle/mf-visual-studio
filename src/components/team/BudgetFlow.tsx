import * as React from "react";
import { Search, RefreshCw, Download, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function BudgetFlow() {
  const transactions = [
    { type: "消费", operator: "t1", description: "图片生成 · 画布 《c1》", amount: "-10", balance: "0", time: "2026-07-27 08:30:35" },
    { type: "消费", operator: "t1", description: "图片生成 · 画布 《c1》", amount: "-10", balance: "10", time: "2026-07-27 04:15:13" },
    { type: "分配", operator: "Zhangyu_4n6h", description: "redemption code", amount: "+20", balance: "20", time: "2026-07-26 13:12:51" },
    { type: "消费", operator: "t6", description: "图片生成", amount: "-10", balance: "0", time: "2026-07-26 13:09:15" },
    { type: "消费", operator: "t6", description: "图片生成", amount: "-10", balance: "10", time: "2026-07-26 13:09:13" },
    { type: "消费", operator: "t3", description: "图片生成", amount: "-10", balance: "20", time: "2026-07-26 13:07:33" },
    { type: "消费", operator: "t3", description: "图片生成", amount: "-10", balance: "30", time: "2026-07-26 13:07:31" },
    { type: "消费", operator: "t1", description: "图片生成", amount: "-10", balance: "40", time: "2026-07-26 12:20:17" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {["全部", "消费", "分配", "退款", "调整", "结转"].map((filter) => (
            <Button
              key={filter}
              variant={filter === "全部" ? "secondary" : "ghost"}
              className={cn(
                "h-9 px-4 text-xs font-medium rounded-lg",
                filter === "全部" ? "bg-muted" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-1.5 text-xs border-border/50"
            onClick={() => console.log('Refresh budget flow')}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            刷新
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 gap-1.5 text-xs border-border/50"
            onClick={() => console.log('Export CSV')}
          >
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
            {transactions.map((t, i) => (
              <TableRow key={i} className="border-border/20 hover:bg-muted/10 transition-colors">
                <TableCell className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {t.type === "消费" ? (
                        <span className="text-rose-500">○</span>
                    ) : (
                        <span className="text-emerald-500">○</span>
                    )}
                    {t.type}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{t.operator}</TableCell>
                <TableCell className="text-sm text-foreground">{t.description}</TableCell>
                <TableCell className={cn("text-sm font-bold", t.amount.startsWith("+") ? "text-emerald-500" : "text-rose-500")}>
                  {t.amount}
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">{t.balance}</TableCell>
                <TableCell className="text-sm text-muted-foreground text-right">{t.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

