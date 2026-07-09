const { getAdventureBook } = require("../data/book-adventures");

function buildSystemPrompt(book) {
  const adventureBook = getAdventureBook(book);

  return [
    "너는 초등학생을 위한 한국어 독서 모험 AI '한 권의 모험'이다.",
    "역할은 정답을 바로 말하는 선생님이 아니라, 학생이 책 속 단서를 스스로 연결하도록 돕는 게임 진행자이자 이야기 길잡이다.",
    "학생의 선택을 받아 다음 단서를 열어 주고, 모험이 이어지고 있다는 느낌을 만든다.",
    "",
    "응답 규칙:",
    "- 친절하고 짧게 말한다. 한 번에 2~4문장, 350자 이내로 답한다.",
    "- 어려운 말은 초등학생도 이해할 수 있는 쉬운 말로 바꾼다.",
    "- 책에 없는 사실을 단정하지 않는다.",
    "- 결론 확인 전에는 최종 정답을 직접 말하지 않는다.",
    "- 학생이 이미 한 말과 선택한 단서를 이어 받아, 같은 설명을 반복하지 않는다.",
    "- 책 속 장면, 인물의 행동, 장소의 분위기 중 최소 1가지를 근거로 말한다.",
    "- 단서를 안내하되 '정답은 ...'처럼 결론을 확정하지 않는다.",
    "- 마지막 문장은 학생이 다시 생각할 짧은 질문 1개로 끝낸다.",
    "- 긴 목록이나 여러 단계 설명은 피하고, 바로 화면에 보여 줄 답변만 쓴다.",
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

function formatStudentLine(student) {
  if (!student) return "학생 정보: 아직 없음";
  return `학생 정보: ${student.className || "?"}반 ${student.number || "?"}번 ${student.nickname || "학생"}`;
}

function formatProgressLine(progress) {
  if (!progress) return "진행 상태: 아직 기록 없음";
  return `진행 상태: 남은 기회 ${progress.chancesLeft ?? "?"}, 찾은 단서 ${progress.cluesFound ?? 0}, 정답 여부 ${progress.solved ? "맞힘" : "진행 중"}`;
}

function formatConversation(conversation = []) {
  if (!Array.isArray(conversation) || conversation.length === 0) {
    return "이전 대화: 아직 없음";
  }

  const lines = conversation.slice(-8).map((entry) => {
    const role = entry.role === "user" ? "학생" : "AI";
    return `- ${role}: ${String(entry.text || "").slice(0, 180)}`;
  });
  return ["이전 대화 요약:", ...lines].join("\n");
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
        formatStudentLine(payload.student),
        formatProgressLine(payload.progress),
        formatConversation(payload.conversation),
        "",
        `학생 질문: ${payload.question || payload.rawQuestion}`,
        `질문 범주: ${payload.category?.title || "자유 질문"}`,
        characterLine,
        placeLine,
        "",
        "학생에게 바로 사용할 수 있는 한국어 답변을 2~4문장으로 작성해 줘.",
        "답변은 게임 진행자의 말투로, 학생이 다음 선택을 하고 싶게 만들어 줘."
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
        formatStudentLine(payload.student),
        formatProgressLine(payload.progress),
        formatConversation(payload.conversation),
        "",
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

function buildAssessmentMessages(payload) {
  const adventureBook = getAdventureBook(payload.book);

  return [
    {
      role: "system",
      content: [
        "너는 초등학생 독서 모험 활동을 평가하는 교사용 AI 도우미다.",
        "반드시 JSON만 출력한다.",
        "형식: {\"totalScore\": number, \"maxScore\": 20, \"scores\": [{\"id\": string, \"label\": string, \"score\": number, \"comment\": string}], \"summary\": string, \"nextStep\": string}",
        "채점 항목은 단서 찾기, 근거 연결, 질문 태도, 추리 결론 4개이며 각 0~5점이다.",
        "초등학생에게 보여 줄 수 있도록 따뜻하고 구체적으로 쓴다.",
        "대화에 없는 사실을 꾸며서 평가하지 않는다."
      ].join("\n")
    },
    {
      role: "user",
      content: [
        formatStudentLine(payload.student),
        formatProgressLine(payload.progress),
        `책: ${adventureBook.title}`,
        `학생이 풀어야 할 질문: ${adventureBook.mysteryQuestion || adventureBook.mystery}`,
        `최종 답안: ${payload.answer || "아직 없음"}`,
        "",
        formatConversation(payload.conversation),
        "",
        "위 대화를 기준으로 4개 항목 점수와 짧은 피드백을 JSON으로 작성해 줘."
      ].join("\n")
    }
  ];
}

module.exports = {
  buildAssessmentMessages,
  buildAnswerCheckMessages,
  buildTurnMessages
};
