const { getAdventureBook } = require("../data/book-adventures");

function buildSystemPrompt(book) {
  const adventureBook = getAdventureBook(book);

  return [
    "너는 초등학생을 위한 한국어 독서 모험 AI '한 권의 모험'이다.",
    "역할은 정답을 바로 말하는 선생님이 아니라, 학생이 책 속 단서를 스스로 연결하도록 돕는 이야기 길잡이다.",
    "",
    "응답 규칙:",
    "- 친절하고 짧게 말한다. 한 번에 3~5문장 정도로 답한다.",
    "- 어려운 말은 초등학생도 이해할 수 있는 쉬운 말로 바꾼다.",
    "- 책에 없는 사실을 단정하지 않는다.",
    "- 결론 확인 전에는 최종 정답을 직접 말하지 않는다.",
    "- 학생 질문에 답한 뒤, 다음에 살펴볼 만한 단서나 장면을 하나만 제안한다.",
    "",
    `책: ${adventureBook.title}`,
    `작가: ${adventureBook.author}`,
    `학생이 풀어야 할 질문: ${adventureBook.mysteryQuestion || adventureBook.mystery}`,
    `현재 미스터리: ${adventureBook.mystery}`,
    `원전 근거 메모: ${adventureBook.sourceNote}`,
    `주요 인물: ${adventureBook.characters.join(", ") || "학생이 선택한 책의 주요 인물"}`,
    `주요 장소: ${adventureBook.locations?.join(", ") || "학생이 선택한 책의 중요한 장소"}`,
    `단서 방향: ${adventureBook.clueHints.join(" / ")}`
  ].join("\n");
}

function buildTurnMessages(payload) {
  const characterLine = payload.character
    ? `학생이 선택한 인물: ${payload.character.name} (${payload.character.role || "역할 미상"})`
    : "학생이 특정 인물을 고르지 않았다.";
  const placeLine = payload.place
    ? `학생이 선택한 장소: ${payload.place.name} - ${payload.place.summary || ""} ${payload.place.clue || ""}`.trim()
    : "학생이 특정 장소를 고르지 않았다.";

  return [
    {
      role: "system",
      content: buildSystemPrompt(payload.book)
    },
    {
      role: "user",
      content: [
        `학생 질문: ${payload.question || payload.rawQuestion}`,
        `질문 범주: ${payload.category?.title || "자유 질문"}`,
        characterLine,
        placeLine,
        "",
        "학생에게 바로 사용할 수 있는 한국어 답변을 작성해 줘."
      ].join("\n")
    }
  ];
}

function buildAnswerCheckMessages(payload) {
  const adventureBook = getAdventureBook(payload.book);

  return [
    {
      role: "system",
      content: [
        "너는 초등학생 독서 추리 게임의 정답 판정 도우미다.",
        "반드시 JSON만 출력한다.",
        "형식: {\"correct\": boolean, \"message\": string}",
        "정답이 아니면 정답을 바로 길게 설명하지 말고, 어떤 단서를 더 봐야 하는지 짧게 알려준다."
      ].join("\n")
    },
    {
      role: "user",
      content: [
        `책: ${adventureBook.title}`,
        `학생이 풀어야 할 질문: ${adventureBook.mysteryQuestion || adventureBook.mystery}`,
        `정답 기준: ${adventureBook.finalAnswer || "원전 근거와 학생이 모은 단서를 바탕으로 판정"}`,
        `학생 답: ${payload.answer}`,
        `찾은 단서 수: ${payload.cluesFound ?? 0}`,
        "",
        "학생 답이 정답 기준에 충분히 맞으면 correct를 true로 해줘."
      ].join("\n")
    }
  ];
}

module.exports = {
  buildAnswerCheckMessages,
  buildTurnMessages
};
