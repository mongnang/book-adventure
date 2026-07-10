const { app } = require("@azure/functions");
const { aiUnavailable, badRequest, json, readJson } = require("../shared/http");
const { completeChat, isOpenAIConfigured } = require("../shared/openai");
const { buildTurnMessages } = require("../shared/prompts");
const { saveAdventureEvent } = require("../shared/store");

app.http("adventureTurn", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/turn",
  handler: async (request, context) => {
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.");
    if (!payload.book?.id || !(payload.question || payload.rawQuestion)) {
      return badRequest("book.id and question are required.");
    }

    if (!isOpenAIConfigured()) return aiUnavailable();

    let answer = "";
    try {
      const aiAnswer = await completeChat(buildTurnMessages(payload), {
        temperature: 0.45,
        maxTokens: 1400
      });
      answer = String(aiAnswer || "").trim();
      if (!answer) throw new Error("Azure OpenAI returned an empty answer.");
    } catch (error) {
      context.log(`Azure OpenAI turn failed: ${error.message}`);
      return aiUnavailable();
    }

    await saveAdventureEvent({
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

    return json(200, {
      answer,
      mode: "azure-openai",
      sessionId: payload.sessionId || null
    });
  }
});
