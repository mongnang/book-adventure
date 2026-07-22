const { app } = require("@azure/functions");
const { aiUnavailable, badRequest, json, readJson } = require("../shared/http");
const { completeChatDetailed, isOpenAIConfigured } = require("../shared/openai");
const { buildCharacterChatMessages } = require("../shared/prompts");
const { saveAdventureEventDetailed } = require("../shared/store");
const { createRequestId, logEvent, safeErrorMessage } = require("../shared/telemetry");

app.http("characterChat", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/character-chat",
  handler: async (request, context) => {
    const startedAt = Date.now();
    const requestId = createRequestId(request, context);
    const route = "/api/adventure/character-chat";
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.", requestId);
    if (!payload.book?.id || !payload.character?.name || !payload.message) {
      return badRequest("book.id, character.name, and message are required.", requestId);
    }

    if (!isOpenAIConfigured()) {
      logEvent(context, { requestId, route, stage: "configuration", status: "error", errorCode: "azure_openai_not_configured", totalMs: Date.now() - startedAt });
      return aiUnavailable(requestId, { error: "azure_openai_not_configured", stage: "configuration" });
    }

    let reply = "";
    let openaiResult;
    try {
      openaiResult = await completeChatDetailed(buildCharacterChatMessages(payload), {
        temperature: 0.56,
        maxTokens: 800,
        reasoningEffort: "minimal",
        verbosity: "low"
      });
      reply = String(openaiResult.text || "").trim();
      if (!reply) throw new Error("Azure OpenAI returned an empty character reply.");
    } catch (error) {
      logEvent(context, {
        requestId, route, stage: "azure-openai", status: "error",
        httpStatus: error.status || 503,
        errorCode: error.code || "azure_openai_empty_response",
        errorMessage: safeErrorMessage(error), openaiMs: error.durationMs,
        openaiRequestId: error.requestId, totalMs: Date.now() - startedAt
      });
      return aiUnavailable(requestId, { error: error.code || "azure_openai_error", status: error.status >= 500 ? 502 : 503 });
    }

    const cosmosResult = await saveAdventureEventDetailed({
      type: "characterChatTurn",
      activityId: "character-chat",
      sessionId: payload.sessionId,
      student: payload.student || null,
      bookId: payload.book.id,
      bookTitle: payload.book.title || "",
      characterName: payload.character.name,
      characterRole: payload.character.role || "",
      characterRules: payload.characterRules || null,
      studentMessage: payload.message,
      characterReply: reply,
      conversation: Array.isArray(payload.conversation) ? payload.conversation.slice(-16) : [],
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
      reply,
      mode: "azure-openai",
      sessionId: payload.sessionId || null,
      requestId,
      saved: cosmosResult.saved,
      timings: { openaiMs: openaiResult.durationMs, cosmosMs: cosmosResult.durationMs, totalMs: Date.now() - startedAt }
    }, { "x-request-id": requestId });
  }
});
