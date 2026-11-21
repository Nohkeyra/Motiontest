#!/usr/bin/env python3
"""Cut real browser recordings using recorded actual-app action timestamps."""
import json
import pathlib
import subprocess
import sys

root=pathlib.Path(sys.argv[1])
video=root/'interaction-full.webm'
data=json.loads((root/'interaction-times.json').read_text())
clips=root/'clips'
clips.mkdir(exist_ok=True)
duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries',
    'format=duration','-of','default=nw=1:nk=1',str(video)]).strip())
if duration<12: raise SystemExit('Real app recording unexpectedly short')
index=[]
for item in data['examples']:
    start=max(0.0,float(data['markers'][item['marker']])-0.35)
    length=min(float(item['seconds']),duration-start-0.08)
    if length<1.2: raise SystemExit('Too little app footage for '+item['file'])
    output=clips/item['file']
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',
      f'{start:.4f}','-i',str(video),'-t',f'{length:.4f}','-vf',
      'fps=30,scale=864:1800:flags=lanczos','-an','-c:v','libx264',
      '-preset','veryfast','-crf','21','-pix_fmt','yuv420p',
      '-movflags','+faststart',str(output)],check=True)
    if output.stat().st_size<30000: raise SystemExit('Empty clip '+item['file'])
    index.append({'file':item['file'],'action':item['marker'],
                  'start_original':start,'duration':length})
(clips/'index.json').write_text(json.dumps(index,indent=2))
print('Prepared real UI clips:',json.dumps(index))
