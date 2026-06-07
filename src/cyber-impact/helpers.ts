import { Easing, interpolate, spring } from "remotion";

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export const smooth = (frame: number, start: number, end: number) => {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

export const sharp = (frame: number, start: number, end: number) => {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.87, 0, 0.13, 1),
  });
};

export const sceneOpacity = (frame: number, durationInFrames: number) => {
  const enter = smooth(frame, 0, 16);
  const exit = interpolate(
    frame,
    [durationInFrames - 16, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.7, 0, 0.84, 0),
    },
  );
  return Math.min(enter, exit);
};

export const countTo = (
  frame: number,
  target: number,
  start: number,
  duration: number,
) => {
  return interpolate(frame, [start, start + duration], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

export const formatNumber = (value: number, decimals = 0) => {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  return String(Math.round(value));
};

export const glowPulse = (frame: number, speed = 36) => {
  return 0.5 + Math.sin((frame / speed) * Math.PI * 2) * 0.5;
};

export const springIn = (frame: number, fps: number, delay = 0) => {
  return spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 16,
      stiffness: 130,
      mass: 0.8,
    },
  });
};

export const seeded = (index: number, salt = 0) => {
  const x = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
