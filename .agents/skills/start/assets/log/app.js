// 기록형 화면을 움직이는 부분입니다. 기록은 이 브라우저 안(localStorage)에만 저장됩니다.
(function () {
  var D = window.APP_DATA, KEY = D.storageKey || "my-service-log";
  if (D.notice) { var n = document.getElementById("notice"); n.querySelector(".wrap").textContent = D.notice; n.hidden = false; }
  var list;
  try { list = JSON.parse(localStorage.getItem(KEY)); } catch (e) { list = null; }
  if (!list) list = D.samples.map(function (t) { return { text: t, done: false, sample: true }; });
  function save() { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  function render() {
    var ul = document.getElementById("checks");
    ul.innerHTML = "";
    list.forEach(function (it, i) {
      var li = document.createElement("li");
      li.className = it.done ? "done" : "";
      li.innerHTML = "<input type=\"checkbox\" id=\"c" + i + "\"" + (it.done ? " checked" : "") + "><label for=\"c" + i + "\">" + esc(it.text) + (it.sample ? " <span class=\"sample\">예시</span>" : "") + "</label><button class=\"del\" type=\"button\">지우기</button>";
      li.querySelector("input").onchange = function () { it.done = this.checked; save(); render(); };
      li.querySelector(".del").onclick = function () { list.splice(i, 1); save(); render(); };
      ul.appendChild(li);
    });
    var done = list.filter(function (it) { return it.done; }).length;
    document.getElementById("count").textContent = list.length ? list.length + "개 중 " + done + "개 했어요" : "아직 적은 것이 없어요.";
  }
  document.getElementById("add").onsubmit = function (e) {
    e.preventDefault();
    var t = document.getElementById("text");
    if (!t.value.trim()) return;
    list = list.filter(function (it) { return !it.sample; });
    list.push({ text: t.value.trim(), done: false });
    t.value = ""; save(); render();
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  render();
})();
