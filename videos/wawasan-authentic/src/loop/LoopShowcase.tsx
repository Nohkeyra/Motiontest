import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {loopOrbit, loopPulse, TWO_PI, useWawasanLoop} from './LoopEngine';

// A 4-second seamless loop. This is abstract proof graphics, NOT a Wawasan
// logo replacement, APK screen recreation, real rider map, or final footage.
const espresso='#291A17', cream='#F8EAD1', amber='#F4A51C', clay='#A75130';

const OrbitingObject: React.FC=()=>{
  const {phase}=useWawasanLoop();
  const bob=loopPulse(phase,0,0.14);
  // Exactly one closed 2π orbit per composition, not a cumulative rotation.
  // Material is static and lighting is stationary to remain seek-safe.
  return <group rotation={[0.12*Math.sin(phase),phase,0.055*Math.sin(phase)]}
    position={[0,bob,0]} scale={0.9}>
    <mesh>
      <boxGeometry args={[3.0,4.8,0.34]}/>
      <meshStandardMaterial color={espresso} roughness={0.5} metalness={0.05}/>
    </mesh>
    <mesh position={[0,0,0.176]}>
      <boxGeometry args={[2.72,4.5,0.015]}/>
      <meshStandardMaterial color={cream} roughness={0.7}/>
    </mesh>
    <mesh position={[0,-1.15,0.20]}>
      <boxGeometry args={[2.15,0.28,0.025]}/>
      <meshStandardMaterial color={amber} roughness={0.65}/>
    </mesh>
    <mesh position={[0,1.03,0.20]}>
      <boxGeometry args={[1.98,0.22,0.025]}/>
      <meshStandardMaterial color={clay} roughness={0.65}/>
    </mesh>
    <mesh position={[-1.0,0.31,0.20]}>
      <boxGeometry args={[0.41,0.44,0.025]}/>
      <meshStandardMaterial color={clay} roughness={0.65}/>
    </mesh>
  </group>;
};

export const WawasanSeamlessLoop: React.FC=()=>{
  const {phase,durationFrames}=useWawasanLoop();
  const {width,height}=useVideoConfig();
  const orbital=loopOrbit(phase,115,135);
  const drift=loopPulse(phase,0,55);
  const ringOpacity=0.38+0.15*Math.sin(phase);
  // Text is static, preserving safe areas and keeping the loop cut clean.
  return <AbsoluteFill style={{backgroundColor:espresso,overflow:'hidden'}}>
    <AbsoluteFill style={{pointerEvents:'none'}}>
      <div style={{
        position:'absolute',top:450,left:95,width:890,height:890,
        borderRadius:'50%',border:'18px solid '+amber,opacity:ringOpacity,
        transform:'translate('+orbital.x+'px,'+orbital.y+'px)',
      }}/>
      <div style={{
        position:'absolute',top:585,left:240,width:600,height:600,
        borderRadius:'50%',border:'8px solid '+cream,opacity:.35,
        transform:'rotate('+(phase*180/Math.PI)+'deg) scale('+loopPulse(phase,1,.045)+')',
      }}/>
      <div style={{position:'absolute',left:250+drift,top:870,
        width:580,height:140,filter:'blur(70px)',borderRadius:'50%',
        backgroundColor:amber,opacity:0.12}}/>
    </AbsoluteFill>
    <ThreeCanvas width={width} height={height}
      camera={{fov:45,position:[0,0,12.6]}}
      style={{width,height,backgroundColor:'transparent'}}>
      <ambientLight intensity={1.55}/>
      <directionalLight color="#FFF1D4" intensity={3.2} position={[4,6,7]}/>
      <directionalLight color="#D98744" intensity={0.9} position={[-4,-2,-6]}/>
      <OrbitingObject/>
    </ThreeCanvas>
    <div style={{position:'absolute',left:75,right:75,top:122,
      color:amber,fontSize:30,fontWeight:900,letterSpacing:5,
      fontFamily:'Arial, sans-serif'}}>
      WAWASAN / SEAMLESS MOTION LAB
    </div>
    <div style={{position:'absolute',left:75,right:75,bottom:225,
      color:cream,fontFamily:'Arial, sans-serif',
      fontSize:113,lineHeight:0.9,fontWeight:900,letterSpacing:-5}}>
      INFINITE<br/>MOTION.
    </div>
    <div style={{position:'absolute',left:79,right:79,bottom:108,
      color:amber,fontFamily:'Arial, sans-serif',letterSpacing:3,
      fontWeight:800,fontSize:26}}>
      3D ORBIT · PERIODIC LIGHT · {durationFrames} FRAMES / 30 FPS
    </div>
  </AbsoluteFill>;
};
