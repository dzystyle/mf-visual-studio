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
  AtSign,
} from "lucide-react";
import {
  ModelPicker,
  SkillPicker,
  ElementsPickerDialog,
  CreativePreferencePicker,
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
  const [hoveredMentionId, setHoveredMentionId] = useState<string | null>(null);
  const [selectedMentions, setSelectedMentions] = useState<{name: string, position: number, id: string}[]>([]);
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
    
    setSkill(null);
    
    const next = files.map((f) => {
      const id = `${Date.now()}-${f.name}`;
      const url = kind === "image" ? URL.createObjectURL(f) : undefined;
      
      return {
        id,
        name: f.name,
        kind,
        url,
      };
    });
    setAttachments((prev) => [...prev, ...next]);
  };

  const removeAttachment = (id: string, name?: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    if (name) {
      setSelectedMentions(prev => prev.filter(m => m.name !== name));
    }
  };

  const handleMentionSelect = (name: string, kind?: string, url?: string) => {
    const textBeforeCursor = text.slice(0, cursorPos);
    const lastAtPos = textBeforeCursor.lastIndexOf("@");
    
    let newText: string;
    let insertionPos: number;

    if (lastAtPos !== -1 && !textBeforeCursor.slice(lastAtPos).includes(" ")) {
      const before = text.slice(0, lastAtPos);
      const after = text.slice(cursorPos);
      newText = before + after;
      insertionPos = before.length;
    } else {
      newText = text;
      insertionPos = cursorPos;
    }

    setText(newText);
    setMentionOpen(false);
    
    if (url) {
      const attachmentId = `${Date.now()}-${name}`;
      
      // Add the attachment if it doesn't exist
      if (!attachments.find(a => a.name === name)) {
        setAttachments(prev => [
          ...prev,
          {
            id: attachmentId,
            name,
            kind: (kind as any) || "image",
            url
          }
        ]);
      }

      // Update positions of existing mentions after the insertion point
      setSelectedMentions(prev => {
        const shifted = prev.map(m => {
          if (m.position >= insertionPos) {
            // This is just a marker, the actual text didn't change length
            // but we need to ensure the new mention is inserted at the exact spot
            return m;
          }
          return m;
        });
        return [...shifted, { name, position: insertionPos, id: attachmentId }].sort((a, b) => a.position - b.position);
      });
    }

    // Crucially set the cursor to the end of the new insertion point
    // Since we remove the '@', the text length might decrease.
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        // The textarea only holds text AFTER the last mention.
        // If we just inserted a mention at the end of the current static text, 
        // the remaining text is everything after insertionPos.
        // We set cursorPos so the next render knows where to split.
        setCursorPos(insertionPos);
      }
    }, 10);
  };


  return (
    <div className={`glass shadow-2xl relative z-20 transition-all duration-500 ease-out-expo ${
      isMini ? 'rounded-full p-2 pl-6' : 'rounded-2xl p-5'
    }`}>
      {!isMini && attachments.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {attachments.map((a) => (
            <div key={a.id} className="group relative w-20 h-20 rounded-xl overflow-hidden border border-border bg-accent/20">
              {a.url ? (
                <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                  {a.kind === 'video' ? <Video className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-between p-2">
                <button 
                  onClick={() => handleMentionSelect(a.name, a.kind, a.url)}
                  className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white backdrop-blur-md transition-all hover:scale-110"
                  title="引用到输入框"
                >
                  <AtSign className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => removeAttachment(a.id, a.name)}
                  className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white backdrop-blur-md transition-all hover:scale-110"
                  title="删除"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-sm py-0.5 px-1 text-[8px] text-white/80 truncate text-center group-hover:hidden">
                {a.name}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <div className={`flex flex-wrap items-center ${!isMini ? 'mb-2' : ''}`}>
          {!isMini && skill && (
            <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[13px] text-white font-medium group transition-all hover:bg-white/15 animate-in fade-in slide-in-from-top-1 duration-300 mr-2 mb-1">
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

            {(() => {
            let currentLastPos = 0;
            const contentItems: React.ReactNode[] = [];
            const sortedMentions = [...selectedMentions].sort((a, b) => a.position - b.position);

            sortedMentions.forEach((m, idx) => {
              const segment = text.slice(currentLastPos, m.position);
              if (segment) {
                contentItems.push(
                  <span key={`text-${idx}`} className="text-[15px] whitespace-pre-wrap py-2 leading-6 align-middle inline-block">
                    {segment}
                  </span>
                );
              }

              const att = attachments.find(a => a.name === m.name);
              if (att && att.url) {
                const mentionKey = `inline-${m.id}-${idx}`;
                contentItems.push(
                  <div 
                    key={mentionKey} 
                    className="inline-flex items-center mx-0.5 animate-in zoom-in-95 duration-200 align-middle"
                    onMouseEnter={() => setHoveredMentionId(mentionKey)}
                    onMouseLeave={() => setHoveredMentionId(null)}
                  >
                    <Popover open={hoveredMentionId === mentionKey}>
                      <PopoverTrigger asChild>
                        <div className="h-6 w-6 shrink-0 rounded-md overflow-hidden border border-border cursor-default transition-transform hover:scale-110 shadow-sm relative group">
                          <img src={att.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent 
                        side="bottom" 
                        align="start" 
                        sideOffset={12} 
                        className="w-64 p-2 border-border bg-popover/95 backdrop-blur-xl rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-top-2 duration-200 z-[110]"
                      >
                        <div className="space-y-2">
                          <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-inner">
                            <img src={att.url} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[10px] font-bold text-foreground/70 truncate text-center px-1 bg-accent/30 py-1 rounded-lg">
                            {att.name}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              }
              currentLastPos = m.position;
            });

            const remainingText = text.slice(currentLastPos);
            
            return (
              <div className={`flex-1 flex flex-wrap items-center relative pointer-events-none ${isMini ? 'min-h-[32px]' : 'min-h-[80px]'}`}>
                <div className="flex-1 flex flex-wrap items-center pointer-events-auto">
                  {contentItems}
                  <div className="relative inline-flex flex-1 min-w-[50px] align-middle">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={remainingText}
                      onChange={(e) => {
                        const val = e.target.value;
                        const selection = e.target.selectionStart || 0;
                        
                        // Reconstruct total text
                        const newTotalText = text.slice(0, currentLastPos) + val;
                        const newCursorPos = currentLastPos + selection;

                        if (newTotalText.length !== text.length) {
                          const diff = newTotalText.length - text.length;
                          setSelectedMentions(prev => prev.map(m => {
                            if (m.position > currentLastPos) {
                              return { ...m, position: m.position + diff };
                            }
                            return m;
                          }));
                        }

                        setText(newTotalText);
                        setCursorPos(newCursorPos);
                      }}
                      onKeyUp={(e) => {
                        setCursorPos(currentLastPos + ((e.target as HTMLTextAreaElement).selectionStart || 0));
                      }}
                      onClick={(e) => {
                        setCursorPos(currentLastPos + ((e.target as HTMLTextAreaElement).selectionStart || 0));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && remainingText === "" && selectedMentions.length > 0) {
                          e.preventDefault();
                          const lastMention = [...selectedMentions].sort((a, b) => a.position - b.position).pop();
                          if (lastMention) {
                            setSelectedMentions(prev => prev.filter(m => m !== lastMention));
                          }
                          return;
                        }

                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          const v = text.trim();
                          if (v && onSubmit) {
                            onSubmit(v, canvasMode);
                            setText("");
                            setAttachments([]);
                            setSelectedMentions([]);
                          }
                        }
                      }}
                      placeholder={text === "" && selectedMentions.length === 0 ? "输入你的需求即可生成图片、视频；上传素材后可使用 @引用素材互动，例如：@Image 1 作首帧、@Image 2 作尾帧，参考 @Video 1 生成游戏宣发视频。" : ""}
                      className={`w-full bg-transparent text-[15px] leading-6 text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-300 resize-none overflow-hidden ${
                        isMini ? 'py-1 cursor-pointer' : 'py-2 min-h-[64px]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {!isMini && mentionOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-80 bg-popover/95 border border-border rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-3.5 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input 
                  autoFocus
                  type="text" 
                  value={mentionFilter}
                  onChange={(e) => setMentionFilter(e.target.value)}
                  placeholder="搜索素材、角色、商品..."
                  className="w-full bg-accent/50 border-none rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
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
              <PopoverContent side="top" align="start" className="w-44 p-1.5 border-border bg-popover/90 backdrop-blur-xl rounded-2xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
                <AddItem icon={ImageIcon} label="本地上传" onClick={() => triggerPick("image")} />
                <AddItem icon={AudioLines} label="音频上传" onClick={() => triggerPick("audio")} />
                <AddItem icon={Video} label="视频上传" onClick={() => triggerPick("video")} />
                <AddItem icon={FileText} label="文档上传" onClick={() => triggerPick("text")} />
                <div className="my-1.5 h-px bg-border/40 mx-2" />
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
              <PopoverContent align="start" className="w-[580px] p-0 border-border bg-popover/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                <ModelPicker value={model} onSelect={setModel} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button type="button">
                  <Chip icon={Package} label={skill ? `Skill：${skill}` : "Skill"} active={!!skill} onClear={skill ? () => setSkill(null) : undefined} />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[480px] p-0 border-border bg-popover/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                <SkillPicker onSelect={(title) => { setSkill(title); textareaRef.current?.focus(); }} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button type="button">
                  <Chip icon={LayoutGrid} label="自定义模型 | 创作偏好" />
                </button>
              </PopoverTrigger>
              <PopoverContent 
                side="top" 
                align="start" 
                sideOffset={16} 
                className="w-[720px] p-0 border-none bg-transparent shadow-none z-[100]"
              >
                <CreativePreferencePicker />
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
                  setSelectedMentions([]);
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

function AddItem({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent rounded-xl transition-all group"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/50 group-hover:bg-accent transition-colors">
        <Icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
      </div>
      <span>{label}</span>
    </button>
  );
}

function MentionListItem({ item, onClick }: { item: any; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-accent transition-all group text-left">
      <div className="h-9 w-9 rounded-lg overflow-hidden border border-border bg-accent/50 shrink-0">
        <img src={item.url} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-foreground/90 truncate tracking-tight">{item.name}</div>
        <div className="text-[10px] font-medium text-muted-foreground/60">{item.kind === 'image' ? '图片素材' : '视频文件'} · 刚刚</div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
        <ArrowUp className="h-4 w-4 text-primary" />
      </div>
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
