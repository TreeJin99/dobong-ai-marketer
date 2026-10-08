import {Composition} from 'remotion';
import {Shorts} from './Shorts';
import data from './data.json';

export const Root = () => (
  <Composition
    id="Shorts"
    component={Shorts}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={data.cards.length * data.secondsPerCard * 30}
    defaultProps={{data}}
  />
);
