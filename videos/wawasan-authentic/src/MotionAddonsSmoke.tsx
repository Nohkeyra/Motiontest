import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {Circle, Star} from '@remotion/shapes';
import {Lottie} from '@remotion/lottie';

// This composition tests library interoperability ONLY. No fictional app UI,
// no unverified delivery route, and no alteration to original Wawasan branding.
// All animation is controlled by Remotion frames and is seek-safe.
const ink='#291A17';
const cream='#F8EAD1';
const amber='#F4A51C';
const rust='#A75130';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;

// Minimal, self-authored Lottie vector ring (not the Wawasan logo).
// Both animation-data identity and content stay stable across rendered frames.
const lottiePulse = {
  v:'5.7.5',fr:30,ip:0,op:120,w:320,h:320,nm:'Generic circle diagnostics',
  ddd:0,assets:[],
  layers:[{
    ddd:0,ind:1,ty:4,nm:'Animated ring',sr:1,ao:0,
    ks:{
      o:{a:0,k:100},r:{a:0,k:0},
      p:{a:0,k:[160,160,0]},a:{a:0,k:[0,0,0]},
      s:{a:1,k:[
        {t:0,s:[60,60,100],e:[120,120,100],o:{x:0.2,y:0.2},i:{x:0.8,y:0.8}},
        {t:60,s:[120,120,100],e:[78,78,100],o:{x:0.2,y:0.2},i:{x:0.8,y:0.8}},
        {t:119,s:[78,78,100]}
      ]}
    },
    shapes:[{ty:'gr',nm:'Ring group',it:[
      {ty:'el',d:1,p:{a:0,k:[0,0]},s:{a:0,k:[190,190]},nm:'Ellipse'},
      {ty:'st',c:{a:0,k:[0.957,0.647,0.11,1]},o:{a:0,k:100},
        w:{a:0,k:18},lc:2,lj:1,nm:'Amber stroke'},
      {ty:'tr',p:{a:0,k:[0,0]},a:{a:0,k:[0,0]},
        s:{a:0,k:[100,100]},r:{a:0,k:0},
        o:{a:0,k:100},sk:{a:0,k:0},sa:{a:0,k:0}}
    ]}],
    ip:0,op:120,st:0,bm:0
  }]
};

// Path is intentionally illustrative: it must never be labeled live GPS.
const route='M 90 640 C 160 485 130 350 290 290 S 490 390 570 248 S 740 95 850 68';

export const WawasanMotionAddonsSmoke:React.FC=()=>{
  const frame=useCurrentFrame();
  const reveal=interpolate(frame,[4,88],[0,1],clamp);
  const rise=interpolate(frame,[0,24],[80,0],clamp);
  const starSpin=interpolate(frame,[0,119],[-40,30]);
  const stroke=evolvePath(reveal,route);
  return <AbsoluteFill style={{
    backgroundColor:ink,color:cream,fontFamily:'Arial, sans-serif',overflow:'hidden'
  }}>
    <div style={{position:'absolute',left:76,top:98,fontSize:32,
      fontWeight:800,letterSpacing:6,color:amber}}>
      RESTORAN WAWASAN / MOTION ENGINE CHECK
    </div>
    <div style={{position:'absolute',left:78,top:210,fontSize:115,
      fontWeight:900,letterSpacing:-6,lineHeight:.92,transform:'translateY('+rise+'px)'}}>
      SHAPES.<br/>PATHS.<br/>LOTTIE.
    </div>
    <div style={{position:'absolute',left:100,top:770,opacity:.58}}>
      <Circle radius={310} fill="none" stroke={rust} strokeWidth={8}/>
    </div>
    <div style={{position:'absolute',right:80,top:860,
      transform:'rotate('+starSpin+'deg)',opacity:.7}}>
      <Star points={5} outerRadius={100} innerRadius={46} fill={amber}/>
    </div>
    <svg viewBox="0 0 940 750" style={{
      position:'absolute',left:70,top:840,width:940,height:750,overflow:'visible'
    }}>
      <path d={route} fill="none" stroke={amber} strokeWidth={23}
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={stroke.strokeDasharray}
        strokeDashoffset={stroke.strokeDashoffset}/>
    </svg>
    <div style={{position:'absolute',left:100,top:1110,width:330,height:330}}>
      <Lottie animationData={lottiePulse} loop={false}
        style={{width:'100%',height:'100%'}}/>
    </div>
    <div style={{position:'absolute',bottom:150,left:75,right:75,
      fontSize:31,fontWeight:800,letterSpacing:3,lineHeight:1.4}}>
      1080 × 1920 · 30 FPS<br/>
      TECHNICAL TEST / NOT ACTUAL APP UI
    </div>
  </AbsoluteFill>;
};
