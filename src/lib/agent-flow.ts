// 智能 Agent 流程脚本（数据驱动）
// 规划模式 → 创意分叉 → 方案确认 → 视频生成模式 → 素材锚定 → 分镜规划与自审
// → 生成策略 → 分轮生成 → 拼接成片
import {
  estimateCredits,
  formatDuration,
  parseDuration,
  parseSubject,
  planRounds,
  planShots,
  SINGLE_SHOT_LIMIT,
  type PlanResult,
  type Scene,
} from "@/lib/agent-plan";

export type ToolState = "done" | "running" | "error";

export type Block =
  | { kind: "text"; text: string }
  | { kind: "mode"; mode: "enter" | "exit"; label: string }
  | { kind: "skill"; name: string }
  | { kind: "requirement"; items: { label: string; value: string }[] }
  | {
      kind: "search";
      count: number;
      summary: string;
      hits: { title: string; score: number; note: string }[];
    }
  | { kind: "tool"; label: string; detail?: string; state?: ToolState }
  | { kind: "taskplan"; label: string }
  | { kind: "gate"; title: string; rows: { label: string; value: string; ok: boolean }[] }
  | {
      kind: "reasoning";
      title: string;
      sections: { title: string; lines: string[] }[];
      table?: { head: string[]; rows: string[][] };
    }
  | { kind: "artifact"; name: string; path: string }
  | {
      kind: "storyboard";
      rows: { id: string; seconds: number; link: string; assets: string; summary: string }[];
      total: number;
    }
  | { kind: "audit"; errors: string[]; warns: string[]; checks: string[] }
  | {
      kind: "media";
      mediaType: "image" | "audio" | "video";
      title: string;
      subtitle?: string;
      url?: string;
      poster?: string;
      duration?: string;
    }
  | { kind: "finalcut"; duration: string; segments: string[]; suggestions: string[] }
  | { kind: "options"; id: string; title: string; options: FlowOption[] };

export type FlowOption = { key: string; label: string; desc?: string };

export type Stage = {
  id: string;
  /** 每个 block 之间的模拟间隔（毫秒） */
  tick?: number;
  blocks: Block[];
};

export type FlowContext = {
  prompt: string;
  skill?: string;
  subject: string;
  duration: number;
  ratio: string;
  hotspot?: string;
  direction?: string;
  branch?: string;
  strategy?: string;
  plan?: PlanResult;
};

export function createContext(prompt: string, skill?: string): FlowContext {
  return {
    prompt,
    skill,
    subject: parseSubject(prompt),
    duration: parseDuration(prompt),
    ratio: "16:9",
  };
}

/* ---------------- 创意方向 / 叙事支线预设 ---------------- */

export const DIRECTIONS: FlowOption[] = [
  {
    key: "story",
    label: "「{subject}奇遇记」",
    desc: "自主推荐：经典寓言结构 + 反转结尾，角色目标受挫后以意外方式达成",
  },
  {
    key: "hot1",
    label: "热点改编 · 生活流实拍感",
    desc: "来自热点榜首（hot_score 1734531），日常质感 + 细节特写，亲和力强",
  },
  {
    key: "hot2",
    label: "热点改编 · 冲突打断流",
    desc: "来自热点第二（hot_score 423665），引入第三方打断制造笑点",
  },
];

export const BRANCHES: FlowOption[] = [
  { key: "heal", label: "治愈成长向", desc: "慢节奏、暖光、主角在失败后学会耐心，收尾温柔" },
  { key: "funny", label: "搞笑反差向", desc: "信心满满 → 打瞌睡 → 被拖下水 → 叼着战利品得意收场" },
  { key: "adventure", label: "冒险奇幻向", desc: "水下世界展开，遭遇变成一场小型奇幻冒险" },
];

export const STRATEGIES: FlowOption[] = [
  { key: "parallel", label: "并行生成（推荐）", desc: "无依赖段同时生成，再按尾帧依赖补齐，速度最快" },
  { key: "serial", label: "串行生成", desc: "逐段生成并逐段确认，可控性最高但耗时更长" },
];

function branchScenes(subject: string, branch: string): Scene[] {
  const hero = subject.replace(/视频|短片/g, "").trim() || "主角";
  if (branch === "heal") {
    return [
      { index: 1, title: "登场", narration: "耐心，是所有等待的答案。", actionSeconds: 3.5, planSeconds: 8, visual: `${hero}背着小竹篓走到河边，晨雾未散` },
      { index: 2, title: "抛竿", narration: "第一次抛竿，水面只剩下涟漪。", actionSeconds: 3, planSeconds: 7, visual: "抛竿动作，鱼线落水泛起涟漪" },
      { index: 3, title: "等待", narration: "太阳一点点偏了，浮漂还是一动不动。", actionSeconds: 3, planSeconds: 9, visual: "光影推移，浮漂纹丝不动，特写主角侧脸" },
      { index: 4, title: "上钩", narration: "就在快要放弃的时候，浮漂沉了下去。", actionSeconds: 4, planSeconds: 8, visual: "浮漂猛沉，鱼竿被拉弯" },
      { index: 5, title: "收场", narration: "原来等待，本身就是收获。", actionSeconds: 3, planSeconds: 6, visual: "夕阳下抱着鱼的剪影，上摇定格" },
    ];
  }
  if (branch === "adventure") {
    return [
      { index: 1, title: "登场", narration: "今天的目标，是河里最大的那条。", actionSeconds: 3.5, planSeconds: 8, visual: `${hero}全套装备到位，河风吹动围巾` },
      { index: 2, title: "异动", narration: "水面下，有什么东西亮了一下。", actionSeconds: 3, planSeconds: 7, visual: "水下微光闪动，镜头缓推" },
      { index: 3, title: "被拖入水", narration: "还没反应过来，整个人已经进了水里。", actionSeconds: 4.5, planSeconds: 9, visual: "鱼竿绷直，主角被拽入水，水花炸裂" },
      { index: 4, title: "水下奇境", narration: "水下不是河，是另一个世界。", actionSeconds: 4, planSeconds: 8, visual: "水下光柱、鱼群、沉船轮廓" },
      { index: 5, title: "浮出", narration: "上岸时，谁也不会相信我说的话。", actionSeconds: 3, planSeconds: 6, visual: "浮出水面，怀里抱着发光的鱼，定格" },
    ];
  }
  return [
    { index: 1, title: "自信登场", narration: "今天的钓鱼佬，从不空军。", actionSeconds: 3.5, planSeconds: 8, visual: `${hero}头戴草帽肩扛竹竿自信入场` },
    { index: 2, title: "标准抛竿", narration: "专业装备，标准动作，完美抛竿。", actionSeconds: 3, planSeconds: 6, visual: "调整草帽、抛竿，鱼线落水泛起涟漪" },
    { index: 3, title: "无聊打瞌睡", narration: "耐心等待……钓鱼嘛……就是要……有……耐心……", actionSeconds: 3, planSeconds: 9, visual: "眼皮渐重、草帽歪斜、嘴角流口水，浮漂纹丝不动" },
    { index: 4, title: "大鱼上钩", narration: "来了来了来了——哎哎哎——哇啊！", actionSeconds: 5, planSeconds: 8, visual: "鱼竿猛弯，被拖入水，水花炸裂特写" },
    { index: 5, title: "得意收场", narration: "钓鱼佬……永不空军！", actionSeconds: 3, planSeconds: 6, visual: "湿漉漉叼着大鱼浮出水面，一脸得意，上摇定格" },
  ];
}

function label(option: FlowOption | undefined, subject: string) {
  return (option?.label ?? "").replace("{subject}", subject);
}

const PROJECT_DIR = "assets/{slug}";

function projectPath(ctx: FlowContext, file: string) {
  const slug = ctx.subject.replace(/\s+/g, "-").slice(0, 16) || "project";
  return `${PROJECT_DIR.replace("{slug}", slug)}/${file}`;
}

/* ---------------- 阶段脚本 ---------------- */

type StageBuilder = (ctx: FlowContext) => Stage;

export const STAGES: StageBuilder[] = [
  // 1. 进入规划模式 + 需求识别
  (ctx) => ({
    id: "planning-enter",
    blocks: [
      {
        kind: "text",
        text: `${ctx.subject}，一个有画面感的题材。${ctx.duration}秒的视频需要多镜头组合完成，我先做创意规划。`,
      },
      { kind: "mode", mode: "enter", label: "进入规划模式" },
      { kind: "skill", name: "故事选题" },
      {
        kind: "text",
        text: `${ctx.subject}有明确的叙事感（角色 + 目标 + 冲突），我先搜索相关热门内容和创意参考。`,
      },
      {
        kind: "requirement",
        items: [
          { label: "已识别需求", value: `${ctx.subject}故事视频，${ctx.duration}秒，${ctx.ratio}` },
          { label: "目标倾向", value: "治愈 / 趣味，适合泛娱乐受众" },
          { label: "输出形式", value: "先给创意方向再定方案" },
        ],
      },
      { kind: "text", text: `接下来搜索「${ctx.subject}」相关的热门视频和创意内容。` },
    ],
  }),

  // 2. 联网搜索 + 热点选择
  (ctx) => ({
    id: "search",
    blocks: [
      {
        kind: "search",
        count: 3,
        summary:
          "hotspot 库返回 10 条相关热点，站内搜索返回 10 条热门视频。其中两条与你的需求最匹配，核心元素相同但风格截然不同。",
        hits: [
          { title: `${ctx.subject} · 生活流实拍`, score: 1734531, note: "日常质感强，评论区互动率高" },
          { title: `${ctx.subject} · 被打断的意外`, score: 423665, note: "冲突设计清晰，反转笑点集中" },
        ],
      },
      {
        kind: "text",
        text: "这两条风格差异很大，先由你定调：我按你选的热点来收敛后面的创意方向。",
      },
      {
        kind: "options",
        id: "hotspot",
        title: "这两条最匹配的热点，你想参考哪一条？",
        options: [
          {
            key: "hot1",
            label: `参考热点一 · ${ctx.subject} · 生活流实拍`,
            desc: "hot_score 1,734,531｜日常质感 + 细节特写，亲和力强",
          },
          {
            key: "hot2",
            label: `参考热点二 · ${ctx.subject} · 被打断的意外`,
            desc: "hot_score 423,665｜冲突设计清晰，反转笑点集中",
          },
          {
            key: "both",
            label: "两条都参考，由我来融合",
            desc: "取热点一的质感 + 热点二的冲突结构",
          },
        ],
      },
    ],
  }),

  // 2b. 创意方向卡
  (ctx) => ({
    id: "direction",
    blocks: [
      {
        kind: "text",
        text: `已按「${ctx.hotspot ?? "热点参考"}」收敛。现在从搜索结果中筛选出三条创意方向，第一条是我基于叙事结构自主推荐的，后两条来自搜索热点中最匹配的内容。`,
      },
      {
        kind: "options",
        id: "direction",
        title: `${ctx.subject}视频创意方向，你想走哪条路线？`,
        options: DIRECTIONS.map((d) => ({ ...d, label: label(d, ctx.subject) })),
      },
    ],
  }),


  // 3. 叙事支线卡
  (ctx) => ({
    id: "branch",
    blocks: [
      {
        kind: "text",
        text: `你选了「${ctx.direction}」。方向已经清晰，接下来我基于这个创意展开三个差异化叙事视角的分叉。`,
      },
      {
        kind: "text",
        text: "同一个核心事件，从不同的情感走向和叙事视角可以拉出三条支线：治愈成长向、搞笑反差向、冒险奇幻向。",
      },
      {
        kind: "options",
        id: "branch",
        title: `「${ctx.direction}」的三条叙事支线，你想走哪条？`,
        options: BRANCHES,
      },
    ],
  }),

  // 4. 撰写创作规划 plan.md
  (ctx) => ({
    id: "plan-doc",
    blocks: [
      { kind: "text", text: `方向已确认：${ctx.branch}。正在撰写创作规划。` },
      { kind: "tool", label: "执行命令", detail: "检查 assets 目录状态" },
      { kind: "tool", label: "执行命令", detail: "创建项目目录" },
      { kind: "tool", label: "写入文件", detail: "plan.md（故事线、镜头、旁白台词、风格）" },
      { kind: "text", text: "规划已完成，先看一下方案再确认。" },
      { kind: "tool", label: "发送产物" },
      { kind: "artifact", name: "plan.md", path: projectPath(ctx, "plan.md") },
      {
        kind: "options",
        id: "plan-confirm",
        title: "规划是否符合你的预期？",
        options: [
          { key: "ok", label: "符合预期，继续", desc: "进入视频生成阶段" },
          { key: "edit", label: "我要调整创意方案", desc: "回到方向/支线重新选择" },
        ],
      },
    ],
  }),

  // 5. 退出规划模式 + 闸门链
  (ctx) => {
    const scenes = branchScenes(ctx.subject, branchKey(ctx.branch));
    const plan = planShots(scenes, ctx.duration);
    ctx.plan = plan;
    const credits = estimateCredits(ctx.duration);
    return {
      id: "gates",
      blocks: [
        { kind: "mode", mode: "exit", label: "退出规划模式" },
        { kind: "skill", name: "视频生成" },
        { kind: "tool", label: "读取文件", detail: "读取多段流程工作流文件" },
        { kind: "taskplan", label: "任务规划" },
        { kind: "text", text: `先校验 plan.md 中旁白台词的耗时是否在 ${ctx.duration} 秒内。` },
        { kind: "tool", label: "执行命令", detail: "校验 plan.md 旁白台词耗时" },
        {
          kind: "gate",
          title: "闸门判定",
          rows: [
            {
              label: "台词耗时",
              value: `下限 ${plan.narrationMin}s / 上限 ${plan.narrationMax}s，在 ${ctx.duration}s 内`,
              ok: plan.narrationMin < ctx.duration,
            },
            {
              label: "时长判定",
              value: `总时长 ${ctx.duration}s，单次生成上限 ${SINGLE_SHOT_LIMIT}s → ${
                plan.needSplit ? "需分段制作" : "可一次生成"
              }，N=ceil(${ctx.duration}/${SINGLE_SHOT_LIMIT})=${plan.maxShots}`,
              ok: true,
            },
            { label: "积分闸门", value: `需要 ${credits}，当前 594 → 充足`, ok: credits <= 594 },
          ],
        },
      ],
    };
  },

  // 6. 素材锚定
  (ctx) => ({
    id: "assets",
    blocks: [
      { kind: "text", text: "积分充足。接下来加载参考图设计指导，生成风格锚点图、角色参考图和音色锚定。" },
      { kind: "tool", label: "资料探索", detail: "读取 3 个文件" },
      {
        kind: "text",
        text: "风格确认：3D 皮克斯风（plan.md 中「3D 卡通渲染写实风格，色彩明亮温暖」最匹配），预置锚定图可用。",
      },
      { kind: "tool", label: "执行命令", detail: "复制预置风格锚定图" },
      { kind: "text", text: "风格锚定图已就位。接下来并行生成角色参考图和旁白音色锚定音频。" },
      { kind: "tool", label: "图片生成", detail: "完成 2 项生成任务" },
      { kind: "media", mediaType: "image", title: "角色参考图（正面 / 侧面 / 背面四视图）", subtitle: "character-ref.png" },
      { kind: "media", mediaType: "image", title: "场景参考图（空镜）", subtitle: "scene-ref.png" },
      { kind: "media", mediaType: "audio", title: "旁白音色锚定", subtitle: "voice-anchor.wav · 0:06" },
      { kind: "tool", label: "资料探索", detail: "读取 2 个文件（复核参考图质量）" },
      {
        kind: "text",
        text: "角色参考图四视图齐全，形象完整；场景图为纯空镜，两张参考图风格一致，质量通过。现在把素材路径写回 plan.md。",
      },
      { kind: "tool", label: "编辑文件", detail: "在 plan.md 末尾追加素材清单" },
      { kind: "taskplan", label: "任务规划" },
      {
        kind: "text",
        text: "参考素材已全部生成并写回 plan.md：角色四视图、场景图、旁白音色锚定音频。plan.md 在创意阶段已确认过，这里只确认素材。",
      },
      {
        kind: "options",
        id: "asset-confirm",
        title: "参考素材是否符合预期？",
        options: [
          { key: "ok", label: "素材没问题，继续分镜", desc: "进入分镜规划" },
          { key: "regen", label: "重新生成参考素材", desc: "换一版角色/场景锚定图" },
        ],
      },
    ],
  }),

  // 7. 分镜规划 + 机械验算 + 自审
  (ctx) => {
    const plan = ctx.plan!;
    const shots = plan.shots;
    return {
      id: "storyboard",
      blocks: [
        { kind: "taskplan", label: "分镜规划" },
        { kind: "tool", label: "读取文件", detail: "读取创意脚本以提取风格、角色、台词等信息" },
        { kind: "tool", label: "执行命令", detail: "逐句计量台词字数和耗时" },
        { kind: "tool", label: "执行命令", detail: "对长旁白进行补算（含省略号尾部）" },
        { kind: "tool", label: "资料探索", detail: "读取 5 个文件（获取已有素材清单与 ref 规范）" },
        {
          kind: "reasoning",
          title: "分段推演",
          sections: [
            {
              title: "逐句耗时汇总（计量点①）",
              lines: plan.timings.map(
                (t) => `旁白${t.index}：「${t.text}」${t.chars}字 [${t.min}s ~ ${t.max}s]`
              ),
            },
            {
              title: "分段闸门",
              lines: [
                `总时长 ${ctx.duration}s，单段上限 L=${SINGLE_SHOT_LIMIT}s，最大调用次数 N=ceil(${ctx.duration}/${SINGLE_SHOT_LIMIT})=${plan.maxShots}`,
                ...(plan.rejected ? [`否决：${plan.rejected.label} —— ${plan.rejected.reason}`] : []),
                `最终方案：${shots.map((s) => s.seconds).join("+")}=${plan.totalSeconds}s，共 ${shots.length} 段 ≤ N=${plan.maxShots} ✓`,
              ],
            },
            {
              title: "衔接序列与导演方案",
              lines: [
                `衔接序列：${shots.map((s) => s.link).join("、")}（禁止连续 ⇐，跨段处以环境锚点补写 Prompt 开头）`,
                "节奏：蓄 → 蓄 → 爆→收，主运镜相邻不重复（跟拍 → 缓推 → 快切急推）",
                "景别随情绪收紧：中景 → 面部特写 → 快切近景后释放回中景定格",
              ],
            },
          ],
          table: {
            head: ["段号", "计划时长", "台词耗时下限", "下限+0.5s > 计划时长？", "任一段 > L？"],
            rows: shots.map((s) => [
              s.id,
              `${s.seconds}s`,
              `${s.narrationMin}s`,
              `${(s.narrationMin + 0.5).toFixed(1)} > ${s.seconds}? ${s.densityOk ? "否 ✓" : "是 ✗"}`,
              `${s.seconds} ≤ ${SINGLE_SHOT_LIMIT} ✓`,
            ]),
          },
        },
        { kind: "tool", label: "写入文件", detail: "写入完整 storyboard.md（总览表 + 通用尾注 + 导演方案 + 各段 shot）" },
        { kind: "tool", label: "执行命令", detail: "运行分镜机械验算脚本", state: "error" },
        {
          kind: "audit",
          errors: [
            `${shots.find((s) => s.dependsOn)?.id ?? "shot_02"} 标了 ${
              shots.find((s) => s.dependsOn)?.link ?? "⇐01"
            } 但 ImageList 缺少 shot_01_lastframe.png`,
          ],
          warns: shots.filter((s) => s.warn).map((s) => s.warn!),
          checks: [],
        },
        { kind: "tool", label: "批量编辑", detail: "修正衔接段的 ImageList 与 Prompt 开头引用 @图片1" },
        { kind: "tool", label: "执行命令", detail: "复跑机械验算确认修正归零" },
        {
          kind: "audit",
          errors: [],
          warns: shots.filter((s) => s.warn).map((s) => s.warn!),
          checks: [
            "用户输入冲突检查：镜头内容、主体、动作链、顺序完整保留，台词逐字保留",
            "plan.md 承接检查：角色特征、场景、旁白台词、动作描写均对应落地",
            "素材映射：独立段引用角色图 + 场景图 + 风格锚点 + 音色音频；衔接段引用前段尾帧",
            `账本约束：总时长 ${plan.totalSeconds}s，比例 ${ctx.ratio}，风格一致，无字幕/BGM 额外要求`,
          ],
        },
        { kind: "text", text: "ERROR 已归零，WARN 为台词密度提示且均有 plan.md 依据，自审通过。接下来推送分镜给你确认。" },
        { kind: "tool", label: "发送产物" },
        { kind: "artifact", name: "storyboard.md", path: projectPath(ctx, "storyboard.md") },
        {
          kind: "storyboard",
          total: plan.totalSeconds,
          rows: shots.map((s) => ({
            id: s.id,
            seconds: s.seconds,
            link: s.link,
            assets: s.dependsOn ? `${s.dependsOn}_lastframe.png + 音色` : "角色图 + 场景图 + 风格锚点 + 音色",
            summary: s.scenes.map((sc) => sc.title).join(" + "),
          })),
        },
        { kind: "taskplan", label: "任务规划" },
        {
          kind: "text",
          text: `分镜已推送。${shots.length} 段视频总计 ${plan.totalSeconds} 秒，其中 ${
            shots.find((s) => s.dependsOn)?.id ?? "无段"
          } 需要衔接前一段的尾帧画面。接下来请确认生成策略：`,
        },
        { kind: "options", id: "strategy", title: "选择视频生成策略", options: STRATEGIES },
      ],
    };
  },

  // 8. 分轮生成
  (ctx) => {
    const plan = ctx.plan!;
    const rounds = planRounds(plan.shots);
    const independent = rounds[0];
    const dependent = rounds[1] ?? [];
    const blocks: Block[] = [
      { kind: "taskplan", label: "任务规划" },
      {
        kind: "text",
        text:
          ctx.strategy === "串行生成"
            ? "串行策略确认。按段顺序逐段生成，每段完成后再进入下一段。"
            : `并行策略确认。storyboard 中有 ${
                dependent[0]?.link ?? "⇐"
              } 标记（存在尾帧依赖），所以分两轮：先生成 ${independent
                .map((s) => s.id)
                .join(" 和 ")}，再截取尾帧生成 ${dependent.map((s) => s.id).join("、") || "剩余段"}。`,
      },
      { kind: "text", text: "先读取通用尾注和各段 Prompt 准备生成。通用尾注已确认，开始生成。" },
      { kind: "tool", label: "视频生成", detail: `完成 ${independent.length} 项生成任务` },
      ...independent.map(
        (s): Block => ({
          kind: "media",
          mediaType: "video",
          title: `${s.id} · ${s.scenes.map((sc) => sc.title).join(" + ")}`,
          duration: formatDuration(s.seconds),
        })
      ),
    ];

    if (dependent.length) {
      blocks.push(
        { kind: "text", text: "独立段已生成。现在截取前段尾帧，用于衔接段的参考。" },
        { kind: "tool", label: "执行命令", detail: "ffmpeg -sseof 截取尾帧画面", state: "error" },
        { kind: "text", text: "尾帧截取输出为空，可能是 -sseof 参数在这个版本 ffmpeg 的兼容性问题。换个方式截取。" },
        { kind: "tool", label: "执行命令", detail: "改用 -ss 方式截取尾帧" },
        { kind: "text", text: "尾帧截取成功。现在用尾帧参考生成衔接段。" },
        ...dependent.flatMap((s): Block[] => [
          {
            kind: "tool",
            label: "生成视频",
            detail: `@图片1 作为该次视频前的画面状态（承接 ${s.dependsOn} 尾帧，角色位置、光线、道具状态保持一致）…`,
          },
          {
            kind: "media",
            mediaType: "video",
            title: `${s.id} · ${s.scenes.map((sc) => sc.title).join(" + ")}`,
            duration: formatDuration(s.seconds),
          },
        ])
      );
    }

    blocks.push({ kind: "text", text: "全部分段视频生成完成。接下来拼接合成最终成片。" });
    return { id: "generate", blocks };
  },

  // 9. 拼接成片
  (ctx) => {
    const plan = ctx.plan!;
    return {
      id: "final",
      blocks: [
        { kind: "taskplan", label: "任务规划" },
        { kind: "tool", label: "生成合成视频", detail: `拼接 ${plan.shots.length} 段，输出 ${ctx.ratio}` },
        {
          kind: "media",
          mediaType: "video",
          title: "最终成片",
          duration: formatDuration(plan.totalSeconds),
        },
        { kind: "tool", label: "读取文件", detail: "查看最终成片信息" },
        {
          kind: "finalcut",
          duration: `${plan.totalSeconds} 秒`,
          segments: plan.shots.map(
            (s) =>
              `第${s.order}段（${s.seconds}秒）：${s.scenes.map((sc) => sc.visual).join("；")}，旁白「${s.scenes
                .map((sc) => sc.narration)
                .join(" ")}」`
          ),
          suggestions: [
            "修改某个镜头重新生成（比如调整表情或动作细节）",
            "调整整体风格或氛围重新制作",
            "基于这个故事继续做续集",
          ],
        },
      ],
    };
  },
];

function branchKey(branchLabel?: string) {
  const found = BRANCHES.find((b) => b.label === branchLabel);
  return found?.key ?? "funny";
}

export function totalStages() {
  return STAGES.length;
}
