import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Original unaltered logo from Pu/public/assets/brand/wawasan_logo.svg
// Git blob SHA: 1ad31cbafedcd51350573e3b3f3261bde53de3ad
// Preserve original logo artwork; only move/reveal its enclosing layer.
type LogoMode = 'cinematic' | 'outro' | 'ambient';
type LogoProps = {mode?: LogoMode; showStudioLabel?: boolean};

const ink='#291A17';
const cream='#F8EAD1';
const amber='#F4A51C';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;

export const AnimatedWawasanLogo:React.FC<LogoProps>=({
  mode='cinematic',showStudioLabel=false,
})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const reveal=mode==='ambient' ? 1 :
    interpolate(frame,mode==='outro'?[1,27]:[5,38],[0,1],clamp);
  const ease=mode==='ambient'?1:spring({
    frame:Math.max(0,frame-(mode==='outro'?1:4)),fps,
    config:{damping:22,stiffness:140,mass:0.9},
  });
  const settle=interpolate(frame,[0,52],[0.92,1],clamp);
  const logoScale=(0.94+0.06*ease)*settle;
  const glow=interpolate(frame,[0,16,40,72],[0,0.16,0.07,0.06],clamp);
  const sweep=interpolate(frame,[11,52],[-85,160],clamp);
  const bottomFade=interpolate(frame,[16,45],[0,1],clamp);

  return <AbsoluteFill style={{backgroundColor:ink,overflow:'hidden'}}>
    <AbsoluteFill style={{
      background:'radial-gradient(ellipse at 50% 41%,#493028 0%,#291A17 57%,#170E0D 100%)',
    }}/>
    <div style={{position:'absolute',left:'50%',top:'45%',
      width:730,height:730,transform:'translate(-50%,-50%)',
      borderRadius:'50%',backgroundColor:amber,
      filter:'blur(135px)',opacity:glow}}/>
    <div style={{position:'absolute',left:'50%',top:'44%',width:850,height:850,
      transform:'translate(-50%,-50%)',borderRadius:'50%',
      border:'2px solid rgba(248,234,209,0.18)',
      opacity:interpolate(frame,[8,40],[0,0.8],clamp)}}/>
    <div style={{
      position:'absolute',left:'50%',top:'45%',width:800,height:700,
      transform:'translate(-50%,-50%) scale('+logoScale+')',
      opacity:interpolate(frame,[0,12],[0,1],clamp),
      filter:'drop-shadow(0px 18px 40px rgba(0,0,0,0.26))',
    }}>
      <div style={{position:'absolute',inset:0,overflow:'hidden',
        clipPath:'inset(0 '+(100-100*reveal)+'% 0 0)'}}>
        <Img src={staticFile('brand/wawasan_logo.svg')}
          style={{width:'100%',height:'100%',objectFit:'contain'}}/>
      </div>
      <div style={{position:'absolute',left:sweep+'%',top:30,bottom:30,
        width:90,transform:'rotate(15deg)',pointerEvents:'none',
        background:'linear-gradient(90deg,transparent,rgba(248,234,209,0.22),transparent)',
        filter:'blur(19px)',opacity:mode==='ambient'?0:.75}}/>
    </div>
    <div style={{position:'absolute',left:90,right:90,bottom:215,
      height:2,background:'rgba(248,234,209,0.27)',
      opacity:bottomFade}}/>
    <div style={{position:'absolute',left:90,right:90,bottom:144,
      color:cream,textAlign:'center',letterSpacing:5,
      fontSize:30,fontWeight:800,fontFamily:'Arial, sans-serif',
      opacity:bottomFade}}>
      RESTORAN WAWASAN
    </div>
    {showStudioLabel && <div style={{
      position:'absolute',left:70,top:90,fontSize:23,
      letterSpacing:4,fontWeight:800,
      color:amber,fontFamily:'Arial, sans-serif',
    }}>AUTHENTIC BRAND ASSET / REMOTION MOTION TEST</div>}
  </AbsoluteFill>;
};

export const WawasanAnimatedLogoPreview:React.FC=()=>{
  return <AnimatedWawasanLogo mode="cinematic" showStudioLabel/>;
};
