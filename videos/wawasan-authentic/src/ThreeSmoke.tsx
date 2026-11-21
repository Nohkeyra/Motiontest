import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// Studio-capability check only. This graphic is NOT a product screenshot.
// The actual film must continue using interface captures from the signed APK.
const smooth = (x: number) => x*x*(3-2*x);
const move = (f: number, a: number, b: number) =>
  smooth(interpolate(f, [a,b], [0,1], {
    extrapolateLeft:'clamp', extrapolateRight:'clamp',
  }));

const Geometry:React.FC=()=>{
  const frame=useCurrentFrame();
  const spin=interpolate(frame,[0,89],[-0.4,Math.PI*0.65]);
  const reveal=move(frame,0,30);
  return <group rotation={[0.11*Math.sin(frame/15),spin,0.08*Math.sin(frame/22)]}
    position={[0,0.2,0]} scale={0.62+reveal*0.16}>
    <mesh>
      <boxGeometry args={[3.5,5.9,0.26]}/>
      <meshStandardMaterial color="#291A17" roughness={0.34} metalness={0.12}/>
    </mesh>
    <mesh position={[0,0,0.141]}>
      <boxGeometry args={[3.23,5.64,0.012]}/>
      <meshStandardMaterial color="#F8EAD1" roughness={0.55}/>
    </mesh>
    <mesh position={[0,-1.05,0.16]}>
      <boxGeometry args={[2.4,0.22,0.018]}/>
      <meshStandardMaterial color="#F4A51C" metalness={0.15} roughness={0.45}/>
    </mesh>
    <mesh position={[-0.73,0.7,0.164]}>
      <boxGeometry args={[0.73,0.73,0.018]}/>
      <meshStandardMaterial color="#A75130" roughness={0.4}/>
    </mesh>
    <mesh position={[0.73,0.7,0.164]}>
      <boxGeometry args={[0.73,0.73,0.018]}/>
      <meshStandardMaterial color="#E9CF9C" roughness={0.4}/>
    </mesh>
  </group>;
};

export const Wawasan3DSmoke:React.FC=()=>{
  const frame=useCurrentFrame();
  const {width,height}=useVideoConfig();
  const enter=move(frame,0,24);
  const headline=move(frame,18,46);
  return <AbsoluteFill style={{backgroundColor:'#F8EAD1',overflow:'hidden'}}>
    <ThreeCanvas width={width} height={height} orthographic={false}
      camera={{fov:45,position:[0,0,13]}}
      style={{width,height,backgroundColor:'#F8EAD1'}}>
      <ambientLight intensity={1.2}/>
      <directionalLight color="#FFF4E0" intensity={3.3} position={[4,7,9]}/>
      <directionalLight color="#E08B3B" intensity={1.3} position={[-6,-3,-1]}/>
      <Geometry/>
    </ThreeCanvas>
    <AbsoluteFill style={{pointerEvents:'none',fontFamily:'Arial, sans-serif'}}>
      <div style={{
        position:'absolute',left:85,top:130,fontWeight:900,fontSize:42,
        letterSpacing:7,color:'#291A17',opacity:enter,
        transform:'translateY('+((1-enter)*45)+'px)',
      }}>RESTORAN WAWASAN</div>
      <div style={{
        position:'absolute',left:82,bottom:185,fontWeight:900,fontSize:116,
        letterSpacing:-5,lineHeight:0.91,color:'#291A17',opacity:headline,
        transform:'translateY('+((1-headline)*85)+'px)',
      }}>3D MOTION<br/>READY.</div>
      <div style={{
        position:'absolute',left:86,bottom:118,color:'#A75130',
        fontWeight:700,fontSize:26,letterSpacing:3,opacity:headline,
      }}>WEBGL · KINETIC TYPE · 30 FPS</div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
