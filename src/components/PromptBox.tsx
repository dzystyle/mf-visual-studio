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
  onSubmit?: (text: string) => void;
  isMini?: boolean;
} = {}) {
  const [text, setText] = useState("");
  const [plusOpen, setPlusOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [model, setModel] = useState("Seedance 2");
  const [skill, setSkill] = useState<string | null>(null);
  const [ratio, setRatio] = useState("16:9");
  const [duration, setDuration] = useState(179);
  const [canvasMode, setCanvasMode] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [assetsOpen, setAssetsOpen] = useState(false);
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
      setText(prev => {
        const mention = `@${skillTitle}`;
        if (!prev) return mention;
        if (prev.endsWith(' ')) return prev + mention;
        return prev + ' ' + mention;
      });
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

  const handleMentionSelect = (name: string, kind: string, url?: string) => {
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
      <div className="relative">
        {!isMini && (attachments.length > 0 || skill) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {skill && (
              <div className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs text-white/80 group">
                <Package className="h-3 w-3 text-white/40" />
                <span>{skill}</span>
                <button 
                  onClick={() => {
                    setSkill(null);
                    setText(prev => prev.replace(new RegExp(`@${skill}\\s?`), ""));
                  }}
                  className="hover:text-white transition-colors"
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
                  onSubmit(v);
                  setText("");
                  setAttachments([]);
                }
              }
            }}
            placeholder={isMini ? "由一个想法或故事开始..." : "输入提示词,或输入 @ 引用资产库中的角色、素材..."}
            className={`w-full resize-none bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-300 ${
              isMini ? 'py-1 cursor-pointer' : 'py-0'
            }`}
          />
          {isMini && (
            <button
              onClick={() => {
                const v = text.trim();
                if (v && onSubmit) {
                  onSubmit(v);
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
              ].filter(i => i.name.toLowerCase().includes(mentionFilter.toLowerCase())).map((item, idx) => (
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
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent">
                  <Plus className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-44 space-y-2 border-border/60 bg-card/95 p-2 backdrop-blur-xl">
                <AddItem icon={ImageIcon} label="图片" onClick={() => triggerPick("image")} />
                <AddItem icon={AudioLines} label="音频" onClick={() => triggerPick("audio")} />
                <AddItem icon={Video} label="视频" onClick={() => triggerPick("video")} />
                <AddItem icon={FileText} label="文本" onClick={() => triggerPick("text")} />
              </PopoverContent>
            </Popover>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFiles} />
            <Popover>
              <PopoverTrigger asChild>
                <button type="button">
                  <Chip icon={LayoutGrid} label={model} badge="新" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[600px] p-0 border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
                <ModelPicker value={model} onSelect={setModel} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <button type="button">
                  <Chip icon={Package} label={skill ?? "Skill"} active={!!skill} onClear={skill ? () => {
                      setSkill(null);
                      setText(prev => prev.replace(new RegExp(`@${skill}\\s?`), ""));
                    } : undefined}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[500px] p-0 border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
                <SkillPicker onSelect={setSkill} />
              </PopoverContent>
            </Popover>
            <button type="button" onClick={() => setAssetsOpen(true)}>
              <Chip icon={Smile} label="资产库" />
            </button>
            <ElementsPickerDialog 
              open={assetsOpen} 
              onOpenChange={setAssetsOpen} 
              onSelect={(name, kind, url) => {
                setAttachments(prev => [...prev, { id: `${Date.now()}-${name}`, name, kind: (kind as any) || "image", url }]);
                setText(prev => {
                  const mention = `@${name}`;
                  if (!prev) return mention;
                  if (prev.endsWith(' ')) return prev + mention;
                  return prev + ' ' + mention;
                });
              }} 
            />
            <div className="h-4 w-px bg-border/40 mx-1" />
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs text-foreground hover:bg-card transition">
                  <div className="w-3.5 h-2.5 border border-current rounded-[1px] flex items-center justify-center text-[8px] leading-none">
                    <span className="scale-75 uppercase">{ratio}</span>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-40 p-1 border-border bg-card/95 backdrop-blur-xl rounded-xl">
                <RatioItem label="自动" icon={<LayoutGrid className="w-3.5 h-3.5" />} active={ratio === "自动"} onClick={() => setRatio("自动")} />
                <RatioItem label="16:9 (横屏)" active={ratio === "16:9"} icon={<div className="w-3.5 h-2.5 border border-current rounded-[1px]" />} onClick={() => setRatio("16:9")} />
                <RatioItem label="21:9 (电影)" active={ratio === "21:9"} icon={<div className="w-4 h-2 border border-current rounded-[1px]" />} onClick={() => setRatio("21:9")} />
                <RatioItem label="9:16 (竖屏)" active={ratio === "9:16"} icon={<div className="w-2.5 h-4 border border-current rounded-[1px]" />} onClick={() => setRatio("9:16")} />
                <RatioItem label="4:3" active={ratio === "4:3"} icon={<div className="w-3.5 h-3 border border-current rounded-[1px]" />} onClick={() => setRatio("4:3")} />
                <RatioItem label="3:4" active={ratio === "3:4"} icon={<div className="w-3 h-3.5 border border-current rounded-[1px]" />} onClick={() => setRatio("3:4")} />
                <RatioItem label="1:1" active={ratio === "1:1"} icon={<div className="w-3.5 h-3.5 border border-current rounded-[1px]" />} onClick={() => setRatio("1:1")} />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <button className={`flex h-8 w-8 items-center justify-center rounded-full border border-border transition ${selectedCharacter ? 'bg-aurora-blue/20 border-aurora-blue/40 text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
                  <AtSign className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-2 border-border bg-card/95 backdrop-blur-xl rounded-xl">
                <div className="text-[10px] text-muted-foreground px-2 py-1 mb-1 flex items-center justify-between">
                  <span>角色引用</span>
                  {selectedCharacter && <button onClick={() => setSelectedCharacter(null)} className="hover:text-foreground">清除</button>}
                </div>
                <div className="text-[10px] text-muted-foreground px-2 py-1 mb-1 opacity-60">其他角色</div>
                <MentionItem label="场景01" img="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=64&h=64&fit=crop" active={selectedCharacter === "场景01"} onClick={() => { setSelectedCharacter("场景01"); handleMentionSelect("场景01", "image", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=64&h=64&fit=crop"); }} />
                <MentionItem label="角色01" img="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" active={selectedCharacter === "角色01"} onClick={() => { setSelectedCharacter("角色01"); handleMentionSelect("角色01", "image", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop"); }} />
                <div className="text-[10px] text-muted-foreground px-2 py-1 mt-2 mb-1 opacity-60">推荐角色</div>
                <MentionItem label="皮皮特PiPi" icon={<div className="w-full h-full bg-accent flex items-center justify-center text-[10px]">P</div>} active={selectedCharacter === "皮皮特PiPi"} onClick={() => { setSelectedCharacter("皮皮特PiPi"); handleMentionSelect("皮皮特PiPi", "image", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop"); }} />
                <MentionItem label="萧衍" img="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop" active={selectedCharacter === "萧衍"} onClick={() => { setSelectedCharacter("萧衍"); handleMentionSelect("萧衍", "image", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop"); }} />
                <MentionItem label="西施" img="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop" active={selectedCharacter === "西施"} onClick={() => { setSelectedCharacter("西施"); handleMentionSelect("西施", "image", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop"); }} />
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs text-foreground/80">画布</span>
              <button onClick={() => setCanvasMode(!canvasMode)} className={`w-9 h-5 rounded-full relative p-0.5 transition-all duration-300 ${canvasMode ? 'bg-aurora-blue/60' : 'bg-muted/60'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${canvasMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 rounded-full bg-accent/60 px-3 py-1.5 text-xs text-foreground hover:bg-accent transition border border-border/40">
                  <span>{duration}秒</span>
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
                  <input type="range" min="4" max="180" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} className="w-full h-1 bg-muted/60 rounded-full appearance-none cursor-pointer accent-foreground" />
                  <div className="flex justify-between mt-3 text-[10px] text-muted-foreground"><span>4</span><span>60</span><span>120</span><span>180</span></div>
                  <div className="absolute right-0 top-[-8px] bg-accent/80 px-2 py-1 rounded-lg text-xs font-medium border border-border">{duration} 秒</div>
                </div>
                <div className="text-[10px] text-muted-foreground/60 text-center italic">会在提示词里附加“时长：{duration}秒”</div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground" onClick={() => console.log("Voice input triggered")}>
              <Mic className="h-4 w-4" />
            </button>
            <button onClick={() => {
                const v = text.trim();
                if (v && onSubmit) { onSubmit(v); setText(""); }
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
