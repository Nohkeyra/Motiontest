#!/usr/bin/env python3
"""Check provenance and output integrity. Video art quality requires separate review."""
import json
import pathlib
import subprocess
import sys
import hashlib
from PIL import Image, ImageChops

def check_capture(folder):
    root=pathlib.Path(folder)
    provenance=json.loads((root/'capture.json').read_text())
    assert provenance['source'] in {
        'real_wawasan_signed_apk_android_emulator',
        'signed_apk_bundled_webview_assets',
    },'Unknown screenshot provenance'
    assert len(provenance.get('apk_sha256',''))==64,'Missing source hash'
    pictures=[]
    for filename in ('welcome.png','after-start.png'):
        fp=root/filename
        assert hashlib.sha256(fp.read_bytes()).hexdigest()==provenance['screens'][filename]
        with Image.open(fp) as im:
            assert im.width>=600 and im.height>=1000
            pictures.append(im.convert('RGB').resize((120,240)))
    changed=ImageChops.difference(*pictures)
    ratio=sum(max(p)>35 for p in changed.getdata())/(120*240)
    assert ratio>=0.10, 'Interaction did not visibly change the real app screen'
    print('Capture verified:',provenance['source'],'changed ratio:',round(ratio,3))

def check_video(filename):
    video=pathlib.Path(filename)
    assert video.is_file() and video.stat().st_size>30000
    data=json.loads(subprocess.check_output(
        ['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]))
    streams=[s for s in data['streams'] if s.get('codec_type')=='video']
    assert len(streams)==1
    s=streams[0]
    assert (s['width'],s['height'])==(1080,1920)
    n,d=map(int,s['avg_frame_rate'].split('/'))
    assert abs(n/d-30)<0.1
    is_film = video.name == 'wawasan-studio-film.mp4'
    expected = 30 if is_film else 9
    assert expected-0.3 < float(data['format']['duration']) < expected+0.3
    # Validate decode of the actual encoded stream, not just container metadata.
    subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],check=True)
    out=video.parent/'review-frames'
    out.mkdir(exist_ok=True)
    times=(0.8,4.5,8.8,12.8,17.8,22.7,26.8,29.0) if is_film else (0.6,2.8,4.8,7.5)
    for i,t in enumerate(times):
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(t),
            '-i',str(video),'-frames:v','1',str(out/('%02d.png'%i))],check=True)
    print('MP4 metadata verified; review frames extracted')

if __name__=='__main__':
    if len(sys.argv)!=3: raise SystemExit('Usage: verify.py capture FOLDER | video FILE')
    {'capture':check_capture,'video':check_video}[sys.argv[1]](sys.argv[2])
