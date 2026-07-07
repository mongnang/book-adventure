const adventureBooks = {
  memil: {
    id: "memil",
    title: "메밀꽃 필 무렵",
    author: "이효석",
    mystery: "허 생원과 동이 사이에 숨겨진 인연을 단서로 추리한다.",
    sourceNote: "봉평 장터, 대화 장터로 가는 밤길, 허 생원의 과거 기억, 동이의 어머니 이야기, 인물들의 말과 행동을 근거로 삼는다.",
    characters: ["허 생원", "조 선달", "동이", "성 서방네 처녀"],
    clueHints: [
      "허 생원이 봉평에서 겪은 오래전 기억",
      "동이가 어머니와 고향에 대해 하는 말",
      "허 생원과 동이 사이의 닮은 점과 분위기",
      "조 선달이 옆에서 알아차리는 말과 반응"
    ],
    finalAnswer: "동이는 허 생원의 아들일 가능성이 크다.",
    finalAnswerKeywords: ["동이", "아들"]
  }
};

function getAdventureBook(book = {}) {
  const knownBook = adventureBooks[book.id];
  if (knownBook) return knownBook;

  return {
    id: book.id || "unknown",
    title: book.title || "선택한 책",
    author: book.author || "작가 미상",
    mystery: "책 속 인물의 마음, 행동, 관계를 근거로 단서를 모은다.",
    sourceNote: book.description || "현재는 책 설명과 학생 질문을 근거로 짧게 안내한다. 원전 본문 연결은 다음 단계에서 Azure AI Search로 확장한다.",
    characters: [],
    clueHints: [
      "인물의 말과 행동",
      "장면의 분위기",
      "다른 인물과의 관계 변화"
    ],
    finalAnswer: "",
    finalAnswerKeywords: []
  };
}

module.exports = {
  adventureBooks,
  getAdventureBook
};
