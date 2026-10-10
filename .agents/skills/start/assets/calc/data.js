// 화면에 나오는 내용은 이 파일에만 있습니다.
// 계산식은 calculate 하나만 고칩니다. 값은 fields 의 id 로 꺼내 씁니다.
window.APP_DATA = {
  notice: "",
  fields: [
    { id: "a", label: "첫째 숫자", unit: "원", placeholder: "예: 50000" },
    { id: "b", label: "둘째 숫자", unit: "명", placeholder: "예: 5" }
  ],
  resultLabel: "결과",
  calculate: function (v) {
    if (!v.b) return { big: "-", sub: "둘째 숫자를 1 이상으로 넣어 주세요." };
    var each = Math.floor(v.a / v.b);
    return { big: each.toLocaleString("ko-KR") + "원", sub: "남는 금액 " + (v.a - each * v.b).toLocaleString("ko-KR") + "원" };
  },
  examples: [ // 화면에 「예시」로 보이는 버튼
    { a: 30000, b: 5 },
    { a: 72000, b: 8 },
    { a: 105000, b: 12 }
  ]
};
