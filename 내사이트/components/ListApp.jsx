"use client";
// 목록형 화면을 움직이는 부분입니다. 내용은 data/app-data.js 의 list 에서 고칩니다.
import { useState } from "react";
import { appData } from "@/data/app-data";

const D = appData.list;

export default function ListApp() {
  const tags = ["전체", ...new Set(D.items.map((it) => it.tag).filter(Boolean))];
  const [current, setCurrent] = useState("전체");
  const [word, setWord] = useState("");
  const shown = D.items.filter((it) =>
    (current === "전체" || it.tag === current) && (!word.trim() || (it.name + it.tag + it.desc).includes(word.trim())));

  return (
    <>
      <input className="search" type="search" placeholder={D.searchPlaceholder} aria-label="찾기"
        value={word} onChange={(e) => setWord(e.target.value)} />
      <div className="chips" role="group" aria-label="분류 고르기">
        {tags.map((t) => (
          <button key={t} className="chip" type="button" aria-pressed={t === current} onClick={() => setCurrent(t)}>{t}</button>
        ))}
      </div>
      <ul className="list-grid">
        {shown.length ? shown.map((it) => (
          <li key={it.name} className="item">
            <div className="meta">{it.tag}</div>
            <h3>{it.name}{it.sample ? <> <span className="sample">예시</span></> : null}</h3>
            <p>{it.desc}</p>
          </li>
        )) : <li className="empty">맞는 항목이 없어요. 다른 말로 찾아보세요.</li>}
      </ul>
      {D.items.some((it) => it.sample) ? (
        <p className="sample-note" style={{ marginBottom: 64 }}>「예시」가 붙은 항목은 화면을 보여 드리려고 넣은 예시입니다.</p>
      ) : null}
    </>
  );
}
