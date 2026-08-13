import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { TeamOverview } from "@/components/team/TeamOverview";
import { TeamMembers, TeamApproval } from "@/components/team/TeamMembers";
import { TeamStructure } from "@/components/team/TeamStructure";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetFlow } from "@/components/team/BudgetFlow";
import { ConsumptionStats } from "@/components/team/ConsumptionStats";
import { TeamProjects } from "@/components/team/TeamProjects";

export const Route = createFileRoute("/settings/team")({
  component: TeamManagementPage,
});

function TeamManagementPage() {
  const [activeTab, setActiveTab] = React.useState("overview");

  const tabLabels = {
    overview: "团队概览",
    members: "团队成员",
    approval: "加入审核",
    structure: "组织架构",
    projects: "项目成员",
    budget: "预算流水",
    stats: "消费统计",
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Reuse the shared TopBar components / layout logic */}
        <div className="relative h-16 w-full px-8 flex items-center justify-between border-b border-border/40 bg-sidebar/50 backdrop-blur-md">
          <div className="flex flex-col">
            <h1 className="text-[15px] font-bold">团队与预算</h1>
            <p className="text-[10px] text-muted-foreground font-medium">管理团队、成员与预算分配</p>
          </div>
          <TopBar />
        </div>

        <main className="flex-1 overflow-y-auto p-8 pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-auto bg-transparent p-0 flex gap-8 border-b border-border/40 rounded-none mb-8">
              {[
                { id: "overview", label: "团队概览" },
                { id: "members", label: "团队成员" },
                { id: "approval", label: (
                  <div className="flex items-center gap-1.5">
                    加入审核
                    <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  </div>
                ) },
                { id: "structure", label: "组织架构" },
                { id: "projects", label: "项目成员" },
                { id: "budget", label: "预算流水" },
                { id: "stats", label: "消费统计" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="rounded-none border-b-2 border-transparent px-0 py-2.5 text-sm font-semibold text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4">
              {activeTab === "overview" && <TeamOverview />}
              {activeTab === "members" && <TeamMembers />}
              {activeTab === "approval" && <TeamApproval />}
              {activeTab === "structure" && <TeamStructure />}
              {activeTab === "budget" && <BudgetFlow />}
              {activeTab === "stats" && <ConsumptionStats />}
              {activeTab === "projects" && <TeamProjects />}
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
