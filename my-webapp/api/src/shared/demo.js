const { getAdventureBook } = require("../data/book-adventures");

function normalizeText(text) {
  return String(text || "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function buildPracticeAnswer(payload) {
  const categoryGuide = {
    mind: "인물의 마음은 말로 직접 드러나기도 하지만, 망설임이나 행동 속에 숨어 있기도 해요.",
    place: "장소는 배경처럼 보이지만, 인물의 기억과 마음, 숨은 단서를 보여주는 중요한 장면이에요."
  };

  const guide = categoryGuide[payload.category?.id] || "작품 속 근거를 하나씩 짚어 보면 답을 더 단단하게 만들 수 있어요.";
  const characterLine = payload.character?.name ? `인물: ${payload.character.name}` : "";
  const placeLine = payload.place?.name ? `장소: ${payload.place.name}` : "";

  return [
    "좋은 질문이에요. 이 단서는 그냥 넘기기 아까워요.",
    [characterLine, placeLine].filter(Boolean).join(" / "),
    guide,
    "그 장면에서 인물이 본 것, 들은 말, 한 행동 중 무엇이 가장 눈에 띄나요?"
  ].filter(Boolean).join("\n");
}

function checkKnownAnswer(payload) {
  const adventureBook = getAdventureBook(payload.book);
  if (!adventureBook.finalAnswerKeywords.length) {
    return null;
  }

  const normalizedAnswer = normalizeText(payload.answer);
  const correct = adventureBook.finalAnswerKeywords.every((keyword) => normalizedAnswer.includes(normalizeText(keyword)));

  if (correct) {
    return {
      correct: true,
      message: `정답이에요! 핵심은 “${adventureBook.finalAnswer}”라고 볼 수 있어요. 단서를 잘 이어 붙였어요.`
    };
  }

  return {
    correct: false,
    message: "아직 정답이라고 보기는 어려워요. 인물의 말, 기억, 장소 단서를 조금 더 모아 보세요."
  };
}

function buildPracticeAssessment(payload = {}) {
  const conversation = Array.isArray(payload.conversation) ? payload.conversation : [];
  const userTurns = conversation.filter((entry) => entry.role === "user").length;
  const cluesFound = Number(payload.progress?.cluesFound || payload.cluesFound || 0);
  const solved = Boolean(payload.progress?.solved || payload.correct);

  const scores = [
    {
      id: "clue",
      label: "단서 찾기",
      score: Math.min(5, Math.max(1, cluesFound + 1)),
      comment: "인물과 장소 단서를 더 모을수록 점수가 올라가요."
    },
    {
      id: "evidence",
      label: "근거 연결",
      score: Math.min(5, Math.max(1, userTurns)),
      comment: "질문을 이어 가며 근거를 연결하려는 태도를 봤어요."
    },
    {
      id: "inquiry",
      label: "질문 태도",
      score: Math.min(5, Math.max(2, userTurns + 1)),
      comment: "스스로 질문하고 확인하려는 모습이 좋아요."
    },
    {
      id: "conclusion",
      label: "추리 결론",
      score: solved ? 5 : 3,
      comment: solved ? "마지막 추리가 핵심 단서와 잘 맞았어요." : "결론을 더 단서와 연결해 보면 좋아요."
    }
  ];

  return {
    totalScore: scores.reduce((sum, item) => sum + item.score, 0),
    maxScore: 20,
    scores,
    summary: "오늘 대화에서는 단서를 고르고 질문으로 확인하는 독서 모험 흐름을 잘 따라왔어요.",
    nextStep: "다음에는 답을 말할 때 어떤 장면이 근거인지 한 문장으로 붙여 보세요."
  };
}

module.exports = {
  buildPracticeAssessment,
  buildPracticeAnswer,
  checkKnownAnswer
};
