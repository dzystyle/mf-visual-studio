import * as React from "react";
import { ChevronRight, ChevronDown, MoreHorizontal, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Member {
  id: string;
  name: string;
  avatar: string;
  initials: string;
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
  members: Member[];
  isExpanded?: boolean;
}

export function TeamStructure() {
  const [groups, setGroups] = React.useState<Group[]>([
    {
      id: "tech",
      name: "技术部",
      memberCount: 2,
      isExpanded: true,
      members: [
        { id: "1", name: "猫咪", avatar: "", initials: "猫" },
        { id: "2", name: "猫咪2", avatar: "", initials: "猫" },
      ],
    },
    {
      id: "data",
      name: "数据组",
      memberCount: 2,
      isExpanded: true,
      members: [
        { id: "3", name: "猫咪3", avatar: "", initials: "猫" },
        { id: "4", name: "aaa22", avatar: "", initials: "A" },
      ],
    },
    {
      id: "unassigned",
      name: "未分组",
      memberCount: 1,
      isExpanded: true,
      members: [
        { id: "5", name: "Zhangyu_4n6h", avatar: "", initials: "Z" },
      ],
    },
  ]);

  const toggleGroup = (groupId: string) => {
    setGroups(groups.map(g => 
      g.id === groupId ? { ...g, isExpanded: !g.isExpanded } : g
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-2 rounded-xl text-sm">
          创建分组
        </Button>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div 
            key={group.id} 
            className="rounded-2xl border border-border/40 bg-card/30 overflow-hidden transition-all"
          >
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/5 group/header"
              onClick={() => toggleGroup(group.id)}
            >
              <div className="flex items-center gap-2">
                <div className="text-muted-foreground/60">
                  {group.isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  {group.name}
                  <span className="ml-1 text-muted-foreground font-medium text-xs">
                    ({group.memberCount} 人)
                  </span>
                </h3>
              </div>
              
              <div className="flex items-center gap-4 opacity-0 group-hover/header:opacity-100 transition-opacity">
                <button 
                  className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Manage group members:', group.name);
                  }}
                >
                  分组成员管理
                </button>
                <button 
                  className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Rename group:', group.name);
                  }}
                >
                  重命名
                </button>
                <button 
                  className="text-xs font-bold text-destructive/70 hover:text-destructive transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Delete group:', group.name);
                  }}
                >
                  删除分组
                </button>
              </div>
            </div>

            {group.isExpanded && (
              <div className="px-6 pb-8 pt-0 flex flex-wrap gap-3">
                {group.members.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-center gap-2 rounded-full bg-muted/20 border border-border/20 px-3 py-1.5 hover:bg-muted/30 transition-all cursor-default group/member"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {member.initials}
                    </div>
                    <span className="text-xs font-medium text-foreground/80 group-hover/member:text-foreground transition-colors">
                      {member.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
