export const CYBER_FPS = 30;
export const CYBER_WIDTH = 1920;
export const CYBER_HEIGHT = 1080;

export type SceneKey =
  | "boot"
  | "thanks"
  | "dataset"
  | "quality"
  | "riskSplit"
  | "structure"
  | "industry"
  | "roles"
  | "adoption"
  | "level"
  | "heatmap"
  | "paths"
  | "protection"
  | "indices"
  | "model"
  | "shap"
  | "cluster"
  | "redesign"
  | "governance"
  | "closing";

export type SceneSpec = {
  key: SceneKey;
  durationInFrames: number;
};

const seconds = (value: number) => Math.round(value * CYBER_FPS);

export const CYBER_SCENES: SceneSpec[] = [
  { key: "boot", durationInFrames: seconds(5) },
  { key: "thanks", durationInFrames: seconds(4) },
  { key: "dataset", durationInFrames: seconds(6) },
  { key: "quality", durationInFrames: seconds(5.5) },
  { key: "riskSplit", durationInFrames: seconds(6) },
  { key: "structure", durationInFrames: seconds(6) },
  { key: "industry", durationInFrames: seconds(7.5) },
  { key: "roles", durationInFrames: seconds(7) },
  { key: "adoption", durationInFrames: seconds(7) },
  { key: "level", durationInFrames: seconds(7) },
  { key: "heatmap", durationInFrames: seconds(9.5) },
  { key: "paths", durationInFrames: seconds(6.5) },
  { key: "protection", durationInFrames: seconds(7.5) },
  { key: "indices", durationInFrames: seconds(7) },
  { key: "model", durationInFrames: seconds(7.5) },
  { key: "shap", durationInFrames: seconds(7.5) },
  { key: "cluster", durationInFrames: seconds(7.5) },
  { key: "redesign", durationInFrames: seconds(7) },
  { key: "governance", durationInFrames: seconds(7) },
  { key: "closing", durationInFrames: seconds(7) },
];

export const CYBER_IMPACT_DURATION_IN_FRAMES = CYBER_SCENES.reduce(
  (total, scene) => total + scene.durationInFrames,
  0,
);

export const COLORS = {
  background: "#050816",
  background2: "#08111F",
  background3: "#0B1728",
  grid: "#11314F",
  low: "#2FFFD0",
  medium: "#FFD166",
  high: "#FF3B30",
  extreme: "#FF7A00",
  blue: "#00D1FF",
  violet: "#8B5CF6",
  text: "#F8FAFC",
  muted: "#8EA4C8",
  dim: "#42526F",
};

export const FONT_STACK =
  '"Noto Sans CJK SC", "Noto Sans SC", "Source Han Sans SC", "Microsoft YaHei", "PingFang SC", Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export type BarDatum = {
  label: string;
  value: number;
  detail?: string;
  color?: string;
};

export type MetricDatum = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  color?: string;
};

export const riskDistribution: MetricDatum[] = [
  { label: "低风险", value: 33, suffix: "%", color: COLORS.low },
  { label: "中风险", value: 33, suffix: "%", color: COLORS.medium },
  { label: "高风险", value: 34, suffix: "%", color: COLORS.high },
];

export const industryRisk: BarDatum[] = [
  { label: "制造业", value: 48.2, color: COLORS.high },
  { label: "物流", value: 41.5, color: COLORS.extreme },
  { label: "零售", value: 40.7, color: COLORS.extreme },
  { label: "金融", value: 37.7, color: COLORS.medium },
  { label: "电信", value: 35.2, color: COLORS.medium },
  { label: "信息技术", value: 28, color: COLORS.blue },
  { label: "医疗健康", value: 20.8, color: COLORS.low },
  { label: "教育", value: 20.1, color: COLORS.low },
];

export const roleRisk: BarDatum[] = [
  { label: "操作员", value: 50.2, color: COLORS.high },
  {
    label: "生产主管",
    value: 48.3,
    color: COLORS.extreme,
  },
  {
    label: "质量工程师",
    value: 46,
    color: COLORS.extreme,
  },
  {
    label: "库存分析师",
    value: 44.6,
    color: COLORS.medium,
  },
  { label: "调度员", value: 42.1, color: COLORS.medium },
];

export const adoptionRisk: MetricDatum[] = [
  { label: "低采用", value: 9.2, suffix: "%", decimals: 1, color: COLORS.low },
  {
    label: "中采用",
    value: 58.2,
    suffix: "%",
    decimals: 1,
    color: COLORS.medium,
  },
  {
    label: "高采用",
    value: 80.8,
    suffix: "%",
    decimals: 1,
    color: COLORS.high,
  },
];

export const levelRisk: MetricDatum[] = [
  { label: "初级", value: 44.5, suffix: "%", decimals: 1, color: COLORS.high },
  { label: "中级", value: 30.7, suffix: "%", decimals: 1, color: COLORS.blue },
  { label: "高级", value: 11.5, suffix: "%", decimals: 1, color: COLORS.low },
];

export const heatmapRows = ["0-25", "26-50", "51-75", "76-100"];
export const heatmapColumns = ["0-25", "26-50", "51-75", "76-100"];
export const heatmapValues: Array<Array<number | null>> = [
  [0, null, null, null],
  [null, 9.3, null, null],
  [null, 37.5, 66.2, null],
  [null, 72.1, 85.5, 94.9],
];

export const highRiskPath = [
  { label: "重复性任务", value: 75.2, suffix: "" },
  { label: "自动化比例", value: 56, suffix: "" },
  { label: "AI 使用", value: 10.8, suffix: "小时" },
  { label: "高风险", value: 34, suffix: "%" },
];

export const lowRiskPath = [
  { label: "重复性任务", value: 28.5, suffix: "" },
  { label: "自动化比例", value: 19.5, suffix: "" },
  { label: "AI 使用", value: 3.3, suffix: "小时" },
  { label: "低风险", value: 33, suffix: "%" },
];

export const indexProfiles = [
  {
    label: "低风险",
    exposure: 14.3,
    protection: 68.3,
    intensity: 9.6,
    color: COLORS.low,
  },
  {
    label: "中风险",
    exposure: 33,
    protection: 54,
    intensity: 22.5,
    color: COLORS.medium,
  },
  {
    label: "高风险",
    exposure: 56.3,
    protection: 39.9,
    intensity: 41.8,
    color: COLORS.high,
  },
];

export const modelMetrics: MetricDatum[] = [
  { label: "准确率", value: 0.962, decimals: 3, color: COLORS.blue },
  { label: "宏平均 F1", value: 0.962, decimals: 3, color: COLORS.low },
  {
    label: "高风险召回率",
    value: 0.982,
    decimals: 3,
    color: COLORS.extreme,
  },
  { label: "PR 曲线面积", value: 0.997, decimals: 3, color: COLORS.violet },
];

export const shapImportance: BarDatum[] = [
  { label: "重复性任务", value: 2.314 },
  { label: "任务自动化", value: 2.191 },
  { label: "岗位级别", value: 1.666 },
  { label: "人类能力保护", value: 1.502 },
  { label: "教育水平", value: 0.992 },
];

export const clusterProfiles = [
  {
    label: "群体 0",
    n: 9307,
    highRate: 62.8,
    exposure: 57,
    protection: 43.1,
    intensity: 45.7,
    color: COLORS.high,
    description: "高自动化暴露 / 低保护 / 高 AI 强度",
  },
  {
    label: "群体 1",
    n: 10693,
    highRate: 8.9,
    exposure: 15.3,
    protection: 63.3,
    intensity: 6.6,
    color: COLORS.low,
    description: "低自动化暴露 / 高保护 / 低 AI 强度",
  },
];

export const governanceSteps = ["模型筛查", "业务复核", "培训转岗", "持续监测"];

export const redesignPaths = [
  "AI 输出复核",
  "异常处理",
  "流程改进",
  "跨职能协作",
];
