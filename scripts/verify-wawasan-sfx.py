#!/usr/bin/env python3
"""Verify generated SFX authenticity metadata, WAV format and headroom."""
import argparse
import hashlib
import json
import math
import struct
import wave
from pathlib import Path

parser=argparse.ArgumentParser()
parser.add_argument("--input",default="videos/wawasan-authentic/public/audio/sfx")
args=parser.parse_args()
folder=Path(args.input)
manifest=json.loads((folder/"manifest.json").read_text(encoding="utf-8"))
items=manifest["soundEffects"]
assert len(items)==9, "Expected exactly 9 named sound cues"
assert len({item["name"] for item in items})==len(items), "Duplicate cue names"
hashes=set()
for sound in items:
    p=folder/sound["file"]
    with wave.open(str(p),"rb") as w:
        assert (w.getframerate(),w.getnchannels(),w.getsampwidth())==(48000,2,2),(sound,w.getparams())
        duration=w.getnframes()/w.getframerate()
        assert abs(duration-sound["durationSeconds"])<=1/48000
        raw=w.readframes(w.getnframes())
    samples=struct.iter_unpack("<h",raw)
    squares=0.0
    peak=0
    count=0
    for (value,) in samples:
        peak=max(peak,abs(value))
        squares+=value*value
        count+=1
    rms=math.sqrt(squares/count)/32768
    peak_amp=peak/32768
    assert 0.02<peak_amp<0.45,(sound["name"],peak_amp)
    assert rms>0.0004,(sound["name"],rms)
    assert sound["provenance"]=="original-procedural"
    digest=hashlib.sha256(raw).hexdigest()
    assert digest not in hashes, "Two different cues are identical"
    hashes.add(digest)
    print("%s: %.2fs, peak %.1f dBFS, rms %.4f, sha256 %.12s" %
          (sound["name"],duration,20*math.log10(peak_amp),rms,digest))
print("All original Wawasan stereo WAV cues verified.")
