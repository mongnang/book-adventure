(function () {
  const SESSION_KEY = "book-adventure-session-id";
  const TITLE_SCENARIO_SUBMISSIONS_KEY = "book-adventure-title-scenario-submissions";

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

  function readJsonStorage(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Server storage is preferred; local storage is only a backup.
    }
  }

  function saveTitleScenarioSubmissionLocally(payload) {
    const saved = readJsonStorage(TITLE_SCENARIO_SUBMISSIONS_KEY, []);
    const submissions = Array.isArray(saved) ? saved : [];
    const item = {
      id: `title-scenario-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      savedAt: new Date().toISOString(),
      ...payload
    };
    submissions.push(item);
    writeJsonStorage(TITLE_SCENARIO_SUBMISSIONS_KEY, submissions.slice(-120));
    return item;
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

  function buildPracticeCharacterReply(payload = {}) {
    const characterName = payload.character?.name || "인물";
    const rules = payload.characterRules || {};
    const message = String(payload.message || "").trim();

    return [
      `${characterName}: ${String(rules.speechStyle || "내 말투에 맞게").split(".")[0].trim()} 대답해 볼게요.`,
      `네가 물은 “${message || "그 질문"}”은 내 마음을 다시 돌아보게 하네요.`,
      "내가 직접 본 장면과 느낀 마음 안에서만 말하자면, 말보다 행동에 더 많은 뜻이 숨어 있었어요.",
      "너는 그 장면에서 어떤 행동이 가장 눈에 남았나요?"
    ].join("\n");
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

  window.requestTitleScenarioTurn = async function requestTitleScenarioTurn(payload) {
    try {
      return await postJson("/api/adventure/title-scenario-turn", payload);
    } catch (error) {
      console.warn("[BookAdventure] Title scenario AI API unavailable.", error);
      throw error;
    }
  };

  window.talkToBookCharacter = async function talkToBookCharacter(payload) {
    try {
      const data = await postJson("/api/adventure/character-chat", payload);
      return data || { reply: buildPracticeCharacterReply(payload), mode: "practice" };
    } catch (error) {
      console.warn("[BookAdventure] Character chat API unavailable. Using practice reply.", error);
      return {
        reply: buildPracticeCharacterReply(payload),
        mode: "practice"
      };
    }
  };

  window.submitTitleScenarioToTeacher = async function submitTitleScenarioToTeacher(payload) {
    try {
      const data = await postJson("/api/adventure/title-scenario", payload);
      if (!data?.saved) {
        const localItem = saveTitleScenarioSubmissionLocally(payload);
        return {
          ...data,
          localSaved: true,
          localId: localItem.id,
          storage: data?.storage || "browser-local-storage"
        };
      }
      return data;
    } catch (error) {
      console.warn("[BookAdventure] Title scenario API unavailable. Saving locally.", error);
      const localItem = saveTitleScenarioSubmissionLocally(payload);
      return {
        ok: true,
        saved: false,
        localSaved: true,
        localId: localItem.id,
        storage: "browser-local-storage"
      };
    }
  };
})();
