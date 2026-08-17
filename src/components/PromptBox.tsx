import { useRef, useState, useEffect } from "react";
import {
  Plus,
  LayoutGrid,
  Package,
  ArrowUp,
  Image as ImageIcon,
  AudioLines,
  Video,
  FileText,
  X,
  ChevronDown,
  Search,
  Mic,
} from "lucide-react";
import {
  ModelPicker,
  SkillPicker,
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
  isMini = false,
  showCanvasToggle = true
}: { 
  onSubmit?: (text: string, canvasMode: boolean) => void;
  isMini?: boolean;
  showCanvasToggle?: boolean;
} = {}) {
  const [text, setText] = useState("");
  const [plusOpen, setPlusOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [model, setModel] = useState<string | null>(null);
  const [skill, setSkill] = useState<string | null>(null);
  const [ratio, setRatio] = useState("16:9");
  const [duration, setDuration] = useState(17);
  const [canvasMode, setCanvasMode] = useState(false);
  const [assetsOpen, setAssetsOpen] = useState(false);
  const [resolution, setResolution] = useState("720p");
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingKind = useRef<Attachment["kind"]>("image");

  useEffect(() => {
    // Check for skill in localStorage (persisted from Skill page)
    const storedSkill = localStorage.getItem('selected-skill');
    if (storedSkill) {
      setSkill(storedSkill);
      localStorage.removeItem('selected-skill'); // Clear it so it doesn't persist on refresh
    }

    const handleSelectSkill = (e: any) => {
      const skillTitle = e.detail;
      setSkill(skillTitle);
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

  const removeAttachment = (id: string, name?: string) => {
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
      
      // We keep everything before the @ and everything after the current mention context
      newText = (before + after);
      newCursorPos = before.length;
    } else {
      newText = text;
      newCursorPos = cursorPos;
    }

    setText(newText);
    setMentionOpen(false);
    
    if (url) {
      const exists = attachments.find(a => a.url === url);
      if (!exists) {
        const id = `${Date.now()}-${name}`;
        setAttachments(prev => [
          ...prev,
          {
            id,
            name,
            kind: (kind as any) || "image",
            url
          }
        ]);
      }
    }

    // Force focus and restore cursor position after state update
    // We use a slightly longer delay to ensure the DOM has updated the Flex layout
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPos(newCursorPos);
      }
    }, 50);
  };

  return (
    <div className={`glass shadow-2xl relative z-20 transition-all duration-500 ease-out-expo ${
      isMini ? 'rounded-full p-2 pl-6' : 'rounded-2xl p-5'
    }`}>
      <div className="relative">
        <div className={`flex flex-wrap items-center gap-2 ${!isMini ? 'mb-2' : ''}`}>
          {!isMini && skill && (
            <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[13px] text-white font-medium group transition-all hover:bg-white/15 animate-in fade-in slide-in-from-top-1 duration-300">
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
          {!isMini && attachments.map((a) => (
            <div key={a.id} className="inline-flex h-[32px] items-center gap-2 rounded-lg bg-white/10 border border-white/20 pl-1.5 pr-2 py-1 text-xs text-white animate-in fade-in slide-in-from-top-1 duration-300">
              {a.url && (
                <div className="h-5 w-5 shrink-0 rounded overflow-hidden border border-white/10">
                  <img src={a.url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <span className="leading-none">{a.name}</span>
              <button 
                onClick={() => removeAttachment(a.id, a.name)}
                className="hover:text-white/60 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          <textarea
            ref={textareaRef}
            rows={1}
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
            placeholder="由一个想法或故事开始..."
            className={`flex-1 min-w-[200px] bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-300 order-last ${
              isMini ? 'py-1 cursor-pointer' : 'py-2 min-h-[32px]'
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
                ...attachments.map(a => ({ name: a.name, kind: a.kind, url: a.url })),
                { name: "画布生图", kind: "image", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=64&h=64&fit=crop" },
                { name: "角色01", kind: "image", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" },
                { name: "S1.mp4", kind: "video", url: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=64&h=64&fit=crop" },
              ].filter((item, index, self) => 
                item.name.toLowerCase().includes(mentionFilter.toLowerCase()) && 
                self.findIndex(t => t.url === item.url) === index
              ).map((item, idx) => (
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
                <AddItem icon={AudioLines} label="音频上传" onClick={() => triggerPick("audio")} />
                <AddItem icon={Video} label="视频上传" onClick={() => triggerPick("video")} />
                <AddItem icon={FileText} label="文档上传" onClick={() => triggerPick("text")} />
                <div className="my-1 h-px bg-white/5" />
                <AddItem icon={LayoutGrid} label="资产库" onClick={() => setAssetsOpen(true)} />
              </PopoverContent>
            </Popover>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFiles} />
            
            <ElementsPickerDialog open={assetsOpen} onOpenChange={setAssetsOpen} onSelect={handleMentionSelect} />
            

            <Popover>
              <PopoverTrigger asChild>
                <button type="button">
                  <Chip icon={LayoutGrid} label={model ? `模型：${model}` : "选择模型"} badge={model === "Seedance 2" ? "新" : undefined} active={!!model} onClear={model ? () => setModel(null) : undefined} />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[580px] p-0 border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
                <ModelPicker value={model} onSelect={setModel} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button type="button">
                  <Chip icon={Package} label={skill ? `Skill：${skill}` : "Skill"} active={!!skill} onClear={skill ? () => setSkill(null) : undefined} />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[480px] p-0 border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
                <SkillPicker onSelect={(title) => { setSkill(title); textareaRef.current?.focus(); }} />
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

            {showCanvasToggle && (
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
            )}
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground" onClick={() => console.log("Voice input triggered")}>
              <Mic className="h-4 w-4" />
            </button>
            <button onClick={() => {
                const v = text.trim();
                if (v && onSubmit) { 
                  onSubmit(v, canvasMode); 
                  setText(""); 
                  setAttachments([]);
                }
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
