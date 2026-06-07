import { Fragment, type CSSProperties, type ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const VIDEO_FPS = 30;
const SCENE_HOLD_IN_FRAMES = VIDEO_FPS * 2;
const SCENE_FADE_OUT_IN_FRAMES = 28;

const COLORS = {
  background: "#0B1020",
  backgroundSoft: "#111827",
  panel: "rgba(15, 23, 42, 0.74)",
  panelStrong: "rgba(15, 23, 42, 0.92)",
  stroke: "rgba(148, 163, 184, 0.24)",
  text: "#F8FAFC",
  muted: "#94A3B8",
  low: "#22C55E",
  medium: "#FACC15",
  high: "#F97316",
  danger: "#EF4444",
  blue: "#38BDF8",
  violet: "#A78BFA",
};

const FONT =
  '"Noto Sans CJK SC", "Noto Sans SC", "Source Han Sans SC", "Microsoft YaHei", "PingFang SC", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const sceneDuration = (animationEndFrame: number) => {
  return animationEndFrame + SCENE_HOLD_IN_FRAMES + SCENE_FADE_OUT_IN_FRAMES;
};

const buildTimeline = <T extends Record<string, number>>(animationEnds: T) => {
  let from = 0;
  const scenes = {} as { [K in keyof T]: { from: number; duration: number } };

  (Object.keys(animationEnds) as Array<keyof T>).forEach((key) => {
    const duration = sceneDuration(animationEnds[key]);
    scenes[key] = { from, duration };
    from += duration;
  });

  return {
    scenes,
    durationInFrames: from,
  };
};

const timeline = buildTimeline({
  title: 138,
  metrics: 52,
  risk: 100,
  industry: 99,
  roles: 78,
  adoption: 128,
  level: 110,
  heatmap: 158,
  protection: 84,
  model: 78,
  importance: 184,
  cluster: 74,
  recommendation: 190,
  closing: 132,
});

const SCENES = timeline.scenes;
export const VIDEO_DURATION_IN_FRAMES = timeline.durationInFrames;

type BarDatum = {
  label: string;
  value: number;
  detail?: string;
  color?: string;
};

type MetricDatum = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  detail?: string;
  color?: string;
};

const riskDistribution = [
  { label: "Low", value: 33, color: COLORS.low },
  { label: "Medium", value: 33, color: COLORS.medium },
  { label: "High", value: 34, color: COLORS.high },
];

const industryRisk: BarDatum[] = [
  { label: "Manufacturing", value: 48.2, detail: "制造业", color: COLORS.danger },
  { label: "Logistics", value: 41.5, detail: "物流", color: COLORS.high },
  { label: "Retail", value: 40.7, detail: "零售", color: COLORS.high },
  { label: "Finance", value: 37.7, detail: "金融" },
  { label: "Telecom", value: 35.2, detail: "电信" },
  { label: "IT", value: 28, detail: "信息技术" },
  { label: "Healthcare", value: 20.8, detail: "医疗健康", color: COLORS.low },
  { label: "Education", value: 20.1, detail: "教育", color: COLORS.low },
];

const roleRisk: BarDatum[] = [
  { label: "Operator", value: 50.2, detail: "操作员", color: COLORS.danger },
  {
    label: "Production Supervisor",
    value: 48.3,
    detail: "生产主管",
    color: COLORS.high,
  },
  {
    label: "Quality Engineer",
    value: 46,
    detail: "质量工程师",
    color: COLORS.high,
  },
  {
    label: "Inventory Analyst",
    value: 44.6,
    detail: "库存分析师",
    color: COLORS.high,
  },
  { label: "Dispatcher", value: 42.1, detail: "调度员", color: COLORS.high },
];

const adoptionRisk: MetricDatum[] = [
  { label: "Low", value: 9.2, suffix: "%", decimals: 1, color: COLORS.low },
  { label: "Medium", value: 58.2, suffix: "%", decimals: 1, color: COLORS.medium },
  { label: "High", value: 80.8, suffix: "%", decimals: 1, color: COLORS.danger },
];

const levelRisk: MetricDatum[] = [
  { label: "Entry", value: 44.5, suffix: "%", decimals: 1, color: COLORS.high },
  { label: "Mid", value: 30.7, suffix: "%", decimals: 1, color: COLORS.blue },
  { label: "Senior", value: 11.5, suffix: "%", decimals: 1, color: COLORS.low },
];

const featureImportance: BarDatum[] = [
  { label: "Routine_Task_Percentage", value: 0.225, detail: "重复性任务比例" },
  { label: "Tasks_Automated_Percentage", value: 0.201, detail: "任务自动化比例" },
  { label: "Job_Level_Score", value: 0.18, detail: "岗位级别分数" },
  { label: "Industry", value: 0.128, detail: "行业" },
  { label: "Education_Score", value: 0.102, detail: "教育水平分数" },
  {
    label: "Human_Creative_Protection_Index",
    value: 0.083,
    detail: "人类能力保护指数",
  },
];

const shapImportance: BarDatum[] = [
  { label: "Routine_Task_Percentage", value: 2.314, detail: "SHAP 重要性" },
  { label: "Tasks_Automated_Percentage", value: 2.191, detail: "SHAP 重要性" },
  { label: "Job_Level_Score", value: 1.666, detail: "SHAP 重要性" },
  {
    label: "Human_Creative_Protection_Index",
    value: 1.502,
    detail: "SHAP 重要性",
  },
  { label: "Education_Score", value: 0.992, detail: "SHAP 重要性" },
];

const heatmapRows = ["0-25", "26-50", "51-75", "76-100"];
const heatmapColumns = ["0-25", "26-50", "51-75", "76-100"];
const heatmapValues: Array<Array<number | null>> = [
  [0, null, null, null],
  [null, 9.3, null, null],
  [null, 37.5, 66.2, null],
  [null, 72.1, 85.5, 94.9],
];

const backgroundNodes = Array.from({ length: 86 }, (_, index) => ({
  x: (index * 151 + 73) % 1280,
  y: (index * 89 + 41) % 720,
  size: 2 + (index % 4),
  delay: index % 31,
}));

const titleNodes = Array.from({ length: 120 }, (_, index) => {
  const column = index % 24;
  const row = Math.floor(index / 24);
  return {
    x: 190 + column * 38,
    y: 118 + row * 34,
    dx: ((index * 47) % 640) - 320,
    dy: ((index * 83) % 360) - 180,
    size: 3 + (index % 5),
  };
});

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const ease = (frame: number, start: number, end: number) => {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

const fadeForScene = (frame: number, duration: number) => {
  const fadeIn = ease(frame, 0, 24);
  const fadeOut = interpolate(
    frame,
    [duration - SCENE_FADE_OUT_IN_FRAMES, duration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.7, 0, 0.84, 0),
    },
  );
  return Math.min(fadeIn, fadeOut);
};

const countValue = (
  frame: number,
  value: number,
  start: number,
  duration: number,
) => {
  return interpolate(frame, [start, start + duration], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

const formatNumber = (value: number, decimals = 0) => {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  return String(Math.round(value));
};

const panelStyle = (extra?: CSSProperties): CSSProperties => ({
  background: COLORS.panel,
  border: `1px solid ${COLORS.stroke}`,
  borderRadius: 8,
  boxShadow: "0 22px 80px rgba(0, 0, 0, 0.34)",
  ...extra,
});

const sectionLabelStyle = (color = COLORS.blue): CSSProperties => ({
  color,
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: 0,
  textTransform: "uppercase",
});

const Background = () => {
  const frame = useCurrentFrame();
  const gridOffset = (frame * 0.35) % 48;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 22%, rgba(56, 189, 248, 0.18), transparent 26%), radial-gradient(circle at 78% 18%, rgba(249, 115, 22, 0.16), transparent 24%), linear-gradient(135deg, #0B1020 0%, #111827 58%, #050816 100%)",
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.38,
          backgroundImage:
            "linear-gradient(rgba(148, 163, 184, 0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.11) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: `translate(${-gridOffset}px, ${-gridOffset}px)`,
        }}
      />
      <AbsoluteFill>
        {backgroundNodes.map((node, index) => {
          const pulse = 0.42 + 0.58 * Math.sin((frame + node.delay) / 18);
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: node.x,
                top: node.y,
                width: node.size,
                height: node.size,
                borderRadius: 999,
                background:
                  index % 5 === 0
                    ? COLORS.high
                    : index % 3 === 0
                      ? COLORS.low
                      : COLORS.blue,
                opacity: 0.13 + pulse * 0.24,
                transform: `scale(${0.75 + pulse * 0.55})`,
              }}
            />
          );
        })}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 128,
          background:
            "linear-gradient(0deg, rgba(5, 8, 22, 0.86), rgba(5, 8, 22, 0))",
        }}
      />
    </AbsoluteFill>
  );
};

const SceneShell = ({
  label,
  title,
  subtitle,
  duration,
  children,
  accent = COLORS.blue,
}: {
  label: string;
  title: string;
  subtitle?: string;
  duration: number;
  children: ReactNode;
  accent?: string;
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeForScene(frame, duration);
  const y = interpolate(frame, [0, 28], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        color: COLORS.text,
        fontFamily: FONT,
        padding: "54px 70px 48px",
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
        <div
          style={{
            width: 6,
            height: 76,
            borderRadius: 999,
            background: accent,
            boxShadow: `0 0 34px ${accent}`,
          }}
        />
        <div>
          <div style={sectionLabelStyle(accent)}>{label}</div>
          <div
            style={{
              fontSize: 42,
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: 0,
              marginTop: 6,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                color: COLORS.muted,
                fontSize: 18,
                lineHeight: 1.5,
                marginTop: 8,
                maxWidth: 980,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ marginTop: 34 }}>{children}</div>
    </AbsoluteFill>
  );
};

const AnimatedNumber = ({
  value,
  suffix = "",
  decimals = 0,
  start = 0,
  duration = 36,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  start?: number;
  duration?: number;
}) => {
  const frame = useCurrentFrame();
  const current = countValue(frame, value, start, duration);

  return (
    <>
      {formatNumber(current, decimals)}
      {suffix}
    </>
  );
};

const MetricCard = ({
  label,
  value,
  suffix,
  decimals,
  detail,
  color = COLORS.blue,
  delay = 0,
}: MetricDatum & { delay?: number }) => {
  const frame = useCurrentFrame();
  const progress = ease(frame, delay, delay + 28);
  const y = interpolate(progress, [0, 1], [24, 0]);

  return (
    <div
      style={panelStyle({
        width: 250,
        minHeight: 152,
        padding: "24px 24px 20px",
        opacity: progress,
        transform: `translateY(${y}px)`,
      })}
    >
      <div
        style={{
          color: COLORS.muted,
          fontSize: 18,
          fontWeight: 700,
          lineHeight: 1.25,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color,
          fontSize: 50,
          fontWeight: 900,
          lineHeight: 1,
          marginTop: 16,
        }}
      >
        <AnimatedNumber
          value={value}
          suffix={suffix}
          decimals={decimals}
          start={delay}
        />
      </div>
      {detail ? (
        <div
          style={{
            color: COLORS.muted,
            fontSize: 15,
            lineHeight: 1.35,
            marginTop: 12,
          }}
        >
          {detail}
        </div>
      ) : null}
    </div>
  );
};

const RankedBarChart = ({
  data,
  maxValue,
  valueSuffix = "%",
  decimals = 1,
  delay = 8,
  rowHeight = 50,
  labelWidth = 270,
}: {
  data: BarDatum[];
  maxValue?: number;
  valueSuffix?: string;
  decimals?: number;
  delay?: number;
  rowHeight?: number;
  labelWidth?: number;
}) => {
  const frame = useCurrentFrame();
  const max = maxValue || Math.max.apply(
    null,
    data.map((item) => item.value),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((item, index) => {
        const rowProgress = ease(frame, delay + index * 7, delay + index * 7 + 28);
        const valueProgress = ease(
          frame,
          delay + index * 7 + 8,
          delay + index * 7 + 42,
        );
        const color = item.color || COLORS.blue;
        const width = clamp((item.value / max) * 100 * valueProgress, 0, 100);

        return (
          <div
            key={item.label}
            style={{
              display: "grid",
              gridTemplateColumns: `${labelWidth}px 1fr 92px`,
              alignItems: "center",
              gap: 16,
              minHeight: rowHeight,
              opacity: rowProgress,
              transform: `translateX(${interpolate(rowProgress, [0, 1], [-26, 0])}px)`,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: COLORS.text,
                }}
              >
                {item.label}
              </div>
              {item.detail ? (
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    color: COLORS.muted,
                    fontWeight: 700,
                  }}
                >
                  {item.detail}
                </div>
              ) : null}
            </div>
            <div
              style={{
                height: 20,
                background: "rgba(148, 163, 184, 0.14)",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${width}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${color}, ${COLORS.blue})`,
                  borderRadius: 6,
                  boxShadow: `0 0 28px ${color}`,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color,
                textAlign: "right",
              }}
            >
              {formatNumber(item.value * valueProgress, decimals)}
              {valueSuffix}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const VerticalRiskBars = ({
  data,
  delay = 0,
}: {
  data: MetricDatum[];
  delay?: number;
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${data.length}, 1fr)`,
        gap: 22,
        alignItems: "end",
        height: 386,
      }}
    >
      {data.map((item, index) => {
        const progress = ease(frame, delay + index * 12, delay + index * 12 + 46);
        const barHeight = interpolate(progress, [0, 1], [0, item.value * 3.25]);

        return (
          <div
            key={item.label}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                color: item.color,
                fontSize: 42,
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {formatNumber(item.value * progress, item.decimals)}
              {item.suffix}
            </div>
            <div
              style={{
                width: 132,
                height: 300,
                borderRadius: 8,
                background: "rgba(148, 163, 184, 0.12)",
                border: `1px solid ${COLORS.stroke}`,
                display: "flex",
                alignItems: "flex-end",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: barHeight,
                  background: `linear-gradient(0deg, ${item.color}, rgba(248, 250, 252, 0.8))`,
                  boxShadow: `0 0 34px ${item.color}`,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: COLORS.text,
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const InsightPill = ({
  children,
  color = COLORS.blue,
}: {
  children: ReactNode;
  color?: string;
}) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        border: `1px solid ${color}`,
        color: COLORS.text,
        borderRadius: 8,
        padding: "12px 16px",
        background: "rgba(15, 23, 42, 0.72)",
        boxShadow: `0 0 28px rgba(56, 189, 248, 0.14)`,
        fontSize: 18,
        fontWeight: 800,
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 16px ${color}`,
        }}
      />
      {children}
    </div>
  );
};

const TitleScene = () => {
  const frame = useCurrentFrame();
  const dotProgress = ease(frame, 0, 72);
  const titleProgress = ease(frame, 28, 86);
  const legendProgress = ease(frame, 78, 122);

  return (
    <AbsoluteFill
      style={{
        opacity: fadeForScene(frame, SCENES.title.duration),
        color: COLORS.text,
        fontFamily: FONT,
        padding: "72px 78px",
      }}
    >
      <AbsoluteFill>
        {titleNodes.map((node, index) => {
          const x = node.x + node.dx * (1 - dotProgress);
          const y = node.y + node.dy * (1 - dotProgress);
          const color =
            index % 7 === 0
              ? COLORS.danger
              : index % 4 === 0
                ? COLORS.medium
                : index % 3 === 0
                  ? COLORS.low
                  : COLORS.blue;
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: node.size,
                height: node.size,
                borderRadius: 999,
                background: color,
                opacity: 0.18 + dotProgress * 0.48,
                transform: `scale(${0.55 + dotProgress * 1.25})`,
                boxShadow: `0 0 ${10 + dotProgress * 20}px ${color}`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          left: 78,
          top: 112,
          width: 760,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [28, 0])}px)`,
        }}
      >
        <div style={sectionLabelStyle(COLORS.high)}>AI IMPACT ANALYSIS</div>
        <div
          style={{
            marginTop: 16,
            fontSize: 68,
            lineHeight: 1.02,
            fontWeight: 950,
            letterSpacing: 0,
          }}
        >
          AI 对岗位与裁员风险的影响
        </div>
        <div
          style={{
            color: COLORS.muted,
            fontSize: 24,
            lineHeight: 1.45,
            marginTop: 26,
            maxWidth: 720,
          }}
        >
          关键不是是否使用 AI，而是岗位任务结构是否容易被自动化。
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 78,
          top: 122,
          width: 300,
          opacity: legendProgress,
          transform: `translateX(${interpolate(legendProgress, [0, 1], [34, 0])}px)`,
          ...panelStyle({ padding: 24 }),
        }}
      >
        <div
          style={{
            color: COLORS.muted,
            fontSize: 16,
            fontWeight: 800,
            marginBottom: 18,
          }}
        >
          风险等级
        </div>
        {riskDistribution.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: item.color,
                  boxShadow: `0 0 16px ${item.color}`,
                }}
              />
              <span style={{ fontSize: 20, fontWeight: 850 }}>{item.label}</span>
            </div>
            <span style={{ color: item.color, fontSize: 20, fontWeight: 900 }}>
              {item.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 78,
          bottom: 70,
          display: "flex",
          gap: 18,
          opacity: ease(frame, 98, 138),
        }}
      >
        <InsightPill color={COLORS.blue}>20,000 条岗位样本</InsightPill>
        <InsightPill color={COLORS.high}>报告日期 2026-06-07</InsightPill>
      </div>
    </AbsoluteFill>
  );
};

const MetricCardsScene = () => {
  return (
    <SceneShell
      label="DATA QUALITY"
      title="先确认数据可信度"
      subtitle="样本覆盖人口背景、职业属性、任务结构、AI 使用情况和裁员风险等级。"
      duration={SCENES.metrics.duration}
      accent={COLORS.blue}
    >
      <div style={{ display: "flex", gap: 22 }}>
        <MetricCard
          label="样本量"
          value={20000}
          detail="岗位样本"
          color={COLORS.blue}
          delay={0}
        />
        <MetricCard
          label="字段数"
          value={16}
          detail="覆盖五类维度"
          color={COLORS.violet}
          delay={8}
        />
        <MetricCard
          label="缺失值"
          value={0}
          detail="无缺失字段"
          color={COLORS.low}
          delay={16}
        />
        <MetricCard
          label="重复记录"
          value={0}
          detail="数据可直接分析"
          color={COLORS.low}
          delay={24}
        />
      </div>
      <div
        style={{
          marginTop: 34,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 28,
        }}
      >
        <div style={panelStyle({ padding: 26, minHeight: 164 })}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              marginBottom: 16,
            }}
          >
            数据维度
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              color: COLORS.muted,
              fontSize: 17,
              lineHeight: 1.4,
              fontWeight: 700,
            }}
          >
            <div>人口与职业背景</div>
            <div>岗位与组织特征</div>
            <div>工作任务属性</div>
            <div>AI 使用与自动化</div>
          </div>
        </div>
        <div
          style={panelStyle({
            padding: 26,
            minHeight: 164,
            borderColor: "rgba(34, 197, 94, 0.5)",
          })}
        >
          <div style={{ color: COLORS.low, fontSize: 52, fontWeight: 950 }}>
            可直接建模
          </div>
          <div
            style={{
              color: COLORS.muted,
              fontSize: 18,
              lineHeight: 1.45,
              marginTop: 12,
            }}
          >
            年龄、经验、百分比字段和类别字段均通过质量检查。
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const RiskDistributionScene = () => {
  const frame = useCurrentFrame();
  const donutProgress = ease(frame, 12, 78);
  const circumference = 2 * Math.PI * 128;
  let cumulative = 0;

  return (
    <SceneShell
      label="TARGET DISTRIBUTION"
      title="裁员风险三类基本均衡"
      subtitle="Low、Medium、High 三类占比接近，后续模型无需进行强类别不平衡处理。"
      duration={SCENES.risk.duration}
      accent={COLORS.medium}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: 44,
          alignItems: "center",
        }}
      >
        <div
          style={panelStyle({
            width: 420,
            height: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          })}
        >
          <svg width="330" height="330" viewBox="0 0 330 330">
            <circle
              cx="165"
              cy="165"
              r="128"
              fill="none"
              stroke="rgba(148, 163, 184, 0.14)"
              strokeWidth="34"
            />
            {riskDistribution.map((item) => {
              const length = (item.value / 100) * circumference;
              const node = (
                <circle
                  key={item.label}
                  cx="165"
                  cy="165"
                  r="128"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="34"
                  strokeDasharray={`${length * donutProgress} ${circumference}`}
                  strokeDashoffset={-cumulative}
                  strokeLinecap="round"
                  transform="rotate(-90 165 165)"
                />
              );
              cumulative += length;
              return node;
            })}
          </svg>
          <div
            style={{
              position: "absolute",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 58, fontWeight: 950 }}>3 类</div>
            <div style={{ color: COLORS.muted, fontSize: 18, marginTop: 6 }}>
              风险标签
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {riskDistribution.map((item, index) => {
            const progress = ease(frame, 34 + index * 10, 80 + index * 10);
            return (
              <div key={item.label} style={panelStyle({ padding: 22 })}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      fontSize: 26,
                      fontWeight: 900,
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        background: item.color,
                        boxShadow: `0 0 18px ${item.color}`,
                      }}
                    />
                    {item.label}
                  </div>
                  <div
                    style={{
                      color: item.color,
                      fontSize: 32,
                      fontWeight: 950,
                    }}
                  >
                    {formatNumber(item.value * progress, 1)}%
                  </div>
                </div>
                <div
                  style={{
                    height: 18,
                    borderRadius: 6,
                    background: "rgba(148, 163, 184, 0.12)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.value * 2.15 * progress}%`,
                      height: "100%",
                      borderRadius: 6,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

const IndustryScene = () => {
  return (
    <SceneShell
      label="HIGH-RISK INDUSTRIES"
      title="高风险集中在流程标准化行业"
      subtitle="制造、物流、零售的高风险比例最高，说明流程标准化和可自动化空间是关键背景。"
      duration={SCENES.industry.duration}
      accent={COLORS.high}
    >
      <div style={panelStyle({ padding: 28 })}>
        <RankedBarChart data={industryRisk} maxValue={50} rowHeight={46} />
      </div>
    </SceneShell>
  );
};

const RoleScene = () => {
  return (
    <SceneShell
      label="HIGH-RISK ROLES"
      title="运营与流程岗位更容易暴露"
      subtitle="高风险岗位多集中在制造、物流、零售及运营流程相关角色。"
      duration={SCENES.roles.duration}
      accent={COLORS.danger}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 330px",
          gap: 28,
          alignItems: "stretch",
        }}
      >
        <div style={panelStyle({ padding: 30 })}>
          <RankedBarChart data={roleRisk} maxValue={52} rowHeight={64} labelWidth={310} />
        </div>
        <div
          style={panelStyle({
            padding: 28,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderColor: "rgba(239, 68, 68, 0.55)",
          })}
        >
          <div style={{ color: COLORS.danger, fontSize: 70, fontWeight: 950 }}>
            50.2%
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>
            Operator
          </div>
          <div
            style={{
              color: COLORS.muted,
              fontSize: 18,
              lineHeight: 1.45,
              marginTop: 18,
            }}
          >
            最高风险岗位通常具备重复执行、流程标准化、可监控和可拆解的任务特征。
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const AiAdoptionScene = () => {
  const frame = useCurrentFrame();
  const arrowProgress = ease(frame, 66, 128);

  return (
    <SceneShell
      label="AI ADOPTION"
      title="AI 高采用场景中，高风险比例显著升高"
      subtitle="这不等于 AI 采用直接导致裁员，而是 AI 更容易进入可标准化、可自动化的岗位场景。"
      duration={SCENES.adoption.duration}
      accent={COLORS.danger}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 350px",
          gap: 34,
          alignItems: "stretch",
        }}
      >
        <div style={panelStyle({ padding: "30px 34px" })}>
          <VerticalRiskBars data={adoptionRisk} delay={8} />
        </div>
        <div
          style={panelStyle({
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          })}
        >
          <div
            style={{
              color: COLORS.muted,
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 18,
            }}
          >
            High AI adoption
          </div>
          <div style={{ color: COLORS.danger, fontSize: 74, fontWeight: 950 }}>
            <AnimatedNumber value={80.8} suffix="%" decimals={1} start={20} />
          </div>
          <div
            style={{
              height: 3,
              width: `${arrowProgress * 100}%`,
              background: `linear-gradient(90deg, ${COLORS.low}, ${COLORS.danger})`,
              margin: "28px 0",
              borderRadius: 999,
            }}
          />
          <div style={{ color: COLORS.text, fontSize: 22, fontWeight: 900 }}>
            高风险比例
          </div>
          <div
            style={{
              color: COLORS.muted,
              fontSize: 17,
              lineHeight: 1.45,
              marginTop: 14,
            }}
          >
            更合理的解释是：AI 优先进入重复性高、自动化空间大的岗位场景。
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const JobLevelScene = () => {
  const frame = useCurrentFrame();
  const lineProgress = ease(frame, 34, 98);
  const points = [
    { x: 90, y: 116 },
    { x: 350, y: 210 },
    { x: 610, y: 326 },
  ];

  return (
    <SceneShell
      label="JOB LEVEL BUFFER"
      title="岗位级别具有明显保护作用"
      subtitle="高级岗位通常包含复杂判断、跨团队协作、流程设计和责任承担，这些任务更难被直接自动化替代。"
      duration={SCENES.level.duration}
      accent={COLORS.low}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "720px 1fr",
          gap: 32,
          alignItems: "stretch",
        }}
      >
        <div style={panelStyle({ padding: 34, position: "relative", height: 410 })}>
          <svg
            width="650"
            height="360"
            viewBox="0 0 650 360"
            style={{ position: "absolute", left: 36, top: 32 }}
          >
            <path
              d={`M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y}`}
              fill="none"
              stroke="rgba(148, 163, 184, 0.22)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d={`M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y}`}
              fill="none"
              stroke={COLORS.low}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="760"
              strokeDashoffset={760 - 760 * lineProgress}
            />
          </svg>
          {levelRisk.map((item, index) => {
            const point = points[index];
            const progress = ease(frame, 24 + index * 20, 70 + index * 20);
            return (
              <div
                key={item.label}
                style={{
                  position: "absolute",
                  left: point.x - 24,
                  top: point.y + 8,
                  opacity: progress,
                  transform: `scale(${0.75 + progress * 0.25})`,
                }}
              >
                <div
                  style={{
                    width: 108,
                    height: 108,
                    borderRadius: 8,
                    background: COLORS.panelStrong,
                    border: `1px solid ${item.color}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 26px ${item.color}`,
                  }}
                >
                  <div style={{ color: item.color, fontSize: 29, fontWeight: 950 }}>
                    {formatNumber(item.value * progress, 1)}%
                  </div>
                  <div style={{ color: COLORS.text, fontSize: 16, fontWeight: 900 }}>
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={panelStyle({
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderColor: "rgba(34, 197, 94, 0.52)",
          })}
        >
          <div style={{ color: COLORS.low, fontSize: 42, fontWeight: 950 }}>
            保护缓冲
          </div>
          <div
            style={{
              color: COLORS.muted,
              fontSize: 19,
              lineHeight: 1.55,
              marginTop: 22,
            }}
          >
            从 Entry 到 Senior，高风险比例从 44.5% 降至 11.5%。
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const heatmapColor = (value: number | null) => {
  if (value === null) {
    return "rgba(148, 163, 184, 0.10)";
  }
  if (value < 10) {
    return COLORS.low;
  }
  if (value < 45) {
    return COLORS.medium;
  }
  if (value < 80) {
    return COLORS.high;
  }
  return COLORS.danger;
};

const HeatmapScene = () => {
  const frame = useCurrentFrame();
  const highlight = ease(frame, 112, 158);

  return (
    <SceneShell
      label="TASK STRUCTURE"
      title="高重复性 + 高自动化 = 最高风险画像"
      subtitle="当重复性任务比例和自动化比例同时进入高区间时，高风险比例接近 95%。"
      duration={SCENES.heatmap.duration}
      accent={COLORS.danger}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "700px 1fr",
          gap: 34,
          alignItems: "stretch",
        }}
      >
        <div style={panelStyle({ padding: 32 })}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "90px repeat(4, 1fr)",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div />
            {heatmapColumns.map((column) => (
              <div
                key={column}
                style={{
                  color: COLORS.muted,
                  fontSize: 16,
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                {column}
              </div>
            ))}
            {heatmapValues.map((row, rowIndex) => (
              <Fragment key={`heat-row-${heatmapRows[rowIndex]}`}>
                <div
                  key={`row-${heatmapRows[rowIndex]}`}
                  style={{
                    color: COLORS.muted,
                    fontSize: 16,
                    fontWeight: 800,
                    textAlign: "right",
                    paddingRight: 8,
                  }}
                >
                  {heatmapRows[rowIndex]}
                </div>
                {row.map((value, columnIndex) => {
                  const cellIndex = rowIndex * 4 + columnIndex;
                  const progress = ease(frame, 18 + cellIndex * 5, 52 + cellIndex * 5);
                  const isPeak = value === 94.9;
                  const color = heatmapColor(value);
                  return (
                    <div
                      key={`${rowIndex}-${columnIndex}`}
                      style={{
                        height: 76,
                        borderRadius: 8,
                        background: color,
                        opacity: value === null ? 0.46 * progress : 0.18 + progress * 0.82,
                        border: isPeak
                          ? `2px solid rgba(248, 250, 252, ${0.4 + highlight * 0.6})`
                          : `1px solid ${COLORS.stroke}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: value === null ? COLORS.muted : "#0B1020",
                        fontSize: value === null ? 13 : 20,
                        fontWeight: 950,
                        transform: `scale(${0.88 + progress * 0.12})`,
                        boxShadow: isPeak
                          ? `0 0 ${18 + highlight * 38}px ${COLORS.danger}`
                          : "none",
                      }}
                    >
                      {value === null ? "未列" : `${formatNumber(value * progress, 1)}%`}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div
            style={{
              color: COLORS.muted,
              fontSize: 15,
              fontWeight: 700,
              textAlign: "center",
              marginTop: 18,
            }}
          >
            横轴：任务自动化比例，纵轴：重复性任务比例
          </div>
        </div>
        <div
          style={panelStyle({
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderColor: "rgba(239, 68, 68, 0.58)",
          })}
        >
          <div style={{ color: COLORS.danger, fontSize: 82, fontWeight: 950 }}>
            <AnimatedNumber value={94.9} suffix="%" decimals={1} start={96} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 8 }}>
            最高组合风险
          </div>
          <div
            style={{
              color: COLORS.muted,
              fontSize: 18,
              lineHeight: 1.55,
              marginTop: 22,
            }}
          >
            重复性任务 76-100，自动化比例 76-100 的岗位，形成最明确的高风险画像之一。
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const ProtectionScene = () => {
  const frame = useCurrentFrame();
  const factors = [
    {
      label: "创造力要求",
      lowRisk: 71.9,
      highRisk: 23.8,
      color: COLORS.low,
    },
    {
      label: "人类能力保护指数",
      lowRisk: 68.3,
      highRisk: 39.9,
      color: COLORS.blue,
    },
    {
      label: "岗位级别",
      lowRisk: 57.7,
      highRisk: 11.5,
      color: COLORS.violet,
    },
  ];

  return (
    <SceneShell
      label="PROTECTION FACTORS"
      title="创造力和复杂判断是最强保护因素"
      subtitle="高风险样本通常重复性更高、创造力要求更低，人类能力保护指数也更弱。"
      duration={SCENES.protection.duration}
      accent={COLORS.low}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 30,
        }}
      >
        <div style={panelStyle({ padding: 30 })}>
          {factors.map((factor, index) => {
            const progress = ease(frame, 8 + index * 14, 56 + index * 14);
            return (
              <div key={factor.label} style={{ marginBottom: 30 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 21,
                    fontWeight: 900,
                    marginBottom: 12,
                  }}
                >
                  <span>{factor.label}</span>
                  <span style={{ color: factor.color }}>
                    Low 风险更高保护
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div>
                    <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 8 }}>
                      Low 风险均值
                    </div>
                    <div
                      style={{
                        height: 22,
                        borderRadius: 6,
                        background: "rgba(148, 163, 184, 0.12)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${factor.lowRisk * progress}%`,
                          background: factor.color,
                        }}
                      />
                    </div>
                    <div style={{ color: factor.color, fontSize: 24, fontWeight: 950, marginTop: 8 }}>
                      {formatNumber(factor.lowRisk * progress, 1)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 8 }}>
                      High 风险均值
                    </div>
                    <div
                      style={{
                        height: 22,
                        borderRadius: 6,
                        background: "rgba(148, 163, 184, 0.12)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${factor.highRisk * progress}%`,
                          background: COLORS.danger,
                        }}
                      />
                    </div>
                    <div style={{ color: COLORS.danger, fontSize: 24, fontWeight: 950, marginTop: 8 }}>
                      {formatNumber(factor.highRisk * progress, 1)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={panelStyle({
            padding: 30,
            borderColor: "rgba(34, 197, 94, 0.52)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          })}
        >
          <div style={{ color: COLORS.low, fontSize: 58, fontWeight: 950 }}>
            保护变量
          </div>
          <div
            style={{
              color: COLORS.muted,
              fontSize: 19,
              lineHeight: 1.55,
              marginTop: 22,
            }}
          >
            创造力、人际互动、岗位级别、教育水平和经验年限都能形成不同程度的风险缓冲。
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const ModelPerformanceScene = () => {
  const models: BarDatum[] = [
    { label: "Logistic Regression", value: 0.962, detail: "Accuracy / Macro F1", color: COLORS.low },
    { label: "LightGBM", value: 0.952, detail: "Macro F1" },
    { label: "XGBoost", value: 0.947, detail: "Macro F1" },
    { label: "Gradient Boosting", value: 0.913, detail: "Macro F1" },
    { label: "Random Forest", value: 0.885, detail: "Macro F1" },
  ];

  return (
    <SceneShell
      label="PREDICTIVE MODEL"
      title="模型适合用于高风险筛查"
      subtitle="多分类和高风险二分类模型均表现稳定，业务上应优先关注高风险召回率。"
      duration={SCENES.model.duration}
      accent={COLORS.blue}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: 32,
          alignItems: "stretch",
        }}
      >
        <div style={panelStyle({ padding: 30 })}>
          <RankedBarChart
            data={models}
            maxValue={1}
            valueSuffix=""
            decimals={3}
            rowHeight={58}
            labelWidth={300}
          />
        </div>
        <div style={{ display: "grid", gap: 18 }}>
          <MetricCard
            label="多分类 Accuracy"
            value={0.962}
            decimals={3}
            detail="Logistic Regression"
            color={COLORS.low}
            delay={10}
          />
          <MetricCard
            label="High Recall"
            value={0.982}
            decimals={3}
            detail="二分类高风险预警"
            color={COLORS.high}
            delay={22}
          />
          <MetricCard
            label="PR-AUC"
            value={0.997}
            decimals={3}
            detail="高风险筛查表现"
            color={COLORS.blue}
            delay={34}
          />
        </div>
      </div>
    </SceneShell>
  );
};

const FeatureImportanceScene = () => {
  const frame = useCurrentFrame();
  const switchProgress = ease(frame, 146, 184);

  return (
    <SceneShell
      label="MODEL EXPLANATION"
      title="关键不是行业标签，而是任务结构"
      subtitle="模型解释结果显示，重复性任务、自动化比例、岗位级别和保护性能力是核心变量。"
      duration={SCENES.importance.duration}
      accent={COLORS.violet}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
        }}
      >
        <div style={panelStyle({ padding: 28, opacity: 1 - switchProgress * 0.08 })}>
          <div style={{ fontSize: 24, fontWeight: 950, marginBottom: 22 }}>
            Permutation Importance
          </div>
          <RankedBarChart
            data={featureImportance}
            maxValue={0.24}
            valueSuffix=""
            decimals={3}
            rowHeight={52}
            labelWidth={260}
          />
        </div>
        <div style={panelStyle({ padding: 28 })}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 950,
              marginBottom: 22,
              color: COLORS.high,
            }}
          >
            SHAP 高风险解释
          </div>
          <RankedBarChart
            data={shapImportance}
            maxValue={2.4}
            valueSuffix=""
            decimals={3}
            rowHeight={57}
            labelWidth={250}
          />
        </div>
      </div>
    </SceneShell>
  );
};

const ClusterScene = () => {
  const frame = useCurrentFrame();
  const split = ease(frame, 20, 74);

  return (
    <SceneShell
      label="SEGMENTATION"
      title="风险来自任务结构、AI 强度与保护能力的组合"
      subtitle="聚类在不使用风险标签的情况下，仍识别出明显的高风险群体。"
      duration={SCENES.cluster.duration}
      accent={COLORS.high}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30,
          alignItems: "stretch",
        }}
      >
        <ClusterCard
          label="Cluster 0"
          title="高风险群体"
          risk={62.8}
          samples={9307}
          exposure={57}
          protection={43.1}
          intensity={45.7}
          color={COLORS.danger}
          delay={0}
        />
        <ClusterCard
          label="Cluster 1"
          title="低风险群体"
          risk={8.9}
          samples={10693}
          exposure={15.3}
          protection={63.3}
          intensity={6.6}
          color={COLORS.low}
          delay={14}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 638,
          top: 250,
          width: 4,
          height: 315 * split,
          borderRadius: 999,
          background: `linear-gradient(180deg, ${COLORS.danger}, ${COLORS.low})`,
          boxShadow: `0 0 28px ${COLORS.blue}`,
        }}
      />
    </SceneShell>
  );
};

const ClusterCard = ({
  label,
  title,
  risk,
  samples,
  exposure,
  protection,
  intensity,
  color,
  delay,
}: {
  label: string;
  title: string;
  risk: number;
  samples: number;
  exposure: number;
  protection: number;
  intensity: number;
  color: string;
  delay: number;
}) => {
  const frame = useCurrentFrame();
  const progress = ease(frame, delay, delay + 42);
  const metrics = [
    { label: "自动化暴露", value: exposure, color: COLORS.high },
    { label: "保护指数", value: protection, color: COLORS.low },
    { label: "AI 强度", value: intensity, color: COLORS.blue },
  ];

  return (
    <div
      style={panelStyle({
        padding: 30,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [22, 0])}px)`,
        borderColor: color,
      })}
    >
      <div style={{ color, fontSize: 18, fontWeight: 900 }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 950, marginTop: 8 }}>{title}</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          marginTop: 26,
        }}
      >
        <div>
          <div style={{ color: COLORS.muted, fontSize: 15, fontWeight: 800 }}>
            高风险比例
          </div>
          <div style={{ color, fontSize: 60, fontWeight: 950, marginTop: 6 }}>
            {formatNumber(risk * progress, 1)}%
          </div>
        </div>
        <div>
          <div style={{ color: COLORS.muted, fontSize: 15, fontWeight: 800 }}>
            样本数
          </div>
          <div style={{ color: COLORS.text, fontSize: 44, fontWeight: 950, marginTop: 12 }}>
            {formatNumber(samples * progress, 0)}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: COLORS.muted,
                fontSize: 15,
                fontWeight: 800,
                marginBottom: 7,
              }}
            >
              <span>{metric.label}</span>
              <span>{formatNumber(metric.value * progress, 1)}</span>
            </div>
            <div
              style={{
                height: 14,
                borderRadius: 5,
                background: "rgba(148, 163, 184, 0.14)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${metric.value * progress}%`,
                  height: "100%",
                  borderRadius: 5,
                  background: metric.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecommendationScene = () => {
  const frame = useCurrentFrame();
  const steps = [
    {
      label: "识别",
      title: "建立高风险预警清单",
      detail: "聚焦高风险行业、岗位、重复性任务和高 AI 采用组合。",
      color: COLORS.high,
    },
    {
      label: "复核",
      title: "业务部门人工确认",
      detail: "结合实际职责、组织变化、绩效与团队结构。",
      color: COLORS.blue,
    },
    {
      label: "重设计",
      title: "培训绑定岗位改造",
      detail: "提升复核、异常处理、流程优化和跨职能协作能力。",
      color: COLORS.low,
    },
    {
      label: "治理",
      title: "持续更新模型",
      detail: "定期监测风险变化，加入公平性评估和模型治理。",
      color: COLORS.violet,
    },
  ];

  return (
    <SceneShell
      label="ACTION PLAN"
      title="模型用于筛查，而不是直接决策"
      subtitle="二分类高风险预警模型召回率高，适合作为管理流程输入，但不能直接作为裁员依据。"
      duration={SCENES.recommendation.duration}
      accent={COLORS.low}
    >
      <div
        style={{
          position: "relative",
          height: 420,
          ...panelStyle({ padding: 34 }),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 92,
            right: 92,
            top: 188,
            height: 4,
            background: "rgba(148, 163, 184, 0.18)",
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 92,
            top: 188,
            height: 4,
            width: `${ease(frame, 28, 190) * 872}px`,
            background: `linear-gradient(90deg, ${COLORS.high}, ${COLORS.blue}, ${COLORS.low}, ${COLORS.violet})`,
            borderRadius: 999,
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 22,
            height: "100%",
          }}
        >
          {steps.map((step, index) => {
            const progress = ease(frame, 18 + index * 28, 66 + index * 28);
            return (
              <div
                key={step.label}
                style={{
                  opacity: progress,
                  transform: `translateY(${interpolate(progress, [0, 1], [24, 0])}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  paddingTop: index % 2 === 0 ? 32 : 162,
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 8,
                    background: COLORS.panelStrong,
                    border: `2px solid ${step.color}`,
                    boxShadow: `0 0 28px ${step.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: step.color,
                    fontSize: 30,
                    fontWeight: 950,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ color: step.color, fontSize: 18, fontWeight: 900, marginTop: 18 }}>
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 950,
                    lineHeight: 1.22,
                    marginTop: 8,
                    minHeight: 54,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    color: COLORS.muted,
                    fontSize: 15,
                    lineHeight: 1.45,
                    marginTop: 12,
                  }}
                >
                  {step.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

const ClosingScene = () => {
  const frame = useCurrentFrame();
  const progress = ease(frame, 18, 82);
  const glow = 0.5 + 0.5 * Math.sin(frame / 24);

  return (
    <AbsoluteFill
      style={{
        opacity: fadeForScene(frame, SCENES.closing.duration),
        color: COLORS.text,
        fontFamily: FONT,
        padding: "72px 78px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 920,
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [28, 0])}px)`,
        }}
      >
        <div style={sectionLabelStyle(COLORS.low)}>FINAL INSIGHT</div>
        <div
          style={{
            fontSize: 62,
            lineHeight: 1.05,
            fontWeight: 950,
            letterSpacing: 0,
            marginTop: 18,
          }}
        >
          不是简单替代，而是重新设计岗位价值
        </div>
        <div
          style={{
            color: COLORS.muted,
            fontSize: 24,
            lineHeight: 1.48,
            maxWidth: 860,
            marginTop: 26,
          }}
        >
          企业不应仅以行业或公司规模判断风险，而应建立基于岗位任务结构的动态风险评估机制。
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 78,
          bottom: 74,
          width: 310,
          height: 310,
          borderRadius: 12,
          border: `1px solid rgba(34, 197, 94, ${0.32 + glow * 0.28})`,
          background:
            "linear-gradient(135deg, rgba(34, 197, 94, 0.16), rgba(56, 189, 248, 0.1))",
          boxShadow: `0 0 ${34 + glow * 40}px rgba(34, 197, 94, 0.22)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: COLORS.low,
          fontSize: 82,
          fontWeight: 950,
          opacity: ease(frame, 76, 132),
        }}
      >
        AI
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background, fontFamily: FONT }}>
      <Background />
      <Sequence from={SCENES.title.from} durationInFrames={SCENES.title.duration}>
        <TitleScene />
      </Sequence>
      <Sequence from={SCENES.metrics.from} durationInFrames={SCENES.metrics.duration}>
        <MetricCardsScene />
      </Sequence>
      <Sequence from={SCENES.risk.from} durationInFrames={SCENES.risk.duration}>
        <RiskDistributionScene />
      </Sequence>
      <Sequence from={SCENES.industry.from} durationInFrames={SCENES.industry.duration}>
        <IndustryScene />
      </Sequence>
      <Sequence from={SCENES.roles.from} durationInFrames={SCENES.roles.duration}>
        <RoleScene />
      </Sequence>
      <Sequence from={SCENES.adoption.from} durationInFrames={SCENES.adoption.duration}>
        <AiAdoptionScene />
      </Sequence>
      <Sequence from={SCENES.level.from} durationInFrames={SCENES.level.duration}>
        <JobLevelScene />
      </Sequence>
      <Sequence from={SCENES.heatmap.from} durationInFrames={SCENES.heatmap.duration}>
        <HeatmapScene />
      </Sequence>
      <Sequence from={SCENES.protection.from} durationInFrames={SCENES.protection.duration}>
        <ProtectionScene />
      </Sequence>
      <Sequence from={SCENES.model.from} durationInFrames={SCENES.model.duration}>
        <ModelPerformanceScene />
      </Sequence>
      <Sequence from={SCENES.importance.from} durationInFrames={SCENES.importance.duration}>
        <FeatureImportanceScene />
      </Sequence>
      <Sequence from={SCENES.cluster.from} durationInFrames={SCENES.cluster.duration}>
        <ClusterScene />
      </Sequence>
      <Sequence
        from={SCENES.recommendation.from}
        durationInFrames={SCENES.recommendation.duration}
      >
        <RecommendationScene />
      </Sequence>
      <Sequence from={SCENES.closing.from} durationInFrames={SCENES.closing.duration}>
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
