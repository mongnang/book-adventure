const { app } = require("@azure/functions");
const { aiUnavailable, badRequest, json, readJson } = require("../shared/http");
const { completeChatDetailed, isOpenAIConfigured } = require("../shared/openai");
const { buildTurnMessages } = require("../shared/prompts");
const { saveAdventureEventDetailed } = require("../shared/store");
const { createRequestId, logEvent, safeErrorMessage } = require("../shared/telemetry");

app.http("adventureTurn", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/turn",
  handler: async (request, context) => {
    const startedAt = Date.now();
    const requestId = createRequestId(request, context);
    const route = "/api/adventure/turn";
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.", requestId);
    if (!payload.book?.id || !(payload.question || payload.rawQuestion)) {
      return badRequest("book.id and question are required.", requestId);
    }

    if (!isOpenAIConfigured()) {
      logEvent(context, { requestId, route, stage: "configuration", status: "error", errorCode: "azure_openai_not_configured", totalMs: Date.now() - startedAt });
      return aiUnavailable(requestId, { error: "azure_openai_not_configured", stage: "configuration" });
    }

    let answer = "";
    let openaiResult;
    try {
      openaiResult = await completeChatDetailed(buildTurnMessages(payload), {
        temperature: 0.45,
        maxTokens: 800,
        reasoningEffort: "minimal",
        verbosity: "low"
      });
      answer = String(openaiResult.text || "").trim();
      if (!answer) throw new Error("Azure OpenAI returned an empty answer.");
    } catch (error) {
      logEvent(context, {
        requestId,
        route,
        stage: "azure-openai",
        status: "error",
        httpStatus: error.status || 503,
        errorCode: error.code || "azure_openai_empty_response",
        errorMessage: safeErrorMessage(error),
        openaiMs: error.durationMs,
        openaiRequestId: error.requestId,
        totalMs: Date.now() - startedAt
      });
      return aiUnavailable(requestId, { error: error.code || "azure_openai_error", status: error.status >= 500 ? 502 : 503 });
    }

    const cosmosResult = await saveAdventureEventDetailed({
      type: "questionTurn",
      sessionId: payload.sessionId,
      student: payload.student || null,
      bookId: payload.book.id,
      categoryId: payload.category?.id || "free",
      placeName: payload.place?.name || null,
      characterName: payload.character?.name || null,
      progress: payload.progress || null,
      conversation: Array.isArray(payload.conversation) ? payload.conversation.slice(-12) : [],
      question: payload.question || payload.rawQuestion,
      answer,
      mode: "azure-openai"
    }, context);

    logEvent(context, {
      requestId,
      route,
      stage: cosmosResult.saved ? "complete" : "cosmos-db",
      status: cosmosResult.saved ? "ok" : "warning",
      errorCode: cosmosResult.errorCode,
      errorMessage: cosmosResult.errorMessage,
      openaiMs: openaiResult.durationMs,
      cosmosMs: cosmosResult.durationMs,
      totalMs: Date.now() - startedAt,
      openaiRequestId: openaiResult.requestId
    });

    return json(200, {
      answer,
      mode: "azure-openai",
      sessionId: payload.sessionId || null,
      requestId,
      saved: cosmosResult.saved,
      timings: {
        openaiMs: openaiResult.durationMs,
        cosmosMs: cosmosResult.durationMs,
        totalMs: Date.now() - startedAt
      }
    }, { "x-request-id": requestId });
  }
});
