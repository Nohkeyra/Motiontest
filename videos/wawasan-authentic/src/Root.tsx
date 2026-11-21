import React from 'react';
import {Composition} from 'remotion';
import {AuthenticProof} from './AuthenticProof';
import {WawasanFilm} from './WawasanFilm';
import {MasterCut} from './MasterCut';
export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="MasterCut" component={MasterCut} durationInFrames={900} fps={30} width={1080} height={1920} />
  <Composition id="WawasanFilm" component={WawasanFilm} durationInFrames={900} fps={30} width={1080} height={1920} />
  <Composition id="AuthenticProof" component={AuthenticProof}
    durationInFrames={270} fps={30} width={1080} height={1920} />
  </>
);
