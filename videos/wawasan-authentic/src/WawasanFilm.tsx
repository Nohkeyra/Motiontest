import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

// WAWASAN / EDITORIAL MOTION — 30-second film.
// App surfaces are genuine rendered captures from a named signed APK release.
// The stage, masks, cards and type are FILM graphics, not new app features.
const C={ink:'#291A17',espresso:'#1B1210',cream:'#F8EAD1',paper:'#F1DBB7',orange:'#F6A829',muted:'#BF9A70'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const ease=(f:number,a:number,b:number)=>{
  const x=interpolate(f,[a,b],[0,1],clamp);
  return x*x*(3-2*x);
};
const fade=(f:number,start:number,end:number,stop:number,finish:number)=>
  ease(f,start,end)*(1-ease(f,stop,finish));
const family='"FilmOutfit", "Arial", sans-serif';
const W=786, H=1638;

const Back:React.FC<{light?:boolean;spot?:boolean}> = ({light=false,spot=true})=>(
  <AbsoluteFill style={{backgroundColor:light?C.cream:C.ink,overflow:'hidden'}}>
    {spot && <AbsoluteFill style={{
      background:light
       ? 'radial-gradient(ellipse at 51% 48%,#FFECCD 0%,#F8EAD1 56%,#E9D6B8 100%)'
       : 'radial-gradient(ellipse at 48% 47%,#573729 0%,#291A17 57%,#180D0B 100%)'
    }}/>}
    <AbsoluteFill style={{
      backgroundImage:'linear-gradient(90deg,rgba(151,108,51,.07) 1px, transparent 1px),linear-gradient(rgba(151,108,51,.07) 1px, transparent 1px)',
      backgroundSize:'90px 90px',opacity:light?0.27:0.13
    }}/>
  </AbsoluteFill>
);
const ScreenImage:React.FC<{name:string;clip?:string}> = ({name,clip})=>(
  <Img src={staticFile('frames/'+name+'.png')} style={{
    position:'absolute',inset:0,width:'100%',height:'100%',display:'block',objectFit:'fill',
    clipPath:clip
  }}/>
);
const Device:React.FC<{x?:number;y?:number;scale?:number;angle?:number;opacity?:number;children:React.ReactNode;shadow?:boolean}> =
 ({x=0,y=0,scale=1,angle=0,opacity=1,children,shadow=true})=>(
  <div style={{
    position:'absolute',left:540,top:960,width:W,height:H,
    opacity,transformOrigin:'center center',
    transform:'translate(-50%,-50%) translate3d('+x+'px,'+y+'px,0) rotate('+angle+'deg) scale('+scale+')',
    borderRadius:39,overflow:'hidden',backgroundColor:C.espresso,
    border:'2px solid rgba(248,234,209,.31)',
    boxShadow:shadow?'0px 45px 115px rgba(0,0,0,.43),0px 10px 20px rgba(0,0,0,.22)':'none'
  }}>{children}</div>
);
const Label:React.FC<{left?:number;top?:number;children:React.ReactNode;dark?:boolean;opacity?:number}> =
 ({left=67,top=72,children,dark=false,opacity=1})=>(
  <div style={{position:'absolute',left,top,color:dark?C.ink:C.cream,opacity,
    fontFamily:family,fontWeight:800,fontSize:24,letterSpacing:4.4,
    lineHeight:1.15,textTransform:'uppercase'}}>{children}</div>
);
const Footer:React.FC<{children:React.ReactNode;dark?:boolean;opacity?:number}> =
 ({children,dark=false,opacity=1})=>(
  <div style={{position:'absolute',bottom:53,left:66,right:66,display:'flex',
    alignItems:'center',justifyContent:'space-between',color:dark?C.ink:C.cream,
    fontFamily:family,fontSize:20,fontWeight:700,letterSpacing:2.4,opacity}}>
    <span>{children}</span><span style={{display:'flex',gap:7}}>
      {[0,1,2,3].map(i=><i key={i} style={{display:'block',width:i===0?30:7,height:6,
        backgroundColor:dark?C.ink:C.orange,opacity:i===0?1:.5}}/>)}
    </span>
  </div>
);
const Big:React.FC<{children:React.ReactNode;top?:number;left?:number;dark?:boolean;size?:number;opacity?:number}> =
 ({children,top=190,left=63,dark=false,size=104,opacity=1})=>(
  <div style={{position:'absolute',top,left,fontFamily:family,
    color:dark?C.ink:C.cream,opacity,fontSize:size,letterSpacing:-5.2,
    fontWeight:900,lineHeight:.88,textTransform:'uppercase',whiteSpace:'pre-line'}}>
    {children}
  </div>
);
const Accent:React.FC<{x:number;y:number;w:number;h?:number;opacity?:number}> =
 ({x,y,w,h=7,opacity=1})=>(
  <div style={{position:'absolute',left:x,top:y,width:w,height:h,opacity,
    backgroundColor:C.orange,borderRadius:10}}/>
);

const Intro:React.FC<{f:number}>=({f})=>{
  const arrive=ease(f,4,69);
  const stamp=ease(f,58,82);
  return <AbsoluteFill>
    <Back/>
    <Device scale={1.57-.64*arrive} y={170-145*arrive} angle={3.5*(1-arrive)}>
      <ScreenImage name="welcome"/>
    </Device>
    <Label opacity={ease(f,30,54)}>THE WAWASAN EXPERIENCE</Label>
    <Big top={1500} size={83} opacity={stamp}>A FRESH
      {'\n'}PERSPECTIVE.</Big>
    <Footer opacity={stamp}>01 / WELCOME</Footer>
  </AbsoluteFill>;
};
const Mood:React.FC<{f:number}>=({f})=>{
  const local=f-111;
  const enter=ease(local,1,27);
  const reveal=ease(local,36,98);
  const wiper=100*(1-reveal);
  return <AbsoluteFill>
    <Back light/>
    <Label dark opacity={enter}>SAME PLACE. TWO MOODS.</Label>
    <Big top={160} size={78} dark opacity={enter}>DAY <span style={{color:C.orange}}> / </span> NIGHT</Big>
    <Device scale={.85+.065*enter} y={120-80*enter} angle={-3*(1-enter)}>
      <ScreenImage name="welcome-light"/>
      <ScreenImage name="welcome" clip={'inset(0 0 0 '+wiper+'%)'}/>
      <div style={{position:'absolute',top:0,bottom:0,left:(100-wiper)+'%',
        width:4,background:C.orange,opacity:reveal>.03 && reveal<.99?1:0}}/>
    </Device>
    <Footer dark opacity={enter}>02 / THE ORIGINAL APP THEMES</Footer>
  </AbsoluteFill>;
};
const Entry:React.FC<{f:number}>=({f})=>{
  const local=f-239;
  const enter=ease(local,0,37);
  const push=ease(local,64,92);
  return <AbsoluteFill>
    <Back/>
    <Big top={235} left={67} size={112} opacity={ease(local,3,25)*.24}>
      MAKE
      {'\n'}IT HAPPEN.
    </Big>
    <Device x={485*(1-enter)} y={130*(1-enter)-20*push}
      angle={9*(1-enter)} scale={.76+.20*enter+.065*push}>
      <ScreenImage name="after-start"/>
    </Device>
    <Label opacity={enter}>A SIMPLE PLACE TO BEGIN</Label>
    <Footer opacity={enter}>03 / GET STARTED · PREPARE A DRAFT</Footer>
  </AbsoluteFill>;
};
const OrderStart:React.FC<{f:number}>=({f})=>{
  const local=f-360;
  const inMotion=ease(local,0,34);
  const close=ease(local,62,100);
  return <AbsoluteFill>
    <Back light/>
    <Label dark opacity={inMotion}>ACTUAL ORDER FLOW / STEP 01</Label>
    <Big dark top={154} size={89} opacity={inMotion}>
      THE
      {'\n'}OCCASION.
    </Big>
    <Device x={-480*(1-inMotion)} y={110*(1-inMotion)}
      angle={-7*(1-inMotion)} scale={.78+.165*inMotion+.045*close}>
      <ScreenImage name="order-start"/>
    </Device>
    <Accent x={65} y={324} w={90*inMotion}/>
    <Footer dark opacity={inMotion}>04 / CHOOSE YOUR EVENT</Footer>
  </AbsoluteFill>;
};
const Select:React.FC<{f:number}>=({f})=>{
  const local=f-514;
  const change=ease(local,18,66);
  const settle=ease(local,57,78);
  const pulse=.020*Math.sin(Math.PI*ease(local,50,72))*(1-settle);
  return <AbsoluteFill>
    <Back/>
    <Label opacity={1}>REAL SELECTION / NO RECREATED UI</Label>
    <Big top={180} size={87} opacity={.9}>MAKE IT
      {'\n'}YOURS.</Big>
    <Device scale={.89+pulse} y={80}>
      <ScreenImage name="order-start"/>
      <ScreenImage name="order-selected" clip={'inset(0 '+(100*(1-change))+'% 0 0)'}/>
      <div style={{position:'absolute',top:0,bottom:0,left:(100*change)+'%',
        width:4,backgroundColor:C.orange,opacity:change>.03&&change<.98?1:0}}/>
    </Device>
    <Footer>05 / EVENT · LUNCH · BUFFET</Footer>
  </AbsoluteFill>;
};
const Menu:React.FC<{f:number}>=({f})=>{
  const local=f-633;
  const enter=ease(local,0,32);
  const cards=ease(local,65,103);
  const y=165*(1-enter)-32*cards;
  const scale=.85+.105*enter+.028*cards;
  return <AbsoluteFill>
    <Back light/>
    <Label dark opacity={enter}>THE DISHES / THE REAL MENU</Label>
    <Big dark top={155} size={86} opacity={enter}>ON THE
      {'\n'}MENU.</Big>
    <Device x={450*(1-enter)} y={y} angle={6*(1-enter)} scale={scale}>
      <ScreenImage name="order-menu"/>
      <ScreenImage name="order-dishes" clip={'inset('+(100*(1-cards))+'% 0 0 0)'}/>
    </Device>
    <Footer dark opacity={enter}>06 / ACTUAL MENU CARDS IN THE APK</Footer>
  </AbsoluteFill>;
};
const Close:React.FC<{f:number}>=({f})=>{
  const local=f-781;
  const inMotion=ease(local,0,34);
  const mark=ease(local,17,50);
  const announce=ease(local,36,61);
  const accentWidth=interpolate(local,[39,73],[0,650],clamp);
  return <AbsoluteFill>
    <Back/>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 39%,rgba(232,123,29,.24),transparent 56%)',opacity:mark}}/>
    <div style={{position:'absolute',left:90,top:185,width:900,height:900,
      opacity:mark,transform:'translateY('+(90*(1-inMotion))+'px) scale('+(0.85+.15*inMotion)+')',
      filter:'drop-shadow(0px 38px 28px rgba(0,0,0,.33))'}}>
      <Img src={staticFile('frames/brand-sign.webp')} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
    </div>
    <div style={{position:'absolute',left:65,right:65,top:1280,textAlign:'center',opacity:announce,
      transform:'translateY('+(47*(1-announce))+'px)'}}>
      <div style={{fontFamily:family,fontWeight:900,fontSize:105,letterSpacing:-4.9,lineHeight:1.04,color:C.cream}}>
        COMING SOON
      </div>
      <div style={{fontFamily:family,fontWeight:800,fontSize:48,letterSpacing:6.4,
        lineHeight:1.7,color:C.orange,marginTop:20}}>
        JANUARY 2027
      </div>
    </div>
    <Accent x={215} y={1600} w={accentWidth} h={7} opacity={announce}/>
    <Footer opacity={announce}>RESTORAN WAWASAN · PAK USOP</Footer>
  </AbsoluteFill>;
};

const FilmAudio:React.FC=()=>(
  <Audio src={staticFile('audio/wawasan-score.wav')} volume={.7}/>
);

export const WawasanFilm:React.FC=()=>{
  const f=useCurrentFrame();
  const fontUrl=staticFile('frames/outfit-latin.woff2');
  const fontRule='@font-face{font-family:FilmOutfit;src:url("'+fontUrl+'") format("woff2");font-style:normal;font-weight:100 900;font-display:block;}';
  return <AbsoluteFill style={{backgroundColor:C.ink}}>
    <style>{fontRule}</style>
    {f<111 ? <Intro f={f}/> :
     f<239 ? <Mood f={f}/> :
     f<360 ? <Entry f={f}/> :
     f<514 ? <OrderStart f={f}/> :
     f<633 ? <Select f={f}/> :
     f<781 ? <Menu f={f}/> : <Close f={f}/>}
    <FilmAudio/>
  </AbsoluteFill>;
};
