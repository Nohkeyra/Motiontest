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
probe=json.loads(subprocess.check_output([
    'ffprobe','-v','error','-select_streams','v:0',
    '-show_entries','stream=width,height','-of','json',str(video)]))
v=probe['streams'][0]
if (int(v['width']),int(v['height'])) != (432,900):
    raise SystemExit('Incorrect Wawasan capture framing: video must exactly match mobile viewport')

index=[]
for item in data['examples']:
    start=max(0.0,float(data['markers'][item['marker']])-0.35)
    length=min(float(item['seconds']),duration-start-0.08)
    if length<1.2: raise SystemExit('Too little app footage for '+item['file'])
    # Decoding OffthreadVideo inside moving 3D layers produced blank/sliver
    # frames. Use an honest frame-accurate JPEG sequence from the same recording.
    name=pathlib.Path(item['file']).stem
    folder=root/'sequences'/name
    folder.mkdir(parents=True,exist_ok=True)
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',
      f'{start:.4f}','-i',str(video),'-t',f'{length:.4f}','-vf',
      'fps=30,scale=864:1800:flags=lanczos','-q:v','3','-start_number','0',
      str(folder/'%04d.jpg')],check=True)
    frames=len(list(folder.glob('*.jpg')))
    if frames < 35: raise SystemExit('Insufficient real frames for '+name)
    index.append({'sequence':name,'frames':frames,'action':item['marker'],
                  'start_original':start,'duration':length})
(clips/'index.json').write_text(json.dumps(index,indent=2))
print('Prepared real UI clips:',json.dumps(index))
