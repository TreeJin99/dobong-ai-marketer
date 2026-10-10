// 목록형 화면을 움직이는 부분입니다. 내용은 data.js 에서 고칩니다.
(function () {
  var D = window.APP_DATA, current = "전체";
  if (D.notice) { var n = document.getElementById("notice"); n.querySelector(".wrap").textContent = D.notice; n.hidden = false; }
  document.getElementById("sampleNote").hidden = !D.items.some(function (it) { return it.sample; });
  var tags = ["전체"].concat(D.items.map(function (it) { return it.tag; }).filter(function (t, i, a) { return t && a.indexOf(t) === i; }));
  var chips = document.getElementById("chips"), q = document.getElementById("q");
  tags.forEach(function (t) {
    var b = document.createElement("button");
    b.className = "chip"; b.type = "button"; b.textContent = t;
    b.onclick = function () { current = t; render(); };
    chips.appendChild(b);
  });
  q.oninput = render;
  function render() {
    chips.querySelectorAll(".chip").forEach(function (b) { b.setAttribute("aria-pressed", b.textContent === current); });
    var word = q.value.trim();
    var shown = D.items.filter(function (it) {
      return (current === "전체" || it.tag === current) && (!word || (it.name + it.tag + it.desc).indexOf(word) > -1);
    });
    var list = document.getElementById("list");
    list.innerHTML = shown.length ? "" : "<li class=\"empty\">맞는 항목이 없어요. 다른 말로 찾아보세요.</li>";
    shown.forEach(function (it) {
      var li = document.createElement("li");
      li.className = "item";
      li.innerHTML = "<div class=\"meta\">" + esc(it.tag) + "</div><h3>" + esc(it.name) + (it.sample ? " <span class=\"sample\">예시</span>" : "") + "</h3><p>" + esc(it.desc) + "</p>";
      list.appendChild(li);
    });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  render();
})();
