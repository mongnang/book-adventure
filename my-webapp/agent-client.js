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

  window.recordAdventureSessionStart = async function recordAdventureSessionStart(payload) {
    try {
      await postJson("/api/adventure/session", payload);
      return true;
    } catch (error) {
      console.warn("[BookAdventure] Session save unavailable.", error);
      return false;
    }
  };

  window.sendReadingQuestionToAgent = async function sendReadingQuestionToAgent(payload) {
    try {
      const data = await postJson("/api/adventure/turn", payload);
      if (data.mode && data.mode !== "azure-openai" && data.openAIError) {
        return [
          "AI 연결 오류가 있어서 실제 모델 답변을 받지 못했어요.",
          "",
          `오류: ${data.openAIError}`,
          "",
          "환경 변수, 배포 이름, 엔드포인트, 모델 호출 방식을 다시 확인해야 해요."
        ].join("\n");
      }
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

  window.assessAdventureConversation = async function assessAdventureConversation(payload) {
    try {
      const data = await postJson("/api/adventure/assessment", payload);
      return data || buildPracticeAssessment(payload);
    } catch (error) {
      console.warn("[BookAdventure] Azure assessment API unavailable. Using practice rubric.", error);
      return buildPracticeAssessment(payload);
    }
  };
})();
