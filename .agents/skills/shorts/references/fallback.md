# Remotion 이 안 될 때 (2순위 · 3순위)

## 언제 이 길로 오나
- `npm install` 이 실패하거나 10분 넘게 끝나지 않을 때
- `npx remotion render` 가 오류로 멈추거나 10분 넘게 끝나지 않을 때
- 사용자가 「CapCut 으로 할게요」라고 할 때

## 1단계: 세로 그림 5장 만들기
`python .agents/skills/shorts/assets/make_frames.py 작업파일/카드뉴스_YYYYMMDD/cards.json 카드뉴스_YYYYMMDD 쇼츠_YYYYMMDD/세로그림`
(`python` 이 안 되면 `python3`). 자막이 이미 그림 위쪽에 들어가 있습니다.

## 2순위: ffmpeg 가 있을 때 (`ffmpeg -version` 으로 확인)
쇼츠_YYYYMMDD 폴더에서 아래를 실행하면 한 장에 3초, 모두 15초짜리 영상이 됩니다.
`ffmpeg -y -framerate 1/3 -i 세로그림/frame%d.png -r 30 -pix_fmt yuv420p -c:v libx264 -t 15 쇼츠.mp4`

ffmpeg 가 없어도 Remotion 설치(npm install)까지는 됐다면, Remotion 에 들어 있는 ffmpeg 를 씁니다. `작업파일/쇼츠_YYYYMMDD` 폴더에서 `npx remotion ffmpeg` 뒤에 위 명령의 `-y` 부터를 그대로 붙이고, 그림과 영상 경로는 `../../쇼츠_YYYYMMDD/...` 로 바꿉니다. 둘 다 안 되면 ffmpeg 를 새로 설치하지 말고 3순위로 갑니다.

## 3순위: CapCut 에 올리기 (사용자가 직접)
사용자에게 아래 순서를 그대로 알려 줍니다.
1. CapCut(PC 또는 휴대폰)을 열고 「새 프로젝트」
2. 쇼츠_YYYYMMDD/세로그림 폴더의 frame1.png ~ frame5.png 를 순서대로 넣기
3. 비율을 9:16 으로, 사진 한 장 길이를 3초로 맞추기 (모두 15초)
4. 원하면 「오디오」의 「음악」에서 저작권 걱정 없는 음악 하나 넣기
5. 「내보내기」로 저장한 뒤, 설명란.txt 내용을 유튜브 설명란에 붙여넣기
