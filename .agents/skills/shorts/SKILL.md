---
name: shorts
description: $cardnews 로 만든 카드 PNG 5장과 자막으로 1080x1920 세로 15초 영상(MP4)을 만들고, 유튜브 설명란에 붙일 설명란.txt(제목·설명·추적 링크)를 저장한다. 1순위 Remotion, 막히면 ffmpeg, 그것도 없으면 CapCut 수동 안내. "쇼츠 만들어줘", "릴스 영상", "15초 영상", "$shorts" 요청에 사용.
metadata:
  short-description: 15초 세로 영상 + 설명란
---

# 쇼츠 15초 (shorts)

카드뉴스 5장을 한 장에 3초씩 넘기는 15초 세로 영상으로 바꾸는 일입니다. 위쪽에 자막 한 줄, 가운데에 카드가 나옵니다. 유튜브 쇼츠 · 인스타 릴스에 그대로 올릴 수 있습니다.

## 준비
1. 이 폴더에서 가장 최근의 `카드뉴스_YYYYMMDD/` (PNG 5장)와 `작업파일/카드뉴스_YYYYMMDD/cards.json` 을 찾습니다. 없으면 멈추고 "먼저 $cardnews 로 카드뉴스를 만들어 주세요"라고만 말합니다.
2. 자막은 cards.json 의 `subtitles` 5줄을 씁니다. 20자를 넘는 줄은 뜻을 바꾸지 않고 줄입니다.
3. AGENTS.md 「브랜드 규칙」에서 「내 사이트 주소」와 「좋아하는 색」을 읽습니다. 주소가 비어 있으면 묻습니다.

## 1순위: Remotion (영상을 코드로 만드는 도구)
Remotion 회사가 만든 공식 기술이 있습니다. 이 폴더에 `.agents/skills/remotion-best-practices` 가 없으면 사용자에게 아래 명령을 알려 주고, 허락을 받은 뒤 실행합니다. 설치가 안 돼도 아래 단계는 진행할 수 있습니다.
`npx skills add remotion-dev/skills -a codex -s remotion-best-practices -y`

이 기술은 공식 기술 위에 얹은 얇은 덮개입니다. 영상 틀은 우리 것을 쓰고, 움직임을 바꿔 달라는 요청이 있을 때만 공식 기술의 규칙을 읽고 따릅니다.

1. `.agents/skills/shorts/assets/remotion/` 폴더를 통째로 `작업파일/쇼츠_YYYYMMDD/` 로 복사합니다.
2. 카드 PNG 5장을 순서대로 그 안 `public/card1.png` ~ `public/card5.png` 로 복사하고, `.agents/skills/cardnews/assets/fonts/Pretendard-Bold.woff2` 도 `public/` 에 복사합니다.
3. `src/data.json` 의 color(좋아하는 색 코드)와 subtitles(자막 5줄)만 바꿉니다. 다른 파일은 고치지 않습니다.
4. `작업파일/쇼츠_YYYYMMDD/` 에서 `npm install` 을 실행합니다. 처음에는 몇 분 걸립니다.
5. 같은 곳에서 `npx remotion render src/index.jsx Shorts ../../쇼츠_YYYYMMDD/쇼츠.mp4` 를 실행합니다.
   4~5번은 인터넷과 브라우저가 필요합니다. 보안 상자(샌드박스) 때문에 실패하면 사용자에게 허락을 받아 같은 명령을 샌드박스 밖에서 다시 실행합니다.
6. Remotion Studio(미리보기 화면)는 열지 않습니다. 브라우저 창을 띄우지 않고 바로 영상 파일로 저장합니다.
7. 확인: `npx remotion still src/index.jsx Shorts 확인.png --frame=100` 으로 한 장면을 찍어 열어 봅니다. 자막이 잘리거나 네모로 깨졌으면 그 자막을 줄이고 5번부터 다시 합니다.

설치나 렌더가 오류로 멈추거나 10분 넘게 끝나지 않으면 중단하고, 무엇이 막혔는지 한 줄로 알린 뒤 2순위로 갑니다.

## 2순위 · 3순위: ffmpeg 또는 CapCut
references/fallback.md 를 읽고 그대로 따릅니다. 세로 그림 5장을 만든 뒤, ffmpeg 가 있으면 영상으로 합치고, 없으면 사용자가 CapCut 에 직접 올리도록 순서를 알려 줍니다.

## 설명란.txt
`쇼츠_YYYYMMDD/설명란.txt` 에 아래 순서로 씁니다.
1. 제목: 카드 1장 표지 문장 기반, 검색어 포함 40자 이내
2. 설명: 2~3줄. 카드에 있는 내용만 씁니다. 근거 숫자를 쓰면 「기관, 연도」를 붙입니다
3. 링크: 사이트 주소 뒤에 `?utm_source=youtube&utm_medium=shorts` (주소에 이미 `?` 가 있으면 `&` 로 잇기)
4. 해시태그: `#Shorts` 와 주제 해시태그 3개

## 저장
- 이 폴더의 `쇼츠_YYYYMMDD/` : `쇼츠.mp4` (3순위면 `세로그림/frame1.png` ~ `frame5.png`) 와 `설명란.txt`
- `작업파일/쇼츠_YYYYMMDD/` : Remotion 프로젝트 (다음에 다시 쓸 수 있습니다)

끝나면 한 줄로 말합니다. 예: "쇼츠_20261020 폴더에 15초 영상과 설명란.txt 를 저장했습니다. 만든 방법: Remotion."
