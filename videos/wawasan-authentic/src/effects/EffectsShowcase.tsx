import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {FX, FractalRidges, GaussianBlurTrail, PolarCoordinates, SpectralMap, WaveWarp}
  from './FilmEffects';

// Ten-second demonstration, independent of real app / APK / soundtrack.
// Five named looks. Deliberately NOT applied to user's invoice or map text.
const names=['WAVE WARP','GAUSSIAN BLUR','FRACTAL RIDGES','SPECTRAL MAP','POLAR COORDINATES'];
const descriptions=[
  'GENTLE MOTION / BATIK TEXTURE',
  'KINETIC TRAILS / TRANSITIONS',
  'PROCEDURAL TOPOGRAPHIC LINES',
  'WARM PRISM / LIGHT SWEEP',
  'RADIAL IRIS / CAMERA REVEAL'
];
const Part:React.FC<{index:number}>=({index})=>{
  const f=useCurrentFrame();
  const appear=interpolate(f,[2,22],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const label=names[index];
  const colors=index===1||index===3?FX.cream:FX.espresso;
  return <AbsoluteFill style={{background:index===1||index===3?FX.espresso:FX.cream,overflow:'hidden'}}>
    {index===0&&<WaveWarp strength={40} opacity={.8}>
      <div style={{position:'absolute',left:70,top:450,width:920,height:750,
        background:'repeating-linear-gradient(36deg,'+
          'rgba(167,81,48,.85) 0px,rgba(167,81,48,.85) 20px,'+
          'rgba(244,165,28,.62) 24px,transparent 40px,transparent 105px)',
        borderRadius:'44% 56% 47% 53%'}}/>
    </WaveWarp>}
    {index===1&&<>
      <GaussianBlurTrail opacity={.62} x={-100} y={440} blur={55}
        width={1100} height={680}/>
      <GaussianBlurTrail opacity={.52} x={250} y={910} blur={72}
        color={FX.clay} width={920} height={780} speed={1.4}/>
    </>}
    {index===2&&<>
      <FractalRidges opacity={.68} color={FX.clay} y={320} height={1320}
        lines={11} amplitude={178}/>
      <FractalRidges opacity={.4} color={FX.amber} y={320} height={1320}
        lines={9} amplitude={95}/>
    </>}
    {index===3&&<>
      <SpectralMap opacity={.88} x={-100} y={370} width={1450}
        height={950} blur={29} travel={950}/>
      <SpectralMap opacity={.75} x={-230} y={870} width={1520}
        height={610} blur={19} travel={-540}/>
    </>}
    {index===4&&<>
      <PolarCoordinates color={FX.clay} opacity={.8} cx={540} cy={870}
        rings={14} radius={550}/>
      <PolarCoordinates color={FX.amber} opacity={.55} cx={540} cy={870}
        rings={7} radius={355}/>
    </>}
    <div style={{
      position:'absolute',top:98,left:68,right:68,
      borderBottom:'2px solid '+colors,
      color:colors,fontFamily:'Arial, sans-serif',paddingBottom:25,
      fontWeight:800,fontSize:26,letterSpacing:5
    }}>WAWASAN / MOTION DESIGN LAB</div>
    <div style={{position:'absolute',left:68,right:68,bottom:254,
      fontFamily:'Arial, sans-serif',fontWeight:900,color:colors,
      fontSize:index===4?91:112,letterSpacing:-5,lineHeight:1,
      opacity:appear,transform:'translateY('+((1-appear)*100)+'px)'}}>
      {label}
    </div>
    <div style={{position:'absolute',left:72,right:72,bottom:166,
      color:index===1||index===3?FX.amber:FX.clay,
      fontFamily:'Arial, sans-serif',letterSpacing:2.3,
      fontWeight:900,fontSize:25,opacity:appear}}>
      {descriptions[index]}
    </div>
    <div style={{position:'absolute',right:73,bottom:77,
      color:colors,fontFamily:'Arial, sans-serif',fontSize:23,letterSpacing:3}}>
      0{index+1} / 05
    </div>
  </AbsoluteFill>;
};
export const EffectsShowcase:React.FC=()=>(
  <AbsoluteFill style={{backgroundColor:FX.espresso}}>
    {names.map((_,i)=><Sequence key={i} from={i*60}
      durationInFrames={60}><Part index={i}/></Sequence>)}
  </AbsoluteFill>
);
