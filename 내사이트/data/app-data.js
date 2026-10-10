// 화면에 나오는 내용(장소 · 항목 · 질문 · 공지 한 줄)은 이 파일에만 있습니다.
// 운영할 때는 이 파일만 고칩니다. sample: true 인 줄은 화면에 「예시」라고 붙습니다.
// 내 서비스 유형(site.js 의 type) 칸만 쓰고, 나머지 유형 칸은 지워도 됩니다.
export const appData = {
  notice: "", // 공지 한 줄. 비워 두면 안 보입니다.

  // 지도형
  map: {
    center: [37.6688, 127.0471], // 처음 지도 가운데 (도봉구청 부근)
    zoom: 14,
    filterLabel: "동네",
    items: [
      { name: "예시 1번 장소", area: "쌍문동", lat: 37.6486, lng: 127.0347, note: "쌍문동 중심 부근을 뜻하는 예시 위치입니다.", sample: true },
      { name: "예시 2번 장소", area: "쌍문동", lat: 37.653, lng: 127.026, note: "쌍문동 중심 부근을 뜻하는 예시 위치입니다.", sample: true },
      { name: "예시 3번 장소", area: "창동", lat: 37.6532, lng: 127.0477, note: "창동 중심 부근을 뜻하는 예시 위치입니다.", sample: true },
      { name: "예시 4번 장소", area: "방학동", lat: 37.664, lng: 127.0357, note: "방학동 중심 부근을 뜻하는 예시 위치입니다.", sample: true },
      { name: "예시 5번 장소", area: "도봉동", lat: 37.679, lng: 127.045, note: "도봉동 중심 부근을 뜻하는 예시 위치입니다.", sample: true },
    ],
  },

  // 목록형
  list: {
    searchPlaceholder: "이름이나 분류로 찾기",
    items: [
      { name: "예시 1번 항목", tag: "분류 가", desc: "항목을 한 줄로 설명합니다.", sample: true },
      { name: "예시 2번 항목", tag: "분류 가", desc: "항목을 한 줄로 설명합니다.", sample: true },
      { name: "예시 3번 항목", tag: "분류 나", desc: "항목을 한 줄로 설명합니다.", sample: true },
      { name: "예시 4번 항목", tag: "분류 나", desc: "항목을 한 줄로 설명합니다.", sample: true },
    ],
  },

  // 계산기형: 계산식은 calculate 하나만 고칩니다. 값은 fields 의 id 로 꺼내 씁니다.
  calc: {
    fields: [
      { id: "a", label: "첫째 숫자", unit: "원", placeholder: "예: 50000" },
      { id: "b", label: "둘째 숫자", unit: "명", placeholder: "예: 5" },
    ],
    button: "계산하기",
    resultLabel: "결과",
    calculate: (v) => {
      if (!v.b) return { big: "-", sub: "둘째 숫자를 1 이상으로 넣어 주세요." };
      const each = Math.floor(v.a / v.b);
      return { big: each.toLocaleString("ko-KR") + "원", sub: "남는 금액 " + (v.a - each * v.b).toLocaleString("ko-KR") + "원" };
    },
    examples: [
      { a: 30000, b: 5 },
      { a: 72000, b: 8 },
    ],
  },

  // 테스트형: 보기마다 type 을 적고, 가장 많이 고른 type 의 결과가 나옵니다.
  quiz: {
    questions: [
      { q: "예시 질문 1", options: [{ text: "보기 가", type: "A" }, { text: "보기 나", type: "B" }] },
      { q: "예시 질문 2", options: [{ text: "보기 가", type: "A" }, { text: "보기 나", type: "B" }] },
      { q: "예시 질문 3", options: [{ text: "보기 가", type: "A" }, { text: "보기 나", type: "B" }] },
    ],
    results: {
      A: { title: "예시 결과 A", desc: "결과를 두세 문장으로 설명합니다." },
      B: { title: "예시 결과 B", desc: "결과를 두세 문장으로 설명합니다." },
    },
  },

  // 기록형: 적은 내용은 그 사람 휴대폰(브라우저) 안에만 남습니다.
  log: {
    storageKey: "my-service-log", // 서비스마다 다른 영어 이름으로
    placeholder: "오늘 할 일",
    samples: ["예시 1번 할 일", "예시 2번 할 일", "예시 3번 할 일"],
  },
};
