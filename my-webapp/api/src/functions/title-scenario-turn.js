const { app } = require("@azure/functions");
const { aiUnavailable, badRequest, json, readJson } = require("../shared/http");
const { completeChatDetailed, isOpenAIConfigured } = require("../shared/openai");
const { buildTitleScenarioMessages } = require("../shared/prompts");
const { saveAdventureEventDetailed } = require("../shared/store");
const { createRequestId, logEvent, safeErrorMessage } = require("../shared/telemetry");

function parseJsonObject(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    const match = String(text || "").match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch (innerError) {
      return null;
    }
  }
}

function normalizePrompt(prompt, fallback = null) {
  if (!prompt || typeof prompt !== "object") return fallback;

  return {
    mood: String(prompt.mood || fallback?.mood || ""),
    scene: String(prompt.scene || fallback?.scene || ""),
    colors: String(prompt.colors || fallback?.colors || ""),
    ko: String(prompt.ko || fallback?.ko || ""),
    en: String(prompt.en || fallback?.en || "")
  };
}

function normalizeTitleScenarioResult(result, payload) {
  if (!result || typeof result !== "object") return null;

  const scenarioText = String(result.scenarioText || payload.scenarioText || "").trim();
  if (!scenarioText) return null;

  const nanoBananaPrompt = normalizePrompt(result.nanoBananaPrompt);
  if (payload.action === "prompt" && (!nanoBananaPrompt?.ko || !nanoBananaPrompt?.en)) return null;

  return {
    guideText: String(result.guideText || (payload.action === "prompt" ? "표지 프롬프트까지 완성했어요." : "학생의 상상을 살려 시나리오를 만들었어요.")),
    scenarioText,
    nanoBananaPrompt: payload.action === "prompt" ? nanoBananaPrompt : null
  };
}

const titleScenarioTurnDefinition = {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/title-scenario-turn",
  handler: async (request, context) => {
    const startedAt = Date.now();
    const requestId = createRequestId(request, context);
    const route = "/api/adventure/title-scenario-turn";
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.", requestId);
    if (!payload.book?.id) return badRequest("book.id is required.", requestId);
    if (!["draft", "revise", "prompt"].includes(payload.action)) {
      return badRequest("action must be draft, revise, or prompt.", requestId);
    }

    if (!isOpenAIConfigured()) {
      logEvent(context, { requestId, route, stage: "configuration", status: "error", errorCode: "azure_openai_not_configured", totalMs: Date.now() - startedAt });
      return aiUnavailable(requestId, { error: "azure_openai_not_configured", stage: "configuration" });
    }

    let result = null;
    let openaiResult;
    try {
      openaiResult = await completeChatDetailed(buildTitleScenarioMessages(payload), {
        temperature: 0.55,
        maxTokens: payload.action === "prompt" ? 1600 : 800,
        reasoningEffort: "minimal",
        verbosity: "low",
        responseFormat: { type: "json_object" }
      });
      result = normalizeTitleScenarioResult(parseJsonObject(openaiResult.text), payload);
      if (!result) throw new Error("Azure OpenAI returned an invalid title scenario result.");
    } catch (error) {
      logEvent(context, {
        requestId, route, stage: "azure-openai", status: "error",
        httpStatus: error.status || 503,
        errorCode: error.code || "azure_openai_invalid_response",
        errorMessage: safeErrorMessage(error), openaiMs: error.durationMs,
        openaiRequestId: error.requestId, totalMs: Date.now() - startedAt
      });
      return aiUnavailable(requestId, { error: error.code || "azure_openai_invalid_response", status: error.status >= 500 ? 502 : 503 });
    }

    const cosmosResult = await saveAdventureEventDetailed({
      type: "titleScenarioTurn",
      activityId: "title-scenario",
      sessionId: payload.sessionId,
      student: payload.student || null,
      bookId: payload.book.id,
      bookTitle: payload.book.title || "",
      action: payload.action,
      answers: payload.answers || null,
      scenarioText: result.scenarioText,
      nanoBananaPrompt: result.nanoBananaPrompt || null,
      revisionLabel: payload.revisionLabel || "",
      customRequest: payload.customRequest || "",
      conversation: Array.isArray(payload.conversation) ? payload.conversation.slice(-30) : [],
      mode: "azure-openai"
    }, context);

    logEvent(context, {
      requestId, route, stage: cosmosResult.saved ? "complete" : "cosmos-db",
      status: cosmosResult.saved ? "ok" : "warning", errorCode: cosmosResult.errorCode,
      errorMessage: cosmosResult.errorMessage, openaiMs: openaiResult.durationMs,
      cosmosMs: cosmosResult.durationMs, totalMs: Date.now() - startedAt,
      openaiRequestId: openaiResult.requestId
    });

    return json(200, {
      ok: true,
      mode: "azure-openai",
      sessionId: payload.sessionId || null,
      requestId,
      saved: cosmosResult.saved,
      timings: { openaiMs: openaiResult.durationMs, cosmosMs: cosmosResult.durationMs, totalMs: Date.now() - startedAt },
      ...result
    }, { "x-request-id": requestId });
  }
};

app.http("titleScenarioTurn", titleScenarioTurnDefinition);

module.exports = {
  normalizeTitleScenarioResult,
  parseJsonObject,
  titleScenarioTurnHandler: titleScenarioTurnDefinition.handler
};
