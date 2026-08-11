import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { TeamOverview } from "@/components/team/TeamOverview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/settings/team")({
  component: TeamManagementPage,
});

function TeamManagementPage() {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-[#1A1D1F]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* We use a custom header for this page to match the reference */}
        <header className="flex h-16 items-center justify-between border-b border-black/5 bg-white px-8">
          <div>
            <h1 className="text-lg font-bold">团队与预算</h1>
            <p className="text-[11px] text-[#6F767E]">管理团队、成员与预算分配</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F4F4] text-[#6F767E] hover:bg-[#EFEFEF]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 border border-white"></span>
            </button>
            <div className="flex items-center gap-2 rounded-full bg-[#F4F4F4] px-2 py-1 pr-3">
              <div className="flex h-6 w-10 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="yellow" stroke="yellow" className="mr-0.5"><path d="m13 2-2 10h3L11 22l2-10h-3Z"/></svg>
                0
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6C5DD3] text-[10px] font-bold text-white">D</div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EFEFEF] text-[10px] font-bold text-[#1A1D1F] border border-black/5">D</div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-auto bg-transparent p-0 flex gap-6 border-b border-black/5 rounded-none mb-6">
              {[
                { id: "overview", label: "团队概览" },
                { id: "members", label: "团队成员" },
                { id: "structure", label: "组织架构" },
                { id: "projects", label: "项目成员" },
                { id: "budget", label: "预算流水" },
                { id: "stats", label: "消费统计" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-2 border-transparent px-0 py-2 text-sm font-medium text-[#6F767E] data-[state=active]:border-[#6C5DD3] data-[state=active]:bg-transparent data-[state=active]:text-[#1A1D1F]"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4">
              {activeTab === "overview" && <TeamOverview />}
              {activeTab !== "overview" && (
                <div className="flex h-[400px] items-center justify-center rounded-2xl bg-white border border-black/5 text-[#6F767E]">
                  {activeTab} Content Area
                </div>
              )}
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
