import React from 'react';
import {Composition} from 'remotion';
import {AuthenticProof} from './AuthenticProof';
import {WawasanFilm} from './WawasanFilm';
import {MasterCut} from './MasterCut';
import {Wawasan3DSmoke} from './ThreeSmoke';
import {WawasanMotionAddonsSmoke} from './MotionAddonsSmoke';
import {EffectsShowcase} from './effects/EffectsShowcase';
import {WawasanSfxPreview} from './audio/SfxPreview';
import {WawasanSeamlessLoop} from './loop/LoopShowcase';
import {WawasanAnimatedLogoPreview} from './brand/WawasanLogoMotion';
import {WawasanCinematicTransitions} from './transitions/CinematicTransitions';
export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="WawasanAnimatedLogoPreview" component={WawasanAnimatedLogoPreview} durationInFrames={120} fps={30} width={1080} height={1920} />
  <Composition id="WawasanCinematicTransitions" component={WawasanCinematicTransitions} durationInFrames={240} fps={30} width={1080} height={1920} />
  <Composition id="WawasanSeamlessLoop" component={WawasanSeamlessLoop} durationInFrames={120} fps={30} width={1080} height={1920} />
  <Composition id="WawasanSfxPreview" component={WawasanSfxPreview} durationInFrames={270} fps={30} width={1080} height={1920} />
  <Composition id="WawasanFXShowcase" component={EffectsShowcase} durationInFrames={300} fps={30} width={1080} height={1920} />
  <Composition id="WawasanMotionAddonsSmoke" component={WawasanMotionAddonsSmoke} durationInFrames={120} fps={30} width={1080} height={1920} />
  <Composition id="Wawasan3DSmoke" component={Wawasan3DSmoke} durationInFrames={90} fps={30} width={1080} height={1920} />
  <Composition id="MasterCut" component={MasterCut} durationInFrames={900} fps={30} width={1080} height={1920} />
  <Composition id="WawasanFilm" component={WawasanFilm} durationInFrames={900} fps={30} width={1080} height={1920} />
  <Composition id="AuthenticProof" component={AuthenticProof}
    durationInFrames={270} fps={30} width={1080} height={1920} />
  </>
);
