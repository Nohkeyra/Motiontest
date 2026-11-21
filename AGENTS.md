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
