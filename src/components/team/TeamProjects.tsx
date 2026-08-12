import * as React from "react";
import { ChevronDown, ChevronRight, UserPlus, Trash2, Plus, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface ProjectMember {
  id: string;
  name: string;
  role: "member" | "owner";
  lastActive: string;
}

interface Project {
  id: string;
  name: string;
  memberCount: number;
  members: ProjectMember[];
}

export function TeamProjects() {
  const [projects, setProjects] = React.useState<Project[]>([
    {
      id: "p1",
      name: "P1",
      memberCount: 5,
      members: [
        { id: "t1", name: "t1", role: "member", lastActive: "2026-07-27 19:24:15" },
        { id: "t3", name: "t3", role: "member", lastActive: "从未" },
        { id: "t6", name: "t6", role: "member", lastActive: "从未" },
        { id: "a22", name: "a22", role: "member", lastActive: "从未" },
        { id: "zhangyu", name: "Zhangyu_4n6h", role: "owner", lastActive: "2026-07-29 12:01:20" },
      ],
    },
    {
      id: "p2",
      name: "P2",
      memberCount: 3,
      members: [
        { id: "t1", name: "t1", role: "member", lastActive: "从未" },
        { id: "t3", name: "t3", role: "member", lastActive: "从未" },
        { id: "zhangyu", name: "Zhangyu_4n6h", role: "owner", lastActive: "从未" },
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs gap-2 rounded-lg">
          新建项目
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectGroup key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectGroup({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = React.useState(true);

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
              {project.name} <span className="text-muted-foreground ml-1 font-normal">({project.memberCount} 人)</span>
            </span>
          </CollapsibleTrigger>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => console.log('Add member to project:', project.name)}
              className="text-xs font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              添加成员
            </button>
            <button 
              onClick={() => console.log('Delete project:', project.name)}
              className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              删除项目
            </button>
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
              {project.members.map((member) => (
                <div 
                  key={member.id} 
                  className="grid grid-cols-[1fr_200px_300px_120px] gap-4 px-6 py-5 text-sm items-center hover:bg-muted/5 transition-colors"
                >
                  <span className="font-medium text-foreground">{member.name}</span>
                  
                  <div>
                    <Select defaultValue={member.role}>
                      <SelectTrigger className="h-9 w-24 bg-muted/20 border-border/30 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member" className="text-xs">成员</SelectItem>
                        <SelectItem value="owner" className="text-xs">负责人</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <span className="text-muted-foreground text-xs">{member.lastActive}</span>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={() => console.log('Remove member from project:', member.name)}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
                    >
                      移出项目
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
