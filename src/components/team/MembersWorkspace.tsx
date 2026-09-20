import * as React from "react";
import { cn } from "@/lib/utils";
import { TeamMembers, TeamApproval } from "./TeamMembers";
import { TeamStructure } from "./TeamStructure";
import { TeamProjects } from "./TeamProjects";
import { useTeam } from "@/lib/team-data";

export type MembersView = "list" | "approval" | "structure" | "projects";

const VIEWS: { id: MembersView; label: string }[] = [
  { id: "list", label: "成员列表" },
  { id: "approval", label: "加入审核" },
  { id: "structure", label: "组织架构" },
  { id: "projects", label: "项目成员" },
];

export function MembersWorkspace({
  view,
  onViewChange,
}: {
  view: MembersView;
  onViewChange: (v: MembersView) => void;
}) {
  const { requests } = useTeam();

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1 rounded-xl border border-border/40 bg-muted/20 p-1">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => onViewChange(v.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all",
              view === v.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {v.label}
            {v.id === "approval" && requests.length > 0 && (
              <span className="rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white">
                {requests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {view === "list" && <TeamMembers />}
      {view === "approval" && <TeamApproval />}
      {view === "structure" && <TeamStructure />}
      {view === "projects" && <TeamProjects />}
    </div>
  );
}
