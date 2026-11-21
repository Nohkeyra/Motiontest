#!/usr/bin/env python3
"""Detect kick pulse in licensed recorded music and snap editorial cuts to beats."""
import pathlib, subprocess, sys
import numpy as np
root=pathlib.Path(sys.argv[1])
wav=root/'public/audio/master-beat.wav'
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(wav),'-ac','1',
                             '-ar','8000','-f','f32le','-'])
samples=np.frombuffer(raw,dtype='<f4')
from numpy.fft import rfft,irfft,rfftfreq
n=len(samples);freq=rfftfreq(n,1/8000)
s=rfft(samples)
s[(freq<42)|(freq>150)]=0
low=irfft(s,n=n)
hop=80
rms=np.sqrt(np.mean(low[:(len(low)//hop)*hop].reshape(-1,hop)**2,axis=1))
onset=np.maximum(0,np.diff(rms,prepend=rms[0]))
onset=(onset-onset.mean())/(onset.std()+1e-9)
scores=[(float(np.mean(onset[lag:]*onset[:-lag])),lag) for lag in range(41,64)]
_,lag=max(scores)
bpm=6000/lag
phases=[float(sum(max(0,onset[p+k*lag]) for k in range((len(onset)-p-1)//lag))) for p in range(lag)]
phase=max(range(lag),key=lambda p:phases[p])/100
period=lag/100
nominal=[0,3.4,6.8,10.4,14.9,19.4,25.5,30]
cuts=[0]
for target in nominal[1:-1]:
    frame=round((phase+round((target-phase)/period)*period)*30)
    cuts.append(max(cuts[-1]+45,min(870,frame)))
cuts.append(900)
if len(set(cuts))!=len(cuts): raise SystemExit('Collapsed beat cuts')
ts='// Generated from licensed audio low-frequency pulse at render time.\n'
ts+=f'export const TRACK_BPM={bpm:.3f};\n'
ts+=f'export const BEAT_FRAMES={period*30:.5f};\n'
ts+=f'export const BEAT_OFFSET={phase*30:.5f};\n'
ts+=f'export const CUTS={cuts} as const;\n'
(root/'src/musicGrid.ts').write_text(ts)
print('Beat grid:',bpm,'bpm',cuts)
