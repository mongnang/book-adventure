const { app } = require("@azure/functions");
const { badRequest, json, readJson } = require("../shared/http");
const { hasCosmosConfig, saveAdventureEventDetailed } = require("../shared/store");
const { createRequestId, logEvent } = require("../shared/telemetry");

const titleScenarioSubmissionDefinition = {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/title-scenario",
  handler: async (request, context) => {
    const startedAt = Date.now();
    const requestId = createRequestId(request, context);
    const route = "/api/adventure/title-scenario";
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.", requestId);
    if (!payload.book?.id) return badRequest("book.id is required.", requestId);
    if (!payload.scenarioText) return badRequest("scenarioText is required.", requestId);
    if (!payload.nanoBananaPrompt && !payload.promptKo && !payload.promptEn) {
      return badRequest("nanoBananaPrompt or prompt text is required.", requestId);
    }

    const cosmosResult = await saveAdventureEventDetailed({
      type: "titleScenarioSubmission",
      activityId: "title-scenario",
      sessionId: payload.sessionId,
      student: payload.student || null,
      bookId: payload.book.id,
      bookTitle: payload.book.title || "",
      bookAuthor: payload.book.author || "",
      answers: payload.answers || null,
      scenarioText: payload.scenarioText,
      nanoBananaPrompt: payload.nanoBananaPrompt || null,
      promptKo: payload.promptKo || payload.nanoBananaPrompt?.ko || "",
      promptEn: payload.promptEn || payload.nanoBananaPrompt?.en || "",
      conversation: Array.isArray(payload.conversation) ? payload.conversation.slice(-30) : [],
      revisionCount: Number(payload.revisionCount || 0),
      clientTimestamp: payload.clientTimestamp || null
    }, context);
    const saved = cosmosResult.saved;

    logEvent(context, {
      requestId, route, stage: saved ? "complete" : "cosmos-db",
      status: saved ? "ok" : "error", errorCode: cosmosResult.errorCode || (cosmosResult.configured ? "cosmos_save_failed" : "cosmos_not_configured"),
      errorMessage: cosmosResult.errorMessage, cosmosMs: cosmosResult.durationMs,
      totalMs: Date.now() - startedAt
    });

    return json(200, {
      ok: true,
      saved,
      storage: saved ? "cosmos-db" : hasCosmosConfig() ? "cosmos-db-error" : "not-configured",
      itemType: "titleScenarioSubmission",
      sessionId: payload.sessionId || null,
      requestId,
      timings: { cosmosMs: cosmosResult.durationMs, totalMs: Date.now() - startedAt }
    }, { "x-request-id": requestId });
  }
};

app.http("titleScenarioSubmission", titleScenarioSubmissionDefinition);

module.exports = {
  titleScenarioSubmissionHandler: titleScenarioSubmissionDefinition.handler
};
