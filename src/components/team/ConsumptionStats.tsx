import * as React from "react";
import { Download, RefreshCw, ChevronRight, User, Users, Folder } from "lucide-react";
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

const chartData = [
  { name: "2026-07-26", value: 50 },
  { name: "2026-07-27", value: 20 },
];

const memberStats = [
  { name: "t1", count: 3, points: 30, percentage: 43 },
  { name: "t3", count: 2, points: 20, percentage: 29 },
  { name: "t6", count: 2, points: 20, percentage: 29 },
];

export function ConsumptionStats() {
  const [activeRange, setActiveRange] = React.useState("30d");
  const [viewType, setViewType] = React.useState("member");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[
            { id: "7d", label: "近 7 天" },
            { id: "30d", label: "近 30 天" },
            { id: "90d", label: "近 90 天" },
          ].map((range) => (
            <Button
              key={range.id}
              variant={activeRange === range.id ? "secondary" : "ghost"}
              onClick={() => setActiveRange(range.id)}
              className={cn(
                "h-9 px-4 text-xs font-medium rounded-lg",
                activeRange === range.id ? "bg-muted" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs border-border/50">
            <RefreshCw className="h-3.5 w-3.5" />
            刷新
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs border-border/50">
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
            <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 text-primary group cursor-pointer">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-bold">北京科技大学</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 text-muted-foreground group cursor-pointer transition-colors">
              <div className="flex items-center gap-2 pl-4">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-sm">技术部</span>
              </div>
              <span className="text-xs">2</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 text-muted-foreground group cursor-pointer transition-colors">
              <div className="flex items-center gap-2 pl-4">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-sm">数据组</span>
              </div>
              <span className="text-xs">2</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 text-muted-foreground group cursor-pointer transition-colors">
              <div className="flex items-center gap-2 pl-4">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-sm">未分组</span>
              </div>
              <span className="text-xs">1</span>
            </div>
          </div>
        </Card>

        {/* Center/Right Charts */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/30 border-border/50 min-h-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase mb-1">近 30 天总消费</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">70</span>
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
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        stroke="#ffffff40" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis 
                        stroke="#ffffff40" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        dx={-10}
                    />
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
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="font-medium text-foreground">图片</span>
                    </div>
                    <span className="text-muted-foreground">70 <span className="mx-1">•</span> 100%</span>
                  </div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-emerald-500" />
                  </div>
                </div>
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
                        onClick={() => setViewType(tab.id)}
                        className={cn(
                            "h-9 px-4 text-xs font-bold gap-2 rounded-lg",
                            viewType === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                    </Button>
                ))}
            </div>
            <div className="w-full">
                <div className="grid grid-cols-4 gap-4 px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border/20">
                    <span>成员</span>
                    <span className="text-center">次数</span>
                    <span className="text-right">消费积分</span>
                    <span className="text-right">占比</span>
                </div>
                {memberStats.map((stat, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 px-6 py-5 text-sm items-center border-b border-border/10 last:border-0 hover:bg-muted/10 transition-colors">
                        <span className="font-medium text-foreground">{stat.name}</span>
                        <span className="text-center text-muted-foreground">{stat.count}</span>
                        <span className="text-right font-bold text-foreground">{stat.points}</span>
                        <div className="flex items-center justify-end gap-3">
                            <span className="text-xs text-muted-foreground w-8 text-right">{stat.percentage}%</span>
                            <div className="h-1.5 w-16 bg-muted/30 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary/60 rounded-full" 
                                    style={{ width: `${stat.percentage}%` }} 
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
