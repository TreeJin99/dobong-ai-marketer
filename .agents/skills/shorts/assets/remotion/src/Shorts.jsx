// 세로 15초 쇼츠: 위에 자막, 가운데 카드. 카드마다 3초씩, 부드럽게 나타남.
// 유튜브 화면의 아래쪽 버튼 · 제목 자리(약 300px)는 비워 둔다.
import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';

loadFont({family: 'Pretendard', url: staticFile('Pretendard-Bold.woff2'), weight: '700'});

const Slide = ({src, text, color, dur}) => {
  const f = useCurrentFrame();
  const show = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const zoom = interpolate(f, [0, dur], [1, 1.03]);
  const rise = interpolate(f, [0, 10], [24, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 150, left: 72, right: 72, height: 250,
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        fontFamily: 'Pretendard', fontWeight: 700, fontSize: 64, lineHeight: 1.3,
        color, wordBreak: 'keep-all', opacity: show, transform: `translateY(${rise}px)`}}>
        {text}
      </div>
      <div style={{position: 'absolute', top: 430, left: 54, width: 972, height: 1215,
        overflow: 'hidden', borderRadius: 24, opacity: show}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', transform: `scale(${zoom})`}} />
      </div>
    </AbsoluteFill>
  );
};

export const Shorts = ({data}) => {
  const dur = data.secondsPerCard * 30;
  return (
    <AbsoluteFill style={{backgroundColor: data.background || '#f4f6f5'}}>
      {data.cards.map((src, i) => (
        <Sequence key={src} from={i * dur} durationInFrames={dur}>
          <Slide src={src} text={data.subtitles[i]} color={data.color} dur={dur} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
