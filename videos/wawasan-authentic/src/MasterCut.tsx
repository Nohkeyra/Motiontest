import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {BEAT_FRAMES, BEAT_OFFSET, CUTS} from './musicGrid';
import {FractalRidges, GaussianBlurTrail, PolarCoordinates, SpectralMap, WaveWarp} from './effects/FilmEffects';

// WAWASAN / THE RHYTHM OF FLAVOUR
// Film graphics are editorial; EVERY app screen, tap clip, dish, sign and batik
// originates in the SIGNED APK bundle. Never draw pretend app controls.

const P={ink:'#291A17',deep:'#140C0B',cream:'#F8EAD1',orange:'#F4A51C',sand:'#E9CF9C',rust:'#A75130'};
const font='"FilmOutfit", "Arial", sans-serif';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const s=(f:number,a:number,b:number)=>{
  const x=interpolate(f,[a,b],[0,1],clamp);
  return x*x*(3-2*x);
};
const out=(f:number,d:number)=>1-s(f,d-15,d);
const beat=(f:number)=> {
  const delta=((f-BEAT_OFFSET)%BEAT_FRAMES+BEAT_FRAMES)%BEAT_FRAMES;
  return Math.max(0,1-delta/5);
};
const deg=(x:number)=>x+'deg';

const Stage:React.FC<{light?:boolean;batik?:number;children:React.ReactNode}>=({light=false,batik=.12,children})=>(
  <AbsoluteFill style={{backgroundColor:light?P.cream:P.ink,overflow:'hidden'}}>
    <AbsoluteFill style={{background:light
      ? 'radial-gradient(ellipse at 49% 39%,#FFF4DD 0%,#F8EAD1 52%,#DABF91 110%)'
      : 'radial-gradient(ellipse at 48% 43%,#5B362B 0%,#291A17 51%,#130C0B 105%)'}}/>
    <Img src={staticFile('frames/batik.jpg')} style={{
      position:'absolute',left:-120,top:-130,width:1330,height:2150,
      objectFit:'cover',opacity:batik,mixBlendMode:light?'multiply':'screen'
    }}/>
    {children}
  </AbsoluteFill>
);
const Mini:React.FC<{children:React.ReactNode;light?:boolean;top?:number}>=
  ({children,light=false,top=88})=>(
  <div style={{position:'absolute',top,left:60,color:light?P.ink:P.cream,fontFamily:font,
    fontWeight:800,fontSize:25,letterSpacing:4.5,lineHeight:1.05,textTransform:'uppercase'}}>
    {children}
  </div>
);
const Kinetic:React.FC<{children:React.ReactNode;f:number;delay?:number;size?:number;left?:number;top?:number;light?:boolean;tracking?:number;line?:number}>=
 ({children,f,delay=0,size=108,left=63,top=150,light=false,tracking=-4.3,line=.92})=>{
  const p=s(f,delay,delay+18);
  return <div style={{position:'absolute',left,top,opacity:p,color:light?P.ink:P.cream,
    fontFamily:font,fontWeight:900,letterSpacing:tracking,lineHeight:line,fontSize:size,
    textTransform:'uppercase',whiteSpace:'pre-line',
    transform:'translate3d(0,'+((1-p)*68)+'px,0)',
    clipPath:'inset(0 0 '+(1-p)*100+'% 0)'}}>{children}</div>;
};
const Rule:React.FC<{x?:number;y?:number;width?:number;light?:boolean}>=
 ({x=60,y=95,width=960,light=false})=>(
 <div style={{position:'absolute',left:x,top:y,width,height:2,
   background:light?P.ink:P.cream,opacity:light?.22:.25}}/>
);
const Stamp:React.FC<{text:string;light?:boolean}>=({text,light=false})=>(
  <div style={{position:'absolute',left:62,bottom:57,right:62,display:'flex',
    alignItems:'center',justifyContent:'space-between',
    color:light?P.ink:P.cream,opacity:.8,
    fontFamily:font,fontWeight:750,fontSize:20,letterSpacing:3}}>
    <span>{text}</span>
    <span style={{display:'flex',gap:7,alignItems:'center'}}>
      {[0,1,2,3].map(i=><i key={i} style={{height:6,width:i===0?34:7,display:'block',
        backgroundColor:light?P.ink:P.orange,opacity:i===0?1:.40}}/>)}
    </span>
  </div>
);
const Food:React.FC<{name:string;w?:number;x?:number;y?:number;scale?:number;angle?:number;opacity?:number;z?:number}>=
 ({name,w=470,x=0,y=0,scale=1,angle=0,opacity=1,z=0})=>(
  <Img src={staticFile('frames/food/'+name+'.webp')} style={{
    position:'absolute',left:540-w/2,top:820-w/2,width:w,height:w,objectFit:'contain',
    opacity,transform:'translate3d('+x+'px,'+y+'px,'+z+'px) rotate('+deg(angle)+') scale('+scale+')',
    transformOrigin:'center',filter:'drop-shadow(0 30px 22px rgba(0,0,0,.33))'
  }}/>
);
type DeviceProps={x?:number;y?:number;scale?:number;tilt?:number;roll?:number;opacity?:number;children:React.ReactNode};
const Device:React.FC<DeviceProps>=({x=0,y=0,scale=1,tilt=0,roll=0,opacity=1,children})=>(
  <div style={{position:'absolute',left:540,top:966,width:720,height:1500,
    transform:'translate(-50%,-50%) perspective(1500px) translate3d('+x+'px,'+y+
      'px,0) rotateY('+deg(tilt)+') rotateZ('+deg(roll)+') scale('+scale+')',
    transformOrigin:'center center',
    opacity,overflow:'hidden',borderRadius:42,background:P.deep,
    border:'3px solid rgba(255,239,204,.34)',boxShadow:
      '0px 56px 90px rgba(0,0,0,.38), 0px 16px 26px rgba(0,0,0,.2)'}}>
    {children}
  </div>
);
const Still:React.FC<{name:string}>=({name})=>(
  <Img src={staticFile('frames/'+name+'.png')} style={{
    width:'100%',height:'100%',objectFit:'fill',display:'block'
  }}/>
);
const Clip:React.FC<{name:string}>=({name})=>{
  const frame=Math.max(0,Math.floor(useCurrentFrame()));
  const frameName=String(frame).padStart(4,'0');
  return <Img src={staticFile('frames/sequences/'+name+'/'+frameName+'.jpg')} style={{
    width:'100%',height:'100%',objectFit:'fill',display:'block'
  }}/>;
};
const Glint:React.FC<{f:number;at:number;light?:boolean}>=({f,at,light=false})=>{
  const v=Math.max(0,1-Math.abs(f-at)/5);
  return <AbsoluteFill style={{background:light?P.cream:P.orange,opacity:v*.17,pointerEvents:'none'}}/>;
};

const Opening:React.FC<{duration:number}>=({duration})=>{
  const f=useCurrentFrame(),enter=s(f,0,29),phone=s(f,30,61),exit=out(f,duration);
  return <Stage batik={.075}>
    <FractalRidges color={P.orange} opacity={.105} y={310} height={1270} lines={8} amplitude={125}/>
    <Rule/>
    <Mini>RESTORAN WAWASAN · A DIFFERENT KIND OF APP FILM</Mini>
    <Kinetic f={f} delay={6} top={190} size={135}>GOOD FOOD.
      {'\n'}GOOD FLOW.</Kinetic>
    <div style={{position:'absolute',left:38,top:390,width:950,height:950,
      border:'3px solid rgba(244,165,28,.27)',borderRadius:950,
      transform:'scale('+(1.1-.18*enter)+')'}}/>
    <Device x={560-610*phone} y={330-205*phone} scale={.58+.12*phone}
      tilt={-26+22*phone} roll={7-8*phone} opacity={phone*exit}>
      <Still name="order-dishes"/>
    </Device>
    <Food name="nasi_lemak_ayam_goreng" w={790}
      x={-50+435*enter} y={130+100*enter} scale={1.85-1.1*enter}
      angle={-23+17*enter} opacity={exit}/>
    <div style={{position:'absolute',left:680,top:1480,color:P.orange,
      fontFamily:font,fontWeight:900,fontSize:34,letterSpacing:3.2,opacity:phone*exit}}>
      REAL MENU / REAL APP
    </div>
    <Stamp text="01 / FLAVOUR IN MOTION"/>
    <Glint f={f} at={4}/>
  </Stage>;
};
const Heritage:React.FC<{duration:number}>=({duration})=>{
  const f=useCurrentFrame(),enter=s(f,0,34),exit=out(f,duration);
  return <Stage light batik={.16}>
    <PolarCoordinates color={P.clay} opacity={.12} cx={540} cy={1040} rings={10} radius={620}/>
    <Rule light/>
    <Mini light>CRAFTED WITH CHARACTER</Mini>
    <div style={{position:'absolute',left:-180,top:490,width:680,height:680,
      borderRadius:'50%',border:'55px solid rgba(167,81,48,.16)',
      transform:'scale('+(1.4-.4*enter)+') rotate('+(80*enter)+'deg)'}}/>
    <Kinetic f={f} delay={5} top={210} light size={153}>HERITAGE
      {'\n'}MEETS
      {'\n'}MOTION.</Kinetic>
    <Img src={staticFile('frames/brand-sign.webp')} style={{
      position:'absolute',width:930,height:930,left:135,top:740,objectFit:'contain',
      opacity:enter*exit,transform:'translate3d('+((1-enter)*540)+'px,'+
        ((1-enter)*170)+'px,0) rotate('+(9-9*enter)+'deg) scale('+(1.12-.12*enter)+')',
      filter:'drop-shadow(0 58px 33px rgba(67,35,15,.35))'
    }}/>
    <Stamp light text="02 / ORIGINAL BRAND ASSET"/>
  </Stage>;
};
const Theme:React.FC<{duration:number}>=({duration})=>{
  const f=useCurrentFrame(),enter=s(f,-6,17),transition=s(f,38,79);
  const pulse=beat(f)*.014;
  return <Stage batik={.08}>
    <GaussianBlurTrail color={P.orange} opacity={.14} blur={48} x={55} y={710} width={930} height={850}/>
    <Rule/><Mini>THE REAL WAWASAN WELCOME</Mini>
    <Kinetic f={f} delay={0} size={110} top={157}>LIGHT.
      {'\n'}DARK.
      {'\n'}WAWASAN.</Kinetic>
    <div style={{position:'absolute',width:850,height:990,left:125,top:680,
      background:'linear-gradient(110deg,#F8EAD1 0%,#EFCB96 47%,#4C322A 48%,#291A17 100%)',
      borderRadius:35,opacity:.7*enter,transform:'rotate(-7deg)'}}/>
    <Device x={-265-36*transition} y={228-55*enter} scale={.53+.04*enter+pulse}
      tilt={13-7*enter} roll={-7+3*enter} opacity={enter}>
      <Still name="welcome-light"/>
    </Device>
    <Device x={248-36*transition} y={156-90*transition} scale={.54+.05*transition+pulse}
      tilt={-13+5*transition} roll={7-3*transition} opacity={enter}>
      <Still name="welcome"/>
    </Device>
    <div style={{position:'absolute',left:95,top:1605,width:280,height:74,
      background:P.cream,color:P.ink,textAlign:'center',paddingTop:16,
      fontFamily:font,fontWeight:900,fontSize:29,letterSpacing:3,opacity:enter}}>DAY</div>
    <div style={{position:'absolute',right:95,top:1605,width:280,height:74,
      background:P.orange,color:P.ink,textAlign:'center',paddingTop:16,
      fontFamily:font,fontWeight:900,fontSize:29,letterSpacing:3,opacity:enter}}>NIGHT</div>
    <Stamp text="03 / ACTUAL LIGHT AND DARK THEMES"/>
    <Glint f={f} at={42}/>
  </Stage>;
};
const Enter:React.FC<{duration:number}>=({duration})=>{
  const f=useCurrentFrame(),enter=s(f,0,30),go=s(f,58,83),pulse=beat(f)*.01;
  return <Stage light batik={.04}>
    <Mini light>ONE START. A WHOLE EXPERIENCE.</Mini><Rule y={139} light/>
    <Kinetic f={f} top={215} size={149} light>LET'S
      {'\n'}BEGIN.</Kinetic>
    <div style={{position:'absolute',left:87,top:665,width:570,height:1100,
      border:'2px solid rgba(41,26,23,.2)',transform:'rotate(7deg)',borderRadius:55,opacity:enter}}/>
    <Device x={320-320*enter-140*go} y={180*(1-enter)+80*go}
      roll={-12+8*enter+2*go} tilt={11-11*enter}
      scale={.68+.16*enter+pulse} opacity={enter}>
      {f<65 ? <Clip name="started"/> : <Still name="order-start"/>}
    </Device>
    <div style={{position:'absolute',left:70,top:1525,width:900,height:115,
      backgroundColor:P.orange,opacity:go,
      transform:'translateX('+((1-go)*-1030)+'px) rotate(-3deg)'}}/>
    <div style={{position:'absolute',left:93,top:1540,color:P.ink,
      fontFamily:font,fontWeight:900,fontSize:57,letterSpacing:-1.9,opacity:go}}>
      PREPARE A DRAFT
    </div>
    <Stamp light text="04 / REAL GET STARTED + DRAFT TAP"/>
  </Stage>;
};
const Choices:React.FC<{duration:number}>=({duration})=>{
  const f=useCurrentFrame(),enter=s(f,0,29),mark=s(f,83,105);
  return <Stage batik={.095}>
    <Mini>YOUR EVENT. YOUR WAY.</Mini><Rule y={140}/>
    <Device x={440-455*enter} y={170-90*enter}
      tilt={18-16*enter} roll={7-6*enter} scale={.72+.16*enter} opacity={enter}>
      {f<54 ? <Clip name="selection"/> : <Still name="order-selected"/>}
    </Device>
    <div style={{position:'absolute',top:290,left:790,opacity:enter,
      transform:'translateX('+((1-enter)*290)+'px)'}}>
      {['OFFICE','LUNCH','BUFFET'].map((v,i)=>(
        <div key={i} style={{fontFamily:font,fontWeight:900,fontSize:66,
          letterSpacing:-3.2,lineHeight:1.4,color:i===1?P.orange:P.cream,
          opacity:s(f,19+i*15,34+i*15)}}>{v}</div>
      ))}
    </div>
    <div style={{position:'absolute',left:700,top:720,width:500,height:10,
      background:P.orange,transform:'rotate(-13deg) scaleX('+mark+')',
      transformOrigin:'left'}}/>
    <Stamp text="05 / REAL SELECTED STATES"/>
  </Stage>;
};
const Menu:React.FC<{duration:number}>=({duration})=>{
  const f=useCurrentFrame(),enter=s(f,0,30),exit=out(f,duration);
  const phases=[s(f,12,34),s(f,56,78),s(f,107,129),s(f,160,179)];
  const items=['kari_kambing','mee_soto','kuih_muih_campur','laksa_johor'];
  return <Stage light batik={.11}>
    <WaveWarp opacity={.13} strength={12} frequency={.007}>
      <div style={{position:'absolute',left:-200,top:510,width:1520,height:520,
        transform:'rotate(-22deg)',borderRadius:'46%',
        background:'repeating-linear-gradient(90deg,transparent 0,transparent 80px,'+
          'rgba(167,81,48,.7) 87px,rgba(167,81,48,.7) 91px,transparent 99px)'}}/>
    </WaveWarp>
    <Mini light>THE MENU COMES ALIVE</Mini><Rule y={140} light/>
    <Kinetic f={f} top={180} size={136} light>CHOOSE.
      {'\n'}ENJOY.</Kinetic>
    <Device x={-360+105*enter} y={214} scale={.58+.06*enter} roll={-8+4*enter}
      tilt={12-7*enter} opacity={enter*exit}>
      <Still name="order-dishes"/>
    </Device>
    {items.map((name,i)=>{
      const p=phases[i],next=phases[i+1]??0;
      const alpha=p*(1-next*.80)*exit;
      const x=[270,500,320,480][i]+(1-p)*560;
      const y=[-260,140,530,-250][i]+Math.sin(f*.035+i)*10;
      const sc=[.80,1.03,.86,.95][i]+(1-p)*.40;
      return <Food key={name} name={name} w={490} x={x} y={y}
        scale={sc} angle={-28*(1-p)+(i%2?12:-8)} opacity={alpha}/>;
    })}
    <div style={{position:'absolute',left:565,top:1420,width:490,
      color:P.ink,fontFamily:font,fontWeight:900,fontSize:43,
      lineHeight:1.0,letterSpacing:-2.2,opacity:enter}}>
      REAL DISH ART
      <div style={{fontSize:23,letterSpacing:3.4,lineHeight:1.9,fontWeight:800}}>
        FROM THE APP ITSELF
      </div>
    </div>
    <Stamp light text="06 / ORIGINAL DISH CUTOUTS + APP MENU"/>
  </Stage>;
};
const Finale:React.FC<{duration:number}>=({duration})=>{
  const f=useCurrentFrame(),enter=s(f,0,31),text=s(f,27,50),line=s(f,54,80);
  return <Stage batik={.19}>
    <SpectralMap opacity={.16} x={-130} y={380} width={1420} height={820} blur={28} travel={430}/>
    <Rule/><Mini>RESTORAN WAWASAN / PAK USOP</Mini>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 41%,rgba(255,161,39,.18),transparent 59%)'}}/>
    <Img src={staticFile('frames/brand-sign.webp')} style={{
      position:'absolute',left:115,top:220,width:850,height:850,objectFit:'contain',
      opacity:enter,transform:'translateY('+((1-enter)*240)+'px) scale('+(.77+.23*enter)+')',
      filter:'drop-shadow(0 45px 27px rgba(0,0,0,.49))'
    }}/>
    <div style={{position:'absolute',top:1150,left:54,right:54,textAlign:'center',
      transform:'translateY('+((1-text)*74)+'px)',opacity:text}}>
      <div style={{fontFamily:font,fontWeight:900,fontSize:119,
        letterSpacing:-5,lineHeight:1,color:P.cream}}>COMING SOON</div>
      <div style={{fontFamily:font,fontWeight:900,fontSize:55,letterSpacing:8.2,
        lineHeight:2.0,color:P.orange}}>JANUARY 2027</div>
    </div>
    <div style={{position:'absolute',left:148,top:1530,width:784*line,height:8,
      borderRadius:4,background:P.orange}}/>
    <Stamp text="WAWASAN · MADE TO BRING PEOPLE TOGETHER"/>
    <Glint f={f} at={0}/>
  </Stage>;
};

export const MasterCut:React.FC=()=>{
  const frame=useCurrentFrame();
  const duration=(i:number)=>CUTS[i+1]-CUTS[i];
  const cutPulse=Math.max(0,...CUTS.slice(1,-1).map(c=>1-Math.abs(frame-c)/3));
  return <AbsoluteFill style={{background:P.deep}}>
    <style>{'@font-face{font-family:FilmOutfit;src:url("'+staticFile('frames/outfit-latin.woff2')+
      '") format("woff2");font-weight:100 900;font-style:normal;font-display:block;}'}</style>
    <Sequence from={CUTS[0]} durationInFrames={duration(0)}><Opening duration={duration(0)}/></Sequence>
    <Sequence from={CUTS[1]} durationInFrames={duration(1)}><Heritage duration={duration(1)}/></Sequence>
    <Sequence from={CUTS[2]} durationInFrames={duration(2)}><Theme duration={duration(2)}/></Sequence>
    <Sequence from={CUTS[3]} durationInFrames={duration(3)}><Enter duration={duration(3)}/></Sequence>
    <Sequence from={CUTS[4]} durationInFrames={duration(4)}><Choices duration={duration(4)}/></Sequence>
    <Sequence from={CUTS[5]} durationInFrames={duration(5)}><Menu duration={duration(5)}/></Sequence>
    <Sequence from={CUTS[6]} durationInFrames={duration(6)}><Finale duration={duration(6)}/></Sequence>
    <AbsoluteFill style={{backgroundColor:P.orange,opacity:Math.max(0,cutPulse)*.075,pointerEvents:'none'}}/>
    <Audio src={staticFile('audio/master-beat.wav')} volume={1}/>
  </AbsoluteFill>;
};
