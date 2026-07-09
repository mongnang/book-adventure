const { app } = require("@azure/functions");
const { badRequest, json, readJson } = require("../shared/http");
const { buildPracticeAnswer } = require("../shared/demo");
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

    let answer;
    let mode = "practice";
    let openAIError = "";

    if (isOpenAIConfigured()) {
      try {
        answer = await completeChat(buildTurnMessages(payload), {
          temperature: 0.45,
          maxTokens: 360
        });
        mode = "azure-openai";
      } catch (error) {
        openAIError = error.message;
        context.log(`Azure OpenAI fallback: ${openAIError}`);
      }
    }

    if (!answer) {
      answer = buildPracticeAnswer(payload);
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
      mode
    }, context);

    return json(200, {
      answer,
      mode,
      openAIError: openAIError ? openAIError.slice(0, 700) : "",
      sessionId: payload.sessionId || null
    });
  }
});
