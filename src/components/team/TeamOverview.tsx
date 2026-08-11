import * as React from "react";
import { Edit3, Share2, Trash2, Users, Folder, LayoutGrid, TrendingUp, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export function TeamOverview() {
  return (
    <div className="space-y-6">
      {/* Team Header Card */}
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#6C5DD3] text-xl font-bold text-white">
              D
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1A1D1F]">D</h3>
              <p className="text-xs text-[#6F767E]">团队信息</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton icon={Edit3} label="重命名" />
            <ActionButton icon={Share2} label="转让负责人" />
            <ActionButton icon={Trash2} label="解散团队" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <StatBox icon={Users} label="团队成员" value="1" />
          <StatBox icon={Folder} label="团队项目" value="0" />
          <StatBox icon={LayoutGrid} label="分组数" value="0" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Usage Card */}
        <div className="col-span-1 rounded-2xl border border-black/5 bg-white p-6 shadow-sm flex flex-col items-center">
          <h4 className="w-full text-sm font-bold text-[#1A1D1F] mb-8 text-left">共享额度使用情况</h4>
          
          <div className="relative mb-12 flex h-32 w-32 items-center justify-center">
            {/* Simple circular progress visualization */}
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="#F4F4F4" 
                strokeWidth="8" 
              />
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="#6C5DD3" 
                strokeWidth="8" 
                strokeDasharray="282.7" 
                strokeDashoffset="282.7" 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out"
              />
              <circle cx="50" cy="5" r="3" fill="#6C5DD3" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold">0%</span>
              <span className="text-[10px] text-[#6F767E]">已用</span>
            </div>
          </div>

          <div className="w-full space-y-3 mb-8">
            <UsageRow color="bg-[#6C5DD3]" label="已用" value="0" />
            <UsageRow color="bg-[#7FBA7A]" label="剩余可用" value="0" />
            <UsageRow color="bg-[#EFEFEF]" label="总额度" value="0" />
          </div>

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1D1F] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90">
            <CreditCard className="h-4 w-4" />
            购买额度
          </button>
        </div>

        {/* Active Projects Card */}
        <div className="col-span-2 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[#6C5DD3] mb-8">
            <TrendingUp className="h-4 w-4" />
            <h4 className="text-sm font-bold text-[#1A1D1F]">活跃项目</h4>
          </div>
          
          <div className="flex h-64 flex-col items-center justify-center text-[#6F767E]">
            <span className="text-sm font-medium">暂无项目</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="flex items-center gap-1.5 rounded-lg border border-black/5 px-3 py-1.5 text-xs font-medium text-[#1A1D1F] transition-colors hover:bg-black/[0.02]">
      <Icon className="h-3.5 w-3.5 text-[#6F767E]" />
      {label}
    </button>
  );
}

function StatBox({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="rounded-xl bg-[#F8F9FB] p-4">
      <div className="flex items-center gap-2 text-[#6F767E] mb-2">
        <Icon className="h-3.5 w-3.5 opacity-50" />
        <span className="text-[11px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[#1A1D1F]">{value}</div>
    </div>
  );
}

function UsageRow({ color, label, value }: { color: string, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span className="text-xs text-[#1A1D1F]">{label}</span>
      </div>
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}
