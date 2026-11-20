import React from 'react';
import {Composition} from 'remotion';
import {WawasanSmokeTest} from './WawasanSmokeTest';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="WawasanSmokeTest"
      component={WawasanSmokeTest}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
