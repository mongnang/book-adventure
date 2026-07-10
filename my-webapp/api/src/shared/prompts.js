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
    "- 문장을 중간에 끊지 말고 마지막 질문까지 완성해서 끝낸다.",
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
    const role = entry.role === "user" ? "학생" : entry.role === "character" ? "인물" : "AI";
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
        "문장이 중간에서 끊기지 않도록 마지막 문장까지 완성해 줘.",
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
        "형식: {\"totalScore\": number, \"maxScore\": 15, \"scores\": [{\"id\": string, \"label\": string, \"score\": number, \"comment\": string}], \"summary\": string, \"nextStep\": string}",
        "채점 항목은 질문 태도, 추리 결론, 합리적 추론 3개이며 각 0~5점이다.",
        "scores에는 반드시 inquiry/질문 태도, conclusion/추리 결론, rational-inference/합리적 추론 순서로 넣는다.",
        "합리적 추론은 정답을 맞힐 때 작품의 장면, 인물의 행동, 장소 단서 등 적합한 근거를 함께 제시했는지 평가한다.",
        "합리적 추론은 정답과 구체적 근거가 모두 적합하면 5점, 정답이지만 근거가 일반적이면 3~4점, 정답만 쓰고 근거가 없거나 맞지 않으면 1~2점, 정답이 아니면 0점으로 평가한다.",
        "nextStep은 학생의 실제 대화, 진행 상태, 최종 답안을 반영해 매번 다르게 한 문장으로 쓴다.",
        "nextStep에 '다음에는 답을 말할 때 어떤 장면이 근거인지 한 문장으로 붙여 보세요' 같은 고정 예시 문구를 반복하지 않는다.",
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
        "위 대화를 기준으로 3개 항목 점수와 짧은 피드백을 JSON으로 작성해 줘."
      ].join("\n")
    }
  ];
}

function buildTitleScenarioMessages(payload) {
  const bookTitle = payload.book?.title || "선택한 책";
  const action = payload.action || "draft";
  const answers = payload.answers || {};

  return [
    {
      role: "system",
      content: [
        "너는 초등학생을 위한 활동 1 '책 제목만 보고 상상하기'의 AI 진행자다.",
        "이 활동의 핵심은 책을 읽기 전에 학생이 제목만 보고 자유롭게 상상하도록 돕는 것이다.",
        "원전 줄거리, 실제 결말, 실제 인물 관계, 정답, 작품 해설은 절대 알려주지 않는다.",
        "학생이 준 상상 요소만 바탕으로 이야기를 만든다.",
        "학생의 표현을 최대한 살리고, 초등학생에게 자연스러운 한국어로 쓴다.",
        "반드시 JSON object만 출력한다.",
        "공통 형식: {\"guideText\": string, \"scenarioText\": string, \"nanoBananaPrompt\": null 또는 {\"mood\": string, \"scene\": string, \"colors\": string, \"ko\": string, \"en\": string}}",
        "draft 또는 revise action에서는 scenarioText를 5~7문장으로 완성하고 nanoBananaPrompt는 null로 둔다.",
        "prompt action에서는 scenarioText를 유지하고 nanoBananaPrompt를 완성한다.",
        "나노바나나 프롬프트는 한국어 설명과 영어 프롬프트를 모두 포함한다.",
        "한국어 설명에는 분위기, 그림 내용, 색감, 표지에 넣을 제목 글자를 포함한다."
      ].join("\n")
    },
    {
      role: "user",
      content: [
        formatStudentLine(payload.student),
        `책 제목: ${bookTitle}`,
        `요청 action: ${action}`,
        "",
        "학생이 상상한 핵심 3항목:",
        `- 등장인물: ${answers.character || "아직 없음"}`,
        `- 배경: ${answers.setting || "아직 없음"}`,
        `- 무슨 일: ${answers.event || "아직 없음"}`,
        "",
        `현재 시나리오: ${payload.scenarioText || "아직 없음"}`,
        `수정 방향: ${payload.revisionLabel || payload.customRequest || "없음"}`,
        "",
        formatConversation(payload.conversation),
        "",
        action === "prompt"
          ? "확정된 시나리오에 어울리는 책 표지용 나노바나나 프롬프트를 만들어 줘. 제목 글자는 반드시 책 제목 그대로 넣어 줘."
          : "학생의 상상 요소를 살려 짧고 생생한 가상 시나리오를 만들어 줘. 원전 내용은 절대 알려주지 마."
      ].join("\n")
    }
  ];
}

function buildCharacterChatMessages(payload) {
  const adventureBook = getAdventureBook(payload.book);
  const character = payload.character || {};
  const rules = payload.characterRules || {};
  const boundaries = Array.isArray(rules.boundaries) ? rules.boundaries : [];

  return [
    {
      role: "system",
      content: [
        "너는 초등학생 독서 활동 3에서 책 속 주요 인물로 대화하는 AI다.",
        "역할은 해설자가 아니라 학생이 고른 인물이다. 1인칭으로 답한다.",
        "학생은 책 밖에서 질문하는 독자이며, 학생을 작품 속 인물로 끌어들이지 않는다.",
        "반드시 선택된 인물의 말투와 제약을 따른다.",
        "책에 없는 사건, 감정, 결말을 사실처럼 꾸며 말하지 않는다.",
        "작품의 핵심 비밀이나 결말은 학생이 먼저 충분히 묻기 전까지 직접 단정하지 않는다.",
        "한 번에 2~4문장, 450자 이내로 답한다.",
        "마지막 문장은 학생이 다시 물어볼 만한 짧은 질문 1개로 끝낸다.",
        "",
        `책: ${adventureBook.title}`,
        `작가: ${adventureBook.author}`,
        `주요 인물: ${adventureBook.characters.join(", ") || "선택한 책의 주요 인물"}`,
        `선택된 인물: ${character.name || "이름 없음"} (${character.role || "역할 미상"})`,
        `인물 말투: ${rules.speechStyle || "인물의 역할에 맞는 자연스러운 말투"}`,
        `인물 관점: ${rules.perspective || "자신이 직접 겪거나 느낄 수 있는 범위"}`,
        boundaries.length ? `인물 제약: ${boundaries.join(" / ")}` : "인물 제약: 결말을 먼저 말하지 않고 책 밖 해설자가 되지 않는다.",
        `원전 근거 메모: ${adventureBook.sourceNote}`,
        `단서 방향: ${adventureBook.clueHints.join(" / ")}`
      ].join("\n")
    },
    {
      role: "user",
      content: [
        formatStudentLine(payload.student),
        formatConversation(payload.conversation),
        "",
        `학생이 인물에게 건넨 말: ${payload.message}`,
        "",
        "선택된 인물의 목소리로만 답해 줘.",
        "답변 안에서 '나는 AI야', '작품 해설을 하자면' 같은 말은 쓰지 마.",
        "학생의 질문을 받아 주고, 인물의 말투로 장면과 마음을 짧게 보여 줘."
      ].join("\n")
    }
  ];
}

module.exports = {
  buildAssessmentMessages,
  buildAnswerCheckMessages,
  buildCharacterChatMessages,
  buildTitleScenarioMessages,
  buildTurnMessages
};
