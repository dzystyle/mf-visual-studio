import { useRef, useState, useEffect } from "react";
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
  Search,
  Mic,
} from "lucide-react";
import {
  ModelPicker,
  SkillPicker,
  ElementsPicker,
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

export function PromptBox({ 
  onSubmit, 
  isMini = false 
}: { 
  onSubmit?: (text: string, canvasMode: boolean) => void;
  isMini?: boolean;
} = {}) {
  const [text, setText] = useState("");
  const [plusOpen, setPlusOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [model, setModel] = useState<string | null>(null);
  const [skill, setSkill] = useState<string | null>(null);
  const [ratio, setRatio] = useState("16:9");
  const [duration, setDuration] = useState(179);
  const [canvasMode, setCanvasMode] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [assetsOpen, setAssetsOpen] = useState(false);
  const [videoMode, setVideoMode] = useState("图生视频");
  const [resolution, setResolution] = useState("720p");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingKind = useRef<Attachment["kind"]>("image");

  useEffect(() => {
    const handleSelectSkill = (e: any) => {
      const skillTitle = e.detail;
      setSkill(skillTitle);
      
      // If we're selecting a skill, we often don't want it to just be an @ mention in text
      // but also a primary visual chip. The visual chip is already rendered if skill state is set.
      
      // We focus the textarea to show the user where the input is
      textareaRef.current?.focus();
    };
    window.addEventListener('select-skill', handleSelectSkill);
    return () => window.removeEventListener('select-skill', handleSelectSkill);
  }, []);

  useEffect(() => {
    const textBeforeCursor = text.slice(0, cursorPos);
    const lastAtPos = textBeforeCursor.lastIndexOf("@");
    
    if (lastAtPos !== -1) {
      const afterAt = textBeforeCursor.slice(lastAtPos + 1);
      if (!afterAt.includes(" ")) {
        setMentionOpen(true);
        setMentionFilter(afterAt);
      } else {
        setMentionOpen(false);
      }
    } else {
      setMentionOpen(false);
    }
  }, [text, cursorPos]);

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
    
    // We clear current skill when uploading files to avoid conflict
    setSkill(null);
    
    const next = files.map((f) => ({
      id: `${Date.now()}-${f.name}`,
      name: f.name,
      kind,
      url: kind === "image" ? URL.createObjectURL(f) : undefined,
    }));
    setAttachments((prev) => [...prev, ...next]);
  };

  const remove = (id: string, name?: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    if (name) {
      setText(prev => {
        const mention = `@${name}`;
        if (prev.includes(mention)) {
          return prev.replace(new RegExp(`@${name}\\s?`), "");
        }
        return prev;
      });
    }
  };

  const handleMentionSelect = (name: string, kind?: string, url?: string) => {
    const textBeforeCursor = text.slice(0, cursorPos);
    const lastAtPos = textBeforeCursor.lastIndexOf("@");
    
    let newText: string;
    let newCursorPos: number;

    if (lastAtPos !== -1 && !textBeforeCursor.slice(lastAtPos).includes(" ")) {
      const before = text.slice(0, lastAtPos);
      const after = text.slice(cursorPos);
      newText = `${before}@${name} ${after}`;
      newCursorPos = before.length + name.length + 2;
    } else {
      const before = text.slice(0, cursorPos);
      const after = text.slice(cursorPos);
      const prefix = before.endsWith(" ") || before === "" ? "" : " ";
      newText = `${before}${prefix}@${name} ${after}`;
      newCursorPos = before.length + prefix.length + name.length + 2;
    }

    setText(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPos(newCursorPos);
      }
    }, 0);
    
    setMentionOpen(false);
    
    if (url && (kind === "image" || kind === "video")) {
      const id = `${Date.now()}-${name}`;
      setAttachments(prev => [
        ...prev,
        {
          id,
          name,
          kind: kind as any,
          url
        }
      ]);
    }
  };

  return (
    <div className={`glass shadow-2xl relative z-20 transition-all duration-500 ease-out-expo ${
      isMini ? 'rounded-full p-2 pl-6' : 'rounded-2xl p-5'
    }`}>
      {/* Canvas mode toggle removed from here */}
      <div className="relative">
        {!isMini && (attachments.length > 0 || skill) && (
          <div className="mb-3 flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
            {skill && (
              <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[13px] text-white font-medium group transition-all hover:bg-white/15">
                <Package className="h-3.5 w-3.5 text-white/60" />
                <span>{skill}</span>
                <button 
                  onClick={() => setSkill(null)}
                  className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/20 text-white/40 hover:text-white transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {attachments.map((a) => (
              <AttachmentChip 
                key={a.id} 
                a={a} 
                onRemove={() => remove(a.id, a.name)} 
                onAtClick={() => {
                  setMentionOpen(true);
                  setMentionFilter("");
                  textareaRef.current?.focus();
                }}
              />
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <textarea
            ref={textareaRef}
            rows={isMini ? 1 : 3}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setCursorPos(e.target.selectionStart);
            }}
            onKeyUp={(e) => {
              setCursorPos((e.target as HTMLTextAreaElement).selectionStart);
            }}
            onClick={(e) => {
              setCursorPos((e.target as HTMLTextAreaElement).selectionStart);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const v = text.trim();
                if (v && onSubmit) {
                  onSubmit(v, canvasMode);
                  setText("");
                  setAttachments([]);
                }
              }
            }}
            placeholder={isMini ? "由一个想法或故事开始..." : "由一个想法或故事开始..."}
            className={`w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-300 ${
              isMini ? 'py-1 cursor-pointer' : 'py-2 min-h-[48px]'
            }`}
          />
          {isMini && (
            <button
              onClick={() => {
                const v = text.trim();
                if (v && onSubmit) {
                  onSubmit(v, canvasMode);
                  setText("");
                }
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition hover:scale-105"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>

        {!isMini && mentionOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-[#1A1A1A]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input 
                  autoFocus
                  type="text" 
                  value={mentionFilter}
                  onChange={(e) => setMentionFilter(e.target.value)}
                  placeholder="搜索素材、角色、商品..."
                  className="w-full bg-white/5 border-none rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-muted-foreground focus:ring-1 focus:ring-white/10 focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-hide">
              <div className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">最近使用</div>
              {[
                { name: "画布生图", kind: "image", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=64&h=64&fit=crop" },
                { name: "角色01", kind: "image", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" },
                { name: "S1.mp4", kind: "video", url: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=64&h=64&fit=crop" },
              ].filter(i => i.name.includes(mentionFilter)).map((item, idx) => (
                <MentionListItem 
                  key={idx}
                  item={item}
                  onClick={() => handleMentionSelect(item.name, item.kind, item.url)}
                />
              ))}
            </div>
            <div className="p-2 border-t border-white/5 bg-white/[0.02]">
              <button 
                onClick={() => { setAssetsOpen(true); setMentionOpen(false); }}
                className="flex w-full items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                打开资产库
              </button>
            </div>
          </div>
        )}
      </div>

      {!isMini && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {!isMini && (
              <Popover open={plusOpen} onOpenChange={setPlusOpen}>
                <PopoverTrigger asChild>
                  <button 
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent transition-colors relative z-10"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-40 p-1.5 border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-xl shadow-2xl">
                  <AddItem icon={ImageIcon} label="本地上传" onClick={() => triggerPick("image")} />
                  <AddItem icon={LayoutGrid} label="资产库" onClick={() => setAssetsOpen(true)} />
                </PopoverContent>
              </Popover>
            )}
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFiles} />
            
            {!isMini && <ElementsPickerDialog open={assetsOpen} onOpenChange={setAssetsOpen} onSelect={handleMentionSelect} />}
            

            <Popover>
              <PopoverTrigger asChild>
                <button type="button">
                  <Chip icon={LayoutGrid} label={model ? `模型：${model}` : "选择模型"} badge={model === "Seedance 2" ? "新" : undefined} active={!!model} onClear={model ? () => setModel(null) : undefined} />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[600px] p-0 border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
                <ModelPicker value={model} onSelect={setModel} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs text-foreground hover:bg-card transition">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">分辨率：</span>
                    <span>{resolution}</span>
                    <span className="flex h-3.5 items-center rounded bg-aurora-purple/20 px-1 text-[7px] font-bold uppercase text-aurora-purple">尊享</span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-32 p-1 border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-xl shadow-2xl">
                {["480p", "720p"].map((res) => (
                  <button 
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${resolution === res ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                  >
                    <span>{res}</span>
                    <span className="flex h-3.5 items-center rounded bg-aurora-purple/20 px-1 text-[7px] font-bold uppercase text-aurora-purple">尊享</span>
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs text-foreground hover:bg-card transition">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">比例：</span>
                    <span>{ratio}</span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-24 p-1.5 border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-xl shadow-2xl">
                <div className="flex flex-col gap-0.5">
                  {[
                    { label: "21:9", icon: <div className="w-4 h-2 border border-current rounded-[1px]" /> },
                    { label: "16:9", icon: <div className="w-3.5 h-2.5 border border-current rounded-[1px]" /> },
                    { label: "4:3", icon: <div className="w-3.5 h-3 border border-current rounded-[1px]" /> },
                    { label: "1:1", icon: <div className="w-3 h-3 border border-current rounded-[1px]" /> },
                    { label: "3:4", icon: <div className="w-2.5 h-3.5 border border-current rounded-[1px]" /> },
                    { label: "9:16", icon: <div className="w-2 h-4 border border-current rounded-[1px]" /> }
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setRatio(item.label)}
                      className={`flex w-full items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                        ratio === item.label ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="w-4 flex justify-center">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs text-foreground hover:bg-card transition">
                  <span className="text-muted-foreground">时长：</span>
                  <span>{duration}s</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6 border-white/10 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-2xl shadow-2xl">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/90">时长：</span>
                    <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-xl font-bold text-white tracking-tight">
                      {duration}s
                    </div>
                  </div>
                  
                  <div className="relative pt-2 pb-4">
                    <input 
                      type="range" 
                      min="4" 
                      max="30" 
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value))} 
                      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:accent-white/90 transition-all" 
                    />
                    <div className="flex justify-between mt-4">
                      <span className="text-[11px] text-white/30">4s</span>
                      <span className="text-[11px] text-white/30">17s</span>
                      <span className="text-[11px] text-white/30">30s</span>
                    </div>
                  </div>
                </div>

              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2 px-3 py-1 bg-card/40 border border-border rounded-full hover:bg-card transition">
              <span className="text-[11px] font-medium text-muted-foreground">画布</span>
              <button 
                onClick={() => setCanvasMode(!canvasMode)}
                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${canvasMode ? 'bg-aurora-blue' : 'bg-white/10'}`}
              >
                <span
                  className={`pointer-events-none block h-2.5 w-2.5 rounded-full shadow-lg ring-0 transition-transform ${canvasMode ? 'translate-x-4.5 bg-white' : 'translate-x-1 bg-white/60'}`}
                />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground" onClick={() => console.log("Voice input triggered")}>
              <Mic className="h-4 w-4" />
            </button>
            <button onClick={() => {
                const v = text.trim();
                if (v && onSubmit) { onSubmit(v, canvasMode); setText(""); }
              }} className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground transition hover:bg-foreground hover:text-background"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddItem({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void; }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-3 py-2.5 text-sm text-foreground transition hover:bg-accent">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{label}</span>
    </button>
  );
}

function RatioItem({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-xs text-foreground transition hover:bg-accent/60">
      <div className="flex items-center gap-2"><span className="text-muted-foreground">{icon}</span><span>{label}</span></div>
      {active && <div className="h-1.5 w-1.5 rounded-full bg-foreground" />}
    </button>
  );
}

function MentionItem({ label, img, icon, active, onClick }: { label: string; img?: string; icon?: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-xs text-foreground transition hover:bg-accent/60 ${active ? 'bg-accent/80' : ''}`}>
      <div className="h-8 w-8 overflow-hidden rounded-lg border border-border bg-muted/40 relative">
        {img ? <img src={img} alt={label} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center">{icon}</div>}
        {active && <div className="absolute inset-0 bg-aurora-blue/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-aurora-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]" /></div>}
      </div>
      <span className={`font-medium text-[13px] ${active ? 'text-foreground' : 'text-foreground/80'}`}>{label}</span>
    </button>
  );
}

function AttachmentChip({ a, onRemove, onAtClick }: { a: Attachment; onRemove: () => void; onAtClick?: () => void }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const Icon = a.kind === "image" ? ImageIcon : a.kind === "audio" ? AudioLines : a.kind === "video" ? Video : FileText;
  return (
    <div className="group relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 bg-card/60 shadow-lg cursor-pointer" onClick={() => a.url && setIsZoomed(true)}>
      {a.kind === "image" && a.url ? <img src={a.url} alt={a.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" /> : <div className="flex h-full w-full flex-col items-center justify-center gap-1"><Icon className="h-5 w-5 text-muted-foreground" /><div className="px-1 text-[8px] text-muted-foreground truncate w-full text-center">{a.name}</div></div>}
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white/80 opacity-0 transition group-hover:opacity-100 hover:bg-black hover:text-white"><X className="h-2.5 w-2.5" /></button>
    </div>
  );
}

function Chip({ icon: Icon, label, badge, active, onClear }: { icon: any; label: string; badge?: string; active?: boolean; onClear?: () => void; }) {
  return (
    <div className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${active ? 'bg-aurora-blue/20 border-aurora-blue/40 text-foreground' : 'border-border bg-card/40 text-foreground hover:bg-card'}`}>
      <Icon className={`h-3.5 w-3.5 ${active ? 'text-aurora-blue' : 'text-muted-foreground'}`} />
      <span className="font-medium">{label}</span>
      {badge && <span className="flex h-4 items-center rounded bg-aurora-purple/20 px-1 text-[8px] font-bold uppercase text-aurora-purple">{badge}</span>}
      {onClear && <button onClick={(e) => { e.stopPropagation(); onClear(); }} className="ml-0.5 hover:text-aurora-blue"><X className="h-3 w-3" /></button>}
    </div>
  );
}

function MentionListItem({ item, onClick }: { item: any; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/5 transition group text-left">
      <div className="h-8 w-8 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
        <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white/90 truncate">{item.name}</div>
        <div className="text-[10px] text-muted-foreground">{item.kind === 'image' ? '图片' : '视频'} · 刚刚</div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUp className="h-3.5 w-3.5 text-muted-foreground" /></div>
    </button>
  );
}
