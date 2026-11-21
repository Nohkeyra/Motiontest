# Wawasan Motiontest

The main application is Nohkeyra/Pu. Do not change it for video production.

- Use real product UI from signed APK releases; do not fabricate screens, controls, labels, or states.
- There are two distinct sources: an Android emulator running the installed APK, versus Chromium rendering the compiled web frontend extracted from that signed APK. Never call Chromium captures emulator footage.
- The browser-based method cannot verify native plugins or Android system chrome; it can only verify the embedded React UI.
- Native-only page presentation may be enabled by supplying a Capacitor platform flag. Never replace real components with drawings.
- Stop on missing scripts, assets, real controls or failed interactions. No mock UI fallback.
- Film choreography, masks, camera transitions and effects can be entirely original.
- Preserve the original logo and typography. Review encoded video frames before claiming visual quality.
- Do not modify Pu or publish final videos without authorization.

## Video production toolchain

- Remotion (`videos/wawasan-authentic`) remains the approved main renderer. Its versions are already pinned.
- Read the appropriate agent guidance under `.agents/skills/<skill>/SKILL.md` before working on timing, kinetic type, visual direction, maps or 3D. Read each skill's local references as needed.
- HyperFrames (`videos/hyperframes-wawasan`) is an isolated HTML-motion lab. Do not replace the main Remotion project or copy HTML animation clocks into a seekable React timeline.
- Manim (`videos/manim-wawasan`) is an optional Python procedural graphics generator. A Manim route sketch is not a verified rider route. Real map positions must come from actual app data.
- Reference clips guide pacing and choreography only. Preserve actual Wawasan brand assets, established labels, and correct screen states.
- Do not add any chosen music to the repository until the user selects it and its usage rights are confirmed.

## Reference-inspired film motion grammar

- Reference video 147494.mp4: editorial poster collage, torn-paper-like masks, layered cutouts, dramatic hierarchy and cropped oversized typography. Adapt the compositional ideas; do not reproduce third-party imagery, poster designs, or red/black palette.
- Reference video 147495.mp4: fast 3D phone choreography, floating category cards, UI-to-object transitions, clean spatial blocking and contrasting graphic backgrounds. Build with authentic Wawasan UI and real dish assets, not simulated banking widgets.
- Keep cuts confidently paced around the user-selected beat (110–120 BPM preferred). Do not assume a track has been chosen.
- For maps, use actual route coordinates/recordings and never pretend abstract Manim sketches are live rider tracking.
- The two references are creative guidance only; do not commit or redistribute the original third-party videos.

## Sound design for the promo film

- Before rendering with sound effects, run `npm run prepare:sfx` and `npm run check:sfx` inside `videos/wawasan-authentic`.
- Audio library and Remotion helpers: `src/audio/SoundDesign.tsx`, demo `WawasanSfxPreview`.
- Synthetic WAVs are deterministic and generated on GitHub Actions; no third-party samples, music or recordings need to be checked into the source repo.
- Sync SFX to real taps, route animation, invoice changes and typography beats. Never claim the demo's example cue frames match actual user interactions.
- The existing MasterCut soundtrack and the app's own notification audio are explicitly out of scope until separately approved. Use music ducking only after reviewing the chosen track and final cue positions.

## Render-loop production discipline

- The frame-based, seek-safe seamless loop reference is `videos/wawasan-authentic/src/loop/`. `WawasanSeamlessLoop` is an isolated 4-second proof composition, not an official Wawasan UI, logo or rider-map state.
- Use `loopPhase()` and integer cycle counts for animated properties that must close at the boundary. No wall-clock clocks, `requestAnimationFrame`, `Math.random()` during rendering, mutable frame-to-frame simulation, or indefinite animation clocks.
- CI `.github/workflows/wawasan-render-loop-qa.yml` runs the loop and validates the encoded MP4, dimensions, frame count, FPS, full decode, nonblank samples, motion variation and the visible first/last seam.
- For future renders, `python3 scripts/render-with-qa.py --composition WawasanSeamlessLoop --output out/wawasan-seamless-loop.mp4 --frames 120 --seam --expected-audio none` performs a maximum of **two** attempts and exports QA logs.
- This workflow is only an isolated production check. Do not automatically change `MasterCut`, selected music, or the main Android app; seamless assets must be reviewed before being incorporated into final edits.

## Cinematic transitions and brand logo (Remotion)

- Use only @remotion/transitions at the same pinned version as remotion (4.0.545).
- Reusable presets are in videos/wawasan-authentic/src/transitions/CinematicTransitions.tsx:
  fade, kinetic slide, directional wipe and clock wipe.
- The actual unmodified logo is at public/brand/wawasan_logo.svg. It is copied
  byte-for-byte from Nohkeyra/Pu/public/assets/brand/wawasan_logo.svg,
  original Git blob SHA 1ad31cbafedcd51350573e3b3f3261bde53de3ad.
- Animate the containing logo layer only; never recolor or reconstruct its paths.
- WawasanAnimatedLogoPreview (4 seconds) and WawasanCinematicTransitions
  (8 seconds) are isolated preview compositions. No invented app UI appears.
- They do not alter MasterCut, its music/SFX choices, the APK or the Pu repo.
