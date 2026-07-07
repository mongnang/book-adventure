(function () {
  const SESSION_KEY = "book-adventure-session-id";

  const finalAnswerRules = {
    memil: {
      answer: "동이는 허 생원의 아들일 가능성이 크다.",
      keywords: ["동이", "아들"]
    }
  };

  function getSessionId() {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const nextId = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.sessionStorage.setItem(SESSION_KEY, nextId);
    return nextId;
  }

  async function postJson(path, payload) {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...payload,
        sessionId: getSessionId(),
        clientTimestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  }

  function buildPracticeAnswer(payload) {
    const categoryGuide = {
      mind: "인물의 마음은 말로 직접 드러나기도 하지만, 망설임이나 행동 속에 숨어 있기도 해요.",
      action: "행동과 선택은 그 인물이 처한 상황, 바라는 것, 피하고 싶은 것을 함께 보면 더 잘 보여요.",
      relationship: "관계는 처음과 나중의 말투와 태도가 어떻게 달라졌는지 비교하면 더 잘 보여요."
    };

    const guide = categoryGuide[payload.category?.id] || "작품 속 근거를 하나씩 짚어 보면 답을 더 단단하게 만들 수 있어요.";
    const characterLine = payload.character?.name ? `인물: ${payload.character.name}` : "";

    return [
      "좋은 질문이에요. 지금은 Azure 연결 전 연습 모드로 답할게요.",
      "",
      `질문: ${payload.question || payload.rawQuestion}`,
      characterLine,
      `책: ${payload.book?.title || "선택한 책"}`,
      "",
      guide,
      "먼저 그 장면에서 인물이 본 것, 들은 말, 한 행동을 하나씩 떠올려 보세요.",
      "그다음 단서 두 개를 연결하면 더 좋은 추리가 됩니다."
    ].filter(Boolean).join("\n");
  }

  function normalizeText(text) {
    return String(text || "")
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  function buildPracticeAnswerCheck(payload) {
    const rule = finalAnswerRules[payload.book?.id];
    if (!rule) {
      return {
        correct: false,
        message: "이 책은 아직 자동 정답 규칙이 준비되지 않았어요. Azure AI 연결 후 원전 근거로 더 정확히 확인할 수 있어요."
      };
    }

    const normalizedAnswer = normalizeText(payload.answer);
    const correct = rule.keywords.every((keyword) => normalizedAnswer.includes(normalizeText(keyword)));

    return correct
      ? {
          correct: true,
          message: `정답이에요! 핵심은 “${rule.answer}”라고 볼 수 있어요. 단서를 잘 이어 붙였어요.`
        }
      : {
          correct: false,
          message: "아직 정답이라고 보기는 어려워요. 인물의 말, 기억, 관계 단서를 조금 더 모아 보세요."
        };
  }

  window.sendReadingQuestionToAgent = async function sendReadingQuestionToAgent(payload) {
    try {
      const data = await postJson("/api/adventure/turn", payload);
      return data.answer || data.message || buildPracticeAnswer(payload);
    } catch (error) {
      console.warn("[BookAdventure] Azure API unavailable. Using practice answer.", error);
      return buildPracticeAnswer(payload);
    }
  };

  window.checkReadingAnswerWithAgent = async function checkReadingAnswerWithAgent(payload) {
    try {
      const data = await postJson("/api/adventure/check-answer", payload);
      return {
        correct: Boolean(data.correct),
        message: data.message || "답을 확인했어요."
      };
    } catch (error) {
      console.warn("[BookAdventure] Azure answer-check API unavailable. Using practice rule.", error);
      return buildPracticeAnswerCheck(payload);
    }
  };
})();
