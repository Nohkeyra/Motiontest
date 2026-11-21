# Wawasan Sound Design Engine

This is an opt-in library for the promo video, NOT an Android app feature.

1. Run `npm run prepare:sfx` in `videos/wawasan-authentic` to create nine
   deterministic 48 kHz stereo WAV effects at `public/audio/sfx/`.
2. Run `npm run check:sfx` to validate original sample format and headroom.
3. Run `npm run render:sfx` to preview a 9-second dry, sound-only montage
   (with graphical labels) using a Remotion frame-synced composition.
4. To use in another composition, import `SoundCueTrack` from
   `./audio/SoundDesign` and pass cues with accurate scene frames.
   Do not use the preview's example cue frames as if they were actual app taps.
5. Only after music and scene timings are approved, optionally wrap an existing
   music Audio track with the exported `musicVolumeWithDucking` helper.

**Assets:** All sounds are generated locally from math/noise without third-party
recordings or downloads. No npm audio plugin is required; Python 3 (standard
library), Remotion and FFmpeg suffice. Frame precision comes from Remotion
`<Sequence>`. Mono synthesis is panned into a 48 kHz stereo WAV.

**Art direction:** UI taps are tight and short, route sound is low in the mix,
confirmation is restrained, impacts are sparse. Avoid loud or generic whooshes.
Music is deliberately not changed or committed by this setup.
