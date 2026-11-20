import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

// Editorial frame relay: every app-facing pixel comes from signed APK screenshots.
const espresso = '#291A17';
const cream = '#F8EAD1';
const clamp = {extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const phase=(f:number,start:number,end:number)=>{
  const t=interpolate(f,[start,end],[0,1],clamp);
  return t*t*(3-2*t);
};
const w=800;
const h=1690;
const ApkScreen:React.FC<{name:'welcome'|'after-start'}>=({name})=>(
  <div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:40,
    backgroundColor:'#110E0D',border:'2px solid rgba(248,234,209,0.20)',
    boxShadow:'0 35px 90px rgba(0,0,0,0.42)'}}>
    <Img src={staticFile('frames/'+name+'.png')}
      style={{height:'100%',width:'100%',objectFit:'contain'}}/>
  </div>
);
const Surface:React.FC<{children:React.ReactNode;x:number;y:number;scale:number;angle?:number;opacity?:number}>=
  ({children,x,y,scale,angle=0,opacity=1})=>(
  <div style={{position:'absolute',left:(1080-w)/2,top:(1920-h)/2,
    width:w,height:h,opacity,transformOrigin:'center center',
    transform:'translate('+x+'px,'+y+'px) rotate('+angle+'deg) scale('+scale+')'}}>
    {children}
  </div>
);
export const AuthenticProof:React.FC=()=>{
  const f=useCurrentFrame();
  const arrival=phase(f,0,43);
  const drift=phase(f,65,126);
  const second=phase(f,115,172);
  const hold=phase(f,164,192);
  const closing=phase(f,232,270);
  const firstScale=.78+.22*arrival-.16*drift;
  const nextScale=.83+.17*second-.13*closing;
  return <AbsoluteFill style={{backgroundColor:espresso,overflow:'hidden',color:cream}}>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 45%,#654232 0%,#291A17 68%,#170F0E 100%)'}}/>
    <div style={{position:'absolute',left:50,top:70,width:2,height:1780,background:cream,opacity:.14}}/>
    <div style={{position:'absolute',right:50,top:70,width:2,height:1780,background:cream,opacity:.14}}/>
    <Surface x={45*(1-arrival)-170*drift} y={140*(1-arrival)}
      scale={firstScale} angle={-5*drift} opacity={1-phase(f,145,185)}>
      <ApkScreen name="welcome"/>
    </Surface>
    {Array.from({length:9},(_,i)=>{
      const p=phase(f,101+i*4,150+i*4);
      const left=i*100/9;
      const right=100-(i+1)*100/9;
      return <Surface key={i} x={(1-p)*(i%2?180:-180)+100*(1-second)}
        y={(1-p)*(i%2?-230:230)+50*(1-second)} scale={nextScale}
        angle={(1-p)*(i%2?5:-5)} opacity={p*(1-hold)}>
        <div style={{position:'absolute',inset:0,
          clipPath:'inset(0 '+right+'% 0 '+left+'%)'}}>
          <ApkScreen name="after-start"/>
        </div>
      </Surface>;
    })}
    <Surface x={100*(1-second)} y={50*(1-second)+80*closing}
      scale={nextScale} opacity={hold*(1-phase(f,250,270))}>
      <ApkScreen name="after-start"/>
    </Surface>
  </AbsoluteFill>;
};
