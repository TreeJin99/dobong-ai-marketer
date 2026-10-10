"use client";
// 기록형 화면을 움직이는 부분입니다. 기록은 이 브라우저 안(localStorage)에만 저장됩니다.
import { useEffect, useState } from "react";
import { appData } from "@/data/app-data";

const D = appData.log;
const KEY = D?.storageKey || "my-service-log";

export default function LogApp() {
  const [list, setList] = useState(() => D.samples.map((t) => ({ text: t, done: false, sample: true })));
  const [text, setText] = useState("");

  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem(KEY)); if (saved) setList(saved); } catch {}
  }, []);

  function save(next) {
    setList(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  }

  const done = list.filter((it) => it.done).length;
  return (
    <section className="log">
      <form className="add" onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        save([...list.filter((it) => !it.sample), { text: text.trim(), done: false }]);
        setText("");
      }}>
        <input placeholder={D.placeholder} aria-label="새로 적기" autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn" type="submit">적기</button>
      </form>
      <div className="count">{list.length ? `${list.length}개 중 ${done}개 했어요` : "아직 적은 것이 없어요."}</div>
      <ul className="checks">
        {list.map((it, i) => (
          <li key={i} className={it.done ? "done" : ""}>
            <input type="checkbox" id={`c${i}`} checked={it.done}
              onChange={(e) => save(list.map((x, j) => (j === i ? { ...x, done: e.target.checked } : x)))} />
            <label htmlFor={`c${i}`}>{it.text}{it.sample ? <> <span className="sample">예시</span></> : null}</label>
            <button className="del" type="button" onClick={() => save(list.filter((_, j) => j !== i))}>지우기</button>
          </li>
        ))}
      </ul>
      <p className="sample-note" style={{ marginTop: 16 }}>적은 내용은 이 휴대폰(이 브라우저) 안에만 남습니다.</p>
    </section>
  );
}
