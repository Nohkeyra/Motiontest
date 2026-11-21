// Original deterministic thirty-second instrumental design bed.
// No samples, copied recordings, AI-generated vocals or external music.
import fs from 'node:fs';
import path from 'node:path';
const SR=48000,SECONDS=30,N=SR*SECONDS;
const wav=Buffer.alloc(44+N*2);
wav.write('RIFF',0,'ascii');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8,'ascii');
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
wav.writeUInt32LE(SR,24);wav.writeUInt32LE(SR*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);
wav.write('data',36,'ascii');wav.writeUInt32LE(N*2,40);
const cuts=[0,3.7,7.95,12.0,17.1,21.1,26.05];
const beatSec=60/112;
const melody=[220,261.63,293.66,261.63,196,220,293.66,246.94];
let seed=0x86a74bd;
const noise=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/2147483648-1;};
for(let i=0;i<N;i++){
  const t=i/SR, b=Math.floor(t/beatSec), age=t-b*beatSec;
  const half=beatSec/2, hAge=t-Math.floor(t/half)*half;
  let v=.065*Math.sin(2*Math.PI*55*t)+.032*Math.sin(2*Math.PI*110*t+Math.sin(t*.15));
  // Understated kick on alternate beats; restrained hats and snare.
  if(b%2===0) v+=.24*Math.sin(2*Math.PI*(58*age+14*(1-Math.exp(-12*age))))*Math.exp(-19*age);
  if(b%4===1||b%4===3) v+=.075*noise()*Math.exp(-29*age);
  v+=.034*noise()*Math.exp(-63*hAge);
  const noteAge=t-Math.floor(t/(2*beatSec))*(2*beatSec);
  const note=melody[Math.floor(t/(2*beatSec))%melody.length];
  v+=.052*Math.sin(2*Math.PI*note*t)*Math.exp(-3.6*noteAge);
  for(const c of cuts){
    const d=t-c;
    if(d>=0&&d<.36){
      v+=.085*Math.sin(2*Math.PI*(160*d+90*d*d))*Math.exp(-22*d);
      v+=.022*noise()*Math.exp(-15*d);
    }
  }
  const fade=Math.min(1,t/.60,(SECONDS-t)/1.7);
  v=Math.max(-.91,Math.min(.91,v*fade));
  wav.writeInt16LE(Math.round(v*32700),44+i*2);
}
const output=path.join(process.cwd(),'public/audio/wawasan-score.wav');
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,wav);
console.log('Original 30-second score:',output,'at',SR,'Hz');
