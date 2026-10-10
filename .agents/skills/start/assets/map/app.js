// 지도형 화면을 움직이는 부분입니다. 내용은 data.js 에서 고칩니다.
(function () {
  var D = window.APP_DATA;
  var items = D.items.map(function (it, i) { return Object.assign({ no: i + 1 }, it); });
  var current = "전체";

  if (D.notice) { var n = document.getElementById("notice"); n.querySelector(".wrap").textContent = D.notice; n.hidden = false; }
  document.getElementById("sampleNote").hidden = !items.some(function (it) { return it.sample; });

  var map = L.map("map", { scrollWheelZoom: false }).setView(D.center, D.zoom);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
  }).addTo(map);
  map.attributionControl.setPrefix("<a href=\"https://leafletjs.com\">Leaflet</a>");

  var markers = {};
  items.forEach(function (it) {
    var icon = L.divIcon({ className: "", html: "<div class=\"pin\">" + it.no + "</div>", iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -18] });
    markers[it.no] = L.marker([it.lat, it.lng], { icon: icon, title: it.name })
      .bindPopup("<strong>" + esc(it.name) + "</strong><br>" + esc(it.area) + (it.sample ? " · 예시" : ""))
      .on("click", function () { select(it.no, false); });
  });

  var areas = ["전체"].concat(items.map(function (it) { return it.area; }).filter(function (a, i, arr) { return a && arr.indexOf(a) === i; }));
  var chips = document.getElementById("chips");
  chips.setAttribute("aria-label", (D.filterLabel || "분류") + " 고르기");
  areas.forEach(function (a) {
    var b = document.createElement("button");
    b.className = "chip"; b.type = "button"; b.textContent = a;
    b.setAttribute("aria-pressed", a === current);
    b.onclick = function () { current = a; render(); };
    chips.appendChild(b);
  });

  function render() {
    chips.querySelectorAll(".chip").forEach(function (b) { b.setAttribute("aria-pressed", b.textContent === current); });
    var shown = items.filter(function (it) { return current === "전체" || it.area === current; });
    var list = document.getElementById("rows");
    list.innerHTML = "";
    items.forEach(function (it) { map.removeLayer(markers[it.no]); });
    shown.forEach(function (it) {
      markers[it.no].addTo(map);
      var li = document.createElement("li");
      li.className = "row"; li.id = "row-" + it.no; li.tabIndex = 0;
      li.innerHTML = "<span class=\"num\">" + it.no + "</span><div><h3>" + esc(it.name) + (it.sample ? " <span class=\"sample\">예시</span>" : "") +
        "</h3><div class=\"meta\">" + esc(it.area || "") + "</div></div><p>" + esc(it.note || "") + "</p>";
      li.onclick = function () { select(it.no, true); };
      li.onkeydown = function (e) { if (e.key === "Enter") select(it.no, true); };
      list.appendChild(li);
    });
    document.getElementById("count").textContent = shown.length + "곳";
    if (shown.length) map.fitBounds(L.latLngBounds(shown.map(function (it) { return [it.lat, it.lng]; })).pad(0.25), { maxZoom: 16 });
  }

  function select(no, fromList) {
    document.querySelectorAll(".row").forEach(function (r) { r.classList.toggle("on", r.id === "row-" + no); });
    document.querySelectorAll(".pin").forEach(function (p) { p.classList.toggle("on", p.textContent === String(no)); });
    var m = markers[no];
    if (fromList) { map.setView(m.getLatLng(), Math.max(map.getZoom(), 15)); m.openPopup(); if (window.innerWidth < 960) window.scrollTo({ top: document.getElementById("map").offsetTop - 80, behavior: "smooth" }); }
    else { var r = document.getElementById("row-" + no); if (r && window.innerWidth >= 960) r.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  render();
})();
