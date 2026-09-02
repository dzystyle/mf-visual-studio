// 纯计算层：台词耗时计量 / 分段闸门 / 密度预检 / 衔接序列
// 供 Creative Assistant 的智能 Agent 流程调用（与 UI 解耦，可单测）

export const SINGLE_SHOT_LIMIT = 15; // 单次生成上限（秒）
const SEC_PER_CHAR_MIN = 0.29;
const SEC_PER_CHAR_MAX = 0.36;

export type Scene = {
  index: number;
  title: string;
  /** 旁白台词 */
  narration: string;
  /** 与旁白不并行的独立动作时长（秒） */
  actionSeconds: number;
  /** 创意方案里给该镜头分配的时长 */
  planSeconds: number;
  /** 画面描述 */
  visual: string;
};

export type LineTiming = {
  index: number;
  text: string;
  chars: number;
  min: number;
  max: number;
};

export type Shot = {
  id: string; // shot_01
  order: number;
  scenes: Scene[];
  seconds: number;
  /** 台词耗时下限 */
  narrationMin: number;
  /** 衔接标记：'-' 独立段，'⇐01' 依赖前段尾帧 */
  link: string;
  dependsOn?: string;
  /** 密度预检是否通过 */
  densityOk: boolean;
  /** 台词密度 WARN 说明 */
  warn?: string;
};

export type PlanResult = {
  timings: LineTiming[];
  narrationMin: number;
  narrationMax: number;
  needSplit: boolean;
  maxShots: number;
  shots: Shot[];
  totalSeconds: number;
  rejected?: { label: string; reason: string };
};

/** 统计中文台词字数（忽略标点与空白） */
export function countChars(text: string): number {
  return (text.match(/[\u4e00-\u9fa5a-zA-Z0-9]/g) || []).length;
}

export function measureLine(text: string, index: number): LineTiming {
  const chars = countChars(text);
  return {
    index,
    text,
    chars,
    min: Number((chars * SEC_PER_CHAR_MIN).toFixed(1)),
    max: Number((chars * SEC_PER_CHAR_MAX).toFixed(1)),
  };
}

/** 解析用户需求里的时长（秒） */
export function parseDuration(prompt: string, fallback = 30): number {
  const m =
    prompt.match(/(\d{1,3})\s*秒/) ||
    prompt.match(/时长\s*[:：]?\s*(\d{1,3})/) ||
    prompt.match(/(\d{1,3})s\b/i);
  if (m) {
    const v = parseInt(m[1], 10);
    if (v >= 3 && v <= 300) return v;
  }
  return fallback;
}

/** 解析主题（去掉「帮我生成一个…的视频」这类壳） */
export function parseSubject(prompt: string): string {
  const cleaned = prompt
    .replace(/时长\s*[:：]?\s*\d{1,3}\s*秒?/g, "")
    .replace(/(帮我|请|麻烦)?(生成|制作|做|创作)一?[个条支段]?/g, "")
    .replace(/的?视频/g, "")
    .replace(/\d{1,3}\s*秒/g, "")
    .replace(/[，。,.\s]+$/g, "")
    .trim();
  return cleaned || prompt.trim().slice(0, 12) || "创意短片";
}

function sum(list: number[]) {
  return list.reduce((a, b) => a + b, 0);
}

/**
 * 分段：把创意方案的镜头按「单段 ≤ 15s」合并成 shot，
 * 并把总时长对齐到用户硬约束。
 */
export function planShots(scenes: Scene[], totalSeconds: number): PlanResult {
  const timings = scenes.map((s, i) => measureLine(s.narration, i + 1));
  const narrationMin = Number(sum(timings.map((t) => t.min)).toFixed(1));
  const narrationMax = Number(sum(timings.map((t) => t.max)).toFixed(1));
  const needSplit = totalSeconds > SINGLE_SHOT_LIMIT;
  const maxShots = Math.max(1, Math.ceil(totalSeconds / SINGLE_SHOT_LIMIT));

  // 每个镜头的真实需求时长 = 台词下限 + 独立动作 + 收束 0.5s
  const demand = scenes.map((s, i) => Number((timings[i].min + s.actionSeconds + 0.5).toFixed(1)));

  // 贪心合并：相邻镜头在不超过 15s 的前提下合并
  const groups: Scene[][] = [];
  let current: Scene[] = [];
  let currentDemand = 0;
  scenes.forEach((scene, i) => {
    const next = currentDemand + demand[i];
    if (current.length > 0 && next > SINGLE_SHOT_LIMIT) {
      groups.push(current);
      current = [scene];
      currentDemand = demand[i];
    } else {
      current.push(scene);
      currentDemand = next;
    }
  });
  if (current.length) groups.push(current);

  // 记录被否决的更细方案（段数超过上限时的说明）
  let rejected: PlanResult["rejected"];
  if (scenes.length > maxShots && groups.length < scenes.length) {
    rejected = {
      label: `${scenes.length} 段方案（每个镜头独立成段）`,
      reason: `段数 ${scenes.length} > 上限 N=${maxShots}，需要把可合并的相邻镜头并段`,
    };
  }

  // 按 plan 分配的比重把总时长分摊到各段，并保证单段 ≤ 15s
  const weights = groups.map((g) => sum(g.map((s) => s.planSeconds)) || 1);
  const weightTotal = sum(weights);
  let allocated = groups.map((_, i) => Math.round((totalSeconds * weights[i]) / weightTotal));
  // 裁剪超限，并把差额补给还有余量的段
  const clamp = () => {
    allocated = allocated.map((v) => Math.min(SINGLE_SHOT_LIMIT, Math.max(3, v)));
    let diff = totalSeconds - sum(allocated);
    let guard = 0;
    while (diff !== 0 && guard < 200) {
      guard += 1;
      for (let i = 0; i < allocated.length && diff !== 0; i += 1) {
        if (diff > 0 && allocated[i] < SINGLE_SHOT_LIMIT) {
          allocated[i] += 1;
          diff -= 1;
        } else if (diff < 0 && allocated[i] > Math.ceil(demand[0])) {
          allocated[i] -= 1;
          diff += 1;
        }
      }
      if (diff > 0 && allocated.every((v) => v >= SINGLE_SHOT_LIMIT)) break;
      if (diff < 0 && allocated.every((v) => v <= 3)) break;
    }
  };
  clamp();

  const shots: Shot[] = groups.map((group, i) => {
    const id = `shot_${String(i + 1).padStart(2, "0")}`;
    const groupNarrationMin = Number(
      sum(group.map((s) => measureLine(s.narration, 0).min)).toFixed(1)
    );
    const seconds = allocated[i];
    const densityOk = groupNarrationMin + 0.5 <= seconds;
    // 衔接：同场景且不与上一段连续标记时，依赖前段尾帧
    const prevLinked = i > 0 && groups[i - 1] && i - 1 > 0;
    const link = i > 0 && !prevLinked ? `⇐${String(i).padStart(2, "0")}` : "—";
    return {
      id,
      order: i + 1,
      scenes: group,
      seconds,
      narrationMin: groupNarrationMin,
      link,
      dependsOn: link === "—" ? undefined : `shot_${String(i).padStart(2, "0")}`,
      densityOk,
      warn: densityOk
        ? seconds - groupNarrationMin > 5
          ? `${id}（${seconds}s 超台词耗时 ${(seconds - groupNarrationMin).toFixed(1)}s）：段内含 plan.md 指定的独立动作/运镜事件，保留合理`
          : undefined
        : `${id} 台词密度超载，需要延长段时长`,
    };
  });

  return {
    timings,
    narrationMin,
    narrationMax,
    needSplit,
    maxShots,
    shots,
    totalSeconds: sum(shots.map((s) => s.seconds)),
    rejected,
  };
}

/** 按 ⇐ 依赖把 shots 拆成并行生成的轮次 */
export function planRounds(shots: Shot[]): Shot[][] {
  const first = shots.filter((s) => !s.dependsOn);
  const rest = shots.filter((s) => s.dependsOn);
  return rest.length ? [first, rest] : [first];
}

/** 积分预估：按秒计价 */
export function estimateCredits(totalSeconds: number): number {
  return Math.round(totalSeconds * 4);
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
