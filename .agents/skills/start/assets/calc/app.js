// 계산기형 화면을 움직이는 부분입니다. 내용과 계산식은 data.js 에서 고칩니다.
(function () {
  var D = window.APP_DATA;
  if (D.notice) { var n = document.getElementById("notice"); n.querySelector(".wrap").textContent = D.notice; n.hidden = false; }
  var box = document.getElementById("fields");
  D.fields.forEach(function (f) {
    var l = document.createElement("label");
    l.className = "field";
    l.innerHTML = "<span>" + esc(f.label) + "</span><div class=\"input\"><input id=\"f-" + f.id + "\" inputmode=\"decimal\" autocomplete=\"off\" placeholder=\"" + esc(f.placeholder || "") + "\"><em>" + esc(f.unit || "") + "</em></div>";
    box.appendChild(l);
  });
  document.getElementById("resultLabel").textContent = D.resultLabel || "결과";
  function num(s) { return Number(String(s).replace(/[^0-9.]/g, "")) || 0; }
  function run() {
    var v = {};
    D.fields.forEach(function (f) { v[f.id] = num(document.getElementById("f-" + f.id).value); });
    var r = D.calculate(v);
    document.getElementById("resultBig").textContent = r.big;
    document.getElementById("resultSub").textContent = r.sub || "";
    var box = document.getElementById("result").getBoundingClientRect();
    if (box.top > window.innerHeight - 120) window.scrollBy({ top: box.top - 120, behavior: "smooth" });
  }
  document.getElementById("form").onsubmit = function (e) { e.preventDefault(); run(); };
  var ex = document.getElementById("exampleList");
  if (!D.examples || !D.examples.length) document.getElementById("examples").hidden = true;
  (D.examples || []).forEach(function (x, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.innerHTML = "<span>" + D.fields.map(function (f) { return Number(x[f.id]).toLocaleString("ko-KR") + (f.unit || ""); }).join(" · ") + "</span><span class=\"sample\">예시 " + (i + 1) + "</span>";
    b.onclick = function () { D.fields.forEach(function (f) { document.getElementById("f-" + f.id).value = x[f.id]; }); run(); };
    ex.appendChild(b);
  });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
})();
