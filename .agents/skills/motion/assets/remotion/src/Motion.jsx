// 세로 20초 모션그래픽: 다섯 장면, 장면마다 4초. 글자·도형·숫자만 움직인다 (사진 없음).
// 움직임은 다섯 가지뿐: 나타나기 · 밀려들기 · 커지기 · 숫자 올라가기 · 밑줄 긋기.
// 유튜브 쇼츠 화면의 위(약 200px) · 아래(약 420px) · 오른쪽 버튼 자리는 글자를 피한다.
// 이 파일은 고치지 않는다. 바꿀 것은 data.json 에만 있다.
import {AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/fonts';

loadFont({family: 'Pretendard', url: staticFile('Pretendard-Bold.woff2'), weight: '700'});
loadFont({family: 'Pretendard', url: staticFile('Pretendard-ExtraBold.woff2'), weight: '800'});

const INK = '#222222';
const GRAY = '#5b5b5b';
const WIDTH = 880;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

// 한 줄에 들어갈 글자 크기: 줄이 길면 작게 (한글 한 글자 ≈ 글자 크기 1배)
const fitSize = (lines, want) => {
  const longest = Math.max(...lines.map((l) => l.length), 1);
  return Math.min(want, Math.floor(WIDTH / longest));
};

// "62배 늘었어요" → {pre: '', num: '62', unit: '배', post: '늘었어요'}
const splitNumber = (text) => {
  const m = text.match(/^(.*?)(\d[\d,]*(?:\.\d+)?)(\S*)\s*([\s\S]*)$/);
  if (!m) return null;
  return {pre: m[1].trim(), num: m[2], unit: m[3], post: m[4].trim()};
};

const formatLike = (value, sample) => {
  const decimals = (sample.split('.')[1] || '').length;
  const fixed = value.toFixed(decimals);
  if (!sample.includes(',')) return fixed;
  const [a, b] = fixed.split('.');
  return a.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (b ? '.' + b : '');
};

const BigText = ({text, size, color, style}) => (
  <div style={{fontWeight: 800, fontSize: size, lineHeight: 1.22, color, whiteSpace: 'pre-line',
    wordBreak: 'keep-all', letterSpacing: -2, ...style}}>
    {text}
  </div>
);

const Scene = ({scene, color, dur, speed, dark}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (n) => n / speed;
  const fg = dark ? '#ffffff' : INK;
  const sub = dark ? 'rgba(255,255,255,0.85)' : GRAY;
  const accent = dark ? '#ffffff' : color;
  const lines = String(scene.big || '').split('\n');
  const size = fitSize(lines, scene.bigSize || 120);
  const out = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  const pop = spring({frame: f, fps, durationInFrames: t(24), config: {damping: 14}});

  // 배경 도형: 큰 원 하나가 천천히 커지고, 작은 원이 비스듬히 떠오른다
  const ring = interpolate(f, [0, dur], [0.85, 1.05]);
  const drift = interpolate(f, [0, dur], [60, -40]);
  const shapes = (
    <>
      <div style={{position: 'absolute', width: 980, height: 980, borderRadius: '50%', right: -420, top: 120,
        background: dark ? 'rgba(255,255,255,0.08)' : color, opacity: dark ? 1 : 0.08,
        transform: `scale(${ring})`}} />
      <div style={{position: 'absolute', width: 180, height: 180, borderRadius: '50%', left: 70, top: 1180 + drift,
        border: `14px solid ${accent}`, opacity: 0.25 * pop}} />
    </>
  );

  let body;
  if (scene.motion === '숫자 올라가기' && splitNumber(scene.big || '')) {
    const p = splitNumber(scene.big);
    const target = parseFloat(p.num.replace(/,/g, ''));
    const k = interpolate(f, [t(4), t(46)], [0, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});
    const numSize = Math.min(Math.floor(WIDTH / Math.max((p.num + p.unit).length * 0.62, 1)), Math.round((scene.bigSize || 120) * 2.2));
    body = (
      <>
        {p.pre ? <BigText text={p.pre} size={Math.round(size * 0.6)} color={fg} style={{opacity: pop}} /> : null}
        <div style={{fontWeight: 800, fontSize: numSize, lineHeight: 1.05, color: accent, letterSpacing: -4,
          transform: `scale(${0.9 + 0.1 * pop})`}}>
          {formatLike(target * k, p.num)}{p.unit}
        </div>
        {p.post ? <BigText text={p.post} size={size} color={fg}
          style={{opacity: interpolate(f, [t(30), t(42)], [0, 1], clamp)}} /> : null}
      </>
    );
  } else if (scene.motion === '밀려들기') {
    const x = interpolate(pop, [0, 1], [1100, 0]);
    const bar = interpolate(f, [0, t(14)], [0, 1], clamp);
    body = (
      <>
        <div style={{position: 'absolute', left: 0, top: 0, height: 22, width: `${bar * 100}%`, background: accent,
          transform: 'translateY(-60px)'}} />
        <BigText text={scene.big} size={size} color={fg} style={{transform: `translateX(${x}px)`}} />
      </>
    );
  } else if (scene.motion === '커지기') {
    const s = interpolate(pop, [0, 1], [0.35, 1]);
    body = <BigText text={scene.big} size={size} color={fg} style={{transform: `scale(${s})`, opacity: Math.min(1, pop * 1.5)}} />;
  } else if (scene.motion === '밑줄 긋기') {
    const show = interpolate(f, [0, t(10)], [0, 1], clamp);
    const line = interpolate(f, [t(12), t(34)], [0, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 2)});
    body = (
      <div style={{position: 'relative', display: 'inline-block', opacity: show}}>
        <div style={{position: 'absolute', left: -12, right: -12, bottom: size * 0.08, height: size * 0.32,
          background: accent, opacity: dark ? 0.3 : 0.22, transformOrigin: 'left center', transform: `scaleX(${line})`}} />
        <BigText text={scene.big} size={size} color={fg} style={{position: 'relative'}} />
      </div>
    );
  } else {
    // 나타나기: 줄마다 차례로 떠오른다
    body = lines.map((l, i) => {
      const a = interpolate(f, [t(2 + i * 8), t(16 + i * 8)], [0, 1], clamp);
      return <BigText key={i} text={l} size={size} color={fg}
        style={{opacity: a, transform: `translateY(${(1 - a) * 50}px)`}} />;
    });
  }

  const smallIn = interpolate(f, [t(20), t(32)], [0, 1], clamp);
  const subIn = interpolate(f, [2, 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: dark ? color : '#ffffff', fontFamily: 'Pretendard', overflow: 'hidden'}}>
      {shapes}
      <AbsoluteFill style={{opacity: out}}>
        <div style={{position: 'absolute', left: 90, width: WIDTH, top: 380, height: 860,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 36}}>
          <div style={{position: 'relative'}}>{body}</div>
          {scene.small ? (
            <div style={{fontWeight: 700, fontSize: 46, lineHeight: 1.4, color: sub, wordBreak: 'keep-all',
              opacity: smallIn, transform: `translateY(${(1 - smallIn) * 20}px)`}}>{scene.small}</div>
          ) : null}
        </div>
        {scene.subtitle ? (
          <div style={{position: 'absolute', left: 90, width: WIDTH, top: 1320, display: 'flex', justifyContent: 'center', opacity: subIn}}>
            <div style={{background: dark ? 'rgba(0,0,0,0.35)' : INK, color: '#ffffff', fontWeight: 700, fontSize: 48,
              lineHeight: 1.35, padding: '16px 32px', borderRadius: 16, textAlign: 'center', wordBreak: 'keep-all'}}>
              {scene.subtitle}
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 위쪽 진행 막대: 지금 몇 번째 장면인지 보여 준다
const Progress = ({count, dur, color}) => {
  const f = useCurrentFrame();
  const now = Math.floor(f / dur);
  const dark = now === 0 || now === count - 1;
  return (
    <div style={{position: 'absolute', top: 230, left: 90, width: WIDTH, display: 'flex', gap: 14}}>
      {Array.from({length: count}).map((_, i) => {
        const fill = i < now ? 1 : i > now ? 0 : (f % dur) / dur;
        return (
          <div key={i} style={{flex: 1, height: 10, borderRadius: 5, background: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'}}>
            <div style={{width: `${fill * 100}%`, height: '100%', borderRadius: 5, background: dark ? '#ffffff' : color}} />
          </div>
        );
      })}
    </div>
  );
};

export const Motion = ({data}) => {
  const dur = Math.round(data.secondsPerScene * 30);
  const speed = data.speed || 1;
  const n = data.scenes.length;
  return (
    <AbsoluteFill style={{backgroundColor: '#ffffff'}}>
      {data.scenes.map((scene, i) => (
        <Sequence key={i} from={i * dur} durationInFrames={dur}>
          <Scene scene={scene} color={data.color} dur={dur} speed={speed} dark={i === 0 || i === n - 1} />
        </Sequence>
      ))}
      <Progress count={n} dur={dur} color={data.color} />
    </AbsoluteFill>
  );
};
