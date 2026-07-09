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

function buildPracticeNextStep(payload = {}) {
  const conversation = Array.isArray(payload.conversation) ? payload.conversation : [];
  const userTurns = conversation.filter((entry) => entry.role === "user").length;
  const cluesFound = Number(payload.progress?.cluesFound || payload.cluesFound || 0);
  const solved = Boolean(payload.progress?.solved || payload.correct);
  const bookTitle = payload.book?.title || "이 책";

  if (!userTurns) {
    return "다음에는 먼저 인물 질문이나 장소 질문을 하나 골라 단서를 모아 보세요.";
  }

  if (!solved && cluesFound < 2) {
    return "다음에는 인물의 마음 질문과 장소 질문을 각각 하나씩 골라 단서를 비교해 보세요.";
  }

  if (!solved) {
    return "다음에는 모은 단서 중 가장 중요한 장면 하나를 골라 결론과 연결해 보세요.";
  }

  return `다음에는 「${bookTitle}」에서 그 답을 떠올리게 한 장면을 한 문장으로 덧붙여 보세요.`;
}

function buildPracticeAssessment(payload = {}) {
  const conversation = Array.isArray(payload.conversation) ? payload.conversation : [];
  const userTurns = conversation.filter((entry) => entry.role === "user").length;
  const cluesFound = Number(payload.progress?.cluesFound || payload.cluesFound || 0);
  const solved = Boolean(payload.progress?.solved || payload.correct);
  const inquiryScore = Math.min(5, Math.max(2, userTurns + Math.min(2, cluesFound)));
  const conclusionScore = solved ? 5 : Math.min(4, Math.max(2, cluesFound + 1));

  const scores = [
    {
      id: "inquiry",
      label: "질문 태도",
      score: inquiryScore,
      comment: userTurns > 2
        ? "스스로 질문을 이어 가며 단서를 확인하려는 태도가 좋아요."
        : "질문을 조금 더 이어 가면 인물과 장소 단서를 더 넓게 볼 수 있어요."
    },
    {
      id: "conclusion",
      label: "추리 결론",
      score: conclusionScore,
      comment: solved ? "마지막 추리가 핵심 단서와 잘 맞았어요." : "결론을 말할 때 가장 중요한 장면을 함께 붙이면 더 단단해져요."
    }
  ];

  return {
    totalScore: scores.reduce((sum, item) => sum + item.score, 0),
    maxScore: 10,
    scores,
    summary: solved
      ? "오늘은 질문으로 단서를 모으고 마지막 결론까지 잘 이어 갔어요."
      : "오늘은 질문으로 단서를 모으는 흐름을 따라왔고, 결론을 더 단단하게 만들 준비가 되었어요.",
    nextStep: buildPracticeNextStep(payload)
  };
}

module.exports = {
  buildPracticeAssessment,
  buildPracticeAnswer,
  checkKnownAnswer
};
