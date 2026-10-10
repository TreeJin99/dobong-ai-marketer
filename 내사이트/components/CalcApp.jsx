"use client";
// 계산기형 화면을 움직이는 부분입니다. 내용과 계산식은 data/app-data.js 의 calc 에서 고칩니다.
import { useRef, useState } from "react";
import { appData } from "@/data/app-data";

const D = appData.calc;
const num = (s) => Number(String(s).replace(/[^0-9.]/g, "")) || 0;

export default function CalcApp() {
  const [values, setValues] = useState(() => Object.fromEntries(D.fields.map((f) => [f.id, ""])));
  const [res, setRes] = useState({ big: "-", sub: "숫자를 넣고 버튼을 누르면 여기에 답이 나옵니다." });
  const box = useRef(null);

  function run(v) {
    const n = Object.fromEntries(D.fields.map((f) => [f.id, num(v[f.id])]));
    setRes(D.calculate(n));
    const top = box.current.getBoundingClientRect().top;
    if (top > window.innerHeight - 120) window.scrollBy({ top: top - 120, behavior: "smooth" });
  }

  return (
    <div className="calc">
      <form noValidate onSubmit={(e) => { e.preventDefault(); run(values); }}>
        {D.fields.map((f) => (
          <label key={f.id} className="field">
            <span>{f.label}</span>
            <div className="input">
              <input inputMode="decimal" autoComplete="off" placeholder={f.placeholder}
                value={values[f.id]} onChange={(e) => setValues({ ...values, [f.id]: e.target.value })} />
              <em>{f.unit}</em>
            </div>
          </label>
        ))}
        <button className="btn full" type="submit">{D.button || "계산하기"}</button>
      </form>
      <section className="result" ref={box} aria-live="polite">
        <div className="label">{D.resultLabel || "결과"}</div>
        <div className="big">{res.big}</div>
        <p className="sub">{res.sub}</p>
      </section>
      {D.examples?.length ? (
        <div className="examples">
          <h2>예시로 눌러 보기</h2>
          {D.examples.map((x, i) => (
            <button key={i} type="button" onClick={() => { setValues(x); run(x); }}>
              <span>{D.fields.map((f) => Number(x[f.id]).toLocaleString("ko-KR") + (f.unit || "")).join(" · ")}</span>
              <span className="sample">예시 {i + 1}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
