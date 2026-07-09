const { app } = require("@azure/functions");
const { badRequest, json, readJson } = require("../shared/http");
const { hasCosmosConfig, saveAdventureEvent } = require("../shared/store");

app.http("titleScenarioSubmission", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/title-scenario",
  handler: async (request, context) => {
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.");
    if (!payload.book?.id) return badRequest("book.id is required.");
    if (!payload.scenarioText) return badRequest("scenarioText is required.");
    if (!payload.nanoBananaPrompt && !payload.promptKo && !payload.promptEn) {
      return badRequest("nanoBananaPrompt or prompt text is required.");
    }

    const saved = await saveAdventureEvent({
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

    return json(200, {
      ok: true,
      saved,
      storage: saved ? "cosmos-db" : hasCosmosConfig() ? "cosmos-db-error" : "not-configured",
      database: process.env.COSMOS_DATABASE_NAME || "",
      container: process.env.COSMOS_CONTAINER_NAME || "",
      itemType: "titleScenarioSubmission",
      sessionId: payload.sessionId || null
    });
  }
});
