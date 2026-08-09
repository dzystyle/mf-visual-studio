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
  Pencil,
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
  const [ratio, setRatio] = useState("16:9");
  const [duration, setDuration] = useState(179);
  const [canvasMode, setCanvasMode] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
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

          <div className="h-4 w-px bg-border/40 mx-1" />

          {/* Aspect Ratio Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs text-foreground hover:bg-card">
                <div className="w-3.5 h-2.5 border border-current rounded-[1px] flex items-center justify-center text-[8px] leading-none">
                  <span className="scale-75">16:9</span>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-40 p-1 border-border bg-card/95 backdrop-blur-xl rounded-xl">
              <RatioItem label="自动" icon={<LayoutGrid className="w-3.5 h-3.5" />} />
              <RatioItem label="16:9 (横屏)" active icon={<div className="w-3.5 h-2.5 border border-current rounded-[1px]" />} />
              <RatioItem label="21:9 (电影)" icon={<div className="w-4 h-2 border border-current rounded-[1px]" />} />
              <RatioItem label="9:16 (竖屏)" icon={<div className="w-2.5 h-4 border border-current rounded-[1px]" />} />
              <RatioItem label="4:3" icon={<div className="w-3.5 h-3 border border-current rounded-[1px]" />} />
              <RatioItem label="3:4" icon={<div className="w-3 h-3.5 border border-current rounded-[1px]" />} />
              <RatioItem label="1:1" icon={<div className="w-3.5 h-3.5 border border-current rounded-[1px]" />} />
            </PopoverContent>
          </Popover>

          {/* Character Mention */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground">
                <AtSign className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-2 border-border bg-card/95 backdrop-blur-xl rounded-xl">
              <div className="text-[10px] text-muted-foreground px-2 py-1 mb-1">其他角色</div>
              <MentionItem label="场景01" img="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=64&h=64&fit=crop" />
              <MentionItem label="角色01" img="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" />
              <div className="text-[10px] text-muted-foreground px-2 py-1 mt-2 mb-1">推荐角色</div>
              <MentionItem label="皮皮特PiPi" icon={<div className="w-full h-full bg-accent flex items-center justify-center text-[10px]">P</div>} />
              <MentionItem label="萧衍" img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop" />
              <MentionItem label="西施" img="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop" />
            </PopoverContent>
          </Popover>

          {/* Canvas Mode Toggle */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs text-foreground">画布</span>
            <button className="w-9 h-5 rounded-full bg-muted/60 relative p-0.5 transition-colors hover:bg-muted">
              <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          </div>

          {/* Duration Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-full bg-accent/60 px-3 py-1.5 text-xs text-foreground hover:bg-accent transition">
                <span>179秒</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 border-border bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl">
              <div className="text-sm font-semibold mb-4">视频时长</div>
              <div className="flex bg-muted/40 p-1 rounded-full mb-6">
                <button className="flex-1 text-[11px] py-1.5 rounded-full bg-white text-black font-medium shadow-sm">按秒数</button>
                <button className="flex-1 text-[11px] py-1.5 rounded-full text-muted-foreground hover:text-foreground">智能时长</button>
              </div>
              <div className="relative pt-2 pb-8">
                <div className="h-1 bg-muted/60 rounded-full relative">
                  <div className="absolute left-0 top-0 h-full w-[90%] bg-foreground/10 rounded-full" />
                  <div className="absolute left-[90%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border border-black/5 cursor-pointer" />
                </div>
                <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
                  <span>4</span>
                  <span>60</span>
                  <span>120</span>
                  <span>180</span>
                </div>
                <div className="absolute right-0 top-[-8px] bg-accent/80 px-2 py-1 rounded-lg text-xs font-medium border border-border">179 秒</div>
              </div>
              <div className="text-[10px] text-muted-foreground/60 text-center italic">
                会在提示词里附加“时长：179秒”
              </div>
            </PopoverContent>
          </Popover>

          {/* Manual Edit Icon */}
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground">
            <Pencil className="h-3.5 w-3.5" />
          </button>
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

function RatioItem({ label, icon, active }: { label: string; icon: React.ReactNode; active?: boolean }) {
  return (
    <button className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-xs text-foreground transition hover:bg-accent/60">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span>{label}</span>
      </div>
      {active && <div className="h-1.5 w-1.5 rounded-full bg-foreground" />}
    </button>
  );
}

function MentionItem({ label, img, icon }: { label: string; img?: string; icon?: React.ReactNode }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-xs text-foreground transition hover:bg-accent/60">
      <div className="h-8 w-8 overflow-hidden rounded-lg border border-border bg-muted/40">
        {img ? (
          <img src={img} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">{icon}</div>
        )}
      </div>
      <span className="font-medium text-[13px]">{label}</span>
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

