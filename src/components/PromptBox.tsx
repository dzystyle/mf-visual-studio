import { useState } from "react";
import { Plus, LayoutGrid, Package, Smile, ArrowUp } from "lucide-react";
import { ModelPickerDialog, SkillPickerDialog, ElementsPickerDialog } from "./picker-dialogs";

export function PromptBox() {
  const [openModel, setOpenModel] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);
  const [openElements, setOpenElements] = useState(false);

  return (
    <div className="glass rounded-2xl p-5 shadow-2xl">
      <textarea
        rows={3}
        placeholder="由一个想法或故事开始..."
        className="w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent">
            <Plus className="h-4 w-4" />
          </button>
          <Chip icon={LayoutGrid} label="模型" badge="新" onClick={() => setOpenModel(true)} />
          <Chip icon={Package} label="Skill" onClick={() => setOpenSkill(true)} />
          <Chip icon={Smile} label="元素" onClick={() => setOpenElements(true)} />
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground transition hover:bg-foreground hover:text-background">
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      <ModelPickerDialog open={openModel} onOpenChange={setOpenModel} />
      <SkillPickerDialog open={openSkill} onOpenChange={setOpenSkill} />
      <ElementsPickerDialog open={openElements} onOpenChange={setOpenElements} />
    </div>
  );
}

function Chip({
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs text-foreground hover:bg-card"
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{label}</span>
      {badge ? (
        <span className="ml-0.5 rounded-full bg-success/20 px-1.5 text-[9px] font-medium text-success">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
