const { app } = require("@azure/functions");
const { badRequest, json, readJson } = require("../shared/http");
const { buildPracticeCharacterReply } = require("../shared/demo");
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

    let reply = "";
    let mode = "practice";
    let openAIError = "";

    if (isOpenAIConfigured()) {
      try {
        const aiReply = await completeChat(buildCharacterChatMessages(payload), {
          temperature: 0.56,
          maxTokens: 1200
        });
        if (aiReply && aiReply.trim()) {
          reply = aiReply.trim();
          mode = "azure-openai";
        } else {
          openAIError = "Azure OpenAI returned an empty character reply.";
          context.log(`Azure OpenAI character chat fallback: ${openAIError}`);
        }
      } catch (error) {
        openAIError = error.message;
        context.log(`Azure OpenAI character chat fallback: ${openAIError}`);
      }
    }

    if (!reply) {
      reply = buildPracticeCharacterReply(payload);
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
      mode
    }, context);

    return json(200, {
      reply,
      mode,
      openAIError: openAIError ? openAIError.slice(0, 700) : "",
      sessionId: payload.sessionId || null
    });
  }
});
