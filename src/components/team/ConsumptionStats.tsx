import * as React from "react";
import { Download, RefreshCw, User, Users, Folder } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTeam, formatDate, normalizePercentages, downloadCsv } from "@/lib/team-data";

const RANGES = [
  { id: "7d", label: "近 7 天", days: 7 },
  { id: "30d", label: "近 30 天", days: 30 },
  { id: "90d", label: "近 90 天", days: 90 },
];

export function ConsumptionStats() {
  const { transactions, members, groups, projects, memberById } = useTeam();
  const [activeRange, setActiveRange] = React.useState("30d");
  const [viewType, setViewType] = React.useState<"member" | "structure" | "project">("member");

  const range = RANGES.find((r) => r.id === activeRange)!;
  const since = Date.now() - range.days * 24 * 60 * 60 * 1000;

  const spend = React.useMemo(
    () => transactions.filter((t) => t.amount < 0 && t.at >= since),
    [transactions, since],
  );

  const total = spend.reduce((s, t) => s - t.amount, 0);

  const chartData = React.useMemo(() => {
    const byDay = new Map<string, number>();
    spend.forEach((t) => {
      const key = formatDate(t.at);
      byDay.set(key, (byDay.get(key) ?? 0) + -t.amount);
    });
    return [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([name, value]) => ({ name, value }));
  }, [spend]);

  const byCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    spend.forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + -t.amount));
    const entries = [...map.entries()];
    const pcts = normalizePercentages(entries.map(([, v]) => v));
    return entries.map(([name, value], i) => ({ name, value, percentage: pcts[i] }));
  }, [spend]);

  const rows = React.useMemo(() => {
    const buckets = new Map<string, { count: number; points: number }>();
    const keyOf = (operatorId: string) => {
      if (viewType === "member") return memberById(operatorId)?.name ?? operatorId;
      if (viewType === "structure") {
        const g = groups.find((gr) => gr.id === memberById(operatorId)?.groupId);
        return g?.name ?? "未分组";
      }
      const p = projects.find((pr) => pr.members.some((pm) => pm.memberId === operatorId));
      return p?.name ?? "未归属项目";
    };
    spend.forEach((t) => {
      const key = keyOf(t.operatorId);
      const cur = buckets.get(key) ?? { count: 0, points: 0 };
      buckets.set(key, { count: cur.count + 1, points: cur.points + -t.amount });
    });
    const entries = [...buckets.entries()].sort((a, b) => b[1].points - a[1].points);
    const pcts = normalizePercentages(entries.map(([, v]) => v.points));
    return entries.map(([name, v], i) => ({ name, ...v, percentage: pcts[i] }));
  }, [spend, viewType, memberById, groups, projects]);

  const viewLabel = viewType === "member" ? "成员" : viewType === "structure" ? "分组" : "项目";

  const handleExport = () => {
    downloadCsv(
      `消费统计-${activeRange}-${viewLabel}.csv`,
      [[viewLabel, "次数", "消费积分", "占比"], ...rows.map((r) => [r.name, r.count, r.points, `${r.percentage}%`])],
    );
    toast.success("CSV 已导出");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <Button
              key={r.id}
              variant={activeRange === r.id ? "secondary" : "ghost"}
              onClick={() => setActiveRange(r.id)}
              className={cn(
                "h-9 px-4 text-xs font-medium rounded-lg",
                activeRange === r.id ? "bg-muted" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs border-border/50"
            onClick={() => toast.success("统计数据已刷新")}
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Structure */}
        <Card className="lg:col-span-1 p-4 bg-card/30 border-border/50">
          <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">组织架构</h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 text-primary">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-bold">全部成员</span>
              </div>
              <span className="text-xs">{members.length}</span>
            </div>
            {groups.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 text-muted-foreground transition-colors"
              >
                <div className="flex items-center gap-2 pl-4">
                  <span className="text-sm">{g.name}</span>
                </div>
                <span className="text-xs">{members.filter((m) => m.groupId === g.id).length}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Center/Right Charts */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/30 border-border/50 min-h-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase mb-1">{range.label}总消费</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{total}</span>
                    <span className="text-sm text-muted-foreground">积分</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                  <span className="text-primary">📈</span>
                  消费趋势
                </div>
              </div>
              <div className="flex-1 w-full min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      itemStyle={{ color: "#fff", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 bg-card/30 border-border/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase mb-6">按类别分类</h3>
              <div className="space-y-6">
                {byCategory.length === 0 && <p className="text-sm text-muted-foreground">该区间暂无消费</p>}
                {byCategory.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            c.name === "图片" ? "bg-emerald-500" : c.name === "视频" ? "bg-violet-500" : "bg-amber-500",
                          )}
                        />
                        <span className="font-medium text-foreground">{c.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {c.value} <span className="mx-1">•</span> {c.percentage}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full",
                          c.name === "图片" ? "bg-emerald-500" : c.name === "视频" ? "bg-violet-500" : "bg-amber-500",
                        )}
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Table Area */}
          <Card className="bg-card/30 border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center gap-2">
              {[
                { id: "member", label: "按成员", icon: User },
                { id: "structure", label: "按架构", icon: Users },
                { id: "project", label: "按项目", icon: Folder },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={viewType === tab.id ? "secondary" : "ghost"}
                  onClick={() => setViewType(tab.id as typeof viewType)}
                  className={cn(
                    "h-9 px-4 text-xs font-bold gap-2 rounded-lg",
                    viewType === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </Button>
              ))}
            </div>
            <div className="w-full">
              <div className="grid grid-cols-4 gap-4 px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/20">
                <span>{viewLabel}</span>
                <span className="text-center">次数</span>
                <span className="text-right">消费积分</span>
                <span className="text-right">占比</span>
              </div>
              {rows.map((stat) => (
                <div
                  key={stat.name}
                  className="grid grid-cols-4 gap-4 px-6 py-5 text-sm items-center border-b border-border/10 last:border-0 hover:bg-muted/10 transition-colors"
                >
                  <span className="font-medium text-foreground">{stat.name}</span>
                  <span className="text-center text-muted-foreground">{stat.count}</span>
                  <span className="text-right font-bold text-foreground">{stat.points}</span>
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-xs text-muted-foreground w-8 text-right">{stat.percentage}%</span>
                    <div className="h-1.5 w-16 bg-muted/30 rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 rounded-full" style={{ width: `${stat.percentage}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              {rows.length === 0 && (
                <div className="py-16 text-center text-sm text-muted-foreground">该区间暂无消费记录</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
