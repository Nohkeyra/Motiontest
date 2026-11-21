import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {SoundCueTrack, SFX_PREVIEW_CUES, WAWASAN_SFX} from './SoundDesign';

// Standalone dry SFX demo. DOES NOT use or replace any film music.
// No invented Wawasan app screens are presented.
const descriptions: Record<string,string>={
  tap:'TAP / TACTILE',card_expand:'CARD / EXPAND',
  whoosh:'CAMERA / WHOOSH',type_hit:'TYPOGRAPHY / HIT',
  map_trace:'ROUTE / TRACE',complete:'STATUS / COMPLETE',
  paper_swipe:'INVOICE / SWIPE',logo_impact:'BRAND / IMPACT',
  shimmer:'BRAND / SHIMMER',
};
const clay='#A75130',amber='#F4A51C',cream='#F8EAD1';
export const WawasanSfxPreview:React.FC=()=>{
  const f=useCurrentFrame();
  const index=SFX_PREVIEW_CUES.reduce((acc,cue,i)=>f>=cue.frame?i:acc,0);
  const event=SFX_PREVIEW_CUES[index];
  const local=f-event.frame;
  const appear=interpolate(local,[0,9],[0,1],
    {extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const energy=Math.max(0,1-Math.max(0,local)/18);
  return <AbsoluteFill style={{
    background:'radial-gradient(ellipse at 50% 40%,#50332B 0%,#291A17 58%,#140C0B 100%)',
    color:cream,overflow:'hidden',fontFamily:'Arial, sans-serif'
  }}>
    <div style={{position:'absolute',left:80,top:105,color:amber,
      fontSize:30,fontWeight:900,letterSpacing:5}}>WAWASAN / SOUND DESIGN LAB</div>
    <div style={{position:'absolute',left:160,top:460,width:760,height:760,
      borderRadius:'50%',border:'solid 18px '+clay,opacity:.6,
      transform:'scale('+(0.87+energy*.13)+')'}}/>
    <div style={{position:'absolute',left:255,top:557,width:570,height:570,
      borderRadius:'50%',border:'solid 13px '+amber,opacity:.45+energy*.3,
      transform:'scale('+(0.85+energy*.18)+')'}}/>
    <div style={{position:'absolute',left:60,top:760,width:960,
      textAlign:'center',fontSize:128,fontWeight:900,
      letterSpacing:-6,opacity:appear,
      transform:'translateY('+((1-appear)*75)+'px)'}}>
      {event.name.toUpperCase().replace('_',' ')}
    </div>
    <div style={{position:'absolute',left:120,top:1050,right:120,textAlign:'center',
      fontSize:31,fontWeight:900,letterSpacing:6,color:amber,opacity:appear}}>
      {descriptions[event.name]}
    </div>
    <div style={{position:'absolute',left:70,top:1500,right:70,
      fontSize:28,lineHeight:1.6,letterSpacing:2,opacity:.84}}>
      ORIGINAL PROCEDURAL SFX<br/>
      48 KHZ / STEREO / FRAME-SYNCED<br/>
      NO THIRD-PARTY RECORDINGS · NO MUSIC
    </div>
    <div style={{position:'absolute',right:78,bottom:100,
      fontWeight:800,fontSize:36,color:amber}}>
      {String(index+1).padStart(2,'0')} / {Object.keys(WAWASAN_SFX).length}
    </div>
    <SoundCueTrack cues={SFX_PREVIEW_CUES}/>
  </AbsoluteFill>;
};
