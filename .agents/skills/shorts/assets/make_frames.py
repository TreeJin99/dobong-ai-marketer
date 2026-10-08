#!/usr/bin/env python3
"""Remotion 이 안 될 때: 카드 5장 + 자막으로 세로 그림(1080x1920) 5장 만들기.

사용법:
    python make_frames.py <cards.json> <카드 PNG 폴더> <저장할 폴더>

만든 그림은 CapCut 에 올리거나, ffmpeg 가 있으면 15초 영상으로 합친다.
브라우저 찾기와 글꼴은 cardnews 기술의 make_cards.py 를 그대로 빌려 쓴다.
"""
import base64
import html
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent.parent / "cardnews" / "assets"))
import make_cards as mc  # noqa: E402

PAGE = """<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
{fonts}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1920px;overflow:hidden;background:#f4f6f5;font-family:'Pretendard',sans-serif}}
.sub{{position:absolute;top:150px;left:72px;right:72px;height:250px;display:flex;align-items:center;
justify-content:center;text-align:center;font-weight:700;font-size:64px;line-height:1.3;color:{color};word-break:keep-all}}
img{{position:absolute;top:430px;left:54px;width:972px;height:1215px;border-radius:24px}}
</style></head><body><div class="sub">{text}</div><img src="data:image/png;base64,{img}"></body></html>"""


def main():
    if len(sys.argv) != 4:
        raise SystemExit("사용법: python make_frames.py <cards.json> <카드 PNG 폴더> <저장할 폴더>")
    data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    cards = sorted(Path(sys.argv[2]).glob("0[1-5]_*.png"))
    if len(cards) != 5:
        raise SystemExit(f"카드 PNG 5장이 필요합니다. 찾은 수: {len(cards)}")
    out = Path(sys.argv[3]).resolve()
    out.mkdir(parents=True, exist_ok=True)
    work = Path(sys.argv[1]).resolve().parent / "html_shorts"
    work.mkdir(exist_ok=True)
    faces = mc.font_faces()
    pages = []
    for i, card in enumerate(cards):
        src = work / f"frame{i + 1}.html"
        src.write_text(PAGE.format(
            fonts=faces, color=data.get("color", "#296258"),
            text=html.escape(data["subtitles"][i]),
            img=base64.b64encode(card.read_bytes()).decode()), encoding="utf-8")
        pages.append((src, out / f"frame{i + 1}.png"))
    mc.W, mc.H = 1080, 1920
    try:
        mc.shoot_playwright(pages)
    except Exception as e:
        print("playwright 로 못 찍어서 명령줄 방식으로 바꿉니다:", str(e).splitlines()[0][:120])
        mc.shoot_cli(pages)
    for _, p in pages:
        print("저장:", p)


if __name__ == "__main__":
    main()
