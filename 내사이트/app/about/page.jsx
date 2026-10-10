// 서비스 소개 랜딩페이지. 위에서 아래로 여섯 칸.
// 글은 data/site.js 의 about 에서 고칩니다. 10/20 광고 도착 페이지로 그대로 씁니다.
import Link from "next/link";
import { site } from "@/data/site";

const A = site.about;

export const metadata = {
  title: `${site.name} 소개 · ${site.promise}`,
  description: site.description,
  openGraph: { title: `${site.name} · ${site.promise}`, description: site.description },
};

export default function About() {
  return (
    <main>
      {/* 1 첫 화면 */}
      <section className="hero">
        <div className="wrap">
          <div>
            <div className="name">{site.name}</div>
            <h1>{site.promise}</h1>
            <p>{A.who}</p>
            <div className="btns"><Link className="btn" href="/">지금 써 보기</Link></div>
          </div>
          <div className="hero-shot" aria-hidden="true">
            <iframe src="/" title="서비스 화면 미리보기" tabIndex={-1} loading="lazy" />
          </div>
        </div>
      </section>

      {/* 2 이런 불편 있으셨죠 */}
      <section className="band">
        <div className="wrap">
          <h2>이런 불편 있으셨죠</h2>
          <ul className="pains">
            {A.pains.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </section>

      {/* 3 이렇게 해결 */}
      <section className="band tint">
        <div className="wrap">
          <h2>{site.name}은 이렇게 풀어요</h2>
          <ul className="features">
            {A.features.map((f) => <li key={f.title}><h3>{f.title}</h3><p>{f.text}</p></li>)}
          </ul>
        </div>
      </section>

      {/* 4 이렇게 써요 */}
      <section className="band">
        <div className="wrap">
          <h2>이렇게 써요</h2>
          <ol className="steps">
            {A.steps.map((s) => <li key={s.title}><div><strong>{s.title}</strong><span>{s.text}</span></div></li>)}
          </ol>
        </div>
      </section>

      {/* 5 만든 사람 */}
      <section className="band tint">
        <div className="wrap">
          <div className="maker">
            <div className="photo">사진 자리</div>
            <div><strong>만든 사람 {site.maker}</strong><p>{A.makerWhy}</p></div>
          </div>
        </div>
      </section>

      {/* 6 마지막 버튼 */}
      <section className="band brand">
        <div className="wrap">
          <h2>{A.ctaTitle}</h2>
          {A.ctaText ? <p>{A.ctaText}</p> : null}
          <div className="btns">
            <Link className="btn on-brand" href="/">지금 써 보기</Link>
            <a className="btn on-brand line" href={A.contactHref || "#"}>{A.contactLabel}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
