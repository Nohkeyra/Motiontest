import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {AnimatedWawasanLogo} from '../brand/WawasanLogoMotion';

// Pinned @remotion/transitions v4.0.545. Reusable, predictable transition recipes.
// Ordinary UI content stays authentic; these demonstrate the transition grammar
// using editorial test plates, not fabricated screenshots of the app.
export const WAWASAN_TRANSITION_FRAMES = 15;
export const wawasanPresentation = {
  softFade: () => fade(),
  kineticPush: () => slide({direction:'from-right'}),
  editorialWipe: () => wipe({direction:'from-bottom'}),
  spotlightClock: (width:number,height:number) => clockWipe({width,height}),
} as const;

const ink='#291A17',cream='#F8EAD1',amber='#F4A51C',clay='#A75130';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const Base:React.FC<{bg:string;children:React.ReactNode}>=({bg,children})=>
  <AbsoluteFill style={{backgroundColor:bg,overflow:'hidden',
    fontFamily:'Arial, sans-serif'}}>{children}</AbsoluteFill>;

const Marker:React.FC<{value:string;light?:boolean}>=({value,light=false})=>
  <div style={{position:'absolute',top:90,left:78,right:78,
    color:light?cream:ink,fontSize:25,letterSpacing:4,fontWeight:900}}>
    WAWASAN / {value}
  </div>;

const EditorialScene:React.FC=()=>{
  const f=useCurrentFrame();
  const rise=interpolate(f,[0,22],[75,0],clamp);
  return <Base bg={cream}>
    <Marker value="01 — EDITORIAL" />
    <div style={{position:'absolute',left:-85,top:490,width:640,height:640,
      borderRadius:'50%',backgroundColor:amber,opacity:.65}}/>
    <div style={{position:'absolute',right:-230,top:1020,
      width:730,height:720,backgroundColor:clay,
      borderRadius:95,transform:'rotate(-25deg)'}}/>
    <div style={{position:'absolute',left:76,right:40,top:680,
      fontWeight:900,fontSize:166,letterSpacing:-10,lineHeight:.87,
      color:ink,transform:'translateY('+rise+'px)'}}>
      ONE<br/>TAP.
    </div>
    <div style={{position:'absolute',left:78,bottom:145,
      fontSize:31,fontWeight:800,letterSpacing:3,color:ink}}>
      TYPOGRAPHY · EDITORIAL MOTION
    </div>
  </Base>;
};

const MotionSpaceScene:React.FC=()=>{
  const f=useCurrentFrame();
  const shift=interpolate(f,[0,60],[-130,130],clamp);
  return <Base bg={ink}>
    <Marker value="02 — KINETIC" light/>
    <div style={{position:'absolute',top:450,left:115+shift,
      width:820,height:820,borderRadius:'50%',
      border:'35px solid '+amber,opacity:.75}}/>
    <div style={{position:'absolute',top:675,left:175-shift,
      width:720,height:720,borderRadius:'50%',
      border:'9px solid '+cream,opacity:.55}}/>
    <div style={{position:'absolute',left:72,right:60,top:705,
      fontSize:148,lineHeight:.9,letterSpacing:-9,
      fontWeight:900,color:cream}}>
      REALITY<br/>FOLDS.
    </div>
    <div style={{position:'absolute',left:75,bottom:145,
      fontSize:30,letterSpacing:3,color:amber,fontWeight:900}}>
      COMPOSITION TEST · NOT APP UI
    </div>
  </Base>;
};

const SpatialScene:React.FC=()=>{
  const f=useCurrentFrame();
  const rotate=interpolate(f,[0,58],[-12,19],clamp);
  return <Base bg={amber}>
    <Marker value="03 — SPATIAL" />
    <div style={{position:'absolute',left:170,top:490,width:740,height:880,
      borderRadius:90,backgroundColor:ink,
      transform:'rotate('+rotate+'deg)',
      boxShadow:'35px 40px 0 rgba(41,26,23,.18)'}}/>
    <div style={{position:'absolute',left:225,top:700,right:75,
      fontSize:130,fontWeight:900,letterSpacing:-8,lineHeight:.88,
      color:cream}}>DEPTH.<br/>MOTION.</div>
    <div style={{position:'absolute',left:75,bottom:145,
      fontSize:29,fontWeight:900,letterSpacing:3,color:ink}}>
      FRAME-ACCURATE TRANSITIONS
    </div>
  </Base>;
};

export const WawasanCinematicTransitions:React.FC=()=>{
  const {width,height}=useVideoConfig();
  return <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={60}>
      <AnimatedWawasanLogo mode="cinematic"/>
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={wawasanPresentation.softFade()}
      timing={linearTiming({durationInFrames:WAWASAN_TRANSITION_FRAMES})}/>
    <TransitionSeries.Sequence durationInFrames={60}>
      <EditorialScene/>
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={wawasanPresentation.kineticPush()}
      timing={linearTiming({durationInFrames:WAWASAN_TRANSITION_FRAMES})}/>
    <TransitionSeries.Sequence durationInFrames={60}>
      <MotionSpaceScene/>
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={wawasanPresentation.editorialWipe()}
      timing={linearTiming({durationInFrames:WAWASAN_TRANSITION_FRAMES})}/>
    <TransitionSeries.Sequence durationInFrames={60}>
      <SpatialScene/>
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={wawasanPresentation.spotlightClock(width,height)}
      timing={linearTiming({durationInFrames:WAWASAN_TRANSITION_FRAMES})}/>
    <TransitionSeries.Sequence durationInFrames={60}>
      <AnimatedWawasanLogo mode="outro"/>
    </TransitionSeries.Sequence>
  </TransitionSeries>;
};
// 5 × 60-frame sequences − 4 × 15-frame overlaps = 240 frames / 8s.
