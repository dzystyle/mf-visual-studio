import { useRef, useState } from "react";
import {
  Plus,
  LayoutGrid,
  Package,
  Smile,
  ArrowUp,
  Image as ImageIcon,
  AudioLines,
  Video,
  FileText,
  X,
  ChevronDown,
  AtSign,
  Square,
  Smartphone,
  Check,
} from "lucide-react";
import {
  ModelPickerDialog,
  SkillPickerDialog,
  ElementsPickerDialog,
} from "./picker-dialogs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Attachment = {
  id: string;
  name: string;
  kind: "image" | "audio" | "video" | "text";
  url?: string;
};

const ACCEPT_MAP: Record<Attachment["kind"], string> = {
  image: "image/*",
  audio: "audio/*",
  video: "video/*",
  text: ".txt,.md,.json,.csv,text/*",
};

export function PromptBox({ onSubmit }: { onSubmit?: (text: string) => void } = {}) {
  const [text, setText] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);
  const [openElements, setOpenElements] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [model, setModel] = useState("Seedance 2");
  const [skill, setSkill] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingKind = useRef<Attachment["kind"]>("image");

  const triggerPick = (kind: Attachment["kind"]) => {
    pendingKind.current = kind;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.accept = ACCEPT_MAP[kind];
      fileInputRef.current.click();
    }
    setPlusOpen(false);
  };

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const kind = pendingKind.current;
    const next = files.map((f) => ({
      id: `${Date.now()}-${f.name}`,
      name: f.name,
      kind,
      url: kind === "image" ? URL.createObjectURL(f) : undefined,
    }));
    setAttachments((prev) => [...prev, ...next]);
  };

  const remove = (id: string) =>
    setAttachments((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="glass rounded-2xl p-5 shadow-2xl">
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((a) => (
            <AttachmentChip key={a.id} a={a} onRemove={() => remove(a.id)} />
          ))}
        </div>
      )}

      <textarea
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const v = text.trim();
            if (v && onSubmit) {
              onSubmit(v);
              setText("");
            }
          }
        }}
        placeholder="由一个想法或故事开始..."
        className="w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
      />
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <MenuSelector />

          <Popover open={plusOpen} onOpenChange={setPlusOpen}>
            <PopoverTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent">
                <Plus className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="start"
              className="w-44 space-y-2 border-border/60 bg-card/95 p-2 backdrop-blur-xl"
            >
              <AddItem icon={ImageIcon} label="图片" onClick={() => triggerPick("image")} />
              <AddItem icon={AudioLines} label="音频" onClick={() => triggerPick("audio")} />
              <AddItem icon={Video} label="视频" onClick={() => triggerPick("video")} />
              <AddItem icon={FileText} label="文本" onClick={() => triggerPick("text")} />
            </PopoverContent>
          </Popover>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={onFiles}
          />

          <Chip icon={LayoutGrid} label={model} badge="新" onClick={() => setOpenModel(true)} />
          <Chip
            icon={Package}
            label={skill ?? "Skill"}
            active={!!skill}
            onClick={() => setOpenSkill(true)}
            onClear={skill ? () => setSkill(null) : undefined}
          />
          <Chip icon={Smile} label="元素" onClick={() => setOpenElements(true)} />
        </div>
        <button
          onClick={() => {
            const v = text.trim();
            if (v && onSubmit) {
              onSubmit(v);
              setText("");
            }
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground transition hover:bg-foreground hover:text-background"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      <ModelPickerDialog open={openModel} onOpenChange={setOpenModel} value={model} onSelect={setModel} />
      <SkillPickerDialog open={openSkill} onOpenChange={setOpenSkill} onSelect={setSkill} />
      <ElementsPickerDialog open={openElements} onOpenChange={setOpenElements} />
    </div>
  );
}

function AddItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 text-sm text-foreground transition hover:bg-accent"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{label}</span>
    </button>
  );
}

function AttachmentChip({ a, onRemove }: { a: Attachment; onRemove: () => void }) {
  const Icon =
    a.kind === "image" ? ImageIcon : a.kind === "audio" ? AudioLines : a.kind === "video" ? Video : FileText;
  return (
    <div className="group relative flex items-center gap-2 rounded-lg border border-border bg-card/60 py-1.5 pl-1.5 pr-2 text-xs">
      {a.kind === "image" && a.url ? (
        <img src={a.url} alt={a.name} className="h-8 w-8 rounded object-cover" />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded bg-muted/40">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <span className="max-w-[140px] truncate text-foreground">{a.name}</span>
      <button
        onClick={onRemove}
        className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-foreground"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function Chip({
  icon: Icon,
  label,
  badge,
  onClick,
  active,
  onClear,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  onClick?: () => void;
  active?: boolean;
  onClear?: () => void;
}) {
  const baseCls = `flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-foreground transition ${
    active
      ? "border-aurora-blue/60 bg-aurora-blue/10"
      : "border-border bg-card/40 hover:bg-card"
  }`;
  const inner = (
    <>
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="max-w-[140px] truncate">{label}</span>
      {badge ? (
        <span className="ml-0.5 rounded-full bg-success/20 px-1.5 text-[9px] font-medium text-success">
          {badge}
        </span>
      ) : null}
    </>
  );
  if (!onClear) {
    return (
      <button type="button" onClick={onClick} className={baseCls}>
        {inner}
      </button>
    );
  }
  return (
    <div className={baseCls}>
      <button type="button" onClick={onClick} className="flex items-center gap-1.5">
        {inner}
      </button>
      <button
        type="button"
        onClick={onClear}
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function MenuSelector() {
  const [selected, setSelected] = useState("16:9");
  const [open, setOpen] = useState(false);

  const options = [
    { label: "自动", icon: LayoutGrid, value: "auto" },
    { label: "16:9 (横屏)", icon: Video, value: "16:9", checked: true },
    { label: "21:9 (电影)", icon: Video, value: "21:9" },
    { label: "9:16 (竖屏)", icon: Smartphone, value: "9:16" },
    { label: "4:3", icon: Square, value: "4:3" },
    { label: "3:4", icon: Square, value: "3:4" },
    { label: "1:1", icon: Square, value: "1:1" },
  ];

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex h-8 items-center gap-1.5 rounded-full border border-border bg-card/40 px-2.5 text-xs text-foreground transition hover:bg-card">
            <Video className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{selected}</span>
            <ChevronDown className={`h-3 w-3 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48 overflow-hidden border-border/60 bg-card/95 p-1 backdrop-blur-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSelected(opt.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-foreground transition hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <opt.icon className="h-4 w-4 text-muted-foreground" />
                <span>{opt.label}</span>
              </div>
              {selected === opt.value && <Check className="h-3.5 w-3.5 text-foreground" />}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/40 text-muted-foreground transition hover:bg-card hover:text-foreground">
        <AtSign className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 rounded-full border border-border bg-card/40 px-2.5 py-1">
        <span className="text-[10px] text-muted-foreground">画布</span>
        <div className="h-3.5 w-7 rounded-full bg-muted/40 p-0.5 transition-colors">
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/60" />
        </div>
      </div>
    </div>
  );
}


