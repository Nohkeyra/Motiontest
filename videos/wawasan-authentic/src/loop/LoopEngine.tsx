import {useCurrentFrame, useVideoConfig} from 'remotion';

// Pure frame-derived motion: seekable, reproducible and unaffected by wall-clock
// time or requestAnimationFrame. A full cycle takes exactly durationFrames.
export const TWO_PI = Math.PI * 2;
export const wrap01 = (value: number): number => ((value % 1) + 1) % 1;
export const loopPhase = (
  frame: number,
  durationFrames: number,
  cycles = 1,
  phaseOffset = 0,
): number => {
  if (!Number.isFinite(durationFrames) || durationFrames <= 0) {
    throw new Error('durationFrames must be positive');
  }
  if (!Number.isInteger(cycles) || cycles < 1) {
    throw new Error('cycles must be a positive integer for seamless looping');
  }
  return TWO_PI * wrap01((frame * cycles) / durationFrames + phaseOffset);
};

export const loopOrbit = (
  phase: number,
  radiusX: number,
  radiusY: number,
) => ({x: radiusX * Math.cos(phase), y: radiusY * Math.sin(phase)});

export const loopPulse = (phase: number, center: number, amplitude: number) =>
  center + amplitude * Math.sin(phase);

// Hook for a full-composition loop. All layers must use integer cycles,
// ensuring frame 0 and the position at frame=durationInFrames coincide.
export const useWawasanLoop = (cycles = 1, phaseOffset = 0) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const phase = loopPhase(frame, durationInFrames, cycles, phaseOffset);
  return {frame, fps, durationFrames: durationInFrames, phase,
    progress: wrap01(frame / durationInFrames)};
};
