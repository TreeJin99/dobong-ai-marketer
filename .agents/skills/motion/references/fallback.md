# Remotion 영상이 안 될 때 (2순위 · 3순위)

## 언제 이 길로 오나
- `npm install` 이 실패하거나 10분 넘게 끝나지 않을 때
- `npx remotion render` 가 오류로 멈추거나 10분 넘게 끝나지 않을 때
- 사용자가 「CapCut 으로 할게요」라고 할 때

## 2순위: 움직임 없이 장면 그림 5장으로 영상 만들기
npm install 은 됐고 영상 렌더만 막혔을 때 씁니다. `작업파일/모션_YYYYMMDD` 폴더에서:
1. 장면 그림 5장을 찍습니다 (장면 길이 4초 기준).
   `npx remotion still src/index.jsx Motion ../../모션_YYYYMMDD/장면그림/frame1.png --frame=90`
   frame2 는 210, frame3 은 330, frame4 는 450, frame5 는 570.
2. Remotion 에 들어 있는 ffmpeg 로 한 장에 4초씩 붙입니다.
   `npx remotion ffmpeg -y -framerate 1/4 -i ../../모션_YYYYMMDD/장면그림/frame%d.png -r 30 -pix_fmt yuv420p -c:v libx264 -t 20 ../../모션_YYYYMMDD/영상.mp4`
3. 사용자에게 "움직임 없이 장면 그림으로 만들었습니다"라고 알립니다.
이것도 안 되면 3순위로 갑니다.

## 3순위: CapCut 에서 직접 (사용자가 직접)
작업파일/스토리보드_YYYYMMDD.md 의 표를 다시 보여 주고, 아래 순서를 그대로 알려 줍니다.
1. CapCut(PC 또는 휴대폰)에서 「새 프로젝트」, 비율 9:16
2. 배경을 좋아하는 색 단색으로 넣고 길이를 20초로
3. 「텍스트」로 장면마다 큰 글자를 하나씩 넣고 한 장면을 4초로 맞추기
4. 텍스트마다 「애니메이션」의 「인」에서 하나 고르기 (페이드 인 · 슬라이드 · 확대 등)
5. 「내보내기」로 저장한 뒤, 설명란.txt 내용을 유튜브 설명란에 붙여넣기
