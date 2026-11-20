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
