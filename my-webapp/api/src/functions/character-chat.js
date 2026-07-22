const { app } = require("@azure/functions");
const { aiUnavailable, badRequest, json, readJson } = require("../shared/http");
const { completeChat, isOpenAIConfigured } = require("../shared/openai");
const { buildCharacterChatMessages } = require("../shared/prompts");
const { saveAdventureEvent } = require("../shared/store");

app.http("characterChat", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/character-chat",
  handler: async (request, context) => {
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.");
    if (!payload.book?.id || !payload.character?.name || !payload.message) {
      return badRequest("book.id, character.name, and message are required.");
    }

    if (!isOpenAIConfigured()) return aiUnavailable();

    let reply = "";
    try {
      const aiReply = await completeChat(buildCharacterChatMessages(payload), {
        temperature: 0.56,
        maxTokens: 800,
        reasoningEffort: "minimal",
        verbosity: "low"
      });
      reply = String(aiReply || "").trim();
      if (!reply) throw new Error("Azure OpenAI returned an empty character reply.");
    } catch (error) {
      context.log(`Azure OpenAI character chat failed: ${error.message}`);
      return aiUnavailable();
    }

    await saveAdventureEvent({
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

    return json(200, {
      reply,
      mode: "azure-openai",
      sessionId: payload.sessionId || null
    });
  }
});
