#!/usr/bin/env python3
"""카드뉴스 PNG 만들기.

사용법:
    python make_cards.py <cards.json> <저장할 폴더>

cards.json 의 글을 HTML 틀(1080x1350)에 넣고, 화면 없는 브라우저로 PNG 를 찍는다.
브라우저 순서: 파이썬 playwright 기본 크로미움 -> 설치된 Chrome -> 설치된 Edge
-> Chrome/Edge 명령줄 스크린샷. 브라우저 창은 띄우지 않는다.
"""
import base64
import html
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

W, H = 1080, 1350
HERE = Path(__file__).resolve().parent
FONTS = HERE / "fonts"
TEMPLATE = HERE / "card_template.html"
NAMES = {"cover": "표지", "problem": "문제", "evidence": "근거", "solution": "해결", "action": "행동"}


def font_faces():
    out = []
    for weight, name in ((500, "Medium"), (700, "Bold"), (800, "ExtraBold")):
        data = base64.b64encode((FONTS / f"Pretendard-{name}.woff2").read_bytes()).decode()
        out.append(
            "@font-face{font-family:'Pretendard';font-weight:%d;"
            "src:url(data:font/woff2;base64,%s) format('woff2');}" % (weight, data)
        )
    return "\n".join(out)


def esc(s):
    return html.escape(str(s or "")).replace("\n", "<br>")


def card_body(c):
    t = c.get("type")
    label = f'<p class="label">{esc(c.get("label"))}</p>' if c.get("label") else ""
    if t == "cover":
        return (f'{label}<h1 class="fit big">{esc(c.get("title"))}</h1>'
                f'<p class="sub fit">{esc(c.get("sub"))}</p>')
    if t == "problem":
        quote = f'<p class="quote fit">{esc(c.get("quote"))}</p>' if c.get("quote") else ""
        return (f'{label}<h2 class="fit">{esc(c.get("title"))}</h2>{quote}'
                f'<p class="body fit">{esc(c.get("body"))}</p>')
    if t == "evidence":
        return (f'{label}<p class="num"><span>{esc(c.get("number"))}</span>'
                f'<small>{esc(c.get("unit"))}</small></p>'
                f'<h2 class="fit">{esc(c.get("title"))}</h2>'
                f'<p class="source">출처: {esc(c.get("source"))}</p>')
    if t == "solution":
        items = "".join(f"<li>{esc(p)}</li>" for p in c.get("points", [])[:3])
        return f'{label}<h2 class="fit">{esc(c.get("title"))}</h2><ul class="fit">{items}</ul>'
    if t == "action":
        return (f'{label}<h2 class="fit">{esc(c.get("title"))}</h2>'
                f'<p class="url">{esc(c.get("url"))}</p>'
                f'<p class="btn">{esc(c.get("button") or "자세히 보기")}</p>')
    raise SystemExit(f"알 수 없는 카드 종류: {t}")


def build_html(data, i, total, faces, tpl):
    c = data["cards"][i]
    bg = ""
    if c.get("type") == "cover" and data.get("background_image"):
        p = Path(data["background_image"])
        if p.exists():
            mime = "image/png" if p.suffix.lower() == ".png" else "image/jpeg"
            bg = "data:%s;base64,%s" % (mime, base64.b64encode(p.read_bytes()).decode())
    return (tpl.replace("{{FONTS}}", faces)
               .replace("{{COLOR}}", data.get("color", "#296258"))
               .replace("{{TYPE}}", c["type"])
               .replace("{{BG}}", f"url({bg})" if bg else "none")
               .replace("{{HASBG}}", "has-bg" if bg else "")
               .replace("{{BODY}}", card_body(c))
               .replace("{{BRAND}}", esc(data.get("brand")))
               .replace("{{PAGE}}", f"{i + 1} / {total}"))


def find_browser():
    cands = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    for c in cands:
        if os.path.exists(c):
            return c
    for n in ("google-chrome", "chromium", "chrome", "msedge"):
        if shutil.which(n):
            return shutil.which(n)
    return None


def shoot_playwright(pages):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser, last = None, None
        for opt in ({}, {"channel": "chrome"}, {"channel": "msedge"}):
            try:
                browser = p.chromium.launch(headless=True, **opt)
                print("브라우저:", opt.get("channel", "playwright 기본"))
                break
            except Exception as e:  # 다음 후보로
                last = e
        if browser is None:
            raise RuntimeError(last)
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        for src, out in pages:
            page.goto(src.as_uri())
            page.evaluate("document.fonts.ready.then(() => window.fitAll && window.fitAll())")
            page.wait_for_timeout(300)
            page.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": W, "height": H})
        browser.close()


def shoot_cli(pages):
    exe = find_browser()
    if not exe:
        raise RuntimeError("Chrome 이나 Edge 를 찾지 못했습니다")
    print("브라우저(명령줄):", exe)
    for src, out in pages:
        subprocess.run([exe, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--force-device-scale-factor=1", f"--window-size={W},{H}",
                        "--virtual-time-budget=4000", f"--screenshot={out}", src.as_uri()],
                       check=True, capture_output=True, timeout=120)


def main():
    if len(sys.argv) != 3:
        raise SystemExit("사용법: python make_cards.py <cards.json> <저장할 폴더>")
    data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    out_dir = Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    html_dir = Path(sys.argv[1]).resolve().parent / "html"
    html_dir.mkdir(exist_ok=True)
    faces, tpl = font_faces(), TEMPLATE.read_text(encoding="utf-8")
    total = len(data["cards"])
    pages = []
    for i, c in enumerate(data["cards"]):
        src = html_dir / f"card{i + 1}.html"
        src.write_text(build_html(data, i, total, faces, tpl), encoding="utf-8")
        pages.append((src, (out_dir / f"{i + 1:02d}_{NAMES.get(c['type'], c['type'])}.png").resolve()))
    try:
        shoot_playwright(pages)
    except Exception as e:
        print("playwright 로 못 찍어서 명령줄 방식으로 바꿉니다:", str(e).splitlines()[0][:120])
        try:
            shoot_cli(pages)
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e2:
            raise SystemExit(
                "브라우저가 켜지다가 멈췄습니다 (" + type(e2).__name__ + "). 코덱스의 보안 상자(샌드박스) 안이라서 "
                "그럴 수 있습니다. 사용자에게 허락을 받아 같은 명령을 샌드박스 밖에서 다시 실행하세요.")
    for _, out in pages:
        print("저장:", out)


if __name__ == "__main__":
    main()
