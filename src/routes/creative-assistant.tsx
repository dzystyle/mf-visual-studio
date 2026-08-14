import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  Search
} from "lucide-react";
import { BrandMark, TopBar } from "@/components/TopBar";
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


type Search = { prompt?: string };

export const Route = createFileRoute("/creative-assistant")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    prompt: typeof s.prompt === "string" ? s.prompt : undefined,
  }),
  head: () => ({
    meta: [{ title: "创作助手 — Artrail" }],
  }),
  component: CreativeAssistantPage,
});

type Message = {
  id: string;
  role: "user" | "assistant";
  content?: string;
  card?: React.ReactNode;
  timestamp: string;
  attachments?: { name: string; type: string; url?: string }[];
  isChoiceCard?: boolean;
  statusLines?: { icon: 'check' | 'loading'; text: string; subText?: string }[];
  isDetailedAssistant?: boolean;
  isDetailedAssistant2?: boolean;
  isVideoOutput?: boolean;
};

function CreativeAssistantPage() {
  const { prompt: initialPrompt } = Route.useSearch();
  const [showResources, setShowResources] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [inputValue, setInputValue] = useState(initialPrompt || "");
  const [isTyping, setIsTyping] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [stepStates, setStepStates] = useState({
    1: [true, false, false], // Duration options
    2: [true, false, false, false], // Style options
    3: [true, true, false, false], // Content options (multi)
    4: [false, true], // Asset options
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [visibleMessageCount, setVisibleMessageCount] = useState(0);

  const [workflow, setWorkflow] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial workflow from search param if present
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      const firstMsg: Message = {
        id: "1",
        role: "user",
        content: initialPrompt,
        timestamp: new Date().toLocaleString(),
      };
      setMessages([firstMsg]);
      triggerAssistantResponse(1);
    }
  }, [initialPrompt]);

  const triggerAssistantResponse = (stepIndex: number) => {
    setIsProcessing(true);
    const fullWorkflow = [
      {
        id: "2",
        role: "assistant",
        content: "掌趣一拳超人游戏宣发，埼玉一拳秒杀的震撼感很适合做营销短视频的开场钩子。我先确认几个关键信息，帮你把方向定准。",
        timestamp: new Date().toLocaleString(),
        statusLines: [{ icon: "check", text: "读取文件", subText: "查看用户上传的一拳超人素材" }]
      },
      {
        id: "3",
        role: "assistant",
        isChoiceCard: true,
        timestamp: new Date().toLocaleString(),
      },
      {
        id: "5",
        role: "assistant",
        content: "收到，15秒内的热血燃战风格，突出角色和战斗特效。请把你的素材上传上来，我基于你的素材来制作营销短视频。",
        timestamp: new Date().toLocaleString(),
        statusLines: [
          { icon: "check", text: "技能学习", subText: "营销视频大师" },
          { icon: "loading", text: "正在加载技能: 营销视频大师" },
          { icon: "check", text: "任务规划" }
        ]
      },
      {
        id: "6",
        role: "assistant",
        content: "好的，我已经准备好处理素材并开始制作营销视频了。我们会先读取文件并规划任务，确保脚本准确还原一拳超人的热血燃战风格。",
        timestamp: new Date().toLocaleString(),
      },
      {
        id: "8",
        role: "assistant",
        content: "埼玉的经典战斗姿态很抓眼，一拳前伸的构图天生适合做开场。我先看一下素材，然后开始制作。",
        timestamp: new Date().toLocaleString(),
      },
      {
        id: "9",
        role: "assistant",
        timestamp: new Date().toLocaleString(),
        isDetailedAssistant: true,
      },
      {
        id: "11",
        role: "assistant",
        timestamp: new Date().toLocaleString(),
        isDetailedAssistant2: true,
      },
      {
        id: "13",
        role: "assistant",
        timestamp: new Date().toLocaleString(),
        isVideoOutput: true,
      },
    ];

    const nextAssistantMsg = fullWorkflow.find(m => {
      if (stepIndex === 1) return m.id === "2" || m.id === "3";
      if (stepIndex === 2) return m.id === "5" || m.id === "6";
      if (stepIndex === 3) return m.id === "8" || m.id === "9";
      if (stepIndex === 4) return m.id === "11";
      if (stepIndex === 5) return m.id === "13";
      return false;
    });

    // In this simulation, we'll just add the relevant response based on step
    const timer = setTimeout(() => {
      setIsTyping(true);
      const typingTimer = setTimeout(() => {
        const msgsToAdd: Message[] = [];
        if (stepIndex === 1) {
          msgsToAdd.push(fullWorkflow[0] as Message, fullWorkflow[1] as Message);
        } else if (stepIndex === 2) {
          msgsToAdd.push(fullWorkflow[2] as Message, fullWorkflow[3] as Message);
        } else if (stepIndex === 3) {
          msgsToAdd.push(fullWorkflow[4] as Message, fullWorkflow[5] as Message);
        } else if (stepIndex === 4) {
          msgsToAdd.push(fullWorkflow[6] as Message);
        } else if (stepIndex === 5) {
          msgsToAdd.push(fullWorkflow[7] as Message);
        }
        
        setMessages(prev => [...prev, ...msgsToAdd]);
        setIsTyping(false);
        setIsProcessing(false);
      }, 1500);
      return () => clearTimeout(typingTimer);
    }, 500);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  const handleOptionClick = (step: number, index: number) => {
    setStepStates(prev => {
      const newState = { ...prev };
      const stepOptions = [...(newState[step as keyof typeof newState] as boolean[])];
      if (step === 3) {
        stepOptions[index] = !stepOptions[index];
      } else {
        stepOptions.fill(false);
        stepOptions[index] = true;
      }
      newState[step as keyof typeof newState] = stepOptions;
      return newState;
    });
  };

  const nextStep = () => {
    setCurrentStep(prev => {
      const next = Math.min(prev + 1, 4);
      if (prev === 4) {
        // When user finishes the choice card, simulate a user message
        const userMsg: Message = {
          id: Math.random().toString(),
          role: "user",
          content: "我已确认以上信息",
          timestamp: new Date().toLocaleString(),
        };
        setMessages(prevMsgs => [...prevMsgs, userMsg]);
        triggerAssistantResponse(2);
      }
      return next;
    });
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSendMessage = () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleString(),
    };
    
    // Check for specific keywords to trigger next stages
    let nextStage = 0;
    if (inputValue.includes("图片") || inputValue.includes("素材")) {
      userMsg.attachments = [{ name: "saitama.webp", type: "IMAGE", url: charSam }];
      nextStage = 3;
    } else if (inputValue.includes("生成") || inputValue.includes("宣发")) {
      nextStage = 4;
    } else if (inputValue.includes("继续")) {
      nextStage = 5;
    } else if (messages.length === 0) {
      nextStage = 1;
    }

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    
    if (nextStage > 0) {
      triggerAssistantResponse(nextStage);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden font-sans">
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <BrandMark />
        </div>
        <div className="pointer-events-auto">
          <TopBar />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden pt-20">
        {/* Main Chat Area */}
        <div className={cn(
          "flex flex-1 flex-col transition-all duration-500 ease-in-out relative",
          showResources ? "mr-[600px]" : "mr-0"
        )}>
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide">
            <div className="mx-auto max-w-4xl space-y-10">
              {messages.length === 0 && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-20 h-20 rounded-3xl bg-[var(--color-secondary)] flex items-center justify-center mb-6 border border-[var(--color-border)] shadow-sm">
                    <MessageSquare className="w-10 h-10 text-[var(--color-foreground)]" />
                  </div>
                  <h1 className="text-3xl font-bold mb-3">Creative Assistant</h1>
                  <p className="text-lg font-medium max-w-md">输入一段话，让我帮你策划并生成精美的宣发视频。</p>
                </div>
              )}
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex flex-col gap-3",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-1">
                      {msg.attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] w-fit shadow-sm">
                          <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-[var(--color-border)]">
                            <img src={file.url} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[14px] font-bold text-[var(--color-foreground)]">{file.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.content && (
                    <div className={cn(
                      "max-w-[85%] px-5 py-3 text-[15px] leading-relaxed tracking-tight shadow-sm border whitespace-pre-wrap",
                      msg.role === "user" 
                        ? "rounded-2xl rounded-tr-sm bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-transparent" 
                        : "rounded-2xl rounded-tl-sm bg-[var(--color-card)] text-[var(--color-foreground)] border-[var(--color-border)]"
                    )}>
                      {msg.content}
                    </div>
                  )}

                  {msg.isChoiceCard && (
                    <div className={cn("w-full", messages.filter(m => m.isChoiceCard).indexOf(msg) !== messages.filter(m => m.isChoiceCard).length - 1 && "pointer-events-none opacity-50")}>
                      <AnimatePresence mode="wait">
                        {currentStep === 1 && msg.id === messages.findLast(m => m.isChoiceCard)?.id && (
                          <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <ChoiceCard 
                              step={1}
                              totalSteps={4}
                              title="视频时长希望控制在多少秒以内？"
                              options={[
                                { num: "1", label: "15秒以内", desc: "节奏紧凑，适合信息流投放", active: stepStates[1][0] },
                                { num: "2", label: "15-30秒", desc: "可展示更多角色 and 玩法细节", active: stepStates[1][1] },
                                { num: "3", label: "30-60秒", desc: "完整剧情+玩法展示", active: stepStates[1][2] },
                              ]}
                              onOptionClick={(i) => handleOptionClick(1, i)}
                              onNext={nextStep}
                              onPrev={prevStep}
                            />
                          </motion.div>
                        )}
                        {currentStep === 2 && (
                          <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <ChoiceCard 
                              step={2}
                              totalSteps={4}
                              title="视频风格偏向哪种？"
                              options={[
                                { num: "1", label: "热血燃战", desc: "高燃打斗、特效炸裂，突出战斗爽感", active: stepStates[2][0] },
                                { num: "2", label: "电影质感", desc: "大场面、史诗感、氛围渲染", active: stepStates[2][1] },
                                { num: "3", label: "搞笑反差", desc: "埼玉日常呆萌 vs 战斗无敌的反差感", active: stepStates[2][2] },
                                { num: "4", label: "潮酷炫技", desc: "快节奏剪辑、潮流视觉、炫酷转场", active: stepStates[2][3] },
                              ]}
                              onOptionClick={(i) => handleOptionClick(2, i)}
                              onNext={nextStep}
                              onPrev={prevStep}
                            />
                          </motion.div>
                        )}
                        {currentStep === 3 && (
                          <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <ChoiceCard 
                              step={3}
                              totalSteps={4}
                              isMulti
                              title="视频主要想突出什么内容？"
                              options={[
                                { num: "1", label: "角色展示（埼玉、杰诺斯等）", active: stepStates[3][0] },
                                { num: "2", label: "战斗特效与打斗场面", active: stepStates[3][1] },
                                { num: "3", label: "游戏玩法特色", active: stepStates[3][2] },
                                { num: "4", label: "下载引导/预约转化", active: stepStates[3][3] },
                              ]}
                              onOptionClick={(i) => handleOptionClick(3, i)}
                              onNext={nextStep}
                              onPrev={prevStep}
                            />
                          </motion.div>
                        )}
                        {currentStep === 4 && (
                          <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <ChoiceCard 
                              step={4}
                              totalSteps={4}
                              title="是否有参考素材需要提供？（游戏画面截图、角色立绘等）"
                              options={[
                                { num: "1", label: "没有，直接帮我做", desc: "由AI根据描述生成", active: stepStates[4][0] },
                                { num: "2", label: "有素材，我来上传", desc: "上传后我会基于素材创作", active: stepStates[4][1] },
                              ]}
                              onOptionClick={(i) => handleOptionClick(4, i)}
                              onNext={nextStep}
                              onPrev={prevStep}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {msg.statusLines && (
                    <div className="flex flex-col gap-2 w-full max-w-xl">
                      {msg.statusLines.map((line, i) => (
                        <StatusLine key={i} icon={line.icon} text={line.text} subText={line.subText} />
                      ))}
                    </div>
                  )}

                  {msg.isDetailedAssistant && (
                    <div className="flex flex-col gap-2 w-full max-w-xl">
                      <StatusLine icon="check" text="读取文件" subText="查看用户上传的一拳超人素材" />
                      <div className="ml-8 mt-1 mb-4 flex items-center gap-3 p-3 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] w-fit">
                        <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-[var(--color-border)]">
                          <img src={charSam} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[14px] font-bold text-[var(--color-foreground)]">saitama.webp</div>
                      </div>
                      <div className="text-[15px] mb-4">素材确认完毕，埼玉的战斗姿态非常适合做宣发开场。接下来加载营销视频制作流程。</div>
                      <StatusLine icon="check" text="技能学习" subText="营销视频大师" />
                      <StatusLine icon="loading" text="正在加载技能: 营销视频大师" />
                      <StatusLine icon="check" text="任务规划" />
                      <div className="text-[15px] mt-2 mb-2">先读取输入规范文件，确认产物格式和项目状态定义。</div>
                      <StatusLine icon="check" text="读取文件" subText="读取输入与项目状态参考文件" />
                      <StatusLine icon="check" text="任务规划" />
                      <div className="text-[15px] mt-2 mb-2">现在读取营销基础与路由文件，确定方向创意路由。</div>
                      <StatusLine icon="check" text="读取文件" subText="读取营销基础与路由参考文件" />
                      <div className="text-[15px] mt-2 mb-2">这是一个游戏宣发视频，核心说服力来自品牌含义和情感关联，路由到品牌片方向。现在读取品牌片方向创意文件。</div>
                      <StatusLine icon="check" text="读取文件" subText="读取品牌片方向创意文件" />
                      <StatusLine icon="check" text="任务规划" />
                      <div className="text-[15px] mt-2 mb-2">现在创建项目目录并编写内部营销脑图和故事脚本。先搜索一下掌趣一拳超人游戏的相关信息，确保脚本内容准确。</div>
                      <StatusLine icon="check" text="联网搜索" subText="完成 2 次搜索" />
                      <StatusLine icon="check" text="执行命令" subText="创建项目目录" />
                      <div className="text-[15px] mt-2 mb-2">搜索结果很全面。掌趣科技的《一拳超人：最强之男》是一款策略卡牌手游，核心卖点包括正版授权、还原动画剧情、原版声优、策略阵容搭配、埼玉一拳秒杀等。现在编写内部营销脑图和故事脚本。</div>
                      <StatusLine icon="check" text="写入文件" subText="编写内部营销脑图story-brief.md" />
                      <div className="text-[15px] mt-2 mb-2">现在编写故事脚本，这是需要你确认的第一个产物。</div>
                      <StatusLine icon="check" text="写入文件" subText="编写故事脚本story-script.md" />
                      <div className="text-[15px] mt-2 mb-2">故事脚本已写好。这份脚本请你确认：埼玉蓄力开场、一拳冲击波过渡、英雄阵容快剪展示、埼玉一拳秒杀收尾 + brand slogan + 下载引导，5个镜头共15秒。画面节奏和卖点顺序对齐后，我再进入素材检查和视频方案环节。如果要改，直接告诉我，改完再发你看。</div>
                      <StatusLine icon="check" text="发送产物" />
                      <div className="mt-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center justify-between shadow-sm max-w-sm hover:border-[var(--color-muted-foreground)] cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center text-[var(--color-primary)]">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-[14px] font-bold">story-script.md</div>
                            <div className="text-[11px] text-[var(--color-muted-foreground)]">/workspace/video-projects/20260813-1400-...</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-[var(--color-muted-foreground)]">
                          查看文件 <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.isDetailedAssistant2 && (
                    <div className="flex flex-col gap-2 w-full max-w-xl">
                      <StatusLine icon="check" text="任务规划" />
                      <div className="text-[15px] mt-2 mb-4">故事脚本已确认通过。现在进入素材完整性检查。</div>
                      <div className="text-[15px] mb-2 font-medium">脚本中引用的实体有：</div>
                      <ol className="list-decimal ml-5 space-y-2 text-[15px] mb-4">
                        <li><span className="font-bold">埼玉</span> - 已有用户上传立绘 (./upload/user_upload_image_1.webp)，可用</li>
                        <li><span className="font-bold">杰诺斯</span> - 脚本中出现，但没有参考素材，需要生成</li>
                        <li><span className="font-bold">战栗的龙卷、原子武士、银色獠牙</span> - 快剪镜头中短暂出现，可由视频模型根据描述生成，不需要单独素材图</li>
                        <li><span className="font-bold">游戏Logo/品牌定帧</span> - 文字元素，由视频模型渲染</li>
                      </ol>
                      <div className="text-[15px] mb-4">埼玉的素材已齐备。杰诺斯在脚本中有3秒重要展示镜头，需要生成一张角色参考图来稳定形象一致性。我来生成这张素材。</div>
                      
                      <div className="w-full bg-[var(--color-secondary)]/50 border border-[var(--color-border)] rounded-2xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <StatusLine icon="check" text="生成图像" subText="日系少年热血动漫风格，赛璐珞平涂动画质感。杰诺斯（魔鬼改造人），年轻男性，金色短发，锐利的眼神，..." />
                        </div>
                        <div className="text-[14px] text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                          日系少年热血动漫风格，赛璐珞平涂动画质感。杰诺斯（魔鬼改造人），年轻男性，金色短发，锐利的眼神，面容冷峻英俊。身穿深色金属质感战斗服，右臂为复杂的金色机械臂改造，手掌处有喷射口结构。身体为机械改造人，胸口的金属核心发出微弱蓝光。站立战斗姿态，背景为纯黑色，高对比明暗光影，线条清晰利落，色彩饱和度高。角色占据画面中心。
                        </div>
                        <div className="flex items-center gap-6 text-[13px] text-[var(--color-muted-foreground)]">
                          <span>比例 3:4</span>
                          <div className="flex items-center gap-2">
                            <span>输出</span>
                            <div className="h-8 w-8 rounded-full overflow-hidden border border-[var(--color-border)]">
                              <img src={charBoss} className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 mb-4">
                        <div className="w-48 h-64 rounded-2xl overflow-hidden border-2 border-[var(--color-border)] shadow-lg">
                          <img src={charBoss} className="w-full h-full object-cover" />
                        </div>
                      </div>

                      <div className="text-[15px] mb-4">杰诺斯参考图已生成。我先确认一下效果是否符合预期。</div>
                      <StatusLine icon="check" text="读取文件" subText="查看杰诺斯参考图生成效果" />
                      <div className="text-[15px] mt-2 mb-4">杰诺斯参考图效果不错，金色机械臂、冷峻面容、赛璐珞动画风格都与埼玉素材风格统一。素材已齐备：埼玉有用户上传立绘，杰诺斯有生成的参考图。</div>
                      <StatusLine icon="check" text="任务规划" />
                      <div className="text-[15px] mt-2 mb-4">现在读取协作与质量文件和Seedance编译指导文件，编译最终生成方案。</div>
                      <StatusLine icon="check" text="资料探索" subText="读取 2 个文件" />
                      <div className="text-[15px] mt-2 mb-4">当前单个请求最大生成时长是15秒，整片15秒可以在一次请求中完成。现在编译最终生成方案。</div>
                      <StatusLine icon="check" text="写入文件" subText="编译最终生成方案final-generation-info.md" />
                      <div className="text-[15px] mt-2 mb-4">这是可直接生成视频的完整方案，请你最终确认：15秒一次生成，埼玉蓄力开场、冲击波过渡、英雄阵容快剪、一拳秒杀收尾加品牌口号、品牌定帧下载引导。参考素材为埼玉立绘 (@图1) 和杰诺斯参考图 (@图2)。确认后我会按此方案生成视频并交付成片。如果要改，直接告诉我。</div>
                      <StatusLine icon="check" text="发送产物" />
                      <div className="mt-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center justify-between shadow-sm max-w-sm hover:border-[var(--color-muted-foreground)] cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center text-[var(--color-primary)]">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-[14px] font-bold">final-generation-info.md</div>
                            <div className="text-[11px] text-[var(--color-muted-foreground)]">/workspace/video-projects/20260813-1400-...</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-[var(--color-muted-foreground)]">
                          查看文件 <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {msg.role === 'assistant' && msg.id === '13' && (
                    <div className="flex flex-col gap-2 w-full max-w-xl">
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-xl mb-2 group">
                        <video 
                          src={videoFileUrl} 
                          className="w-full h-full object-cover" 
                          controls
                          autoPlay
                          muted
                          loop
                          poster={videoPreview}
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1 pointer-events-none">
                          <span className="opacity-70">AI 生成</span>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white pointer-events-none">
                          0:15
                        </div>
                      </div>
                      <div className="text-[15px] mb-4">视频已生成成功。先确认一下效果。</div>
                      
                      <StatusLine icon="check" text="读取文件" subText="查看生成的视频效果" />
                      <StatusLine icon="check" text="任务规划" />
                      
                      <div className="text-[15px] mb-4">视频已生成完成，15秒热血燃战风格的游戏宣发成片。赤焰拳客在废墟战场中双拳燃烧火焰，结尾定格在「英雄参上 一拳K.O.」品牌口号和游戏Logo。</div>
                      
                      <div className="text-[15px] mb-4">由于IP形象审核限制，角色已从埼玉/杰诺斯替换为原创的赤焰拳客形象，保留了热血战斗的宣发调性。成片已交付，你可以审阅后告诉我是否需要调整。</div>
                      
                      <StatusLine icon="check" text="发送产物" />
                      
                      <div className="text-[15px] mb-2">成片已交付。由于平台审核限制，原IP角色形象（埼玉/杰诺斯）无法直接生成，已替换为原创的赤焰拳客角色，保留了热血燃战的游戏宣发风格。如果你有官方授权的角色素材，可以上传后重新生成更贴近原作的画面。需要调整什么直接说。</div>
                    </div>
                  )}

                  <div className="text-[11px] text-[var(--color-muted-foreground)] px-1 font-medium">{msg.timestamp}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Input Area */}
          <div className="px-6 pb-10">
            <div className="mx-auto max-w-5xl">
              <div className="bg-[var(--color-card)] rounded-[2.5rem] border border-[var(--color-border)] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.04)] transition-all focus-within:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                <div className="flex flex-wrap gap-2 px-4 mb-2">
                   {/* Prompt chips could go here */}
                </div>
                <textarea 
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="与综合助手对话，支持多种能力..."
                  className="w-full bg-transparent text-[16px] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none resize-none px-4 py-2 font-medium"
                />
                <div className="mt-4 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2.5">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-secondary)] text-[var(--color-foreground)] hover:bg-[var(--color-accent)] transition-colors border border-transparent active:scale-95">
                      <Plus className="h-5 w-5" />
                    </button>
                    <div className="h-5 w-px bg-[#E5E5E7] mx-1" />
                    
                    <button className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] px-4 py-2 text-[13px] font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-accent)] transition-all">
                      <div className="w-4 h-3 border-2 border-current rounded-[2px]" />
                      16:9 (横屏)
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>

                    <button className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] px-4 py-2 text-[13px] font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-accent)] transition-all">
                      <LayoutGrid className="h-4 w-4" />
                      技能
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>

                    <button className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] px-4 py-2 text-[13px] font-bold text-[var(--color-foreground)] hover:bg-[var(--color-accent)] transition-all uppercase tracking-tight">
                      720P
                    </button>

                    <button className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] px-4 py-2 text-[13px] font-bold text-[var(--color-foreground)] hover:bg-[var(--color-accent)] transition-all uppercase tracking-tight">
                      2K
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors p-2 rounded-full hover:bg-[var(--color-secondary)]">
                      <Mic className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={handleSendMessage}
                      disabled={isProcessing}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all active:scale-90",
                        isProcessing 
                          ? "bg-[var(--color-muted-foreground)] cursor-not-allowed" 
                          : "bg-[var(--color-foreground)] text-[var(--color-background)] hover:opacity-90"
                      )}
                    >
                      <ArrowUp className={cn("h-5 w-5", isProcessing && "animate-pulse")} />
                    </button>
                  </div>
                </div>
              </div>
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

        {/* Resources Panel */}
        <AnimatePresence>
          {showResources && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[600px] z-[100] bg-[var(--color-card)] border-l border-[var(--color-border)] flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-[var(--color-border)]">
                <div className="flex items-center gap-6">
                  <h2 className="text-xl font-bold text-[var(--color-foreground)]">资源</h2>
                  <div className="flex items-center bg-[var(--color-secondary)] rounded-lg p-1 border border-[var(--color-border)]">
                    <button className="p-1.5 bg-[var(--color-card)] rounded-md shadow-sm text-[var(--color-foreground)]"><LayoutGrid className="h-4 w-4" /></button>
                    <button className="p-1.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"><ChevronDown className="h-4 w-4 rotate-180" /></button>
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

              <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
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
                    <ResourceCard title="story-script.md" type="MD" date="1小时前" />
                  </div>
                </section>

                {/* Images */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[13px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-[0.1em] flex items-center gap-2">图片</h3>
                    <span className="text-[12px] text-[var(--color-muted-foreground)] font-medium">共 2 个</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <ImageResourceCard title="user_upload_image_1.webp" type="WEBP" date="1小时前" img={charSam} />
                    <ImageResourceCard title="genos-reference.png" type="PNG" date="1小时前" img={charBoss} />
                  </div>
                </section>

                {/* Videos */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[13px] font-bold text-[var(--color-muted-foreground)] uppercase tracking-[0.1em] flex items-center gap-2">视频</h3>
                    <span className="text-[12px] text-[var(--color-muted-foreground)] font-medium">共 1 个</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <ImageResourceCard title="intro-animation.mp4" type="MP4" date="刚刚" img={skillReenact} />
                  </div>
                </section>
              </div>
              
              {/* Collapse handle */}
              <button 
                onClick={() => setShowResources(false)}
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-8 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full flex items-center justify-center text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] shadow-lg transition-all hover:scale-110 active:scale-95 z-[110]"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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

function ResourceCard({ title, type, date }: { title: string; type: string; date: string }) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-5 flex flex-col gap-5 group hover:border-[var(--color-muted-foreground)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer">
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

function ImageResourceCard({ title, type, date, img }: { title: string; type: string; date: string; img: string }) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-5 flex flex-col gap-5 group hover:border-[var(--color-muted-foreground)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] cursor-pointer">
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
