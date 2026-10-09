import {Composition} from 'remotion';
import {Motion} from './Motion';
import data from './data.json';

export const Root = () => (
  <Composition
    id="Motion"
    component={Motion}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={data.scenes.length * data.secondsPerScene * 30}
    defaultProps={{data}}
  />
);
