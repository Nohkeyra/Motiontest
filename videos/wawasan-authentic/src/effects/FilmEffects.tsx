import React, {useId} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

// Deterministic, frame-based graphic effects — not part of the app UI.
// Palette stays Wawasan: espresso, cream, amber, clay. Never warp UI labels.
export const FX = {
  espresso: '#291A17',
  cream: '#F8EAD1',
  amber: '#F4A51C',
  clay: '#A75130',
  muted: '#D3AA73',
} as const;
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const progress=(f:number,a:number,b:number)=>{
  const x=interpolate(f,[a,b],[0,1],clamp);
  return x*x*(3-2*x);
};

type Common={opacity?:number};

// WAVE WARP: actual SVG fractal displacement, only for decoration / texture.
// Use a fixed noise seed and continuous scale envelope to prevent jumps.
export const WaveWarp:React.FC<Common&{
  children:React.ReactNode;
  strength?:number;
  frequency?:number;
  offset?:number;
}>=({children,opacity=1,strength=13,frequency=0.008,offset=0})=>{
  const uid='wave-'+useId().replace(/:/g,'');
  const f=useCurrentFrame()+offset;
  const envelope=(0.48+0.52*Math.sin(f*0.065+0.5));
  const amount=strength*envelope;
  return <AbsoluteFill style={{opacity,pointerEvents:'none'}}>
    <svg width="0" height="0" style={{position:'absolute',overflow:'visible'}}
      aria-hidden="true">
      <defs>
        <filter id={uid} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency={frequency}
            numOctaves={2} seed={4} result="wave-noise"/>
          <feDisplacementMap in="SourceGraphic" in2="wave-noise"
            scale={amount} xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    </svg>
    <AbsoluteFill style={{filter:'url(#'+uid+')'}}>{children}</AbsoluteFill>
  </AbsoluteFill>;
};

// GAUSSIAN BLUR: smooth kinetic motion trail on large editorial shapes.
// Intentionally not applied to readable text, logos, or authentic app UI.
export const GaussianBlurTrail:React.FC<Common&{
  color?:string;
  blur?:number;
  x?:number;
  y?:number;
  width?:number;
  height?:number;
  speed?:number;
}>=({color=FX.amber,opacity=0.28,blur=40,x=110,y=650,
  width=780,height=560,speed=0.6})=>{
  const f=useCurrentFrame();
  const drift=Math.sin(f*speed*0.045)*100;
  return <div aria-hidden="true" style={{
    position:'absolute',left:x+drift,top:y,width,height,
    pointerEvents:'none',
    borderRadius:'50%',opacity,
    background:'radial-gradient(ellipse at center,'+color+' 0%,transparent 67%)',
    filter:'blur('+Math.min(100,Math.max(0,blur))+'px)',
    transform:'rotate(-16deg)'
  }}/>;
};

const fract=(x:number)=>x-Math.floor(x);
const random=(x:number,y:number)=>fract(Math.sin(x*127.1+y*311.7)*43758.5453);
const valueNoise=(x:number,seed:number)=>{
  const i=Math.floor(x),f=x-i;
  const t=f*f*(3-2*f);
  return (random(i,seed)*(1-t)+random(i+1,seed)*t)*2-1;
};
const ridged=(x:number,seed:number)=>{
  let sum=0,amp=0.56,freq=1.0;
  for(let i=0;i<5;i++){
    const n=valueNoise(x*freq+i*8.71,seed+i*3.9);
    const ridge=1-Math.abs(n);
    sum+=ridge*ridge*amp;
    freq*=2.12;
    amp*=0.49;
  }
  return sum;
};

// FRACTAL RIDGES: genuinely multi-octave ridged noise evaluated at each frame.
// Lines are decorative terrain / paper-cut contours, not a substitute for a map.
export const FractalRidges:React.FC<Common&{
  color?:string;
  x?:number;
  y?:number;
  width?:number;
  height?:number;
  lines?:number;
  amplitude?:number;
}>=({color=FX.amber,opacity=.16,x=0,y=590,
  width=1080,height=900,lines=6,amplitude=170})=>{
  const f=useCurrentFrame();
  const paths=Array.from({length:lines},(_,line)=>{
    const coords:string[]=[];
    const phase=f*0.0035;
    for(let i=0;i<=154;i++){
      const u=i/154;
      const n=ridged(u*4.8+phase,line*8.5+1.2);
      const px=u*width;
      const py=(line+0.65)*(height/(lines+0.75))-n*amplitude;
      coords.push((i===0?'M':'L')+px.toFixed(1)+' '+py.toFixed(1));
    }
    return coords.join(' ');
  });
  return <svg aria-hidden="true" viewBox={'0 0 '+width+' '+height}
    style={{position:'absolute',left:x,top:y,width,height,
      opacity,pointerEvents:'none',overflow:'visible'}}>
    {paths.map((path,i)=><path key={i} d={path}
      fill="none" stroke={color} strokeWidth={i===2?7:3.2}
      strokeLinecap="round" strokeLinejoin="round"
      opacity={1-i/Math.max(1,lines)*0.39}/>)}
  </svg>;
};

// SPECTRAL MAP: a subtle palette-mapped prism flare. It is kept BEHIND content
// and uses brand hues rather than rainbow distortion on a real logo.
export const SpectralMap:React.FC<Common&{
  x?:number;
  y?:number;
  width?:number;
  height?:number;
  blur?:number;
  travel?:number;
}>=({opacity=.3,x=0,y=440,width=1080,height=800,blur=14,travel=260})=>{
  const f=useCurrentFrame();
  const p=progress(f,0,65);
  const offset=-travel/2+travel*p;
  return <div aria-hidden="true" style={{
    position:'absolute',left:x+offset,top:y,width,height,
    pointerEvents:'none',opacity,transform:'rotate(-16deg)',
    background:'linear-gradient(90deg,transparent 3%,rgba(244,165,28,.62) 23%,'+
      'rgba(167,81,48,.80) 44%,rgba(248,234,209,.65) 56%,'+
      'rgba(244,165,28,.50) 78%,transparent 96%)',
    maskImage:'radial-gradient(ellipse,black 7%,transparent 71%)',
    WebkitMaskImage:'radial-gradient(ellipse,black 7%,transparent 71%)',
    filter:'blur('+blur+'px)',
    mixBlendMode:'screen'
  }}/>;
};
const polar=(angle:number,r:number,cx:number,cy:number)=>
  [cx+r*Math.cos(angle),cy+r*Math.sin(angle)];
const ringPath=(r:number,twist:number,cx:number,cy:number)=>{
  const pts:string[]=[];
  for(let k=0;k<=120;k++){
    const a=(Math.PI*2*k/120)+twist;
    const radius=r+5.2*Math.sin(a*7+twist*2.8);
    const v=polar(a,radius,cx,cy);
    pts.push((k===0?'M':'L')+v[0].toFixed(1)+' '+v[1].toFixed(1));
  }
  return pts.join(' ')+' Z';
};

// POLAR COORDINATES: Cartesian parameter (angle,radius) remapped to actual
// concentric paths. Useful as a graphic iris / logo reveal, not on app screens.
export const PolarCoordinates:React.FC<Common&{
  cx?:number;
  cy?:number;
  radius?:number;
  rings?:number;
  color?:string;
  size?:number;
}>=({cx=540,cy=990,radius=390,rings=8,color=FX.amber,opacity=.2,size=1080})=>{
  const f=useCurrentFrame();
  const twist=f*0.012;
  return <svg aria-hidden="true" viewBox={'0 0 '+size+' 1920'}
    style={{position:'absolute',inset:0,width:'100%',height:'100%',
      opacity,pointerEvents:'none',overflow:'hidden'}}>
    {Array.from({length:rings},(_,i)=>{
      const r=radius*(.29+.73*i/Math.max(1,rings-1));
      return <path key={i} d={ringPath(r,twist+i*.13,cx,cy)}
        fill="none" stroke={color} strokeWidth={i%3===0?4:2.4}
        strokeLinecap="round"
        strokeDasharray={i%3===0?'23 15':undefined}/>;
    })}
  </svg>;
};
