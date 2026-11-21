import React from 'react';
import {AbsoluteFill,Img,Audio,Sequence,staticFile,useCurrentFrame,useVideoConfig,spring} from 'remotion';

const B='#291A17',K='#F8EAD1',A='#F5A623',O='#ED592C';
const clip=(x:number)=>Math.max(0,Math.min(1,x));
const s=(x:number)=>{const n=clip(x);return n*n*(3-2*n)};
const ramp=(f:number,a:number,b:number)=>s((f-a)/(b-a));
const visible=(f:number,a:number,b:number)=>ramp(f,a,a+17)*(1-ramp(f,b-17,b));
const file=(n:string)=>staticFile('assets/'+n);
const strong:React.CSSProperties={fontFamily:'Outfit,Arial,sans-serif',fontWeight:900,letterSpacing:'-0.06em',lineHeight:.92};
const shadow='0px 20px 45px rgba(0,0,0,.45)';
function BG({f}:{f:number}){
return <AbsoluteFill style={{background:'radial-gradient(circle at 55% 45%,#593322 0%,#291A17 52%,#110D0D 100%)'}}>
<div style={{position:'absolute',inset:-280,backgroundImage:'url('+file('batik.jpg')+')',backgroundSize:'660px',opacity:.055,transform:'translateY('+(f*.09)+'px) rotate(-8deg)'}}/>
<div style={{position:'absolute',left:-180,top:-210,width:850,height:850,borderRadius:'50%',background:O,opacity:.12,filter:'blur(200px)'}}/>
<div style={{position:'absolute',right:-250,bottom:-220,width:850,height:850,borderRadius:'50%',background:A,opacity:.13,filter:'blur(200px)'}}/>
</AbsoluteFill>;
}
function Punch({f,at,x,y,size,word,color=K}:{f:number,at:number,x:number,y:number,size:number,word:string,color?:string}){
const p=spring({frame:f-at,fps:30,config:{damping:15,stiffness:138}});
return <div style={{position:'absolute',left:x,top:y,...strong,fontSize:size,color,whiteSpace:'pre-line',textShadow:shadow,opacity:clip(p),transform:'translateY('+((1-p)*95)+'px) scale('+(0.77+0.23*p)+')',transformOrigin:'left top'}}>{word}</div>;
}
function Device({wide,f,at,src,small=false,sequence,sequenceAt,sequenceLength=0}:{wide:boolean,f:number,at:number,src:string,small?:boolean,sequence?:string,sequenceAt?:number,sequenceLength?:number}){
const p=spring({frame:f-at,fps:30,config:{damping:22,stiffness:92}});
const width=wide?(small?970:1200):(small?530:615);
const height=wide?(small?645:780):(small?1160:1315);
const left=wide?(small?850:650):(small?405:390);
const top=wide?(small?160:145):(small?550:520);
return <div style={{position:'absolute',left,top,width,height,perspective:1600,opacity:clip(p),
transform:'perspective(1500px) translateX('+((1-p)*950)+'px) translateY('+((1-p)*120)+'px) rotate('+((1-p)*9)+'deg) rotateY('+(-7+Math.sin(f/110)*3)+'deg)',transformOrigin:'center'}}>
<div style={{position:'absolute',inset:-16,borderRadius:wide?40:86,background:'linear-gradient(120deg,#CB9358,#3D281E 53%,#C59A68)',boxShadow:'0 50px 110px #0009'}}/>
<div style={{position:'absolute',inset:1,background:'#1D1412',borderRadius:wide?25:69,overflow:'hidden',border:'2px solid #D5A367'}}>
{wide&&<div style={{height:42,background:'#2B221E',display:'flex',alignItems:'center',paddingLeft:25,gap:9}}>
{[O,A,'#75846D'].map((c,i)=><i key={i} style={{width:12,height:12,borderRadius:'50%',background:c}}/>)}
<div style={{width:580,marginLeft:80,height:25,lineHeight:'25px',textAlign:'center',background:'#1A1411',color:'#E5D0B4',borderRadius:10,fontSize:15,fontFamily:'Arial'}}>RESTORAN WAWASAN</div></div>}
<Img src={file(src)} style={{width:'100%',height:wide?'calc(100% - 42px)':'100%',objectFit:'cover',objectPosition:'top center'}}/>
{sequence&&sequenceAt!==undefined&&f>=sequenceAt&&f<sequenceAt+sequenceLength&&<Img src={file('sequences/'+sequence+'/'+String(Math.min(sequenceLength-1,Math.floor(f-sequenceAt))).padStart(4,'0')+'.jpg')} style={{position:'absolute',left:0,top:wide?42:0,width:'100%',height:wide?'calc(100% - 42px)':'100%',objectFit:'fill'}}/>}
</div>
{!wide&&<div style={{position:'absolute',top:5,left:'36%',width:'28%',height:26,borderRadius:40,background:'#0B0808'}}/>}
</div>;
}
function Food({src,f,at,x,y,sz}:{src:string,f:number,at:number,x:number,y:number,sz:number}){
const p=spring({frame:f-at,fps:30,config:{damping:12,stiffness:130,mass:.7}});
return <div style={{position:'absolute',left:x,top:y,width:sz,height:sz,zIndex:5,
opacity:ramp(f,at,at+13)*(1-ramp(f,250,270)),filter:'drop-shadow(10px 45px 28px rgba(0,0,0,.65))',
transform:'translateY('+((1-p)*320+Math.sin((f-at)/18)*13)+'px) scale('+(0.35+0.65*p)+') rotate('+((1-p)*40-12)+'deg)'}}>
<Img src={file(src)} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>;
}
function Tap({f,at,x,y}:{f:number,at:number,x:number,y:number}){
const p=ramp(f,at,at+23);
return <div style={{position:'absolute',left:x,top:y,zIndex:10,opacity:ramp(f,at,at+4)*(1-ramp(f,at+30,at+42))}}>
<div style={{position:'absolute',left:-45,top:-45,width:90,height:90,border:'5px solid '+A,borderRadius:'50%',opacity:1-p,transform:'scale('+(0.2+2.3*p)+')'}}/>
<div style={{width:23,height:23,borderRadius:'50%',background:K,border:'4px solid '+O,boxShadow:'0 0 35px #FFB933'}}/></div>;
}
function Head({wide,kicker,title,desc,f,at}:{wide:boolean,kicker:string,title:string,desc:string,f:number,at:number}){
return <div style={{position:'absolute',left:wide?95:78,top:wide?130:125,opacity:ramp(f,at,at+18)}}>
<div style={{color:A,fontWeight:900,letterSpacing:7,fontSize:wide?23:25,marginBottom:30}}>{kicker}</div>
<div style={{...strong,fontSize:wide?124:128,color:K,whiteSpace:'pre-line',textShadow:shadow}}>{title}</div>
<div style={{marginTop:32,fontSize:wide?30:33,fontWeight:500,maxWidth:wide?620:770,lineHeight:1.25,color:'#DFCCB8'}}>{desc}</div>
</div>;
}
function Route({f,wide}:{f:number,wide:boolean}){
const progress=ramp(f,455,586);
const left=wide?1070:55,top=wide?180:820,scale=wide?1:1;
return <div style={{position:'absolute',left,top,width:930,height:620,borderRadius:55,overflow:'hidden',background:'linear-gradient(140deg,#47352D,#241A17)',border:'3px solid #765443',boxShadow:'0 30px 75px #0008',opacity:ramp(f,448,473)}}>
{Array.from({length:12},(_,i)=><div key={i} style={{position:'absolute',left:i*85,top:0,bottom:0,width:1,background:'#9B806D',opacity:.17}}/>)}
{Array.from({length:8},(_,i)=><div key={i} style={{position:'absolute',left:0,right:0,top:i*85,height:1,background:'#9B806D',opacity:.17}}/>)}
<svg width="930" height="620" viewBox="0 0 930 620" style={{position:'absolute',inset:0}}>
<path d="M95 475 C210 410 275 145 480 240 S695 100 845 105" fill="none" stroke="#100B0A" strokeWidth="42" opacity=".55"/>
<path d="M95 475 C210 410 275 145 480 240 S695 100 845 105" fill="none" stroke={A} strokeWidth="12" strokeLinecap="round" pathLength="1000" strokeDasharray="1000" strokeDashoffset={1000*(1-progress)}/>
<circle cx="95" cy="475" r="26" fill={O} stroke={K} strokeWidth="7"/><circle cx="845" cy="105" r="26" fill={A} stroke={K} strokeWidth="7"/>
</svg><div style={{position:'absolute',left:40,bottom:42,color:K,letterSpacing:4,fontSize:25,fontWeight:900}}>ROUTE / CONCEPTUAL VISUAL</div>
<div style={{position:'absolute',right:55,top:35,color:A,fontSize:28,fontWeight:900}}>{Math.round(progress*100)}%</div>
</div>;
}
function Flash({f,at,wide}:{f:number,at:number,wide:boolean}){
const n=ramp(f,at,at+9)*(1-ramp(f,at+10,at+20));
return <div style={{position:'absolute',zIndex:50,inset:0,background:A,opacity:n*.7,transform:'skewX(-9deg) scaleX('+(1+Math.sin(f)*.02)+')',pointerEvents:'none'}}/>;
}
export const WawasanFilm:React.FC<{wide:boolean}>=({wide})=>{
const f=useCurrentFrame();const {width:w,height:h}=useVideoConfig();
const a=visible(f,0,111),b=visible(f,95,280),c=visible(f,262,445),d=visible(f,431,640),e=visible(f,626,780),z=ramp(f,763,800);
return <AbsoluteFill style={{overflow:'hidden',background:B,color:K,fontFamily:'Outfit,Arial,sans-serif'}}>
<style>{'@font-face{font-family:Outfit;src:url("'+file('outfit.woff2')+'") format("woff2");font-weight:100 900;font-display:block;}'}</style>
<BG f={f}/>
<div style={{position:'absolute',inset:0,opacity:a}}>
<div style={{position:'absolute',width:wide?590:750,height:wide?590:750,left:wide?1070:155,top:wide?145:320,filter:'drop-shadow(0 45px 45px #0008)',transform:'rotate('+((1-ramp(f,0,29))*-16)+'deg) scale('+(0.6+ramp(f,0,31)*.4)+')'}}>
<Img src={file('logo.png')} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>
<Punch f={f} at={12} x={wide?105:82} y={wide?235:1115} size={wide?205:196} word="SATU"/>
<Punch f={f} at={27} x={wide?105:82} y={wide?423:1300} size={wide?230:218} word="TAP." color={A}/>
<Punch f={f} at={48} x={wide?115:87} y={wide?690:1565} size={wide?53:57} word="REALITI BERLIPAT."/>
<div style={{position:'absolute',top:wide?80:145,left:wide?108:85,fontSize:24,color:A,fontWeight:900,letterSpacing:5}}>RESTORAN WAWASAN • DIGITAL EXPERIENCE</div>
</div>
<div style={{position:'absolute',inset:0,opacity:b}}>
<Head f={f} at={112} wide={wide} kicker="01 / EXPLORE" title={wide?'RANCANG\nMAJLIS.':'PILIH.\nSUSUN.\nSIAP.'} desc="Pilih jenis majlis, sesi dan cara penyediaan."/>
<Device wide={wide} f={f} at={116} src={wide?'wide-order.png':'phone-order.png'} sequence={wide?'desktop':'selection'} sequenceAt={145} sequenceLength={96}/>

<Tap f={f} at={206} x={wide?1420:780} y={wide?620:1180}/>
<Punch f={f} at={237} x={wide?105:90} y={wide?890:1690} size={wide?74:80} word="NEXT PLEASE!" color={A}/>
</div>
<div style={{position:'absolute',inset:0,opacity:c}}>
<Head f={f} at={277} wide={wide} kicker="02 / ORDER" title={wide?'RASA.\nDALAM SATU TAP.':'MENU.\nRASA.\nSIAP.'} desc="Menu Wawasan daripada tempahan sebenar."/>
<Device wide={wide} f={f} at={296} src={wide?'wide-menu.png':'phone-home.png'} sequence={wide?'desktop-menu':'menu'} sequenceAt={335} sequenceLength={96}/>
<Food f={f} at={334} src="nasi.webp" x={wide?1170:5} y={wide?550:970} sz={wide?360:420}/>
<Food f={f} at={356} src="rendang.webp" x={wide?1630:670} y={wide?200:390} sz={wide?295:350}/>
<Food f={f} at={376} src="soto.webp" x={wide?810:510} y={wide?720:1440} sz={wide?315:340}/>
<Tap f={f} at={351} x={wide?1370:790} y={wide?500:980}/>
<div style={{position:'absolute',left:wide?105:100,top:wide?715:1445,display:'flex',gap:17,opacity:ramp(f,355,380)}}>
{['MAJLIS','MENU','BUTIRAN'].map((s,i)=><div key={i} style={{fontSize:wide?23:25,fontWeight:900,color:i===1?B:K,border:'2px solid '+A,background:i===1?A:'#2C1E19',padding:wide?'16px 26px':'22px 24px',borderRadius:80,transform:'translateY('+(Math.sin(f/14+i)*6)+'px)'}}>{s}</div>)}</div>
<Punch f={f} at={401} x={wide?105:85} y={wide?905:1710} size={wide?75:82} word="NEXT PLEASE!" color={A}/>
</div>
<div style={{position:'absolute',inset:0,opacity:d}}>
<Head f={f} at={447} wide={wide} kicker="03 / DELIVERY" title={wide?'DARI DAPUR.\nKE DESTINASI.':'GERAK.\nJEJAK.\nSAMPAI.'} desc="Laluan penghantaran dalam satu aliran."/>
<Route f={f} wide={wide}/>
<Tap f={f} at={574} x={wide?1720:865} y={wide?370:1010}/>
<Punch f={f} at={606} x={wide?110:88} y={wide?890:1660} size={wide?78:84} word="NEXT PLEASE!" color={A}/>
</div>
<div style={{position:'absolute',inset:0,opacity:e}}>
<Head f={f} at={649} wide={wide} kicker="04 / COMPLETE" title={wide?'KEMAS.\nTERATUR.':'TEMPAHAN.\nSTATUS.\nINVOIS.'} desc="Daripada tempahan kepada rekod."/>
<Device wide={wide} f={f} at={655} src={wide?'wide-order.png':'phone-order.png'}/>
<div style={{position:'absolute',left:wide?1030:80,top:wide?750:1440,width:wide?715:890,boxSizing:'border-box',padding:38,border:'2px solid '+A,borderRadius:35,background:'#271A17',boxShadow:'0 25px 70px #0008',opacity:ramp(f,698,724),transform:'translateY('+((1-ramp(f,698,724))*160)+'px)'}}>
<div style={{color:A,letterSpacing:4,fontSize:23,fontWeight:900}}>RESTORAN WAWASAN</div>
<div style={{color:K,fontSize:wide?52:59,fontWeight:900,marginTop:10}}>INVOIS & REKOD</div>
<div style={{height:5,marginTop:24,background:A,width:(75*ramp(f,715,753))+'%'}}/>
</div></div>
<div style={{position:'absolute',inset:0,opacity:z,background:'radial-gradient(circle at 50% 40%,#623923,#291A17 69%,#0F0908)'}}>
<div style={{position:'absolute',left:'50%',top:wide?70:310,width:wide?540:760,height:wide?540:760,transform:'translateX(-50%) scale('+(0.65+.35*ramp(f,770,810))+')'}}>
<Img src={file('logo.png')} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>
<Punch f={f} at={809} x={wide?315:72} y={wide?679:1190} size={wide?132:140} word="COMING SOON"/>
<Punch f={f} at={831} x={wide?555:145} y={wide?834:1360} size={wide?75:87} word="JANUARY 2027!" color={A}/>
<div style={{position:'absolute',left:'50%',top:wide?980:1590,width:wide?900:760,height:5,background:A,transform:'translateX(-50%) scaleX('+ramp(f,838,864)+')'}}/>
</div>
{[99,267,432,630,773].map(at=><Flash key={at} f={f} at={at} wide={wide}/>)}
{([[0,'logo_impact',0.28],[102,'whoosh',0.25],[150,'card_expand',0.24],[204,'tap',0.36],[267,'whoosh',0.28],[351,'tap',0.4],[432,'whoosh',0.28],[447,'map_trace',0.28],[630,'paper_swipe',0.25],[774,'logo_impact',0.29],[830,'shimmer',0.22]] as Array<[number,string,number]>).map(([at,name,volume])=><Sequence key={at} from={at}><Audio src={staticFile('audio/sfx/'+name+'.wav')} volume={volume}/></Sequence>)}
<div style={{position:'absolute',left:wide?80:70,bottom:wide?40:65,display:'flex',gap:18,alignItems:'center',opacity:.68}}>
<span style={{fontSize:wide?20:22,fontWeight:900,letterSpacing:3}}>RW / 2027</span>
<span style={{height:3,width:wide?250:135,background:'#6A5344',position:'relative'}}><span style={{position:'absolute',left:0,top:0,height:'100%',width:(f/9)+'%',background:A}}/></span>
<span style={{fontSize:wide?20:22,fontWeight:700}}>{String(Math.min(6,Math.floor(f/150)+1)).padStart(2,'0')}</span></div>
<div style={{position:'absolute',right:wide?90:70,top:wide?54:68,opacity:.65,fontSize:wide?23:24,letterSpacing:3,fontWeight:900}}>W / MOTION</div>
</AbsoluteFill>;
};
