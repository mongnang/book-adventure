const { getAdventureBook } = require("../data/book-adventures");

function normalizeText(text) {
  return String(text || "")
    .replace(/\s+/g, "")
    .toLowerCase();
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

module.exports = {
  checkKnownAnswer
};
