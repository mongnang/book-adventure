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

    if (isOpenAIConfigured()) {
      try {
        answer = await completeChat(buildTurnMessages(payload), {
          temperature: 0.45,
          maxTokens: 700
        });
        mode = "azure-openai";
      } catch (error) {
        context.log(`Azure OpenAI fallback: ${error.message}`);
      }
    }

    if (!answer) {
      answer = buildPracticeAnswer(payload);
    }

    await saveAdventureEvent({
      type: "questionTurn",
      sessionId: payload.sessionId,
      bookId: payload.book.id,
      categoryId: payload.category?.id || "free",
      placeName: payload.place?.name || null,
      question: payload.question || payload.rawQuestion,
      answer,
      mode
    }, context);

    return json(200, {
      answer,
      mode,
      sessionId: payload.sessionId || null
    });
  }
});
