(function () {
  const SESSION_KEY = "book-adventure-session-id";
  const TITLE_SCENARIO_SUBMISSIONS_KEY = "book-adventure-title-scenario-submissions";
  const AI_UNAVAILABLE_MESSAGE = "AI와 연결이 불안정합니다. 다시 시도해보세요.";
  const DEFAULT_TIMEOUT_MS = 45000;

  class BookAdventureApiError extends Error {
    constructor(message, details = {}) {
      super(message);
      this.name = "BookAdventureApiError";
      this.code = details.code || "unknown_error";
      this.stage = details.stage || "unknown";
      this.apiPath = details.apiPath || "";
      this.status = details.status || 0;
      this.requestId = details.requestId || "";
      this.durationMs = details.durationMs || 0;
      this.retryable = details.retryable !== false;
    }
  }

  function createRequestId() {
    return window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `request-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function logApiFailure(error) {
    console.warn("[BookAdventure] API request failed.", {
      stage: error.stage,
      apiPath: error.apiPath,
      status: error.status || undefined,
      errorCode: error.code,
      requestId: error.requestId,
      durationMs: error.durationMs,
      message: String(error.message || "").replace(/[\r\n\t]+/g, " ").slice(0, 180)
    });
  }

  function responseDataError(path, message = "서버 응답 데이터 형식이 올바르지 않습니다.") {
    const error = new BookAdventureApiError(message, {
      code: "response_data_error",
      stage: "response-data",
      apiPath: path
    });
    logApiFailure(error);
    return error;
  }

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
    const startedAt = performance.now();
    const requestId = createRequestId();
    const controller = new AbortController();
    const timeoutMs = Number(window.__BOOK_ADVENTURE_API_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
    let response;

    try {
      response = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-request-id": requestId
        },
        body: JSON.stringify({
          ...payload,
          sessionId: getSessionId(),
          clientTimestamp: new Date().toISOString()
        }),
        signal: controller.signal
      });
    } catch (cause) {
      const error = new BookAdventureApiError(
        cause?.name === "AbortError" ? "요청 시간이 초과되었습니다." : "서버에 연결하지 못했습니다.",
        {
          code: cause?.name === "AbortError" ? "request_timeout" : "network_error",
          stage: cause?.name === "AbortError" ? "timeout" : "network",
          apiPath: path,
          requestId,
          durationMs: Math.round(performance.now() - startedAt)
        }
      );
      logApiFailure(error);
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }

    const durationMs = Math.round(performance.now() - startedAt);
    const responseRequestId = response.headers.get("x-request-id") || requestId;
    const rawText = await response.text();
    let data = {};

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch (cause) {
        const error = new BookAdventureApiError("서버 응답 형식을 읽을 수 없습니다.", {
          code: "response_json_error",
          stage: "response-json",
          apiPath: path,
          status: response.status,
          requestId: responseRequestId,
          durationMs
        });
        logApiFailure(error);
        throw error;
      }
    }

    if (!response.ok) {
      const serverCode = String(data.error || (response.status >= 500 ? "server_error" : "http_error"));
      const isAzureError = serverCode.startsWith("azure_openai") || data.stage === "azure-openai";
      const error = new BookAdventureApiError(
        String(data.message || (isAzureError ? AI_UNAVAILABLE_MESSAGE : `서버가 요청을 처리하지 못했습니다. (${response.status})`)),
        {
          code: isAzureError ? serverCode : response.status >= 500 ? "server_error" : "http_error",
          stage: isAzureError ? "azure-openai" : response.status >= 500 ? "server" : "http",
          apiPath: path,
          status: response.status,
          requestId: responseRequestId,
          durationMs,
          retryable: data.retryable !== false
        }
      );
      logApiFailure(error);
      throw error;
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      const error = new BookAdventureApiError("서버 응답 데이터 형식이 올바르지 않습니다.", {
        code: "response_data_error",
        stage: "response-data",
        apiPath: path,
        status: response.status,
        requestId: responseRequestId,
        durationMs
      });
      logApiFailure(error);
      throw error;
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
    const path = "/api/adventure/turn";
    const data = await postJson(path, payload);
    const answer = String(data.answer || data.message || "").trim();
    if (!answer) throw responseDataError(path);
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
    const path = "/api/adventure/assessment";
    const data = await postJson(path, payload);
    if (!Array.isArray(data.scores) || !data.scores.length) {
      throw responseDataError(path);
    }
    return data;
  };

  window.requestTitleScenarioTurn = async function requestTitleScenarioTurn(payload) {
    const path = "/api/adventure/title-scenario-turn";
    const data = await postJson(path, payload);
    const scenarioText = String(data.scenarioText || "").trim();
    const prompt = data.nanoBananaPrompt;
    if (!scenarioText || (payload.action === "prompt" && (!prompt?.ko || !prompt?.en))) {
      throw responseDataError(path);
    }
    return data;
  };

  window.talkToBookCharacter = async function talkToBookCharacter(payload) {
    const path = "/api/adventure/character-chat";
    const data = await postJson(path, payload);
    const reply = String(data.reply || data.answer || "").trim();
    if (!reply) throw responseDataError(path);
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

  window.BookAdventureApiError = BookAdventureApiError;
  window.formatBookAdventureApiError = function formatBookAdventureApiError(error, action = "요청") {
    const retry = "잠시 후 같은 버튼을 눌러 다시 시도해 주세요.";
    switch (error?.code) {
      case "network_error":
        return `인터넷 또는 서버 연결을 확인할 수 없어요. 연결을 확인한 뒤 ${retry}`;
      case "request_timeout":
        return `${action} 시간이 너무 오래 걸렸어요. ${retry}`;
      case "response_json_error":
      case "response_data_error":
        return `서버 응답을 읽는 중 문제가 생겼어요. ${retry}`;
      case "azure_openai_not_configured":
        return `AI 연결 설정을 확인하고 있어요. 선생님께 알린 뒤 ${retry}`;
      default:
        if (error?.stage === "azure-openai" || String(error?.code || "").startsWith("azure_openai")) {
          return `AI가 답을 만드는 중 문제가 생겼어요. ${retry}`;
        }
        if (error?.stage === "server") {
          return `서버 안에서 문제가 생겼어요. ${retry}`;
        }
        if (error?.stage === "http") {
          return `서버가 요청을 처리하지 못했어요${error.status ? ` (${error.status})` : ""}. ${retry}`;
        }
        return `${action} 중 문제가 생겼어요. ${retry}`;
    }
  };
})();
