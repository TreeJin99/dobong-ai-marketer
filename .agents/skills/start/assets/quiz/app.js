// 테스트형 화면을 움직이는 부분입니다. 질문은 data.js 에서 고칩니다.
(function () {
  var D = window.APP_DATA, box = document.getElementById("quiz"), i = 0, score = {};
  if (D.notice) { var n = document.getElementById("notice"); n.querySelector(".wrap").textContent = D.notice; n.hidden = false; }
  function show() {
    var total = D.questions.length;
    if (i >= total) return result();
    var Q = D.questions[i];
    box.innerHTML = "<div class=\"step\">" + (i + 1) + " / " + total + "</div><div class=\"progress\"><i style=\"width:" + (i / total * 100) + "%\"></i></div><h2>" + esc(Q.q) + "</h2><div class=\"options\"></div>";
    var opts = box.querySelector(".options");
    Q.options.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = o.text;
      b.onclick = function () { score[o.type] = (score[o.type] || 0) + 1; i++; show(); };
      opts.appendChild(b);
    });
  }
  function result() {
    var best = Object.keys(score).sort(function (a, b) { return score[b] - score[a]; })[0];
    var R = D.results[best] || { title: "결과", desc: "" };
    box.innerHTML = "<div class=\"quiz-result\"><div class=\"step\">나의 결과</div><div class=\"big\">" + esc(R.title) + "</div><p>" + esc(R.desc) + "</p><button class=\"btn line\" type=\"button\">처음부터 다시</button></div>";
    box.querySelector("button").onclick = function () { i = 0; score = {}; show(); };
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  show();
})();
