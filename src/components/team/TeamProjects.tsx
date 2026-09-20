import * as React from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { ConfirmDialog } from "./PromptDialog";
import { BudgetBar, LevelBadge } from "./BudgetBar";
import { useTeam, type Project } from "@/lib/team-data";

export function TeamProjects() {
  const { projects, createProject, can } = useTeam();
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end" hidden={!can("project.manage")}>
        <Button
          onClick={() => setCreateOpen(true)}
          className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-2 rounded-lg"
        >
          <Plus className="h-3.5 w-3.5" />
          新建项目
        </Button>
      </div>

      <CreateProjectDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onConfirm={(name) => {
          createProject(name);
          toast.success(`项目「${name}」创建成功`);
        }}
      />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/40 rounded-3xl bg-card/5">
          <p className="text-sm text-muted-foreground font-medium">暂无项目</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectGroup key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectGroup({ project }: { project: Project }) {
  const {
    members,
    memberById,
    addProjectMember,
    removeProjectMember,
    setProjectMemberRole,
    deleteProject,
    projectStatus,
    can,
  } = useTeam();
  const [isOpen, setIsOpen] = React.useState(true);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const manage = can("project.manage");
  const status = projectStatus(project.id);

  const available = members.filter((m) => !project.members.some((pm) => pm.memberId === m.id));

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/20">
          <CollapsibleTrigger className="flex items-center gap-2 group">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            )}
            <span className="text-sm font-bold text-foreground">
              {project.name}{" "}
              <span className="text-muted-foreground ml-1 font-normal">({project.members.length} 人)</span>
            </span>
          </CollapsibleTrigger>

          <div className="flex items-center gap-4">
            <LevelBadge status={status} />
            <BudgetBar status={status} className="w-48" />
            {!manage && <span className="text-xs text-muted-foreground">只读</span>}
            {manage && (
            <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  添加成员
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {available.length === 0 && <DropdownMenuItem disabled>全部成员都已在项目中</DropdownMenuItem>}
                {available.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onClick={() => {
                      addProjectMember(project.id, m.id);
                      toast.success(`${m.name} 已加入「${project.name}」`);
                    }}
                  >
                    {m.name}
                    <span className="ml-auto text-[10px] text-muted-foreground">{m.email}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={() => setDeleteOpen(true)}
              className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              删除项目
            </button>
            </>
            )}
          </div>
        </div>

        <CollapsibleContent>
          <div className="w-full">
            <div className="grid grid-cols-[1fr_200px_300px_120px] gap-4 px-6 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/10">
              <span>成员信息</span>
              <span>项目角色</span>
              <span>最后访问时间</span>
              <span className="text-right"></span>
            </div>

            <div className="divide-y divide-border/10">
              {project.members.map((pm) => {
                const member = memberById(pm.memberId);
                return (
                  <div
                    key={pm.memberId}
                    className="grid grid-cols-[1fr_200px_300px_120px] gap-4 px-6 py-5 text-sm items-center hover:bg-muted/5 transition-colors"
                  >
                    <span className="font-medium text-foreground">{member?.name ?? pm.memberId}</span>

                    <div>
                      <Select
                        value={pm.role}
                        onValueChange={(v) => {
                          setProjectMemberRole(project.id, pm.memberId, v as "owner" | "member");
                          toast.success("项目角色已更新");
                        }}
                      >
                        <SelectTrigger className="h-9 w-24 bg-muted/20 border-border/30 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member" className="text-xs">
                            成员
                          </SelectItem>
                          <SelectItem value="owner" className="text-xs">
                            负责人
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <span className="text-muted-foreground text-xs">{pm.lastActive}</span>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          removeProjectMember(project.id, pm.memberId);
                          toast.success(`${member?.name ?? "成员"} 已移出项目`);
                        }}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
                      >
                        移出项目
                      </button>
                    </div>
                  </div>
                );
              })}
              {project.members.length === 0 && (
                <div className="px-6 py-10 text-center text-xs text-muted-foreground">该项目暂无成员</div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`删除项目「${project.name}」？`}
        description="项目及其成员权限将被移除，且无法恢复。"
        confirmText="确认删除"
        onConfirm={() => {
          deleteProject(project.id);
          toast.success("项目已删除");
        }}
      />
    </Collapsible>
  );
}
