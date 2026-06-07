import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  BrandMark,
  Kicker,
  MainTitle,
  MetricTile,
  MonoNumber,
  SceneShell,
} from "./components";
import {
  COLORS,
  CYBER_IMPACT_DURATION_IN_FRAMES,
  CYBER_SCENES,
  adoptionRisk,
  clusterProfiles,
  governanceSteps,
  heatmapColumns,
  heatmapRows,
  heatmapValues,
  highRiskPath,
  indexProfiles,
  industryRisk,
  levelRisk,
  lowRiskPath,
  modelMetrics,
  redesignPaths,
  riskDistribution,
  roleRisk,
  shapImportance,
  type BarDatum,
  type MetricDatum,
  type SceneKey,
} from "./data";
import {
  countTo,
  formatNumber,
  glowPulse,
  sceneOpacity,
  seeded,
  sharp,
  smooth,
} from "./helpers";

export { CYBER_IMPACT_DURATION_IN_FRAMES };

const timeline = CYBER_SCENES.reduce(
  (acc, scene) => {
    acc.entries.push({
      ...scene,
      from: acc.cursor,
    });
    acc.cursor += scene.durationInFrames;
    return acc;
  },
  {
    cursor: 0,
    entries: [] as Array<(typeof CYBER_SCENES)[number] & { from: number }>,
  },
).entries;

const sceneMap: Record<SceneKey, React.FC<{ durationInFrames: number }>> = {
  boot: BootScene,
  thanks: ThanksScene,
  dataset: DatasetScene,
  quality: QualityScene,
  riskSplit: RiskSplitScene,
  structure: StructureScene,
  industry: IndustryScene,
  roles: RolesScene,
  adoption: AdoptionScene,
  level: LevelScene,
  heatmap: HeatmapScene,
  paths: PathsScene,
  protection: ProtectionScene,
  indices: IndicesScene,
  model: ModelScene,
  shap: ShapScene,
  cluster: ClusterScene,
  redesign: RedesignScene,
  governance: GovernanceScene,
  closing: ClosingScene,
};

export const CyberImpactVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.background }}>
      {timeline.map((scene) => {
        const Component = sceneMap[scene.key];
        return (
          <Sequence
            key={scene.key}
            from={scene.from}
            durationInFrames={scene.durationInFrames}
          >
            <Component durationInFrames={scene.durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

function BootScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const boot = smooth(frame, 10, 58);
  const glitch = frame % 19 < 3 ? 1 : 0;
  const bar = smooth(frame, 28, 118);
  const codeRows = Array.from({ length: 18 }, (_, index) => index);

  return (
    <SceneShell
      opacity={opacity}
      label="系统启动"
      title="报告日期：2026-06-07"
      intensity={1.18}
    >
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            left: 210,
            top: 190,
            width: 320,
            height: 520,
            opacity: 0.58,
          }}
        >
          {codeRows.map((row) => {
            const reveal = smooth(frame, row * 4, row * 4 + 18);
            return (
              <div
                key={row}
                style={{
                  height: 24,
                  color: row % 4 === 0 ? COLORS.low : COLORS.blue,
                  fontSize: 15,
                  fontWeight: 800,
                  fontVariantNumeric: "tabular-nums",
                  opacity: reveal * (0.28 + (row % 3) * 0.18),
                  transform: `translateX(${(1 - reveal) * -22}px)`,
                }}
              >
                {`扫描.${row + 1 < 10 ? `0${row + 1}` : row + 1} // ${
                  row % 2 === 0 ? "任务矩阵" : "模型中枢"
                }`}
              </div>
            );
          })}
        </div>
        <svg
          width="920"
          height="520"
          viewBox="0 0 920 520"
          style={{
            filter: `drop-shadow(0 0 ${24 + boot * 28}px ${COLORS.blue}77)`,
            transform: `scale(${0.9 + boot * 0.1}) translateX(${glitch * 4}px)`,
          }}
        >
          <rect
            x="60"
            y="60"
            width="800"
            height="400"
            fill="rgba(5, 8, 22, 0.62)"
            stroke={COLORS.blue}
            strokeWidth="2"
            strokeOpacity={0.75 * boot}
          />
          <path
            d="M96 116 H824 M96 404 H824 M138 82 V438 M782 82 V438"
            stroke={COLORS.grid}
            strokeWidth="2"
            strokeOpacity={0.55 * boot}
          />
          <circle
            cx="460"
            cy="260"
            r={130 + boot * 24}
            fill="none"
            stroke={COLORS.low}
            strokeWidth="2"
            strokeDasharray="18 16"
            strokeOpacity={0.68 * boot}
          />
          <circle
            cx="460"
            cy="260"
            r={188}
            fill="none"
            stroke={COLORS.violet}
            strokeWidth="1"
            strokeDasharray="5 18"
            strokeOpacity={0.42 * boot}
          />
          <path
            d="M460 70 V450 M270 260 H650"
            stroke={COLORS.blue}
            strokeWidth="2"
            strokeOpacity={0.4 * boot}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: 402,
            width: 980,
            textAlign: "center",
            transform: `translateY(${(1 - boot) * 24}px)`,
          }}
        >
          <div
            style={{
              color: COLORS.blue,
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: 0,
              textTransform: "uppercase",
              opacity: smooth(frame, 28, 54),
            }}
          >
            系统初始化
          </div>
          <MainTitle size={82}>
            <span style={{ color: COLORS.text }}>AI时代</span>
            <br />
            <span style={{ color: COLORS.low }}>失业风险分析</span>
          </MainTitle>
          <div
            style={{
              width: 760,
              height: 12,
              margin: "34px auto 0",
              background: "rgba(17, 49, 79, 0.54)",
              border: `1px solid ${COLORS.blue}77`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${bar * 100}%`,
                background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.low})`,
                boxShadow: `0 0 28px ${COLORS.blue}`,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function ThanksScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const beam = smooth(frame, 34, 82);

  return (
    <SceneShell opacity={opacity} label="特别鸣谢" title="项目支持">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            top: 186,
            textAlign: "center",
            opacity: smooth(frame, 4, 28),
          }}
        >
          <Kicker color={COLORS.low}>特别鸣谢</Kicker>
          <MainTitle size={58} style={{ marginTop: 12 }}>
            数据项目支持与社区鸣谢
          </MainTitle>
        </div>
        <div style={{ display: "flex", gap: 90, alignItems: "center" }}>
          <BrandMark src="linuxdo.png" label="Linux.Do" delay={20} />
          <div
            style={{
              width: 230,
              height: 4,
              background: `linear-gradient(90deg, transparent, ${COLORS.blue}, ${COLORS.low}, transparent)`,
              boxShadow: `0 0 28px ${COLORS.blue}`,
              transform: `scaleX(${beam})`,
            }}
          />
          <BrandMark src="unity2.png" label="unity2.ai" delay={40} />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

const datasetParticles = Array.from({ length: 260 }, (_, index) => {
  const angle = seeded(index, 31) * Math.PI * 2;
  const radius = 110 + seeded(index, 32) * 330;
  return {
    startX: seeded(index, 33) * 1920,
    startY: seeded(index, 34) * 1080,
    angle,
    radius,
    z: seeded(index, 35),
    color:
      index % 8 === 0
        ? COLORS.low
        : index % 11 === 0
          ? COLORS.high
          : COLORS.blue,
  };
});

function DatasetScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const gather = smooth(frame, 12, 112);
  const rotate = frame * 0.018;

  return (
    <SceneShell opacity={opacity} label="数据载入" title="20,000 条记录">
      <AbsoluteFill>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0 }}
        >
          {datasetParticles.map((point, index) => {
            const orbitX =
              960 +
              Math.cos(point.angle + rotate * (0.7 + point.z)) *
                point.radius *
                (0.34 + point.z * 0.6);
            const orbitY =
              500 +
              Math.sin(point.angle + rotate) *
                point.radius *
                0.48 *
                (0.55 + point.z * 0.5);
            const x = point.startX + (orbitX - point.startX) * gather;
            const y = point.startY + (orbitY - point.startY) * gather;
            const size = 2 + point.z * 4;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={size}
                fill={point.color}
                opacity={0.18 + gather * 0.62}
              />
            );
          })}
          <ellipse
            cx="960"
            cy="500"
            rx={430}
            ry={250}
            fill="none"
            stroke={COLORS.blue}
            strokeWidth="2"
            strokeDasharray="18 18"
            strokeOpacity={0.5 * gather}
          />
          <ellipse
            cx="960"
            cy="500"
            rx={300}
            ry={175}
            fill="none"
            stroke={COLORS.low}
            strokeWidth="2"
            strokeDasharray="8 14"
            strokeOpacity={0.46 * gather}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 180,
            top: 228,
            width: 600,
          }}
        >
          <Kicker>样本宇宙</Kicker>
          <MainTitle size={74} style={{ marginTop: 16 }}>
            20,000 条岗位样本
            <br />
            正在进入扫描
          </MainTitle>
        </div>
        <div
          style={{
            position: "absolute",
            right: 170,
            bottom: 186,
            display: "flex",
            gap: 34,
          }}
        >
          <MetricTile
            metric={{ label: "岗位样本", value: 20000, color: COLORS.blue }}
            delay={22}
            large
          />
          <MetricTile
            metric={{
              label: "分析字段",
              value: 16,
              color: COLORS.low,
            }}
            delay={38}
            large
          />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function QualityScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const metrics: MetricDatum[] = [
    { label: "样本量", value: 20000, color: COLORS.blue },
    { label: "字段数", value: 16, color: COLORS.low },
    { label: "缺失值", value: 0, color: COLORS.low },
    { label: "重复记录", value: 0, color: COLORS.low },
  ];

  return (
    <SceneShell opacity={opacity} label="数据质量" title="全部检查通过">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            left: 170,
            top: 160,
            width: 720,
          }}
        >
          <Kicker color={COLORS.low}>质量锁定</Kicker>
          <MainTitle size={66} style={{ marginTop: 14 }}>
            数据质量通过
            <br />
            可以进入建模
          </MainTitle>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 28,
            marginTop: 150,
          }}
        >
          {metrics.map((metric, index) => (
            <MetricTile
              key={metric.label}
              metric={metric}
              delay={18 + index * 12}
            />
          ))}
        </div>
        <svg
          width="1420"
          height="280"
          viewBox="0 0 1420 280"
          style={{ position: "absolute", bottom: 118 }}
        >
          {metrics.map((metric, index) => {
            const x = 100 + index * 395;
            const reveal = smooth(frame, 42 + index * 12, 70 + index * 12);
            return (
              <g key={metric.label} opacity={reveal}>
                <path
                  d={`M${x} 92 L${x + 70} 162 L${x + 180} 44`}
                  fill="none"
                  stroke={metric.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x={x + 4}
                  y="232"
                  fill={metric.color}
                  fontSize="30"
                  fontWeight="900"
                >
                  通过
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </SceneShell>
  );
}

function RiskSplitScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const draw = smooth(frame, 18, 96);
  const circumference = 2 * Math.PI * 168;
  let offset = 0;

  return (
    <SceneShell opacity={opacity} label="风险分布" title="低 / 中 / 高">
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            left: 178,
            top: 190,
            width: 650,
          }}
        >
          <Kicker>风险核心</Kicker>
          <MainTitle size={68} style={{ marginTop: 16 }}>
            表面均衡
            <br />
            不代表风险均匀
          </MainTitle>
        </div>
        <svg width="640" height="640" viewBox="0 0 640 640">
          <circle
            cx="320"
            cy="320"
            r="218"
            fill="rgba(5, 8, 22, 0.48)"
            stroke={COLORS.grid}
            strokeWidth="2"
          />
          {riskDistribution.map((segment) => {
            const length = (segment.value / 100) * circumference;
            const dash = `${length * draw} ${circumference}`;
            const element = (
              <circle
                key={segment.label}
                cx="320"
                cy="320"
                r="168"
                fill="none"
                stroke={segment.color}
                strokeWidth="58"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                transform="rotate(-90 320 320)"
                style={{
                  filter: `drop-shadow(0 0 18px ${segment.color}88)`,
                }}
              />
            );
            offset += length;
            return element;
          })}
          <circle
            cx="320"
            cy="320"
            r={110 + glowPulse(frame, 50) * 6}
            fill="none"
            stroke={COLORS.blue}
            strokeWidth="2"
            strokeOpacity="0.55"
            strokeDasharray="12 16"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            right: 188,
            top: 278,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {riskDistribution.map((metric, index) => (
            <MetricTile
              key={metric.label}
              metric={{ ...metric, decimals: 1 }}
              delay={22 + index * 14}
              large
            />
          ))}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function StructureScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const burst = sharp(frame, 22, 70);
  const columns = Array.from({ length: 22 }, (_, index) => ({
    x: 280 + index * 62,
    height: 70 + seeded(index, 44) * 360,
    risk: seeded(index, 45),
  }));

  return (
    <SceneShell opacity={opacity} label="结构决定风险" title="隐藏风险地形">
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 190,
            top: 170,
            width: 760,
          }}
        >
          <Kicker color={COLORS.extreme}>结构决定风险</Kicker>
          <MainTitle size={74} style={{ marginTop: 12 }}>
            真正的风险
            <br />
            藏在岗位结构里
          </MainTitle>
        </div>
        <svg
          width="1500"
          height="620"
          viewBox="0 0 1500 620"
          style={{
            position: "absolute",
            left: 210,
            bottom: 110,
            transform: `perspective(900px) rotateX(${50 - burst * 12}deg)`,
          }}
        >
          <path
            d="M80 520 H1430 L1260 110 H250 Z"
            fill="rgba(0, 209, 255, 0.04)"
            stroke={COLORS.blue}
            strokeOpacity="0.42"
          />
          {Array.from({ length: 15 }, (_, index) => (
            <line
              key={`terrain-${index}`}
              x1={160 + index * 82}
              y1="490"
              x2={260 + index * 64}
              y2="145"
              stroke={COLORS.grid}
              strokeOpacity="0.4"
            />
          ))}
          {columns.map((column, index) => {
            const reveal = smooth(frame, 30 + index * 2, 72 + index * 2);
            const color =
              column.risk > 0.72
                ? COLORS.high
                : column.risk > 0.45
                  ? COLORS.extreme
                  : COLORS.blue;
            return (
              <g key={index}>
                <rect
                  x={column.x}
                  y={510 - column.height * reveal}
                  width="34"
                  height={column.height * reveal}
                  fill={color}
                  opacity={0.45 + reveal * 0.48}
                  style={{ filter: `drop-shadow(0 0 16px ${color})` }}
                />
                <rect
                  x={column.x - 5}
                  y={510 - column.height * reveal - 12}
                  width="44"
                  height="10"
                  fill={color}
                  opacity={reveal}
                />
              </g>
            );
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            right: 190,
            top: 290,
            width: 420,
            color: COLORS.muted,
            fontSize: 34,
            fontWeight: 800,
            lineHeight: 1.35,
            opacity: smooth(frame, 64, 92),
          }}
        >
          行业只是表层标签，
          <br />
          任务结构才是风险地形。
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

const DataBar: React.FC<{
  datum: BarDatum;
  max: number;
  index: number;
  delay?: number;
  valueSuffix?: string;
}> = ({ datum, max, index, delay = 0, valueSuffix = "%" }) => {
  const frame = useCurrentFrame();
  const reveal = smooth(frame, delay + index * 8, delay + index * 8 + 28);
  const width = (datum.value / max) * 100 * reveal;
  const color = datum.color ?? COLORS.blue;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "330px 1fr 120px",
        alignItems: "center",
        gap: 24,
        height: 58,
        opacity: reveal,
        transform: `translateX(${(1 - reveal) * -40}px)`,
      }}
    >
      <div>
        <div style={{ color: COLORS.text, fontSize: 24, fontWeight: 900 }}>
          {datum.label}
        </div>
        <div style={{ color: COLORS.muted, fontSize: 16, fontWeight: 800 }}>
          {datum.detail}
        </div>
      </div>
      <div
        style={{
          height: 22,
          background: "rgba(17, 49, 79, 0.52)",
          border: `1px solid ${COLORS.grid}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 22px ${color}`,
          }}
        />
      </div>
      <div
        style={{
          color,
          fontSize: 30,
          fontWeight: 950,
          fontVariantNumeric: "tabular-nums",
          textAlign: "right",
        }}
      >
        {formatNumber(countTo(frame, datum.value, delay + index * 8, 28), 1)}
        {valueSuffix}
      </div>
    </div>
  );
};

function IndustryScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const scan = smooth(frame, 10, 150);

  return (
    <SceneShell opacity={opacity} label="行业热区扫描" title="高风险比例">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 170, top: 150 }}>
          <Kicker color={COLORS.high}>行业高风险热区</Kicker>
          <MainTitle size={62} style={{ marginTop: 12 }}>
            制造、物流、零售
            <br />
            进入高风险热区
          </MainTitle>
        </div>
        <div
          style={{
            position: "absolute",
            left: 240,
            right: 210,
            top: 382,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {industryRisk.map((datum, index) => (
            <DataBar
              key={datum.label}
              datum={datum}
              max={50}
              index={index}
              delay={30}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 210 + scan * 1320,
            top: 330,
            width: 5,
            height: 620,
            background: COLORS.low,
            boxShadow: `0 0 42px ${COLORS.low}`,
            opacity: 0.84,
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
}

function RolesScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);

  return (
    <SceneShell opacity={opacity} label="岗位锁定" title="高暴露岗位前五">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 180, top: 150, width: 720 }}>
          <Kicker color={COLORS.extreme}>岗位风险锁定墙</Kicker>
          <MainTitle size={62} style={{ marginTop: 12 }}>
            流程岗位
            <br />
            暴露最明显
          </MainTitle>
        </div>
        <div
          style={{
            position: "absolute",
            left: 210,
            right: 210,
            bottom: 142,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 24,
          }}
        >
          {roleRisk.map((role, index) => {
            const reveal = smooth(frame, 20 + index * 14, 50 + index * 14);
            const color = role.color ?? COLORS.high;
            const rankScale = 1 + (5 - index) * 0.018;
            return (
              <div
                key={role.label}
                style={{
                  height: 520,
                  position: "relative",
                  border: `1px solid ${color}88`,
                  background:
                    "linear-gradient(180deg, rgba(255, 59, 48, 0.15), rgba(5, 8, 22, 0.78))",
                  boxShadow: `0 0 ${18 + reveal * 34}px ${color}44`,
                  padding: 24,
                  opacity: reveal,
                  transform: `translateY(${(1 - reveal) * 70}px) scale(${
                    (0.92 + reveal * 0.08) * rankScale
                  })`,
                  clipPath:
                    "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 26px 100%, 0 calc(100% - 26px))",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    color,
                    fontSize: 26,
                    fontWeight: 950,
                  }}
                >
                  0{index + 1}
                </div>
                <div
                  style={{
                    height: 168,
                    border: `1px solid ${color}55`,
                    marginTop: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0, 0, 0, 0.22)",
                  }}
                >
                  <svg width="130" height="130" viewBox="0 0 130 130">
                    <circle
                      cx="65"
                      cy="42"
                      r="24"
                      fill="none"
                      stroke={color}
                      strokeWidth="8"
                    />
                    <path
                      d="M26 114 C32 82 98 82 104 114"
                      fill="none"
                      stroke={color}
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    <path
                      d="M31 31 H99 M18 68 H112"
                      stroke={COLORS.blue}
                      strokeOpacity="0.5"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
                <div
                  style={{
                    marginTop: 28,
                    color: COLORS.text,
                    fontSize: 27,
                    fontWeight: 950,
                    lineHeight: 1.1,
                    minHeight: 68,
                  }}
                >
                  {role.label}
                </div>
                <div
                  style={{
                    color: COLORS.muted,
                    fontSize: 19,
                    fontWeight: 800,
                    marginTop: 6,
                  }}
                >
                  {role.detail}
                </div>
                <div style={{ position: "absolute", bottom: 28, left: 24 }}>
                  <MonoNumber
                    value={role.value}
                    suffix="%"
                    decimals={1}
                    start={30 + index * 14}
                    duration={34}
                    color={color}
                    size={54}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function AdoptionScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const shock = smooth(frame, 112, 142);

  return (
    <SceneShell opacity={opacity} label="AI 采用冲击" title="高风险比例">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 175, top: 150, width: 680 }}>
          <Kicker color={COLORS.high}>采用强度冲击</Kicker>
          <MainTitle size={64} style={{ marginTop: 12 }}>
            AI 高采用场景
            <br />
            风险被快速放大
          </MainTitle>
        </div>
        <div
          style={{
            position: "absolute",
            left: 520,
            right: 220,
            bottom: 150,
            height: 620,
            display: "flex",
            alignItems: "end",
            justifyContent: "space-around",
          }}
        >
          {adoptionRisk.map((metric, index) => {
            const reveal = smooth(frame, 28 + index * 24, 84 + index * 24);
            const height = 80 + metric.value * 6.2 * reveal;
            return (
              <div
                key={metric.label}
                style={{
                  width: 260,
                  height: 590,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <div
                  style={{
                    width: 150,
                    height,
                    background: `linear-gradient(180deg, ${metric.color}, ${metric.color}33)`,
                    border: `1px solid ${metric.color}`,
                    boxShadow: `0 0 42px ${metric.color}88`,
                    clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)",
                  }}
                />
                <MonoNumber
                  value={metric.value}
                  suffix="%"
                  decimals={1}
                  start={28 + index * 24}
                  duration={48}
                  color={metric.color}
                  size={64}
                />
                <div
                  style={{
                    color: COLORS.text,
                    fontSize: 28,
                    fontWeight: 950,
                    textTransform: "uppercase",
                  }}
                >
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 850 - shock * 210,
            top: 350 - shock * 160,
            width: 420 + shock * 420,
            height: 420 + shock * 420,
            borderRadius: "50%",
            border: `4px solid ${COLORS.high}`,
            opacity: shock * (1 - smooth(frame, 150, 190)),
            boxShadow: `0 0 60px ${COLORS.high}`,
          }}
        />
      </AbsoluteFill>
    </SceneShell>
  );
}

function LevelScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);

  return (
    <SceneShell opacity={opacity} label="岗位级别护盾" title="风险缓冲">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 175, top: 150, width: 720 }}>
          <Kicker color={COLORS.low}>保护缓冲</Kicker>
          <MainTitle size={64} style={{ marginTop: 12 }}>
            岗位级别越高
            <br />
            风险缓冲越强
          </MainTitle>
        </div>
        <div
          style={{
            position: "absolute",
            left: 300,
            right: 270,
            bottom: 140,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 76,
          }}
        >
          {levelRisk.map((metric, index) => {
            const reveal = smooth(frame, 24 + index * 24, 78 + index * 24);
            const crack = metric.label === "初级" ? reveal : 0;
            const color = metric.color ?? COLORS.blue;
            return (
              <div
                key={metric.label}
                style={{
                  textAlign: "center",
                  opacity: reveal,
                  transform: `translateY(${(1 - reveal) * 44}px)`,
                }}
              >
                <svg width="360" height="420" viewBox="0 0 360 420">
                  <path
                    d="M180 28 L304 76 V178 C304 276 250 352 180 390 C110 352 56 276 56 178 V76 Z"
                    fill={`${color}18`}
                    stroke={color}
                    strokeWidth="7"
                    style={{ filter: `drop-shadow(0 0 22px ${color}88)` }}
                  />
                  <path
                    d="M180 74 L256 104 V184 C256 250 224 302 180 332 C136 302 104 250 104 184 V104 Z"
                    fill="rgba(5, 8, 22, 0.52)"
                    stroke={color}
                    strokeOpacity="0.5"
                    strokeWidth="3"
                  />
                  <path
                    d={`M176 126 L${168 - crack * 18} ${180 + crack * 24} L${
                      198 + crack * 22
                    } ${222 + crack * 42} L${182 - crack * 8} ${
                      292 + crack * 22
                    }`}
                    fill="none"
                    stroke={COLORS.high}
                    strokeWidth={metric.label === "初级" ? 5 : 0}
                    strokeLinecap="round"
                    opacity={crack}
                  />
                  <circle
                    cx="180"
                    cy="188"
                    r={60 + glowPulse(frame + index * 12, 42) * 6}
                    fill="none"
                    stroke={color}
                    strokeDasharray="10 12"
                    strokeOpacity="0.5"
                  />
                </svg>
                <div
                  style={{
                    color: COLORS.text,
                    fontSize: 36,
                    fontWeight: 950,
                    textTransform: "uppercase",
                  }}
                >
                  {metric.label}
                </div>
                <MonoNumber
                  value={metric.value}
                  suffix="%"
                  decimals={1}
                  start={32 + index * 24}
                  duration={36}
                  color={color}
                  size={58}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function heatColor(value: number | null) {
  if (value === null) {
    return "rgba(17, 49, 79, 0.24)";
  }
  if (value < 15) {
    return COLORS.low;
  }
  if (value < 60) {
    return COLORS.medium;
  }
  if (value < 86) {
    return COLORS.extreme;
  }
  return COLORS.high;
}

function HeatmapScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const focus = smooth(frame, 162, 230);
  const cellSize = 142;
  const gap = 18;
  const startX = 720;
  const startY = 260;

  return (
    <SceneShell opacity={opacity} label="任务矩阵" title="重复性 x 自动化">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 160, top: 150, width: 620 }}>
          <Kicker color={COLORS.high}>关键风险热区</Kicker>
          <MainTitle size={66} style={{ marginTop: 12 }}>
            高重复性 + 高自动化
            <br />
            风险接近 95%
          </MainTitle>
          <div
            style={{
              marginTop: 34,
              color: COLORS.muted,
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.34,
            }}
          >
            右上角热区是全片最重要的风险爆点。
          </div>
        </div>
        <svg
          width="980"
          height="760"
          viewBox="0 0 980 760"
          style={{
            position: "absolute",
            left: 690 - focus * 260,
            top: 190 - focus * 90,
            transform: `scale(${1 + focus * 0.64})`,
            transformOrigin: "620px 560px",
          }}
        >
          <text
            x="126"
            y="44"
            fill={COLORS.muted}
            fontSize="24"
            fontWeight="900"
          >
            任务自动化比例
          </text>
          <text
            x="-260"
            y="34"
            fill={COLORS.muted}
            fontSize="24"
            fontWeight="900"
            transform="rotate(-90)"
          >
            重复性任务比例
          </text>
          {heatmapColumns.map((column, index) => (
            <text
              key={column}
              x={startX - 610 + index * (cellSize + gap) + 54}
              y="96"
              fill={COLORS.muted}
              fontSize="22"
              fontWeight="900"
            >
              {column}
            </text>
          ))}
          {heatmapRows.map((row, rowIndex) => (
            <text
              key={row}
              x="24"
              y={startY - 100 + rowIndex * (cellSize + gap) + 82}
              fill={COLORS.muted}
              fontSize="22"
              fontWeight="900"
            >
              {row}
            </text>
          ))}
          {heatmapValues.map((row, rowIndex) =>
            row.map((value, columnIndex) => {
              const delay = 20 + rowIndex * 18 + columnIndex * 10;
              const reveal = smooth(frame, delay, delay + 28);
              const color = heatColor(value);
              const x = startX - 610 + columnIndex * (cellSize + gap);
              const y = startY - 100 + rowIndex * (cellSize + gap);
              const critical = rowIndex === 3 && columnIndex === 3;
              return (
                <g key={`${rowIndex}-${columnIndex}`}>
                  <rect
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    fill={
                      value === null ? "rgba(5, 8, 22, 0.48)" : `${color}30`
                    }
                    stroke={critical ? COLORS.high : color}
                    strokeWidth={critical ? 6 : 2}
                    opacity={reveal}
                    style={{
                      filter:
                        value === null
                          ? "none"
                          : `drop-shadow(0 0 ${critical ? 34 : 16}px ${color})`,
                    }}
                  />
                  {value !== null ? (
                    <text
                      x={x + cellSize / 2}
                      y={y + 82}
                      fill={color}
                      fontSize={critical ? 36 : 30}
                      fontWeight="950"
                      textAnchor="middle"
                      opacity={reveal}
                    >
                      {formatNumber(countTo(frame, value, delay, 30), 1)}%
                    </text>
                  ) : null}
                </g>
              );
            }),
          )}
        </svg>
        <div
          style={{
            position: "absolute",
            right: 150,
            bottom: 120,
            opacity: focus,
            transform: `scale(${0.9 + focus * 0.1})`,
          }}
        >
          <div
            style={{
              color: COLORS.high,
              fontSize: 132,
              fontWeight: 950,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 0.9,
              textShadow: `0 0 56px ${COLORS.high}`,
            }}
          >
            94.9%
          </div>
          <div
            style={{
              color: COLORS.text,
              fontSize: 34,
              fontWeight: 950,
              marginTop: 18,
            }}
          >
            高风险
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function PathsScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);

  return (
    <SceneShell opacity={opacity} label="风险路径" title="低风险对比高风险">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 170, top: 145, width: 740 }}>
          <Kicker>路径对照</Kicker>
          <MainTitle size={62} style={{ marginTop: 12 }}>
            高风险组的任务结构
            <br />
            完全不同
          </MainTitle>
        </div>
        <RiskPath
          label="高风险路径"
          items={highRiskPath}
          color={COLORS.high}
          top={374}
          delay={18}
        />
        <RiskPath
          label="低风险路径"
          items={lowRiskPath}
          color={COLORS.low}
          top={680}
          delay={44}
        />
      </AbsoluteFill>
    </SceneShell>
  );
}

const RiskPath: React.FC<{
  label: string;
  items: Array<{ label: string; value: number; suffix: string }>;
  color: string;
  top: number;
  delay: number;
}> = ({ label, items, color, top, delay }) => {
  const frame = useCurrentFrame();
  const line = smooth(frame, delay + 20, delay + 92);
  const positions = items.map((_, index) => ({
    x: 390 + index * 390,
    y: top,
  }));
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 196,
          top: top - 36,
          color,
          fontSize: 28,
          fontWeight: 950,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <svg
        width="1560"
        height="190"
        viewBox="0 0 1560 190"
        style={{ position: "absolute", left: 230, top: top - 80 }}
      >
        <path
          d={`M160 94 H${160 + 1170 * line}`}
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 18px ${color})` }}
        />
      </svg>
      {items.map((item, index) => {
        const reveal = smooth(
          frame,
          delay + index * 18,
          delay + index * 18 + 30,
        );
        return (
          <div
            key={item.label}
            style={{
              position: "absolute",
              left: positions[index].x - 128,
              top: positions[index].y - 62,
              width: 256,
              height: 150,
              border: `1px solid ${color}88`,
              background: "rgba(5, 8, 22, 0.74)",
              boxShadow: `0 0 ${24 * reveal}px ${color}44`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: reveal,
              transform: `scale(${0.9 + reveal * 0.1})`,
            }}
          >
            <div
              style={{
                color: COLORS.muted,
                fontSize: 18,
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </div>
            <MonoNumber
              value={item.value}
              suffix={item.suffix}
              decimals={item.value % 1 === 0 ? 0 : 1}
              start={delay + index * 18}
              duration={28}
              color={color}
              size={44}
            />
          </div>
        );
      })}
    </>
  );
};

function ProtectionScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const compress = smooth(frame, 90, 150);

  return (
    <SceneShell
      opacity={opacity}
      label="人类能力保护"
      title="创造力 x 人际互动"
    >
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 170, top: 145, width: 820 }}>
          <Kicker color={COLORS.low}>保护因素反击</Kicker>
          <MainTitle size={62} style={{ marginTop: 12 }}>
            创造力和互动
            <br />
            让风险曲线急剧下降
          </MainTitle>
        </div>
        <div
          style={{
            position: "absolute",
            left: 260,
            right: 260,
            top: 420,
            display: "grid",
            gridTemplateColumns: "1fr 240px 1fr",
            alignItems: "center",
            gap: 44,
          }}
        >
          <ProtectionBlock
            title="低创造力 + 低互动"
            value={86.6}
            color={COLORS.high}
            delay={22}
            compressed={compress}
          />
          <div
            style={{
              height: 8,
              background: `linear-gradient(90deg, ${COLORS.high}, ${COLORS.low})`,
              boxShadow: `0 0 30px ${COLORS.blue}`,
              transform: `scaleX(${smooth(frame, 48, 110)})`,
            }}
          />
          <ProtectionBlock
            title="高创造力 + 高互动"
            value={0.2}
            color={COLORS.low}
            delay={76}
          />
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

const ProtectionBlock: React.FC<{
  title: string;
  value: number;
  color: string;
  delay: number;
  compressed?: number;
}> = ({ title, value, color, delay, compressed = 0 }) => {
  const frame = useCurrentFrame();
  const reveal = smooth(frame, delay, delay + 34);
  return (
    <div
      style={{
        height: 360,
        border: `1px solid ${color}88`,
        background: `linear-gradient(135deg, ${color}18, rgba(5, 8, 22, 0.78))`,
        boxShadow: `0 0 44px ${color}44`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: reveal,
        transform: `scale(${0.94 + reveal * 0.06 - compressed * 0.08})`,
      }}
    >
      <div
        style={{
          color: COLORS.muted,
          fontSize: 24,
          fontWeight: 900,
          textTransform: "uppercase",
          width: 420,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      <MonoNumber
        value={value}
        suffix="%"
        decimals={1}
        start={delay + 12}
        duration={38}
        color={color}
        size={110 - compressed * 30}
      />
      <div
        style={{
          color: color === COLORS.low ? COLORS.low : COLORS.high,
          fontSize: 28,
          fontWeight: 950,
          marginTop: 18,
        }}
      >
        高风险
      </div>
    </div>
  );
};

function IndicesScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);

  return (
    <SceneShell opacity={opacity} label="指数对撞" title="暴露 / 保护 / 强度">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 170, top: 145, width: 780 }}>
          <Kicker color={COLORS.violet}>衍生信号</Kicker>
          <MainTitle size={60} style={{ marginTop: 12 }}>
            自动化暴露升高
            <br />
            保护能力下降
          </MainTitle>
        </div>
        <div
          style={{
            position: "absolute",
            left: 270,
            right: 240,
            bottom: 130,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 56,
          }}
        >
          {indexProfiles.map((profile, index) => {
            const reveal = smooth(frame, 22 + index * 20, 64 + index * 20);
            return (
              <div
                key={profile.label}
                style={{
                  height: 600,
                  border: `1px solid ${profile.color}66`,
                  background: "rgba(5, 8, 22, 0.58)",
                  padding: "36px 32px",
                  opacity: reveal,
                  transform: `translateY(${(1 - reveal) * 44}px)`,
                }}
              >
                <div
                  style={{
                    color: profile.color,
                    fontSize: 36,
                    fontWeight: 950,
                    textTransform: "uppercase",
                    marginBottom: 34,
                  }}
                >
                  {profile.label}
                </div>
                <IndexGauge
                  label="自动化暴露"
                  value={profile.exposure}
                  color={COLORS.high}
                  delay={34 + index * 20}
                />
                <IndexGauge
                  label="人类保护"
                  value={profile.protection}
                  color={COLORS.low}
                  delay={48 + index * 20}
                />
                <IndexGauge
                  label="AI 强度"
                  value={profile.intensity}
                  color={COLORS.blue}
                  delay={62 + index * 20}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

const IndexGauge: React.FC<{
  label: string;
  value: number;
  color: string;
  delay: number;
}> = ({ label, value, color, delay }) => {
  const frame = useCurrentFrame();
  const reveal = smooth(frame, delay, delay + 34);
  return (
    <div style={{ marginBottom: 38 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: COLORS.muted,
          fontSize: 20,
          fontWeight: 900,
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        <span>{label}</span>
        <span style={{ color }}>
          {formatNumber(countTo(frame, value, delay, 34), 1)}
        </span>
      </div>
      <div
        style={{
          height: 24,
          background: "rgba(17, 49, 79, 0.46)",
          border: `1px solid ${COLORS.grid}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value * reveal}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}66, ${color})`,
            boxShadow: `0 0 20px ${color}`,
          }}
        />
      </div>
    </div>
  );
};

function ModelScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const lock = smooth(frame, 54, 110);

  return (
    <SceneShell opacity={opacity} label="模型中枢" title="逻辑回归">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 170, top: 145, width: 760 }}>
          <Kicker color={COLORS.blue}>预测中枢上线</Kicker>
          <MainTitle size={62} style={{ marginTop: 12 }}>
            高召回模型
            <br />
            适合做预警筛查
          </MainTitle>
        </div>
        <svg
          width="700"
          height="700"
          viewBox="0 0 700 700"
          style={{ position: "absolute", left: 610, top: 190 }}
        >
          <circle
            cx="350"
            cy="350"
            r="250"
            fill="rgba(5, 8, 22, 0.52)"
            stroke={COLORS.blue}
            strokeWidth="2"
            strokeOpacity="0.66"
          />
          <circle
            cx="350"
            cy="350"
            r={160 + glowPulse(frame, 46) * 10}
            fill="none"
            stroke={COLORS.low}
            strokeWidth="4"
            strokeDasharray="20 18"
            strokeOpacity="0.72"
          />
          <path
            d="M350 106 A244 244 0 0 1 594 350"
            fill="none"
            stroke={COLORS.high}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${lock * 383} 383`}
            style={{ filter: `drop-shadow(0 0 18px ${COLORS.high})` }}
          />
          <text
            x="350"
            y="330"
            fill={COLORS.text}
            fontSize="34"
            fontWeight="950"
            textAnchor="middle"
          >
            逻辑
          </text>
          <text
            x="350"
            y="374"
            fill={COLORS.blue}
            fontSize="34"
            fontWeight="950"
            textAnchor="middle"
          >
            回归
          </text>
          <text
            x="350"
            y="430"
            fill={COLORS.low}
            fontSize="22"
            fontWeight="900"
            textAnchor="middle"
            opacity={lock}
          >
            最佳模型锁定
          </text>
        </svg>
        <div
          style={{
            position: "absolute",
            right: 145,
            top: 245,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 26,
          }}
        >
          {modelMetrics.map((metric, index) => (
            <MetricTile
              key={metric.label}
              metric={metric}
              delay={22 + index * 18}
              large
            />
          ))}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function ShapScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);

  return (
    <SceneShell opacity={opacity} label="SHAP 轨道" title="特征归因">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 170, top: 145, width: 760 }}>
          <Kicker color={COLORS.extreme}>风险因子锁定</Kicker>
          <MainTitle size={62} style={{ marginTop: 12 }}>
            模型锁定的不是标签
            <br />
            而是任务结构
          </MainTitle>
        </div>
        <svg
          width="1180"
          height="720"
          viewBox="0 0 1180 720"
          style={{ position: "absolute", right: 120, bottom: 90 }}
        >
          <circle
            cx="330"
            cy="360"
            r="96"
            fill="rgba(0, 209, 255, 0.12)"
            stroke={COLORS.blue}
            strokeWidth="3"
          />
          <text
            x="330"
            y="350"
            fill={COLORS.text}
            fontSize="28"
            fontWeight="950"
            textAnchor="middle"
          >
            高
          </text>
          <text
            x="330"
            y="386"
            fill={COLORS.high}
            fontSize="28"
            fontWeight="950"
            textAnchor="middle"
          >
            风险
          </text>
          {shapImportance.map((item, index) => {
            const delay = 22 + index * 18;
            const reveal = smooth(frame, delay, delay + 38);
            const length = 170 + item.value * 180;
            const angle = -58 + index * 29;
            const rad = (angle / 180) * Math.PI;
            const x2 = 330 + Math.cos(rad) * length * reveal;
            const y2 = 360 + Math.sin(rad) * length * reveal;
            const color =
              index < 2 ? COLORS.high : index < 4 ? COLORS.extreme : COLORS.low;
            return (
              <g key={item.label}>
                <line
                  x1="330"
                  y1="360"
                  x2={x2}
                  y2={y2}
                  stroke={color}
                  strokeWidth={8 - index}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 14px ${color})` }}
                />
                <circle cx={x2} cy={y2} r={14} fill={color} opacity={reveal} />
                <text
                  x={x2 + 26}
                  y={y2 - 8}
                  fill={COLORS.text}
                  fontSize="28"
                  fontWeight="950"
                  opacity={reveal}
                >
                  {item.label}
                </text>
                <text
                  x={x2 + 26}
                  y={y2 + 28}
                  fill={color}
                  fontSize="22"
                  fontWeight="900"
                  opacity={reveal}
                >
                  {formatNumber(countTo(frame, item.value, delay, 34), 3)}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </SceneShell>
  );
}

const clusterDots = Array.from({ length: 260 }, (_, index) => ({
  side: index % 2,
  x: seeded(index, 61),
  y: seeded(index, 62),
  size: 3 + seeded(index, 63) * 5,
}));

function ClusterScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const split = smooth(frame, 16, 92);

  return (
    <SceneShell opacity={opacity} label="聚类分层" title="无监督分群">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 170, top: 145, width: 760 }}>
          <Kicker color={COLORS.violet}>两类岗位画像</Kicker>
          <MainTitle size={62} style={{ marginTop: 12 }}>
            两类岗位画像
            <br />
            完全分化
          </MainTitle>
        </div>
        <svg
          width="1300"
          height="600"
          viewBox="0 0 1300 600"
          style={{ position: "absolute", left: 350, top: 315 }}
        >
          <line
            x1="650"
            y1="30"
            x2="650"
            y2="570"
            stroke={COLORS.grid}
            strokeWidth="2"
            strokeDasharray="10 14"
          />
          {clusterDots.map((dot, index) => {
            const targetX =
              dot.side === 0 ? 245 + dot.x * 310 : 745 + dot.x * 330;
            const targetY = 90 + dot.y * 410;
            const startX = 620 + (dot.x - 0.5) * 110;
            const startY = 300 + (dot.y - 0.5) * 80;
            const x = startX + (targetX - startX) * split;
            const y = startY + (targetY - startY) * split;
            const color = dot.side === 0 ? COLORS.high : COLORS.low;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={dot.size}
                fill={color}
                opacity={0.32 + split * 0.54}
              />
            );
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 280,
            bottom: 122,
            right: 280,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 90,
          }}
        >
          {clusterProfiles.map((profile, index) => (
            <div
              key={profile.label}
              style={{
                border: `1px solid ${profile.color}88`,
                background: "rgba(5, 8, 22, 0.72)",
                padding: "28px 34px",
                boxShadow: `0 0 34px ${profile.color}44`,
                opacity: smooth(frame, 70 + index * 16, 104 + index * 16),
              }}
            >
              <div
                style={{
                  color: profile.color,
                  fontSize: 30,
                  fontWeight: 950,
                  textTransform: "uppercase",
                }}
              >
                {profile.label} / {profile.n.toLocaleString()} 个样本
              </div>
              <div style={{ marginTop: 18 }}>
                <MonoNumber
                  value={profile.highRate}
                  suffix="%"
                  decimals={1}
                  start={80 + index * 16}
                  duration={36}
                  color={profile.color}
                  size={70}
                />
              </div>
              <div
                style={{
                  color: COLORS.muted,
                  fontSize: 22,
                  fontWeight: 850,
                  marginTop: 14,
                }}
              >
                {profile.description}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function RedesignScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const dissolve = smooth(frame, 24, 86);

  return (
    <SceneShell opacity={opacity} label="岗位重设计" title="从风险塔到能力结构">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 170, top: 145, width: 820 }}>
          <Kicker color={COLORS.low}>行动转向</Kicker>
          <MainTitle size={62} style={{ marginTop: 12 }}>
            高风险岗位需要重设计
            <br />
            而不只是培训
          </MainTitle>
        </div>
        <svg
          width="1420"
          height="580"
          viewBox="0 0 1420 580"
          style={{ position: "absolute", left: 250, top: 360 }}
        >
          <g opacity={1 - dissolve * 0.72}>
            {Array.from({ length: 8 }, (_, index) => {
              const height = 70 + index * 34;
              return (
                <rect
                  key={index}
                  x={130 - index * 12}
                  y={470 - height}
                  width={190 + index * 24}
                  height={height}
                  fill={index > 4 ? COLORS.high : COLORS.extreme}
                  opacity="0.24"
                  stroke={COLORS.high}
                  strokeOpacity="0.8"
                />
              );
            })}
            <text
              x="195"
              y="528"
              fill={COLORS.high}
              fontSize="32"
              fontWeight="950"
              textAnchor="middle"
            >
              风险塔
            </text>
          </g>
          {redesignPaths.map((path, index) => {
            const reveal = smooth(frame, 48 + index * 18, 92 + index * 18);
            const x = 500 + index * 215;
            const y = 190 + (index % 2) * 150;
            return (
              <g key={path} opacity={reveal}>
                <path
                  d={`M310 310 C${400 + index * 70} ${130 + index * 40}, ${
                    x - 55
                  } ${y}, ${x} ${y}`}
                  fill="none"
                  stroke={index % 2 === 0 ? COLORS.low : COLORS.blue}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${reveal * 460} 460`}
                  style={{
                    filter: `drop-shadow(0 0 14px ${
                      index % 2 === 0 ? COLORS.low : COLORS.blue
                    })`,
                  }}
                />
                <rect
                  x={x}
                  y={y - 58}
                  width="190"
                  height="116"
                  fill="rgba(5, 8, 22, 0.78)"
                  stroke={index % 2 === 0 ? COLORS.low : COLORS.blue}
                  strokeWidth="2"
                />
                <text
                  x={x + 95}
                  y={y - 6}
                  fill={COLORS.text}
                  fontSize="25"
                  fontWeight="950"
                  textAnchor="middle"
                >
                  {path.slice(0, 5)}
                </text>
                <text
                  x={x + 95}
                  y={y + 28}
                  fill={COLORS.muted}
                  fontSize="21"
                  fontWeight="850"
                  textAnchor="middle"
                >
                  {path.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </SceneShell>
  );
}

function GovernanceScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const loop = smooth(frame, 28, 128);

  return (
    <SceneShell opacity={opacity} label="治理闭环" title="筛查，而不是直接决策">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 170, top: 145, width: 850 }}>
          <Kicker color={COLORS.low}>决策治理</Kicker>
          <MainTitle size={62} style={{ marginTop: 12 }}>
            模型用于筛查
            <br />
            不用于直接决策
          </MainTitle>
        </div>
        <svg
          width="1180"
          height="620"
          viewBox="0 0 1180 620"
          style={{ position: "absolute", left: 420, top: 350 }}
        >
          <path
            d="M240 160 H940 V450 H240 Z"
            fill="none"
            stroke={COLORS.blue}
            strokeWidth="5"
            strokeDasharray={`${loop * 1740} 1740`}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 18px ${COLORS.blue})` }}
          />
          {governanceSteps.map((step, index) => {
            const positions = [
              { x: 160, y: 100 },
              { x: 780, y: 100 },
              { x: 780, y: 390 },
              { x: 160, y: 390 },
            ];
            const position = positions[index];
            const reveal = smooth(frame, 30 + index * 22, 64 + index * 22);
            return (
              <g key={step} opacity={reveal}>
                <rect
                  x={position.x}
                  y={position.y}
                  width="320"
                  height="120"
                  fill="rgba(5, 8, 22, 0.8)"
                  stroke={index === 0 ? COLORS.high : COLORS.low}
                  strokeWidth="3"
                />
                <text
                  x={position.x + 160}
                  y={position.y + 72}
                  fill={COLORS.text}
                  fontSize="34"
                  fontWeight="950"
                  textAnchor="middle"
                >
                  {step}
                </text>
              </g>
            );
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            right: 190,
            bottom: 154,
            color: COLORS.muted,
            fontSize: 28,
            fontWeight: 850,
            lineHeight: 1.35,
            width: 420,
            opacity: smooth(frame, 96, 130),
          }}
        >
          风险信号进入人工复核和岗位重设计流程，而不是成为自动裁员按钮。
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}

function ClosingScene({ durationInFrames }: { durationInFrames: number }) {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, durationInFrames);
  const reveal = smooth(frame, 14, 70);

  return (
    <SceneShell
      opacity={opacity}
      label="结论"
      title="岗位价值被重新定义"
      intensity={1.26}
    >
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <svg
          width="1200"
          height="660"
          viewBox="0 0 1200 660"
          style={{ position: "absolute", opacity: 0.5 }}
        >
          {Array.from({ length: 44 }, (_, index) => {
            const angle = (index / 44) * Math.PI * 2 + frame * 0.008;
            const r = 120 + (index % 7) * 42;
            const x = 600 + Math.cos(angle) * r;
            const y = 330 + Math.sin(angle) * r * 0.72;
            const nextAngle = ((index + 9) / 44) * Math.PI * 2 + frame * 0.008;
            const nx = 600 + Math.cos(nextAngle) * r;
            const ny = 330 + Math.sin(nextAngle) * r * 0.72;
            const color = index % 5 === 0 ? COLORS.low : COLORS.blue;
            return (
              <g key={index}>
                <line
                  x1={x}
                  y1={y}
                  x2={nx}
                  y2={ny}
                  stroke={color}
                  strokeOpacity="0.28"
                />
                <circle cx={x} cy={y} r="5" fill={color} opacity="0.72" />
              </g>
            );
          })}
        </svg>
        <div
          style={{
            width: 1120,
            textAlign: "center",
            opacity: reveal,
            transform: `translateY(${(1 - reveal) * 42}px)`,
          }}
        >
          <Kicker color={COLORS.low}>最终洞察</Kicker>
          <MainTitle size={72} style={{ marginTop: 22 }}>
            不是 AI 替代人
            <br />
            而是岗位价值被重新定义
          </MainTitle>
          <div
            style={{
              margin: "42px auto 0",
              width: 960,
              color: COLORS.muted,
              fontSize: 31,
              fontWeight: 850,
              lineHeight: 1.48,
            }}
          >
            真正的应对方向，是把岗位从重复执行推向判断、复核、协调、创新和业务决策。
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
}
