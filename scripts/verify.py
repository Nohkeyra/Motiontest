#!/usr/bin/env python3
"""Technical checks; does not claim the film has artistic quality."""
import json
import pathlib
import subprocess
import sys
import hashlib
from PIL import Image, ImageChops

def check_capture(folder):
    root=pathlib.Path(folder)
    provenance=json.loads((root/'capture.json').read_text())
    assert provenance['source']=='real_wawasan_signed_apk_android_emulator'
    pictures=[]
    for filename in ('welcome.png','after-start.png'):
        path=root/filename
        assert hashlib.sha256(path.read_bytes()).hexdigest()==provenance['screens'][filename]
        with Image.open(path) as im:
            assert im.width>=600 and im.height>=1000
            pictures.append(im.convert('RGB').resize((120,240)))
    delta=ImageChops.difference(*pictures)
    ratio=sum(max(pixel)>35 for pixel in delta.getdata())/(120*240)
    assert ratio>=0.10, 'Tap did not visibly change the screen'
    print('Verified signed APK captures; changed-pixel ratio %.2f' % ratio)

def check_video(filename):
    video=pathlib.Path(filename)
    assert video.is_file() and video.stat().st_size>30000
    data=json.loads(subprocess.check_output(
        ['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]))
    stream=[s for s in data['streams'] if s.get('codec_type')=='video']
    assert len(stream)==1
    stream=stream[0]
    assert (stream['width'],stream['height'])==(1080,1920)
    n,d=map(int,stream['avg_frame_rate'].split('/'))
    assert abs(n/d-30)<0.1
    assert 8.7<float(data['format']['duration'])<9.3
    out=video.parent/'review-frames'
    out.mkdir(exist_ok=True)
    for idx,t in enumerate((0.6,2.8,4.8,7.5)):
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',
            '-ss',str(t),'-i',str(video),'-frames:v','1',
            str(out/('%02d.png' % idx))],check=True)
    print('Validated MP4 and extracted 4 review frames')

if __name__=='__main__':
    assert len(sys.argv)==3
    {'capture':check_capture,'video':check_video}[sys.argv[1]](sys.argv[2])
