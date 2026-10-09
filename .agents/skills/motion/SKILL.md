---
name: motion
description: $storyboard 로 저장한 작업파일/storyboard.json 으로 글자·도형·숫자가 움직이는 1080x1920 세로 20초 모션그래픽 영상(MP4)을 Remotion 틀로 만들고, 유튜브 쇼츠 설명란에 붙일 설명란.txt(제목·설명·추적 링크)를 저장한다. 사진·AI 영상은 쓰지 않는다. 「2장면 글자 더 크게」「더 빠르게」「색 바꿔」 같은 고치기 요청도 처리한다. "모션 영상 만들어줘", "모션그래픽", "20초 영상", "$motion" 요청에 사용.
metadata:
  short-description: 20초 세로 모션그래픽 영상 + 설명란
---

# 모션그래픽 20초 (motion)

스토리보드 다섯 장면을 글자 · 도형 · 숫자가 움직이는 20초 세로 영상으로 바꾸는 일입니다. 움직임은 틀 안에 미리 만들어 두었습니다. 이 기술은 틀에 내용(data.json)만 넣고 영상으로 찍습니다.

## 준비
1. `작업파일/storyboard.json` 을 찾습니다. 없으면 멈추고 "먼저 $storyboard 로 스토리보드를 만들어 주세요"라고만 말합니다.
2. AGENTS.md 「브랜드 규칙」에서 「내 사이트 주소」와 「좋아하는 색」을 읽습니다. 주소가 비어 있거나 괄호 안내문 그대로면 `(내 사이트 주소)` 로 두고 끝날 때 알려 줍니다.

## 만들기 (Remotion, 영상을 코드로 만드는 무료 도구)
1. `.agents/skills/motion/assets/remotion/` 폴더를 통째로 `작업파일/모션_YYYYMMDD/` 로 복사합니다. 이미 있으면 5번으로 갑니다.
2. storyboard.json 에서 color · secondsPerScene · speed · scenes 를 `작업파일/모션_YYYYMMDD/src/data.json` 에 그대로 옮깁니다. 모양은 그 파일과 똑같이 둡니다.
3. 다른 파일(Motion.jsx · Root.jsx · public 글꼴)은 고치지 않습니다. 움직임을 새로 짜지 않습니다.
4. `작업파일/모션_YYYYMMDD/` 에서 `npm install` 을 실행합니다. 처음에는 몇 분 걸립니다.
5. 같은 곳에서 아래를 실행합니다.
   `npx remotion render src/index.jsx Motion ../../모션_YYYYMMDD/영상.mp4`
   처음 한 번은 영상용 브라우저(약 190MB)를 받느라 더 걸립니다.
   4~5번은 인터넷이 필요합니다. 보안 상자(샌드박스) 때문에 실패하면 사용자에게 허락을 받아 같은 명령을 샌드박스 밖에서 다시 실행합니다.
6. Remotion Studio(미리보기 화면)나 브라우저 창은 열지 않습니다. 영상 파일로만 저장합니다.

## 확인 (꼭 합니다)
장면마다 한 장씩, 다섯 장을 찍어 직접 열어 봅니다. 장면 길이가 4초면 프레임 번호는 90 · 210 · 330 · 450 · 570 입니다 (장면 길이가 바뀌면 각 장면 끝나기 1초 전).
`npx remotion still src/index.jsx Motion 확인/장면1.png --frame=90`
- 글자가 네모로 깨졌는지, 화면 밖으로 잘렸는지, 자막이 두 줄을 넘는지 봅니다.
- 문제가 있으면 그 장면의 글을 줄이거나 bigSize 를 20 줄여 data.json 을 고치고 5번부터 다시 합니다.
- 영상 길이 · 크기는 `npx remotion ffprobe -v error -show_entries format=duration:stream=width,height -of compact ../../모션_YYYYMMDD/영상.mp4` 로 봅니다 (20초 · 1080x1920 이면 맞습니다).

## 고치기 요청
data.json 만 고치고 5번(렌더)과 확인만 다시 합니다. npm install 은 다시 하지 않습니다.

| 이렇게 말하면 | data.json 에서 바꿀 것 |
|---|---|
| 「N장면 글자 더 크게 / 작게」 | 그 장면의 bigSize 를 30 올리거나 내림 (60~200 사이) |
| 「3장면 숫자 더 크게」 | 그 장면의 bigSize 를 30 올림 (숫자는 bigSize 에 맞춰 커집니다) |
| 「더 빠르게 / 느리게」 | speed 를 1.5 / 0.7 로 (움직임 빠르기. 영상 길이는 20초 그대로) |
| 「영상을 더 짧게」 | secondsPerScene 을 3 으로 (모두 15초) |
| 「색 바꿔」 | color 를 새 색 코드로. 색 이름만 말하면 흰 글자가 잘 읽히는 진한 색을 고르고 알려 줍니다 |
| 「N장면 글자 바꿔」 | 그 장면의 big · small · subtitle. storyboard.json 도 같이 고칩니다 |
| 「N장면 움직임 바꿔」 | motion 을 다섯 가지(나타나기 · 밀려들기 · 커지기 · 숫자 올라가기 · 밑줄 긋기) 중 하나로 |

다섯 가지 밖의 움직임, 사진, 음악을 넣어 달라고 하면 "이 틀에서는 다섯 가지 움직임만 됩니다"라고 알리고 고치지 않습니다. 음악은 references/music.md 를 읽고 안내만 합니다.

## 설명란.txt
`모션_YYYYMMDD/설명란.txt` 에 아래 순서로 씁니다. 스토리보드에 있는 내용만 씁니다.
1. 제목: 1장면 큰 글자 기반, 검색어 포함 40자 이내
2. 설명: 2~3줄. 근거 숫자를 쓰면 「기관, 연도」를 붙입니다
3. 링크: AGENTS.md [6] 규칙표의 유튜브 줄을 따릅니다. 사이트 주소 뒤에 `?utm_source=youtube&utm_medium=shorts&utm_campaign=MMDD_motion` (MMDD 는 오늘 월일 네 자리, 주소에 이미 `?` 가 있으면 `&` 로 잇기)
4. 해시태그: `#Shorts` 와 주제 해시태그 3개

## 막히면
설치나 렌더가 오류로 멈추거나 10분 넘게 끝나지 않으면 중단하고, 무엇이 막혔는지 한 줄로 알린 뒤 references/fallback.md 를 읽고 따릅니다. ffmpeg 를 새로 설치하지 않습니다.

## 저장
- 이 폴더의 `모션_YYYYMMDD/` : `영상.mp4` 와 `설명란.txt`
- `작업파일/모션_YYYYMMDD/` : Remotion 프로젝트와 `확인/장면1~5.png` (다음에 고칠 때 다시 씁니다)

끝나면 한 줄로 말합니다. 예: "모션_20261019 폴더에 20초 영상과 설명란.txt 를 저장했습니다. 고칠 곳이 있으면 「2장면 글자 더 크게」처럼 말해 주세요."
