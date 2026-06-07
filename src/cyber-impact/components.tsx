import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import {
  COLORS,
  CYBER_HEIGHT,
  CYBER_WIDTH,
  FONT_STACK,
  type MetricDatum,
} from "./data";
import { countTo, formatNumber, glowPulse, seeded, smooth } from "./helpers";

const stars = Array.from({ length: 180 }, (_, index) => ({
  x: seeded(index, 1) * CYBER_WIDTH,
  y: seeded(index, 2) * CYBER_HEIGHT,
  size: 1 + seeded(index, 3) * 3.4,
  speed: 0.25 + seeded(index, 4) * 1.2,
  phase: seeded(index, 5) * Math.PI * 2,
}));

const networkNodes = Array.from({ length: 54 }, (_, index) => ({
  x: seeded(index, 10) * CYBER_WIDTH,
  y: seeded(index, 11) * CYBER_HEIGHT,
  radius: 2 + seeded(index, 12) * 4,
}));

const rainColumns = Array.from({ length: 34 }, (_, index) => ({
  x: 80 + index * 54 + seeded(index, 21) * 20,
  height: 120 + seeded(index, 22) * 280,
  delay: seeded(index, 23) * 90,
  opacity: 0.06 + seeded(index, 24) * 0.18,
}));

export const CyberBackground: React.FC<{ intensity?: number }> = ({
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const scanY = (frame * 5.2) % (CYBER_HEIGHT + 240);
  const pulse = glowPulse(frame, 80);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 42%, rgba(0, 209, 255, 0.13), transparent 30%), linear-gradient(135deg, #050816 0%, #08111F 52%, #050816 100%)",
        overflow: "hidden",
        fontFamily: FONT_STACK,
      }}
    >
      <svg
        width={CYBER_WIDTH}
        height={CYBER_HEIGHT}
        viewBox={`0 0 ${CYBER_WIDTH} ${CYBER_HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="gridFade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={COLORS.blue} stopOpacity="0.02" />
            <stop offset="50%" stopColor={COLORS.blue} stopOpacity="0.18" />
            <stop offset="100%" stopColor={COLORS.blue} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {Array.from({ length: 33 }, (_, index) => {
          const y = index * 34;
          return (
            <line
              key={`h-${index}`}
              x1="0"
              y1={y}
              x2={CYBER_WIDTH}
              y2={y}
              stroke={COLORS.grid}
              strokeOpacity={0.16 * intensity}
              strokeWidth="1"
            />
          );
        })}
        {Array.from({ length: 49 }, (_, index) => {
          const x = index * 40;
          return (
            <line
              key={`v-${index}`}
              x1={x}
              y1="0"
              x2={x}
              y2={CYBER_HEIGHT}
              stroke={COLORS.grid}
              strokeOpacity={0.13 * intensity}
              strokeWidth="1"
            />
          );
        })}
        <rect
          x="0"
          y={scanY - 120}
          width={CYBER_WIDTH}
          height="240"
          fill="url(#gridFade)"
          opacity={0.6 * intensity}
        />
        {networkNodes.map((node, index) => {
          const next = networkNodes[(index + 7) % networkNodes.length];
          const opacity =
            (0.05 + 0.07 * Math.sin(frame / 38 + index)) * intensity;
          return (
            <line
              key={`link-${index}`}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke={COLORS.blue}
              strokeOpacity={Math.max(0.01, opacity)}
              strokeWidth="1"
            />
          );
        })}
        {networkNodes.map((node, index) => (
          <circle
            key={`node-${index}`}
            cx={node.x}
            cy={node.y}
            r={node.radius}
            fill={index % 5 === 0 ? COLORS.low : COLORS.blue}
            opacity={
              (0.12 + glowPulse(frame + index * 3, 48) * 0.26) * intensity
            }
          />
        ))}
        {stars.map((star, index) => {
          const y = (star.y + frame * star.speed) % CYBER_HEIGHT;
          const opacity =
            (0.18 + Math.sin(frame / 20 + star.phase) * 0.14) * intensity;
          return (
            <circle
              key={`star-${index}`}
              cx={star.x}
              cy={y}
              r={star.size}
              fill={index % 9 === 0 ? COLORS.violet : COLORS.blue}
              opacity={Math.max(0.03, opacity)}
            />
          );
        })}
        {rainColumns.map((column, index) => {
          const y = (frame * 7 + column.delay * 12) % (CYBER_HEIGHT + 320);
          return (
            <rect
              key={`rain-${index}`}
              x={column.x}
              y={y - 260}
              width="2"
              height={column.height}
              fill={index % 4 === 0 ? COLORS.low : COLORS.blue}
              opacity={column.opacity * intensity}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 240px rgba(0, 0, 0, ${0.64 + pulse * 0.1})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const HudFrame: React.FC<{ title?: string; label?: string }> = ({
  title,
  label,
}) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width={CYBER_WIDTH}
        height={CYBER_HEIGHT}
        viewBox={`0 0 ${CYBER_WIDTH} ${CYBER_HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d="M70 88 H380 M70 88 V270 M1850 88 H1540 M1850 88 V270 M70 992 H380 M70 992 V810 M1850 992 H1540 M1850 992 V810"
          fill="none"
          stroke={COLORS.blue}
          strokeWidth="2"
          strokeOpacity="0.55"
        />
        <path
          d="M104 124 H308 M1612 956 H1816"
          fill="none"
          stroke={COLORS.low}
          strokeWidth="4"
          strokeOpacity="0.62"
        />
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 58,
            color: COLORS.blue,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 0,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      ) : null}
      {title ? (
        <div
          style={{
            position: "absolute",
            right: 96,
            top: 58,
            color: COLORS.muted,
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: 0,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const SceneShell: React.FC<{
  children: ReactNode;
  opacity?: number;
  label?: string;
  title?: string;
  intensity?: number;
}> = ({ children, opacity = 1, label, title, intensity = 1 }) => {
  return (
    <AbsoluteFill
      style={{
        opacity,
        color: COLORS.text,
        fontFamily: FONT_STACK,
        overflow: "hidden",
      }}
    >
      <CyberBackground intensity={intensity} />
      <HudFrame label={label} title={title} />
      {children}
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{ children: ReactNode; color?: string }> = ({
  children,
  color = COLORS.blue,
}) => {
  return (
    <div
      style={{
        color,
        fontSize: 22,
        fontWeight: 900,
        letterSpacing: 0,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
};

export const MainTitle: React.FC<{
  children: ReactNode;
  size?: number;
  style?: CSSProperties;
}> = ({ children, size = 76, style }) => {
  return (
    <div
      style={{
        fontSize: size,
        lineHeight: 1.02,
        fontWeight: 950,
        letterSpacing: 0,
        textShadow: "0 0 32px rgba(0, 209, 255, 0.25)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const MonoNumber: React.FC<{
  value: number;
  suffix?: string;
  decimals?: number;
  start?: number;
  duration?: number;
  color?: string;
  size?: number;
}> = ({
  value,
  suffix = "",
  decimals = 0,
  start = 0,
  duration = 40,
  color = COLORS.text,
  size = 70,
}) => {
  const frame = useCurrentFrame();
  const display = countTo(frame, value, start, duration);
  return (
    <span
      style={{
        color,
        fontSize: size,
        fontWeight: 950,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        textShadow: `0 0 34px ${color}66`,
      }}
    >
      {formatNumber(display, decimals)}
      {suffix}
    </span>
  );
};

export const MetricTile: React.FC<{
  metric: MetricDatum;
  delay?: number;
  large?: boolean;
}> = ({ metric, delay = 0, large = false }) => {
  const frame = useCurrentFrame();
  const reveal = smooth(frame, delay, delay + 24);
  return (
    <div
      style={{
        position: "relative",
        width: large ? 330 : 276,
        height: large ? 172 : 144,
        padding: large ? "30px 32px" : "24px 26px",
        border: `1px solid ${metric.color ?? COLORS.blue}88`,
        background:
          "linear-gradient(135deg, rgba(8, 17, 31, 0.82), rgba(5, 8, 22, 0.62))",
        boxShadow: `0 0 ${20 + reveal * 36}px ${metric.color ?? COLORS.blue}30`,
        clipPath:
          "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 30}px) scale(${0.94 + reveal * 0.06})`,
      }}
    >
      <div
        style={{
          color: COLORS.muted,
          fontSize: large ? 24 : 20,
          fontWeight: 800,
          letterSpacing: 0,
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        {metric.label}
      </div>
      <MonoNumber
        value={metric.value}
        suffix={metric.suffix}
        decimals={metric.decimals}
        start={delay + 6}
        duration={38}
        color={metric.color ?? COLORS.blue}
        size={large ? 68 : 56}
      />
    </div>
  );
};

export const BrandMark: React.FC<{
  src: string;
  label: string;
  delay: number;
}> = ({ src, label, delay }) => {
  const frame = useCurrentFrame();
  const reveal = smooth(frame, delay, delay + 28);
  return (
    <div
      style={{
        width: 420,
        height: 210,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        border: `1px solid ${COLORS.blue}66`,
        background: "rgba(5, 8, 22, 0.64)",
        boxShadow: `0 0 ${32 * reveal}px ${COLORS.blue}36`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 42}px)`,
        clipPath:
          "polygon(34px 0, 100% 0, 100% calc(100% - 34px), calc(100% - 34px) 100%, 0 100%, 0 34px)",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: 96,
          height: 96,
          objectFit: "contain",
          filter: `drop-shadow(0 0 18px ${COLORS.blue}88)`,
        }}
      />
      <div
        style={{
          color: COLORS.text,
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: 0,
        }}
      >
        {label}
      </div>
    </div>
  );
};
