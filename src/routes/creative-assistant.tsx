import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  ChevronRight, 
  LayoutGrid, 
  Plus, 
  ArrowUp, 
  Mic, 
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Video,
  X,
  Search,
  Download,
  Share2,
  Trash2,
  Folder,
  File,
  ChevronRight as ChevronRightIcon,
  PenTool,
  Scissors,
  RotateCcw,
  MessageCirclePlus,
  Zap,
  Eraser,
  Maximize2,
  Volume2,
  VolumeX,
  Layers,
  SquareDashedMousePointer,
  

} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { AssistantToolbar } from "@/components/assistant/AssistantToolbar";
import { PromptBox } from "@/components/PromptBox";
import { toast } from "sonner";
import { VideoAnnotationDialog } from "@/components/VideoAnnotationDialog";
import { ImageAnnotationDialog } from "@/components/image/ImageAnnotationDialog";
import { RegionEditDialog } from "@/components/image/RegionEditDialog";
import { LayerSplitDialog } from "@/components/image/LayerSplitDialog";
import threeViewImage from "@/assets/three-view-result.jpg";
import { FlowBlockView } from "@/components/assistant/blocks";
import {
  ASSISTANT_NEW_SESSION_EVENT,
  ASSISTANT_SELECT_HISTORY_EVENT,
} from "@/components/AppSidebar";
import { IconSheetFlow, IconSheetResult, type IconSheetDraft } from "@/components/assistant/IconSheetFlow";
import {
  STAGES,
  createContext,
  type Block,
  type FlowContext,
  type FlowOption,
  type Stage,
} from "@/lib/agent-flow";

import { cn } from "@/lib/utils";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import saitamaAsset from "@/assets/saitama.webp.asset.json";
const charSam = saitamaAsset.url;
import genosAsset from "@/assets/genos.webp.asset.json";
const charBoss = genosAsset.url;
import skillReenact from "@/assets/skill-reenact.jpg";
import videoPreviewAsset from "@/assets/generated-video-preview.jpg.asset.json";
const videoPreview = videoPreviewAsset.url;
import videoFileAsset from "@/assets/video-preview.mp4.asset.json";
const videoFileUrl = videoFileAsset.url;


type Search = { prompt?: string; skill?: string };

export const Route = createFileRoute("/creative-assistant")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    prompt: typeof s.prompt === "string" ? s.prompt : undefined,
    skill: typeof s.skill === "string" ? s.skill : undefined,
  }),
  head: () => ({
    meta: [{ title: "创作助手 — Artrail" }],
  }),
  component: CreativeAssistantPage,
});

type Entry = {
  id: string;
  role: "user" | "assistant";
  content?: string;
  block?: Block;
  timestamp: string;
  skill?: string;
  icon?: "flow" | "result";
  attachments?: { name: string; type: string; url?: string }[];
};

function CreativeAssistantPage() {
  const { prompt: initialPrompt, skill: initialSkill } = Route.useSearch();

  // 「游戏icon设置」Skill：走图标集确认流程，而不是视频 Agent 流程
  const isIconSheetRequest =
    initialSkill === "游戏icon设置" ||
    (!!initialPrompt &&
      /(icon|图标)/i.test(initialPrompt) &&
      /(\d{1,3}\s*(个|张|枚)|图标集|套图)/.test(initialPrompt));
  const [iconDraft, setIconDraft] = useState<IconSheetDraft | null>(null);

  const [imgAnnotateOpen, setImgAnnotateOpen] = useState(false);
  const [regionEditOpen, setRegionEditOpen] = useState(false);
  const [layerSplitOpen, setLayerSplitOpen] = useState(false);

  const [showResources, setShowResources] = useState(false);
  
  const [resourceMode, setResourceMode] = useState<'grid' | 'folder'>('folder');
  const [inputValue, setInputValue] = useState(initialPrompt || "");
  const [activeResource, setActiveResource] = useState<{ type: 'script' | 'image' | 'video'; data?: any } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);
  const [annotationTime, setAnnotationTime] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /* ---------------- Agent 流程引擎 ---------------- */
  const ctxRef = useRef<FlowContext>(createContext(initialPrompt || "", initialSkill));
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stageRef = useRef(0);
  const runningRef = useRef(false);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [waiting, setWaiting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const now = () => new Date().toLocaleString();

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const pushBlock = (block: Block, stageId: string, i: number) => {
    setEntries((prev) => [
      ...prev,
      { id: `${stageId}-${i}-${Math.random().toString(36).slice(2, 7)}`, role: "assistant", block, timestamp: now() },
    ]);
  };

  const runStage = (index: number) => {
    if (index >= STAGES.length || runningRef.current) return;
    runningRef.current = true;
    stageRef.current = index;
    const stage: Stage = STAGES[index](ctxRef.current);
    setIsProcessing(true);
    setIsTyping(true);

    stage.blocks.forEach((block, i) => {
      const timer = setTimeout(() => {
        pushBlock(block, stage.id, i);
        if (i === stage.blocks.length - 1) {
          setIsTyping(false);
          setIsProcessing(false);
          runningRef.current = false;
          const last = stage.blocks[stage.blocks.length - 1];
          if (last.kind === "options") {
            setWaiting(true);
          } else {
            const next = setTimeout(() => runStage(index + 1), 600);
            timersRef.current.push(next);
          }
        }
      }, 500 * (i + 1));
      timersRef.current.push(timer);
    });
  };

  /* ---------------- 图标集流程（游戏icon设置 Skill） ---------------- */
  const pushEntry = (entry: Omit<Entry, "id" | "timestamp"> & { id?: string }) => {
    setEntries((prev) => [
      ...prev,
      {
        id: entry.id ?? `icon-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: now(),
        ...entry,
      } as Entry,
    ]);
  };

  const runIconSheet = () => {
    setIsTyping(true);
    setIsProcessing(true);
    const steps = [
      "解析需求：识别数量、题材、品质分配与参考风格…",
      "参考对齐 (ref-align)：锁定构图角度、投影方向与描边厚度…",
      "生成清单：按题材扩写道具名并分配品质档位…",
      "提取色卡：从参考作品中抽取 6 色主色板…",
    ];
    steps.forEach((text, i) => {
      const t = setTimeout(() => {
        pushEntry({ role: "assistant", content: text });
      }, 500 * (i + 1));
      timersRef.current.push(t);
    });
    const done = setTimeout(() => {
      setIsTyping(false);
      setIsProcessing(false);
      pushEntry({
        role: "assistant",
        content: "草案已生成。你只需要确认下面 3 张卡片，需要精调可以点「高级」展开 5 步向导。",
      });
      pushEntry({ role: "assistant", icon: "flow", id: "icon-flow" });
    }, 500 * (steps.length + 1));
    timersRef.current.push(done);
  };

  const handleIconConfirm = (draft: IconSheetDraft) => {
    setIconDraft(draft);
    pushEntry({ role: "assistant", icon: "result", id: `icon-result-${Date.now()}` });
    const t = setTimeout(() => {
      pushEntry({
        role: "assistant",
        content: `已按「${draft.style} · ${draft.theme}」生成 ${draft.gridCount} 个图标（普通 ${draft.normalCount} / 精致 ${draft.fineCount}），网格 ${draft.gridLayout}。你可以继续微调单个图标，或让我导出透明底 PNG 图集。`,
      });
    }, 2600);
    timersRef.current.push(t);
  };

  // 入口：带 prompt 进入即启动流程
  useEffect(() => {
    if (!initialPrompt || entries.length > 0) return;
    setEntries([
      {
        id: "user-0",
        role: "user",
        content: initialPrompt,
        timestamp: now(),
        skill: initialSkill,
      },
    ]);
    if (isIconSheetRequest) {
      runIconSheet();
      return () => clearTimers();
    }
    const t = setTimeout(() => runStage(0), 400);
    timersRef.current.push(t);
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleSelect = (optionId: string, opt: FlowOption) => {
    if (answers[optionId]) return;
    setAnswers((prev) => ({ ...prev, [optionId]: opt.key }));
    setEntries((prev) => [
      ...prev,
      { id: `pick-${optionId}`, role: "user", content: opt.label, timestamp: now() },
    ]);

    const ctx = ctxRef.current;
    if (optionId === "hotspot") ctx.hotspot = opt.label;
    if (optionId === "direction") ctx.direction = opt.label;
    if (optionId === "branch") ctx.branch = opt.label;
    if (optionId === "strategy") ctx.strategy = opt.label;

    setWaiting(false);

    // 需要回炉的分支
    if (optionId === "plan-confirm" && opt.key === "edit") {
      setAnswers((prev) => {
        const next = { ...prev };
        delete next.hotspot;
        delete next.direction;
        delete next.branch;
        delete next["plan-confirm"];
        return next;
      });
      const t = setTimeout(() => runStage(1), 600);
      timersRef.current.push(t);
      return;
    }
    if (optionId === "asset-confirm" && opt.key === "regen") {
      const t = setTimeout(() => runStage(6), 600);
      timersRef.current.push(t);
      return;
    }

    const t = setTimeout(() => runStage(stageRef.current + 1), 600);
    timersRef.current.push(t);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [entries, isTyping]);

  // 刷新历史:回到最近一次用户消息并重跑当前阶段
  const handleRefreshHistory = () => {
    if (entries.length === 0) {
      toast.info("当前暂无会话内容");
      return;
    }
    clearTimers();
    runningRef.current = false;
    const lastUserIdx = entries.reduce((acc, m, i) => (m.role === "user" ? i : acc), -1);
    setEntries(lastUserIdx >= 0 ? entries.slice(0, lastUserIdx + 1) : []);
    setWaiting(false);
    toast.success("正在刷新当前会话...");
    if (isIconSheetRequest) {
      setIconDraft(null);
      const ti = setTimeout(() => runIconSheet(), 400);
      timersRef.current.push(ti);
      return;
    }
    const t = setTimeout(() => runStage(stageRef.current), 400);
    timersRef.current.push(t);
  };

  // 新会话:重置全部会话状态
  const handleNewSession = () => {
    clearTimers();
    runningRef.current = false;
    stageRef.current = 0;
    ctxRef.current = createContext("", undefined);
    setIconDraft(null);
    setEntries([]);
    setAnswers({});
    setWaiting(false);
    setInputValue("");
    setActiveResource(null);
    setIsTyping(false);
    setIsProcessing(false);
    toast.success("已创建新会话,开始新的创作吧");
  };

  // 监听全局侧栏的「创作」新建会话与历史条目选择事件
  useEffect(() => {
    const onNew = () => handleNewSession();
    const onSelect = () => {
      clearTimers();
      runningRef.current = false;
      stageRef.current = 0;
      ctxRef.current = createContext("", undefined);
      setIconDraft(null);
      setEntries([]);
      setAnswers({});
      setWaiting(false);
      setInputValue("");
      setActiveResource(null);
      setIsTyping(false);
      setIsProcessing(false);
    };
    window.addEventListener(ASSISTANT_NEW_SESSION_EVENT, onNew);
    window.addEventListener(ASSISTANT_SELECT_HISTORY_EVENT, onSelect);
    return () => {
      window.removeEventListener(ASSISTANT_NEW_SESSION_EVENT, onNew);
      window.removeEventListener(ASSISTANT_SELECT_HISTORY_EVENT, onSelect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSendMessage = (textOverride?: string) => {
    const textToSend = typeof textOverride === "string" ? textOverride : inputValue;
    if (!textToSend.trim() || isProcessing) return;

    setEntries((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: textToSend, timestamp: now() },
    ]);
    setInputValue("");

    // 首条消息启动完整流程；流程进行中的追加消息作为补充需求
    if (stageRef.current === 0 && entries.filter((e) => e.role === "assistant").length === 0) {
      if (isIconSheetRequest) {
        const ti = setTimeout(() => runIconSheet(), 400);
        timersRef.current.push(ti);
        return;
      }
      ctxRef.current = createContext(textToSend, initialSkill);
      const t = setTimeout(() => runStage(0), 400);
      timersRef.current.push(t);
    } else if (!waiting) {
      const t = setTimeout(() => {
        setEntries((prev) => [
          ...prev,
          {
            id: `ack-${Date.now()}`,
            role: "assistant",
            content: "收到，这条补充需求我已记入本次项目的账本，会在后续镜头里体现。",
            timestamp: now(),
          },
        ]);
      }, 700);
      timersRef.current.push(t);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden font-sans">
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-end gap-4 pointer-events-none">
        <div className="pointer-events-auto">
          <AssistantToolbar onRefreshHistory={handleRefreshHistory} onNewSession={handleNewSession} />
        </div>
        <div className="pointer-events-auto">
          <TopBar />
        </div>
      </div>

      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-24 left-1/2 z-[100] px-6 py-3 rounded-2xl bg-white text-black shadow-2xl flex items-center gap-3 border border-black/5"
          >
            <div className="w-5 h-5 rounded-full bg-[#34C759] flex items-center justify-center">
              <ChevronRightIcon className="h-3 w-3 text-white rotate-[-90deg] translate-y-[0.5px]" />
            </div>
            <span className="text-[14px] font-bold tracking-tight">分享链接已复制到剪贴板，快去分享吧！</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden pt-20 relative z-0">
        {/* Main Chat Area */}
        <div className={cn(
          "flex flex-1 flex-col transition-all duration-500 ease-in-out relative",
          showResources ? "mr-[600px]" : "mr-0"
        )}>
          {/* 左侧对话节点导航:紧靠对话流左缘,垂直居中固定,每个节点对应一次用户输入,悬浮高亮并显示内容 */}
          {entries.some((e) => e.role === "user") && (
            <div className="absolute inset-y-0 left-0 right-0 z-30 pointer-events-none">
              <div className="mx-auto max-w-4xl h-full px-6 relative">
                <div className="absolute -left-9 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-auto">
                  {entries.filter((e) => e.role === "user").map((e, i) => (
                    <div key={e.id} className="relative group/node flex items-center">
                      <button
                        onClick={() => {
                          const el = scrollContainerRef.current?.querySelector(`[data-entry-id="${e.id}"]`);
                          el?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className={cn(
                          "block h-[3px] w-2.5 rounded-full bg-[var(--color-muted-foreground)]/40 transition-all duration-200",
                          "group-hover/node:w-4 group-hover/node:bg-[var(--color-foreground)] group-hover/node:shadow-[0_0_8px_var(--color-foreground)]",
                          i === 0 && "w-4 bg-[var(--color-foreground)]"
                        )}
                        aria-label={`节点 ${i + 1}`}
                      />
                      {/* 悬浮提示:胶囊显示该节点用户输入的内容标题 */}
                      <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 z-30 hidden group-hover/node:block max-w-xs whitespace-nowrap overflow-hidden text-ellipsis rounded-full bg-neutral-900 dark:bg-neutral-100 px-3.5 py-1.5 text-[12px] font-medium text-neutral-50 dark:text-neutral-900 shadow-lg">
                        {e.content || "（附件/选择）"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide relative z-0">
            <div className="mx-auto max-w-4xl space-y-6 relative">
              {entries.length > 0 && (
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setShowShareToast(true);
                      setTimeout(() => setShowShareToast(false), 2000);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-all shadow-sm group/share"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm font-medium">分享会话流</span>
                  </button>
                </div>
              )}

              {entries.length === 0 && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-20 h-20 rounded-3xl bg-[var(--color-secondary)] flex items-center justify-center mb-6 border border-[var(--color-border)] shadow-sm">
                    <MessageSquare className="w-10 h-10 text-[var(--color-foreground)]" />
                  </div>
                  <h1 className="text-3xl font-bold mb-3">Creative Assistant</h1>
                  <p className="text-lg font-medium max-w-md">输入一段话，我会先做创意规划，再逐段生成并拼接成片。</p>
                </div>
              )}

              {entries.map((entry) => (
                <div
                  key={entry.id}
                  data-entry-id={entry.id}
                  className={cn(
                    "flex flex-col gap-2 relative group",
                    entry.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  {entry.attachments && entry.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-1">
                      {entry.attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] w-fit shadow-sm">
                          <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-[var(--color-border)]">
                            <img src={file.url} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[14px] font-bold text-[var(--color-foreground)]">{file.name}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {entry.skill && (
                    <div className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-[12px] text-[var(--color-foreground)] shadow-sm">
                      <Zap className="h-3.5 w-3.5" />
                      Skill · {entry.skill}
                    </div>
                  )}

                  {entry.content && (
                    <div className={cn(
                      "max-w-[85%] px-5 py-3 text-[15px] leading-relaxed tracking-tight shadow-sm border whitespace-pre-wrap",
                      entry.role === "user"
                        ? "rounded-2xl rounded-tr-sm bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-transparent"
                        : "rounded-2xl rounded-tl-sm bg-[var(--color-card)] text-[var(--color-foreground)] border-[var(--color-border)]"
                    )}>
                      {entry.content}
                    </div>
                  )}

                  {entry.icon === "flow" && (
                    <IconSheetFlow prompt={initialPrompt || ""} onConfirm={handleIconConfirm} />
                  )}

                  {entry.icon === "result" && iconDraft && <IconSheetResult draft={iconDraft} />}

                  {entry.block && (
                    <FlowBlockView
                      block={entry.block}
                      selected={entry.block.kind === "options" ? answers[entry.block.id] : undefined}
                      onSelect={handleSelect}
                      onOpenArtifact={() => {
                        setShowResources(true);
                        setActiveResource({ type: "script" });
                      }}
                      onAnnotate={() => {
                        setAnnotationTime(0);
                        setIsAnnotationOpen(true);
                      }}
                      mediaUrls={{ image: skillReenact, video: videoFileUrl, poster: videoPreview }}
                    />
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-[13px] text-[var(--color-muted-foreground)]">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted-foreground)] [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted-foreground)] [animation-delay:120ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted-foreground)] [animation-delay:240ms]" />
                  </span>
                  Agent 正在处理…
                </div>
              )}

            </div>
          </div>

          {/* Bottom Input Area */}
          <div className="px-6 pb-10">
            <div className="mx-auto max-w-5xl">
              <PromptBox 
                onSubmit={(text) => {
                  setInputValue(text);
                  handleSendMessage(text);
                }}
              />
              <div className="mt-5 text-center text-[11px] text-[var(--color-muted-foreground)] font-medium">
                AI 可能会犯错，内容仅供参考，请核查重要信息。
              </div>
            </div>
          </div>
          
          {/* Floating Resource Toggle */}
          <button 
            onClick={() => setShowResources(!showResources)}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-2 px-3 py-8 bg-[var(--color-card)] border border-[var(--color-border)] rounded-l-[1.5rem] shadow-xl transition-all duration-500 hover:pr-5 group",
              showResources ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"
            )}
          >
            <LayoutGrid className="h-5 w-5 text-[var(--color-foreground)]" />
            <span className="text-[12px] [writing-mode:vertical-lr] text-[var(--color-foreground)] font-bold tracking-widest uppercase py-2">查看对话资源</span>
          </button>
        </div>

        <ImageAnnotationDialog
          open={imgAnnotateOpen}
          onOpenChange={setImgAnnotateOpen}
          imageUrl={threeViewImage}
          onConfirm={(url) => {
            window.dispatchEvent(new CustomEvent('artrail-add-attachment', {
              detail: { url, name: `标注图片-${Date.now()}.jpg`, kind: 'image' }
            }));
            toast.success("标注结果已添加到输入框");
          }}
        />

        <RegionEditDialog
          open={regionEditOpen}
          onOpenChange={setRegionEditOpen}
          imageUrl={threeViewImage}
          onConfirm={(url) => {
            window.dispatchEvent(new CustomEvent('artrail-add-attachment', {
              detail: { url, name: `局部编辑-${Date.now()}.jpg`, kind: 'image' }
            }));
            toast.success("局部编辑结果已添加到输入框");
          }}
        />

        <LayerSplitDialog
          open={layerSplitOpen}
          onOpenChange={setLayerSplitOpen}
          imageUrl={threeViewImage}
          onConfirm={(url) => {
            window.dispatchEvent(new CustomEvent('artrail-add-attachment', {
              detail: { url, name: `图层分离-${Date.now()}.jpg`, kind: 'image' }
            }));
            toast.success("图层分离结果已添加到输入框");
          }}
        />

        <VideoAnnotationDialog 

          open={isAnnotationOpen}
          onOpenChange={setIsAnnotationOpen}
          videoUrl={videoFileUrl}
          posterUrl={videoPreview}
          currentTime={annotationTime}
          onConfirm={(imageUrl) => {
            // Create a custom event to notify PromptBox
            const event = new CustomEvent('artrail-add-attachment', {
              detail: {
                url: imageUrl,
                name: `annotation-${Date.now()}.jpg`,
                kind: 'image'
              }
            });
            window.dispatchEvent(event);
          }}
        />

        {/* Resources Panel */}
        <AnimatePresence>
          {showResources && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[600px] z-[150] bg-[var(--color-card)] border-l border-[var(--color-border)] flex flex-col shadow-2xl pt-20"
            >
              <div className="p-6 flex items-center justify-between border-b border-[var(--color-border)]">
                <div className="flex items-center gap-6">
                  <h2 className="text-xl font-bold text-[var(--color-foreground)]">资源</h2>
                  <div className="flex items-center bg-[var(--color-secondary)] rounded-lg p-1 border border-[var(--color-border)]">
                    <button 
                      onClick={() => setResourceMode('grid')}
                      className={cn(
                        "p-1.5 rounded-md transition-all shadow-sm",
                        resourceMode === 'grid' ? "bg-[var(--color-card)] text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setResourceMode('folder')}
                      className={cn(
                        "p-1.5 rounded-md transition-all shadow-sm",
                        resourceMode === 'folder' ? "bg-[var(--color-card)] text-[var(--color-foreground)]" : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                      )}
                    >
                      <Folder className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868B]" />
                    <input 
                      type="text" 
                      placeholder="查找..." 
                      className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-full pl-9 pr-4 py-2 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 w-56 transition-all"
                    />
                  </div>
                  <button onClick={() => setShowResources(false)} className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] p-1 rounded-full hover:bg-[var(--color-secondary)] transition-colors"><X className="h-6 w-6" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col relative">
                <div className={cn(
                  "absolute inset-0 z-10 bg-[var(--color-card)] flex flex-col transition-all duration-300 ease-in-out scrollbar-hide overflow-y-auto p-8",
                  activeResource ? "pointer-events-none opacity-0 translate-x-[-20px]" : "opacity-100 translate-x-0"
                )}>
                  {resourceMode === 'grid' ? (
                    <div className="space-y-10">
                      {/* Documents */}
                      <section>
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-[13px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-[0.1em] flex items-center gap-2">文稿</h3>
                          <span className="text-[12px] text-[var(--color-muted-foreground)] font-medium">共 5 个</span>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <ResourceCard title="video-projects_20260813-14..." type="JSON" date="1小时前" />
                          <ResourceCard title="video-projects_20260813-14..." type="JSON" date="25分钟前" />
                          <ResourceCard title="final-generation-info.md" type="MD" date="1小时前" />
                          <ResourceCard title="story-brief.md" type="MD" date="1小时前" />
                          <ResourceCard 
                            title="story-script.md" 
                            type="MD" 
                            date="1小时前" 
                            onClick={() => setActiveResource({ type: 'script' })} 
                          />
                        </div>
                      </section>

                      {/* Images */}
                      <section>
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-[13px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-[0.1em] flex items-center gap-2">图片</h3>
                          <span className="text-[12px] text-[var(--color-muted-foreground)] font-medium">共 2 个</span>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <ImageResourceCard 
                            title="user_upload_image_1.webp" 
                            type="WEBP" 
                            date="1小时前" 
                            img={charSam} 
                            onClick={() => setActiveResource({ type: 'image', data: { url: charSam, name: 'user_upload_image_1.webp' } })}
                          />
                          <ImageResourceCard 
                            title="genos-reference.png" 
                            type="PNG" 
                            date="1小时前" 
                            img={charBoss} 
                            onClick={() => setActiveResource({ type: 'image', data: { url: charBoss, name: 'genos-reference.png' } })}
                          />
                        </div>
                      </section>

                      {/* Videos */}
                      <section>
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-[13px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-[0.1em] flex items-center gap-2">视频</h3>
                          <span className="text-[12px] text-[var(--color-muted-foreground)] font-medium">共 1 个</span>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <ImageResourceCard 
                            title="intro-animation.mp4" 
                            type="MP4" 
                            date="刚刚" 
                            img={skillReenact} 
                            onClick={() => setActiveResource({ type: 'video', data: { url: videoFileUrl, name: 'intro-animation.mp4' } })}
                          />
                        </div>
                      </section>
                    </div>
                  ) : (
                    <FolderView 
                      charSam={charSam} 
                      charBoss={charBoss} 
                      videoFileUrl={videoFileUrl}
                      setActiveResource={setActiveResource} 
                    />
                  )}
                </div>

                {/* Resource Detail View (Integrated into Panel) */}
                <div className={cn(
                  "absolute inset-0 z-20 bg-[var(--color-card)] flex flex-col transition-all duration-300 ease-in-out",
                  activeResource ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
                )}>
                  <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
                    <button 
                      onClick={() => setActiveResource(null)}
                      className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center gap-1 text-[13px] font-medium"
                    >
                      <ChevronRight className="h-4 w-4 rotate-180" />
                      返回
                    </button>
                    <span className="text-sm font-bold text-[var(--color-foreground)] truncate max-w-[200px]">
                      {activeResource?.type === 'script' ? 'story-script.md' : activeResource?.data?.name}
                    </span>
                    <button 
                      onClick={() => {
                        if (!activeResource) return;
                        const url = activeResource.type === 'script' ? '#' : activeResource.data?.url;
                        const filename = activeResource.type === 'script' ? 'story-script.md' : activeResource.data?.name;
                        
                        if (url && url !== '#') {
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = filename || 'download';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          // Handle script/markdown download
                          const content = "Shot ID | Duration | Description\n1 | 2.5s | Saitama close-up\n..."; // Mock content
                          const blob = new Blob([content], { type: 'text/markdown' });
                          const link = document.createElement('a');
                          link.href = URL.createObjectURL(blob);
                          link.download = filename;
                          link.click();
                        }
                      }}
                      className="p-1.5 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-accent)] transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    {activeResource?.type === 'script' && <StoryboardContent />}
                    {activeResource?.type === 'image' && (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <img src={activeResource.data.url} alt="Preview" className="max-w-full max-h-[70%] object-contain rounded-xl shadow-lg border border-[var(--color-border)]" />
                      </div>
                    )}
                    {activeResource?.type === 'video' && (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <video src={activeResource.data.url} controls className="max-w-full max-h-[70%] rounded-xl shadow-lg border border-[var(--color-border)]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Collapse handle */}
              <button 
                onClick={() => {
                  setShowResources(false);
                  setActiveResource(null);
                }}
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-8 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full flex items-center justify-center text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] shadow-lg transition-all hover:scale-110 active:scale-95 z-[110]"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <VideoAnnotationDialog 
          open={isAnnotationOpen}
          onOpenChange={setIsAnnotationOpen}
          videoUrl={videoFileUrl}
          posterUrl={videoPreview}
          currentTime={annotationTime}
          onConfirm={(imageUrl) => {
            setEntries((prev) => [
              ...prev,
              {
                id: `annotate-${Date.now()}`,
                role: "user",
                content: "基于这张标注的视频帧进行修改",
                timestamp: new Date().toLocaleString(),
                attachments: [{ name: "annotated-frame.jpg", type: "IMAGE", url: imageUrl }],
              },
            ]);
          }}
        />
      </div>
      
      {/* Footer Question Mark */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <button className="h-10 w-10 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] flex items-center justify-center text-[var(--color-foreground)] shadow-lg hover:shadow-xl transition-all active:scale-95">
          <span className="text-base font-bold">?</span>
        </button>
      </div>
    </div>
  );
}

function ScriptDetailDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return null;
}

import { Dialog, DialogContent } from "@/components/ui/dialog";

function VideoActionItem({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) {
  return (
    <div className="relative group/tooltip">
      <button className="h-8 w-8 flex items-center justify-center rounded-xl text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] transition-all active:scale-90">
        {icon}
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 rounded-lg bg-black text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-all pointer-events-none shadow-2xl scale-90 group-hover/tooltip:scale-100 origin-top">
        {tooltip}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-black" />
      </div>
    </div>
  );
}

function StatusLine({ icon, text, subText }: { icon: 'check' | 'loading'; text: string; subText?: string }) {
  return (
    <div className="flex items-center gap-3 px-1 py-1 group">
      <div className={cn(
        "flex h-5 w-5 items-center justify-center rounded-full text-white shrink-0",
        icon === 'check' ? "bg-green-500" : "bg-blue-500 animate-pulse"
      )}>
        {icon === 'check' ? (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      <div className="flex items-center gap-2 text-[14px]">
        <span className="font-semibold text-[var(--color-foreground)]">{text}</span>
        {subText && <span className="text-[var(--color-muted-foreground)]">{subText}</span>}
      </div>
      {icon === 'check' && (
        <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronDown className="h-4 w-4 text-[var(--color-muted-foreground)]" />
        </button>
      )}
    </div>
  );
}

interface StepOption {
  num: string;
  label: string;
  desc?: string;
  active?: boolean;
}

interface ChoiceCardProps {
  step: number;
  totalSteps: number;
  title: string;
  options: StepOption[];
  onOptionClick?: (index: number) => void;
  onNext?: () => void;
  onPrev?: () => void;
  isMulti?: boolean;
}

function ChoiceCard({ 
  step, 
  totalSteps, 
  title, 
  options, 
  onOptionClick, 
  onNext, 
  onPrev,
  isMulti = false
}: ChoiceCardProps) {
  return (
    <div className="w-full max-w-xl bg-[var(--color-card)] border border-[var(--color-border)] rounded-[2rem] p-8 space-y-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-bold text-[var(--color-foreground)]">{title}</h3>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[13px] text-[var(--color-muted-foreground)] font-bold">已提交</span>
          </div>
          <div className="flex items-center gap-2 bg-[var(--color-secondary)] rounded-lg px-2 py-1 border border-[var(--color-border)]">
            <button 
              onClick={onPrev}
              disabled={step === 1}
              className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
            <span className="text-[12px] text-[var(--color-foreground)] font-bold">{step}/{totalSteps}</span>
            <button 
              onClick={onNext}
              disabled={step === totalSteps}
              className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {options.map((opt, idx) => (
          <ChoiceItem 
            key={idx}
            num={opt.num}
            label={opt.label}
            desc={opt.desc}
            active={opt.active}
            isMulti={isMulti}
            onClick={() => onOptionClick?.(idx)}
          />
        ))}
        
        <button className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[var(--color-secondary)] text-[var(--color-foreground)] text-sm font-bold border border-[var(--color-border)] hover:bg-[var(--color-accent)] transition-all">
          <Plus className="h-4 w-4" />
          添加选项
        </button>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--color-foreground)] text-[var(--color-background)] text-[14px] font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg"
        >
          继续
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ChoiceItem({ 
  num, 
  label, 
  desc, 
  active = false, 
  isMulti = false,
  onClick 
}: StepOption & { isMulti?: boolean; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-5 p-5 rounded-[1.25rem] transition-all border-2 cursor-pointer",
        active 
          ? "bg-[var(--color-secondary)] border-[var(--color-foreground)] shadow-sm" 
          : "bg-[var(--color-card)] border-transparent hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)]"
      )}
    >
      <div className={cn(
        "h-8 w-8 rounded-xl flex items-center justify-center text-[15px] font-bold shrink-0 shadow-sm transition-colors",
        active 
          ? "bg-[var(--color-foreground)] text-[var(--color-background)]" 
          : "bg-[var(--color-secondary)] text-[var(--color-muted-foreground)]"
      )}>
        {isMulti ? (
          <div className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
            active ? "bg-white border-white" : "border-[var(--color-muted-foreground)]"
          )}>
            {active && (
              <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        ) : num}
      </div>
      <div>
        <div className={cn("text-[16px] font-bold", active ? "text-[var(--color-foreground)]" : "text-[var(--color-foreground)]/60")}>{label}</div>
        {desc && <div className="text-[13px] text-[var(--color-muted-foreground)] mt-0.5 font-medium">{desc}</div>}
      </div>
      {active && !isMulti && (
        <div className="ml-auto w-6 h-6 rounded-full bg-[var(--color-foreground)] flex items-center justify-center text-[var(--color-background)]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}

function ResourceCard({ title, type, date, onClick }: { title: string; type: string; date: string; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-5 flex flex-col gap-5 group hover:border-[var(--color-muted-foreground)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer"
    >
      <div className="h-28 w-full bg-[var(--color-secondary)] rounded-2xl flex items-center justify-center border border-[var(--color-border)]">
        <div className="text-[12px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-[0.2em]">{type}</div>
      </div>
      <div>
        <div className="text-[14px] font-bold text-[var(--color-foreground)] truncate mb-1.5">{title}</div>
        <div className="text-[12px] text-[var(--color-muted-foreground)] flex items-center gap-2 font-medium">
          <span>文稿</span>
          <span className="opacity-30">·</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

function ImageResourceCard({ title, type, date, img, onClick }: { title: string; type: string; date: string; img: string; onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-5 flex flex-col gap-5 group hover:border-[var(--color-muted-foreground)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer"
    >
      <div className="h-28 w-full rounded-2xl overflow-hidden relative border border-[var(--color-border)]">
        <img src={img} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
        <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-[var(--color-card)]/90 backdrop-blur-md text-[10px] font-bold text-[var(--color-foreground)] uppercase tracking-wider shadow-sm">{type}</div>
      </div>
      <div>
        <div className="text-[14px] font-bold text-[var(--color-foreground)] truncate mb-1.5">{title}</div>
        <div className="text-[12px] text-[var(--color-muted-foreground)] flex items-center gap-2 font-medium">
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

function FolderItem({ 
  name, 
  type, 
  date, 
  isFolder = false, 
  isOpen = false, 
  level = 0,
  icon,
  onClick,
  onToggle
}: { 
  name: string; 
  type?: string; 
  date?: string; 
  isFolder?: boolean; 
  isOpen?: boolean; 
  level?: number;
  icon?: React.ReactNode;
  onClick?: () => void;
  onToggle?: () => void;
}) {
  return (
    <div 
      className="group flex flex-col"
    >
      <div 
        onClick={isFolder ? onToggle : onClick}
        className={cn(
          "flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[var(--color-secondary)] cursor-pointer transition-colors w-full",
          !isFolder && "hover:text-[var(--color-primary)]"
        )}
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="shrink-0 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)] transition-colors">
            {isFolder ? (
              <div className="flex items-center gap-1">
                <ChevronRightIcon className={cn("h-4 w-4 transition-transform", isOpen ? "rotate-90" : "")} />
                <Folder className={cn("h-5 w-5", isOpen ? "fill-[var(--color-primary)]/20 text-[var(--color-primary)]" : "")} />
              </div>
            ) : (
              <div className="flex items-center gap-1 pl-5">
                {icon ? icon : <File className="h-5 w-5" />}
              </div>
            )}
          </div>
          <span className={cn(
            "text-[14px] font-medium truncate",
            isFolder ? "text-[var(--color-foreground)]" : "text-[var(--color-foreground)]/80"
          )}>
            {name}
          </span>
        </div>
        {date && (
          <span className="text-[12px] text-[var(--color-muted-foreground)] shrink-0 ml-4">
            {date}
          </span>
        )}
      </div>
    </div>
  );
}

function FolderView({ charSam, charBoss, videoFileUrl, setActiveResource }: any) {
  const [openFolders, setOpenFolders] = useState<string[]>(['workspace', 'tasks', 'upload', 'video-projects', '20260813-1400-onepunch-game-promo']);

  const toggleFolder = (folder: string) => {
    setOpenFolders(prev => 
      prev.includes(folder) 
        ? prev.filter(f => f !== folder) 
        : [...prev, folder]
    );
  };

  const isOpen = (folder: string) => openFolders.includes(folder);

  return (
    <div className="flex flex-col space-y-1">
      {/* workspace */}
      <FolderItem 
        name="workspace" 
        isFolder 
        isOpen={isOpen('workspace')} 
        onToggle={() => toggleFolder('workspace')} 
      />
      
      {isOpen('workspace') && (
        <>
          {/* tasks */}
          <FolderItem 
            name="tasks" 
            isFolder 
            isOpen={isOpen('tasks')} 
            level={1} 
            onToggle={() => toggleFolder('tasks')} 
          />
          {isOpen('tasks') && (
            <>
              <FolderItem 
                name="video-projects_20260813-1400-onepunch-game-promo_genos-reference.json" 
                level={2} 
                date="3天前" 
              />
              <FolderItem 
                name="video-projects_20260813-1400-onepunch-game-promo_onepunch-promo.json" 
                level={2} 
                date="3天前" 
              />
            </>
          )}

          {/* upload */}
          <FolderItem 
            name="upload" 
            isFolder 
            isOpen={isOpen('upload')} 
            level={1} 
            onToggle={() => toggleFolder('upload')} 
          />
          {isOpen('upload') && (
            <FolderItem 
              name="user_upload_image_1.webp" 
              level={2} 
              date="3天前" 
              icon={<div className="h-5 w-5 rounded overflow-hidden"><img src={charSam} className="w-full h-full object-cover" /></div>}
              onClick={() => setActiveResource({ type: 'image', data: { url: charSam, name: 'user_upload_image_1.webp' } })}
            />
          )}

          {/* video-projects */}
          <FolderItem 
            name="video-projects" 
            isFolder 
            isOpen={isOpen('video-projects')} 
            level={1} 
            onToggle={() => toggleFolder('video-projects')} 
          />
          {isOpen('video-projects') && (
            <>
              <FolderItem 
                name="20260813-1400-onepunch-game-promo" 
                isFolder 
                isOpen={isOpen('20260813-1400-onepunch-game-promo')} 
                level={2} 
                onToggle={() => toggleFolder('20260813-1400-onepunch-game-promo')} 
              />
              {isOpen('20260813-1400-onepunch-game-promo') && (
                <>
                  <FolderItem 
                    name="final-generation-info.md" 
                    level={3} 
                    date="3天前" 
                  />
                  <FolderItem 
                    name="genos-reference.png" 
                    level={3} 
                    date="3天前" 
                    icon={<div className="h-5 w-5 rounded overflow-hidden"><img src={charBoss} className="w-full h-full object-cover" /></div>}
                    onClick={() => setActiveResource({ type: 'image', data: { url: charBoss, name: 'genos-reference.png' } })}
                  />
                  <FolderItem 
                    name="onepunch-promo.mp4" 
                    level={3} 
                    date="3天前" 
                    icon={<div className="h-5 w-5 rounded overflow-hidden relative"><img src={charBoss} className="w-full h-full object-cover opacity-50" /><div className="absolute inset-0 flex items-center justify-center"><Video className="h-3 w-3" /></div></div>}
                    onClick={() => setActiveResource({ type: 'video', data: { url: videoFileUrl, name: 'onepunch-promo.mp4' } })}
                  />
                  <FolderItem 
                    name="story-brief.md" 
                    level={3} 
                    date="3天前" 
                  />
                  <FolderItem 
                    name="story-script.md" 
                    level={3} 
                    date="3天前" 
                    onClick={() => setActiveResource({ type: 'script' })} 
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function StoryboardContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-[var(--color-foreground)] px-2">《一拳超人：最强之男》游戏宣发 - 故事脚本</h1>
      
      <div className="space-y-6">
        {[
          {
            num: 1,
            time: "2.5s",
            desc: "纯黑背景中，埼玉特写登场，光头冷峻面容，身穿棕黄色紧身战衣，灰白色披风微微飘动，右拳前伸，红色拳套表面泛起微光蓄力。",
            view: "近景特写",
            atmos: "黑底单点聚光，高对比度，赛璐璐质感",
            audio: "逐渐升压蓄力声",
            camera: "推至拳套"
          },
          {
            num: 2,
            time: "0.7s",
            desc: "红色拳套爆发冲击波，白光撕裂画面，碎片飞溅。",
            view: "全景",
            atmos: "爆裂白光闪屏",
            audio: "巨响轰鸣",
            camera: "快速拉镜"
          },
          {
            num: 3,
            time: "3s",
            desc: "杰诺斯登场，火焰喷射，快剪多个英雄技能特效。",
            view: "中/全景",
            atmos: "高饱和燃战色调",
            audio: "英雄集结旁白+音效",
            camera: "快速剪辑"
          },
          {
            num: 4,
            time: "3.8s",
            desc: "埼玉一拳粉碎怪人，定格侧脸。浮现品牌口号。",
            view: "近景→中景",
            atmos: "金色品牌光芒",
            audio: "一拳K.O.旁白+重击",
            camera: "慢动作→定格"
          },
          {
            num: 5,
            time: "5s",
            desc: "品牌定帧：Logo居中，背景埼玉背影，下载提示。",
            view: "全景",
            atmos: "金属质感反光",
            audio: "品牌收尾音效",
            camera: "固定机位"
          }
        ].map((row) => (
          <div key={row.num} className="p-4 rounded-2xl bg-[var(--color-secondary)]/50 border border-[var(--color-border)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="h-6 w-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">{row.num}</span>
              <span className="text-xs font-bold text-[var(--color-muted-foreground)]">{row.time}</span>
            </div>
            <div className="text-[13px] text-[var(--color-foreground)] leading-relaxed">
              <span className="font-bold mr-2">画面:</span> {row.desc}
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="text-[var(--color-muted-foreground)]"><span className="font-bold">景别:</span> {row.view}</div>
              <div className="text-[var(--color-muted-foreground)]"><span className="font-bold">氛围:</span> {row.atmos}</div>
              <div className="text-[var(--color-muted-foreground)]"><span className="font-bold">音频:</span> {row.audio}</div>
              <div className="text-[var(--color-muted-foreground)]"><span className="font-bold">运镜:</span> {row.camera}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
