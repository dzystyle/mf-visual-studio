import * as React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PromptDialog, ConfirmDialog } from "./PromptDialog";
import { BudgetBar, LevelBadge } from "./BudgetBar";
import { useTeam } from "@/lib/team-data";

export function TeamStructure() {
  const { groups, members, groupMembers, groupStatus, createGroup, renameGroup, deleteGroup, setMemberGroup, can } =
    useTeam();
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = React.useState(false);
  const [renameTarget, setRenameTarget] = React.useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; name: string } | null>(null);
  const manage = can("group.manage");

  const isExpanded = (id: string) => expanded[id] !== false;
  const toggleGroup = (id: string) => setExpanded((p) => ({ ...p, [id]: !isExpanded(id) }));

  return (
    <div className="space-y-4">
      {manage && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2 rounded-xl text-sm"
          >
            创建分组
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {groups.map((group) => {
          const gm = groupMembers(group.id);
          return (
            <div key={group.id} className="rounded-2xl border border-border/40 bg-card/30 overflow-hidden transition-all">
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/5 group/header"
                onClick={() => toggleGroup(group.id)}
              >
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground/60">
                    {isExpanded(group.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {group.name}
                    <span className="ml-1 text-muted-foreground font-medium text-xs">({gm.length} 人)</span>
                  </h3>
                  <LevelBadge status={groupStatus(group.id)} />
                  <BudgetBar status={groupStatus(group.id)} className="w-48 ml-4" />
                </div>

                <div className="flex items-center gap-4 opacity-60 group-hover/header:opacity-100 transition-opacity">
                  {!manage && <span className="text-xs text-muted-foreground">只读</span>}
                  {manage && (
                  <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        分组成员管理
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
                      {members.map((m) => (
                        <DropdownMenuItem
                          key={m.id}
                          onClick={() => {
                            setMemberGroup(m.id, group.id);
                            toast.success(`${m.name} 已加入「${group.name}」`);
                          }}
                        >
                          {m.name}
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            {m.groupId === group.id ? "已在本组" : ""}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button
                    className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenameTarget(group);
                    }}
                  >
                    重命名
                  </button>
                  {group.id !== "unassigned" && (
                    <button
                      className="text-xs font-bold text-destructive/70 hover:text-destructive transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(group);
                      }}
                    >
                      删除分组
                    </button>
                  )}
                  </>
                  )}
                </div>
              </div>

              {isExpanded(group.id) && (
                <div className="px-6 pb-8 pt-0 flex flex-wrap gap-3">
                  {gm.length === 0 && <span className="text-xs text-muted-foreground">该分组暂无成员</span>}
                  {gm.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 rounded-full bg-muted/20 border border-border/20 px-3 py-1.5 hover:bg-muted/30 transition-all group/member"
                    >
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {member.initial}
                      </div>
                      <span className="text-xs font-medium text-foreground/80">{member.name}</span>
                      {group.id !== "unassigned" && (
                        <button
                          className="text-[10px] text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => {
                            setMemberGroup(member.id, "unassigned");
                            toast.success(`${member.name} 已移出「${group.name}」`);
                          }}
                        >
                          移出
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <PromptDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="创建分组"
        label="分组名称"
        placeholder="如：市场部"
        onConfirm={(v) => {
          createGroup(v);
          toast.success(`分组「${v}」已创建`);
        }}
      />
      <PromptDialog
        open={!!renameTarget}
        onOpenChange={(v) => !v && setRenameTarget(null)}
        title="重命名分组"
        label="分组名称"
        defaultValue={renameTarget?.name ?? ""}
        onConfirm={(v) => {
          if (renameTarget) {
            renameGroup(renameTarget.id, v);
            toast.success("分组名称已更新");
          }
          setRenameTarget(null);
        }}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`删除分组「${deleteTarget?.name ?? ""}」？`}
        description="分组内的成员会自动移动到「未分组」。"
        confirmText="确认删除"
        onConfirm={() => {
          if (deleteTarget) {
            deleteGroup(deleteTarget.id);
            toast.success("分组已删除");
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
