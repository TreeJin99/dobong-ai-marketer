"use client";
// 지도형 화면을 움직이는 부분입니다. 내용은 data/app-data.js 의 map 에서 고칩니다.
import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { appData } from "@/data/app-data";
import { site } from "@/data/site";

const D = appData.map;

export default function MapApp() {
  const items = useMemo(() => D.items.map((it, i) => ({ no: i + 1, ...it })), []);
  const areas = useMemo(() => ["전체", ...new Set(items.map((it) => it.area).filter(Boolean))], [items]);
  const [current, setCurrent] = useState("전체");
  const [selected, setSelected] = useState(null);
  const mapBox = useRef(null);
  const mapRef = useRef(null);
  const markers = useRef({});
  const L = useRef(null);

  const shown = items.filter((it) => current === "전체" || it.area === current);

  // 지도 처음 그리기
  useEffect(() => {
    let alive = true;
    import("leaflet").then(({ default: Leaflet }) => {
      if (!alive || mapRef.current) return;
      L.current = Leaflet;
      const map = Leaflet.map(mapBox.current, { scrollWheelZoom: false }).setView(D.center, D.zoom);
      Leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
      items.forEach((it) => {
        const icon = Leaflet.divIcon({ className: "", html: `<div class="pin" data-no="${it.no}">${it.no}</div>`, iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -18] });
        const m = Leaflet.marker([it.lat, it.lng], { icon, title: it.name });
        const pop = document.createElement("div");
        const b = document.createElement("strong");
        b.textContent = it.name;
        pop.append(b, document.createElement("br"), (it.area || "") + (it.sample ? " · 예시" : ""));
        m.bindPopup(pop).on("click", () => setSelected(it.no));
        markers.current[it.no] = m;
      });
      mapRef.current = map;
      draw(shownFor("전체"));
    });
    return () => {
      alive = false;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; markers.current = {}; }
    };
  }, [items]);

  function shownFor(area) {
    return items.filter((it) => area === "전체" || it.area === area);
  }

  function draw(list) {
    const map = mapRef.current;
    if (!map) return;
    Object.values(markers.current).forEach((m) => map.removeLayer(m));
    list.forEach((it) => markers.current[it.no].addTo(map));
    if (list.length) map.fitBounds(L.current.latLngBounds(list.map((it) => [it.lat, it.lng])).pad(0.25), { maxZoom: 16 });
  }

  // 동네를 고르면 핀 다시 그리기
  useEffect(() => { draw(shown); }, [current]);

  // 고른 핀 강조
  useEffect(() => {
    document.querySelectorAll(".pin").forEach((p) => p.classList.toggle("on", p.dataset.no === String(selected)));
  }, [selected, current]);

  function pick(it) {
    setSelected(it.no);
    const map = mapRef.current;
    if (!map) return;
    const m = markers.current[it.no];
    map.setView(m.getLatLng(), Math.max(map.getZoom(), 15));
    m.openPopup();
    if (window.innerWidth < 960) window.scrollTo({ top: mapBox.current.offsetTop - 80, behavior: "smooth" });
  }

  return (
    <>
      <div className="chips" role="group" aria-label={`${D.filterLabel || "분류"} 고르기`}>
        {areas.map((a) => (
          <button key={a} className="chip" type="button" aria-pressed={a === current} onClick={() => setCurrent(a)}>{a}</button>
        ))}
      </div>
      <div className="map-layout" style={{ marginTop: 16 }}>
        <div ref={mapBox} className="map" aria-label="지도" />
        <section>
          <div className="rows-head"><h2>{site.listTitle || "목록"}</h2><span>{shown.length}곳</span></div>
          <ol className="rows">
            {shown.map((it) => (
              <li key={it.no} className={`row${selected === it.no ? " on" : ""}`} tabIndex={0}
                onClick={() => pick(it)} onKeyDown={(e) => e.key === "Enter" && pick(it)}>
                <span className="num">{it.no}</span>
                <div>
                  <h3>{it.name}{it.sample ? <> <span className="sample">예시</span></> : null}</h3>
                  <div className="meta">{it.area}</div>
                </div>
                <p>{it.note}</p>
              </li>
            ))}
          </ol>
          {items.some((it) => it.sample) ? (
            <p className="sample-note" style={{ marginTop: 16 }}>「예시」가 붙은 곳은 화면을 보여 드리려고 넣은 예시입니다. 실제 장소가 아닙니다.</p>
          ) : null}
        </section>
      </div>
    </>
  );
}
