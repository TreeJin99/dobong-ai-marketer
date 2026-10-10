// 질문과 결과는 이 파일에만 있습니다.
// 보기마다 type 을 적고, 가장 많이 고른 type 의 결과가 나옵니다.
window.APP_DATA = {
  notice: "",
  questions: [
    { q: "예시 질문 1", options: [ { text: "보기 가", type: "A" }, { text: "보기 나", type: "B" } ] },
    { q: "예시 질문 2", options: [ { text: "보기 가", type: "A" }, { text: "보기 나", type: "B" } ] },
    { q: "예시 질문 3", options: [ { text: "보기 가", type: "A" }, { text: "보기 나", type: "B" } ] }
  ],
  results: {
    A: { title: "예시 결과 A", desc: "결과를 두세 문장으로 설명합니다." },
    B: { title: "예시 결과 B", desc: "결과를 두세 문장으로 설명합니다." }
  }
};
