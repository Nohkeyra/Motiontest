#!/usr/bin/env python3
"""Wawasan: deterministic, royalty-free procedural stereo SFX.

No recorded samples, copied material, external generative services, downloads,
or third-party sound recordings. Every sample is synthesized from equations.
The filename and render format are stable for frame-accurate Remotion cues.
"""
from __future__ import annotations

import argparse
import json
import math
import random
import struct
import wave
from pathlib import Path

SR = 48000
PI = math.pi
TAU = PI * 2
# Peak targets on each isolated stereo file. The Remotion SFX bus is further
# attenuated for headroom when combined with a future music track.
SOUNDS = {
    "tap":          (0.18, -11.0, "UI / tactile click"),
    "card_expand":  (0.43, -12.0, "UI / airy expansion"),
    "whoosh":       (0.68, -10.0, "Transition / lateral sweep"),
    "type_hit":     (0.34,  -9.5, "Kinetic typography / short stomp"),
    "map_trace":    (0.82, -14.0, "Map / subdued electronic trace"),
    "complete":     (0.75, -11.0, "Delivery / soft confirmation"),
    "paper_swipe":  (0.45, -13.0, "Invoice / paper-like transition"),
    "logo_impact":  (0.96, -10.0, "Brand / low cinematic impact"),
    "shimmer":      (0.92, -14.0, "Brand / restrained tonal shimmer"),
}

def clamp(x: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, x))

def smooth(x: float) -> float:
    a = clamp(x)
    return a * a * (3.0 - 2.0 * a)

def envelope(t: float, length: float, attack: float = 0.004, release: float = 0.025) -> float:
    return smooth(t / attack) * smooth((length - t) / release)

def synthesized(name: str, duration: float, seed: int) -> list[float]:
    count = round(SR * duration)
    rng = random.Random(seed)
    samples: list[float] = []
    lowpass = 0.0
    phase = 0.0
    for i in range(count):
        t = i / SR
        u = t / duration
        white = rng.random() * 2.0 - 1.0
        # One-pole filtered noise plus its higher-frequency complement.
        cutoff = 0.09 + 0.18 * u
        lowpass += cutoff * (white - lowpass)
        highpass = white - lowpass
        amp = envelope(t, duration)
        if name == "tap":
            frequency = 750.0 - 490.0 * smooth(t / 0.07)
            phase += TAU * frequency / SR
            v = (0.85 * math.sin(phase) + 0.42 * highpass) * math.exp(-36 * t)
        elif name == "card_expand":
            frequency = 225.0 + 510.0 * smooth(u)
            phase += TAU * frequency / SR
            v = (math.sin(phase) * 0.42 + highpass * 0.13) * (math.sin(PI * u) ** 1.4)
        elif name == "whoosh":
            frequency = 94.0 + 240.0 * smooth(u)
            phase += TAU * frequency / SR
            v = (0.55 * highpass + 0.27 * lowpass + 0.19 * math.sin(phase)) * (math.sin(PI * u) ** 1.1)
        elif name == "type_hit":
            frequency = 158.0 - 96.0 * smooth(t / 0.22)
            phase += TAU * frequency / SR
            v = (0.8 * math.sin(phase) + 0.48 * highpass * math.exp(-32.0 * t)) * math.exp(-12.5 * t)
        elif name == "map_trace":
            frequency = 290.0 + 250.0 * smooth(u) + 10.0 * math.sin(TAU * 4.0 * t)
            phase += TAU * frequency / SR
            v = (0.57 * math.sin(phase) + 0.09 * highpass) * (math.sin(PI * u) ** 1.7)
        elif name == "complete":
            notes = [(0.0, 659.255), (0.15, 783.991), (0.3, 987.767)]
            v = 0.0
            for at, frequency in notes:
                age = t - at
                if age >= 0.0:
                    v += (math.sin(TAU * frequency * age) + 0.13 * math.sin(TAU * frequency * 2 * age)) * math.exp(-9.2 * age)
            v *= 0.34
        elif name == "paper_swipe":
            v = (0.74 * highpass + 0.24 * lowpass) * (math.sin(PI * u) ** 1.35)
        elif name == "logo_impact":
            frequency = 96.0 - 49.0 * smooth(u)
            phase += TAU * frequency / SR
            v = (0.92 * math.sin(phase) * math.exp(-5.1 * t)
                 + 0.48 * highpass * math.exp(-33.0 * t)
                 + 0.20 * math.sin(TAU * 131.0 * t) * math.exp(-9.0 * t))
        elif name == "shimmer":
            frequencies = (659.255, 987.767, 1318.510)
            v = sum(math.sin(TAU * f * t) * math.exp(-4.8 * t) * (0.48 / (1 + k))
                    for k, f in enumerate(frequencies))
            v += 0.03 * highpass * math.sin(PI * u)
        else:
            raise ValueError("Unknown Wawasan SFX: " + name)
        samples.append(v * amp)
    return samples

def pan_for(name: str, u: float) -> float:
    # Negative is left. Restrained; not excessive headphone-only gimmicks.
    if name in ("whoosh", "paper_swipe"):
        return -0.65 + 1.3 * smooth(u)
    if name == "map_trace":
        return -0.28 + 0.56 * smooth(u)
    return 0.0

def write_wav(path: Path, name: str, duration: float, peak_db: float, seed: int) -> dict:
    mono = synthesized(name, duration, seed)
    peak = max(abs(x) for x in mono)
    if peak <= 1e-9:
        raise RuntimeError("Silence generated: " + name)
    target = 10.0 ** (peak_db / 20.0)
    multiplier = target / peak
    frames = bytearray(len(mono) * 4)
    for i, sample in enumerate(mono):
        pan = pan_for(name, i / max(1, len(mono)-1))
        left = math.sqrt((1 - pan) / 2.0) * math.sqrt(2.0)
        right = math.sqrt((1 + pan) / 2.0) * math.sqrt(2.0)
        v = sample * multiplier
        struct.pack_into("<hh", frames, i * 4, int(round(32767 * v * left)),
                         int(round(32767 * v * right)))
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as out:
        out.setnchannels(2)
        out.setsampwidth(2)
        out.setframerate(SR)
        out.writeframes(frames)
    return {
        "name": name, "file": path.name, "durationSeconds": duration,
        "peakTargetDbFS": peak_db, "description": SOUNDS[name][2],
        "channels": 2, "sampleRate": SR, "provenance": "original-procedural"
    }

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="videos/wawasan-authentic/public/audio/sfx")
    args = parser.parse_args()
    destination = Path(args.output)
    manifest = []
    for index, (name, (duration, peak_db, _)) in enumerate(SOUNDS.items()):
        manifest.append(write_wav(destination / (name + ".wav"), name, duration,
                                  peak_db, 20261121 + index * 1103))
    (destination / "manifest.json").write_text(
        json.dumps({"version": 1, "soundEffects": manifest, "sampleLicense":
                    "Original procedural assets. No external recordings."},
                   indent=2) + "\n", encoding="utf-8")
    print("Generated", len(manifest), "48 kHz stereo SFX in", destination)

if __name__ == "__main__":
    main()
