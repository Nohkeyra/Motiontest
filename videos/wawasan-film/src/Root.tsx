import React from 'react';
import {Composition} from 'remotion';
import {WawasanFilm} from './WawasanFilm';
export const WawasanRoot: React.FC = () => (<>
  <Composition id="WawasanAPK" component={WawasanFilm} defaultProps={{wide:false}} durationInFrames={900} fps={30} width={1080} height={1920}/>
  <Composition id="WawasanWebapp" component={WawasanFilm} defaultProps={{wide:true}} durationInFrames={900} fps={30} width={1920} height={1080}/>
</>);
