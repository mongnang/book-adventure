(function () {
  const SESSION_KEY = "book-adventure-session-id";
  const TITLE_SCENARIO_SUBMISSIONS_KEY = "book-adventure-title-scenario-submissions";
  const AI_UNAVAILABLE_MESSAGE = "AI와 연결이 불안정합니다. 다시 시도해보세요.";

  function createSessionId() {
    return window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getSessionId() {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const nextId = createSessionId();
    window.sessionStorage.setItem(SESSION_KEY, nextId);
    return nextId;
  }

  function startParticipation() {
    const nextId = createSessionId();
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

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || AI_UNAVAILABLE_MESSAGE);
    }

    return data;
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

  window.startBookAdventureParticipation = function startBookAdventureParticipation() {
    return startParticipation();
  };

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
    const data = await postJson("/api/adventure/turn", payload);
    const answer = String(data.answer || data.message || "").trim();
    if (!answer) throw new Error(AI_UNAVAILABLE_MESSAGE);
    return answer;
  };

  window.checkReadingAnswerWithAgent = async function checkReadingAnswerWithAgent(payload) {
    const data = await postJson("/api/adventure/check-answer", payload);
    return {
      correct: Boolean(data.correct),
      message: data.message || "답을 확인했어요."
    };
  };

  window.assessAdventureConversation = async function assessAdventureConversation(payload) {
    const data = await postJson("/api/adventure/assessment", payload);
    if (!Array.isArray(data.scores) || !data.scores.length) {
      throw new Error(AI_UNAVAILABLE_MESSAGE);
    }
    return data;
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
    const data = await postJson("/api/adventure/character-chat", payload);
    const reply = String(data.reply || data.answer || "").trim();
    if (!reply) throw new Error(AI_UNAVAILABLE_MESSAGE);
    return data;
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
