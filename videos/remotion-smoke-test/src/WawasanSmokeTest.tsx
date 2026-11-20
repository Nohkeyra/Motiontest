import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const ESPRESSO = '#291A17';
const CREAM = '#F8EAD1';

/** A six-second rendering smoke test, not a reconstruction of the Wawasan app. */
export const WawasanSmokeTest: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 17, stiffness: 85, mass: 1}});
  const titleY = interpolate(enter, [0, 1], [180, 0]);
  const ruleWidth = interpolate(frame, [22, 72], [0, 680], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subtitleOpacity = interpolate(frame, [56, 90, 152, 174], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const endOpacity = interpolate(frame, [150, 175], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: ESPRESSO, color: CREAM, justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      <div style={{width: 820, textAlign: 'center', transform: `translateY(${titleY}px)`, opacity: enter * endOpacity}}>
        <div style={{fontFamily: 'Arial, sans-serif', fontSize: 113, fontWeight: 900, letterSpacing: -4, lineHeight: 1.04}}>WAWASAN</div>
      </div>
      <div style={{width: ruleWidth, height: 8, backgroundColor: CREAM, marginTop: 48, opacity: endOpacity}} />
      <div style={{fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 43, letterSpacing: 1.5, textAlign: 'center', maxWidth: 850, marginTop: 70, opacity: subtitleOpacity}}>
        SATU TAP, REALITI BERLIPAT
      </div>
      <div style={{position: 'absolute', bottom: 100, color: CREAM, fontFamily: 'Arial, sans-serif', fontSize: 28, opacity: 0.5}}>
        REMOTION RENDER TEST · 1080 × 1920 · 30 FPS
      </div>
    </AbsoluteFill>
  );
};
