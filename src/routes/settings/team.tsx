import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { TopBar } from "@/components/TopBar";

import { TeamOverview } from "@/components/team/TeamOverview";
import { MembersWorkspace, type MembersView } from "@/components/team/MembersWorkspace";
import { BudgetQuota } from "@/components/team/BudgetQuota";
import { UsageBilling } from "@/components/team/UsageBilling";
import { PrdDialog } from "@/components/team/PrdDialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamProvider, useTeam } from "@/lib/team-data";

const TABS = ["overview", "members", "quota", "usage"] as const;
type TabId = (typeof TABS)[number];

/** 旧链接兼容：七标签时代的取值映射到新的四标签 */
const LEGACY: Record<string, { tab: TabId; view?: MembersView }> = {
  approval: { tab: "members", view: "approval" },
  structure: { tab: "members", view: "structure" },
  projects: { tab: "members", view: "projects" },
  budget: { tab: "usage" },
  stats: { tab: "usage" },
};

const VIEWS: MembersView[] = ["list", "approval", "structure", "projects"];

export const Route = createFileRoute("/settings/team")({
  validateSearch: (search: Record<string, unknown>): { tab?: TabId; view?: MembersView } => {
    const raw = String(search.tab ?? "overview");
    const legacy = LEGACY[raw];
    const tab = legacy ? legacy.tab : TABS.includes(raw as TabId) ? (raw as TabId) : "overview";
    const rawView = search.view as MembersView | undefined;
    const view = legacy?.view ?? (VIEWS.includes(rawView as MembersView) ? rawView : undefined);
    return view ? { tab, view } : { tab };
  },
  head: () => ({
    meta: [
      { title: "团队与预算 — movieflow.ai" },
      { name: "description", content: "管理 movieflow.ai 团队成员、权限、三层预算与用量账单。" },
      { property: "og:title", content: "团队与预算 — movieflow.ai" },
      { property: "og:description", content: "管理 movieflow.ai 团队成员、权限、三层预算与用量账单。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamManagementRoute,
});

function TeamManagementRoute() {
  return (
    <TeamProvider>
      <TeamManagementPage />
    </TeamProvider>
  );
}

function TeamManagementPage() {
  const { tab = "overview", view } = Route.useSearch();
  const navigate = useNavigate();
  const { requests, team, dissolved, alerts } = useTeam();
  const [prdOpen, setPrdOpen] = React.useState(false);
  // 红点依赖运行时派生数据，仅客户端挂载后渲染，避免 SSR 水合不一致
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const go = (nextTab: TabId, nextView?: MembersView) => {
    navigate({ to: "/settings/team", search: nextView ? { tab: nextTab, view: nextView } : { tab: nextTab } });
  };

  if (dissolved) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold">团队「{team.name}」已解散</h2>
          <p className="text-sm text-muted-foreground">所有成员、分组与项目权限已被移除。</p>
          <Link to="/" className="inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as TabId, label: "团队概览", dot: mounted && alerts.length > 0 },
    { id: "members" as TabId, label: "成员与权限", dot: mounted && requests.length > 0 },
    { id: "quota" as TabId, label: "预算与额度", dot: false },
    { id: "usage" as TabId, label: "用量与账单", dot: false },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="flex-1 flex flex-col">
        <div className="relative h-16 w-full px-8 flex items-center justify-between border-b border-border/40 bg-sidebar/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="text-[15px] font-bold">团队与预算</h1>
              <p className="text-[10px] text-muted-foreground font-medium">成员、权限与三层预算治理</p>
            </div>
            <button
              onClick={() => setPrdOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/20 px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground"
            >
              <FileText className="h-3.5 w-3.5" />
              需求文档
            </button>
          </div>
          <TopBar />
        </div>

        <main className="flex-1 overflow-y-auto p-8 pt-6">
          <Tabs value={tab} onValueChange={(v) => go(v as TabId)} className="w-full">
            <TabsList className="h-auto bg-transparent p-0 flex gap-8 border-b border-border/40 rounded-none mb-8">
              {tabs.map((t) => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="rounded-none border-b-2 border-transparent px-0 py-2.5 text-sm font-semibold text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none transition-all"
                >
                  <span className="flex items-center gap-1.5">
                    {t.label}
                    {t.dot && <span className="flex h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4">
              {tab === "overview" && (
                <TeamOverview onGoMembers={(v) => go("members", v)} onGoBudget={() => go("quota")} />
              )}
              {tab === "members" && (
                <MembersWorkspace view={view ?? "list"} onViewChange={(v) => go("members", v)} />
              )}
              {tab === "quota" && <BudgetQuota />}
              {tab === "usage" && <UsageBilling />}
            </div>
          </Tabs>
        </main>
      </div>
      <PrdDialog open={prdOpen} onOpenChange={setPrdOpen} />
    </div>
  );
}
