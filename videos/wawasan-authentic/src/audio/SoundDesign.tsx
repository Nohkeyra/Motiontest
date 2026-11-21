import React from 'react';
import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';

// Sound cues are generated deterministically by scripts/generate-wawasan-sfx.py.
// The source sound library is procedural, so no licensing/download dependency.
// This module does NOT replace the user-selected music or modify MasterCut.
export const WAWASAN_SFX = {
  tap: {seconds: 0.18, description: 'Tactile UI tap', defaultDb: -2},
  card_expand: {seconds: 0.43, description: 'Card expansion', defaultDb: -3},
  whoosh: {seconds: 0.68, description: 'Spatial transition', defaultDb: -3},
  type_hit: {seconds: 0.34, description: 'Kinetic typography impact', defaultDb: -3},
  map_trace: {seconds: 0.82, description: 'Animated route trace', defaultDb: -5},
  complete: {seconds: 0.75, description: 'Delivery completed', defaultDb: -4},
  paper_swipe: {seconds: 0.45, description: 'Invoice paper swipe', defaultDb: -3},
  logo_impact: {seconds: 0.96, description: 'Brand impact', defaultDb: -3},
  shimmer: {seconds: 0.92, description: 'Brand tonal shimmer', defaultDb: -5},
} as const;

export type SfxName = keyof typeof WAWASAN_SFX;
export type SoundCue = {name: SfxName; frame: number; gainDb?: number};
export const dbToGain = (db: number) => Math.pow(10, db / 20);
const ease=(x:number)=>{
  const v=Math.max(0,Math.min(1,x));
  return v*v*(3-2*v);
};

// Optional helper when music is provided later; music is NOT installed or
// ducked automatically in the existing main film.
// Returns a volume envelope with gentle attack/release near each cue.
export const musicVolumeWithDucking = (
  frame: number,
  cues: SoundCue[],
  musicBaseVolume = 1,
  duckDb = -3,
): number => {
  let maxEnvelope=0;
  for(const cue of cues){
    const a=ease((frame-(cue.frame-5))/5);
    const b=1-ease((frame-(cue.frame+6))/18);
    maxEnvelope=Math.max(maxEnvelope,a*b);
  }
  return musicBaseVolume*dbToGain(duckDb*maxEnvelope);
};

export const SoundCueTrack: React.FC<{
  cues: SoundCue[];
  busGainDb?: number;
  muted?: boolean;
}> = ({cues,busGainDb=-5,muted=false}) => {
  const {fps}=useVideoConfig();
  if(muted) return null;
  return <>
    {cues.map((cue,index)=>{
      const info=WAWASAN_SFX[cue.name];
      const duration=Math.ceil(info.seconds*fps);
      const baseGain=dbToGain(busGainDb+info.defaultDb+(cue.gainDb??0));
      const startFrame=Math.max(0,Math.floor(cue.frame));
      return <Sequence key={index+'-'+cue.name}
        from={startFrame} durationInFrames={duration} layout="none">
        <Audio src={staticFile('audio/sfx/'+cue.name+'.wav')}
          volume={(f)=>{
            const attack=Math.min(1,(f+1)/2);
            const release=Math.min(1,Math.max(0,(duration-f)/Math.max(2,fps*.09)));
            return baseGain*attack*release;
          }}/>
      </Sequence>;
    })}
  </>;
};

// Standalone demonstration of where a future 30-second film could place cues.
// Positions are EXAMPLES; the actual film's tap and route times must be reviewed
// against its real captured interactions before enabling this on MasterCut.
export const SFX_PREVIEW_CUES: SoundCue[] = [
  {name:'tap', frame:9},
  {name:'card_expand', frame:31},
  {name:'whoosh', frame:58},
  {name:'type_hit', frame:86},
  {name:'map_trace', frame:113},
  {name:'complete', frame:143},
  {name:'paper_swipe', frame:167},
  {name:'logo_impact', frame:199},
  {name:'shimmer', frame:228},
];
