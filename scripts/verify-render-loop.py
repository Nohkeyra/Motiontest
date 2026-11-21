#!/usr/bin/env python3
"""Quality-check an encoded Remotion video, optionally including its loop seam.

Uses FFmpeg/FFprobe and Python stdlib: dimensions, FPS, actual decoded frame
count, full decode, near-black frames, temporal variation, loop discontinuity
and audio presence/headroom. Never substitutes mock footage for failed output.
"""
from __future__ import annotations
import argparse
import json
import math
import re
import subprocess
from pathlib import Path

def command(argv: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(argv, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

def frame_rgb(path: Path, index: int, width: int=90, height: int=160) -> bytes:
    filt="select=eq(n\\,"+str(index)+"),scale="+str(width)+":"+str(height)
    result=command(["ffmpeg","-nostdin","-v","error","-i",str(path),
        "-vf",filt,"-vsync","0","-frames:v","1","-pix_fmt","rgb24",
        "-f","rawvideo","pipe:1"])
    data=result.stdout
    assert len(data)==width*height*3,("Frame not decoded",index,len(data))
    return data

def difference(a: bytes,b: bytes) -> float:
    assert len(a)==len(b)
    return sum(abs(x-y) for x,y in zip(a,b))/len(a)

def validate(ns: argparse.Namespace) -> dict:
    path=Path(ns.input)
    assert path.is_file() and path.stat().st_size>25000,"Missing/empty MP4"
    meta=json.loads(command(["ffprobe","-v","error","-count_frames",
      "-show_entries","format=duration,size:stream=codec_type,width,height,"
      "r_frame_rate,nb_read_frames,channels,sample_rate",
      "-of","json",str(path)]).stdout)
    streams=meta.get("streams",[])
    video=next((s for s in streams if s.get("codec_type")=="video"),None)
    audio=next((s for s in streams if s.get("codec_type")=="audio"),None)
    assert video is not None,"No video stream found"
    assert (video.get("width"),video.get("height"))==(ns.width,ns.height),video
    parts=video["r_frame_rate"].split("/")
    actual_fps=int(parts[0])/int(parts[1])
    assert abs(actual_fps-ns.fps)<0.02,("Wrong FPS",actual_fps)
    actual_frames=int(video.get("nb_read_frames") or 0)
    assert actual_frames==ns.frames,("Wrong decoded frame count",actual_frames,ns.frames)
    duration=float(meta["format"]["duration"])
    assert abs(duration-ns.frames/ns.fps)<0.11,("Wrong duration",duration)
    if ns.expected_audio=="none":
        assert audio is None,"Unexpected audio in silent loop demo"
    if ns.expected_audio=="required":
        assert audio is not None,"Missing expected soundtrack"
    command(["ffmpeg","-nostdin","-v","error","-i",str(path),"-f","null","-"])
    sampled=sorted(set([0,ns.frames//4,ns.frames//2,3*ns.frames//4,ns.frames-1]))
    pixels={i:frame_rgb(path,i) for i in sampled}
    for i,raw in pixels.items():
        mean=sum(raw)/len(raw)
        dynamic=max(raw)-min(raw)
        assert mean>12.0 and dynamic>55,("Dark/blank frame",i,mean,dynamic)
    midpoint=difference(pixels[0],pixels[ns.frames//2])
    assert midpoint>2.0,("Suspiciously frozen animation",midpoint)
    report={"file":str(path),"width":ns.width,"height":ns.height,
        "fps":actual_fps,"frames":actual_frames,"seconds":duration,
        "sampleFrameIndices":sampled,
        "midpointMeanAbsoluteDifference":round(midpoint,3),
        "audioPresent":audio is not None}
    if ns.seam:
        seam=difference(pixels[0],pixels[ns.frames-1])
        report["seamMeanAbsoluteDifference"]=round(seam,3)
        report["maxAllowedSeamDifference"]=ns.max_seam_difference
        assert seam<=ns.max_seam_difference,(
          "Visible discontinuity at loop boundary",seam,ns.max_seam_difference)
    if audio is not None:
        assert int(audio.get("sample_rate",0))>=44100
        levels=command(["ffmpeg","-hide_banner","-i",str(path),
          "-af","volumedetect","-vn","-f","null","-"]).stderr.decode("utf-8","replace")
        peak=re.search(r"max_volume:\s*([-\d.]+) dB",levels)
        mean=re.search(r"mean_volume:\s*([-\d.]+) dB",levels)
        assert peak and mean,"FFmpeg failed to measure audio levels"
        peak_db,mean_db=float(peak.group(1)),float(mean.group(1))
        assert peak_db<=-0.8,("Audio clipping risk",peak_db)
        assert mean_db>-70.0,("Audio effectively silent",mean_db)
        report["audioPeakDbFS"]=peak_db
        report["audioMeanDbFS"]=mean_db
    report["passed"]=True
    return report

def main() -> None:
    ap=argparse.ArgumentParser()
    ap.add_argument("--input",required=True)
    ap.add_argument("--frames",type=int,default=120)
    ap.add_argument("--fps",type=float,default=30.0)
    ap.add_argument("--width",type=int,default=1080)
    ap.add_argument("--height",type=int,default=1920)
    ap.add_argument("--seam",action="store_true")
    ap.add_argument("--max-seam-difference",type=float,default=13.0)
    ap.add_argument("--expected-audio",choices=("none","optional","required"),default="optional")
    ap.add_argument("--report")
    ns=ap.parse_args()
    assert ns.frames>=4 and ns.fps>0
    result=validate(ns)
    output=json.dumps(result,indent=2,sort_keys=True)
    print(output)
    if ns.report:
        p=Path(ns.report)
        p.parent.mkdir(parents=True,exist_ok=True)
        p.write_text(output+"\n",encoding="utf-8")

if __name__=="__main__":
    main()
