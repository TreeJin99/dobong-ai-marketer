"use client";
// 테스트형 화면을 움직이는 부분입니다. 질문은 data/app-data.js 의 quiz 에서 고칩니다.
import { useState } from "react";
import { appData } from "@/data/app-data";

const D = appData.quiz;

export default function QuizApp() {
  const [i, setI] = useState(0);
  const [score, setScore] = useState({});
  const total = D.questions.length;

  if (i >= total) {
    const best = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
    const R = D.results[best] || { title: "결과", desc: "" };
    return (
      <section className="quiz" aria-live="polite">
        <div className="quiz-result">
          <div className="step">나의 결과</div>
          <div className="big">{R.title}</div>
          <p>{R.desc}</p>
          <button className="btn line" type="button" onClick={() => { setI(0); setScore({}); }}>처음부터 다시</button>
        </div>
      </section>
    );
  }

  const Q = D.questions[i];
  return (
    <section className="quiz" aria-live="polite">
      <div className="step">{i + 1} / {total}</div>
      <div className="progress"><i style={{ width: `${(i / total) * 100}%` }} /></div>
      <h2>{Q.q}</h2>
      <div className="options">
        {Q.options.map((o) => (
          <button key={o.text} type="button" onClick={() => { setScore({ ...score, [o.type]: (score[o.type] || 0) + 1 }); setI(i + 1); }}>{o.text}</button>
        ))}
      </div>
    </section>
  );
}
