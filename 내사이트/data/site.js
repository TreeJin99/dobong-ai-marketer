// 서비스 이름 · 약속 · 소개 페이지 글은 이 파일에만 있습니다.
// 여기만 고치면 메뉴 · 첫 화면 · 소개 페이지 · 카톡 미리보기 글이 같이 바뀝니다.
export const site = {
  type: "map", // 화면 유형 하나: map 지도 · list 목록 · calc 계산기 · quiz 테스트 · log 기록
  name: "내 서비스", // 서비스 이름
  promise: "한 줄 약속을 여기에 씁니다", // 서비스 화면 제목이자 소개 페이지 큰 글씨
  description: "누구의 어떤 불편을 푸는지 한 문장으로 씁니다.", // 검색 · 카톡 미리보기 설명
  appIntro: "", // 서비스 화면 제목 아래 한 줄 (지도형은 비워 둡니다)
  listTitle: "장소 목록", // 지도형 목록 제목
  maker: "별명", // 만든 사람 별명 (실명 쓰지 않음)
  url: "", // Vercel 에 올린 뒤 받은 주소. 예: https://xxxx.vercel.app
  gaId: "", // 10/13 측정 ID. 예: G-ABC123DEF4

  about: {
    who: "누구를 위한 서비스인지 한 문장으로 씁니다.",
    pains: ["불편 1", "불편 2", "불편 3"],
    features: [
      { title: "기능 1", text: "기능 1을 한 줄로 설명합니다." },
      { title: "기능 2", text: "기능 2를 한 줄로 설명합니다." },
      { title: "기능 3", text: "기능 3을 한 줄로 설명합니다." },
    ],
    steps: [
      { title: "1단계", text: "처음 할 일을 한 줄로." },
      { title: "2단계", text: "다음 할 일을 한 줄로." },
      { title: "3단계", text: "마지막 할 일을 한 줄로." },
    ],
    makerWhy: "왜 만들었는지 한 문장으로 씁니다.",
    ctaTitle: "지금 바로 써 보세요",
    ctaText: "",
    contactLabel: "연락하기 (준비 중)",
    contactHref: "",
  },
};
