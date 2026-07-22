const { app } = require("@azure/functions");
const { aiUnavailable, badRequest, json, readJson } = require("../shared/http");
const { checkKnownAnswer } = require("../shared/demo");
const { completeChat, isOpenAIConfigured } = require("../shared/openai");
const { buildAnswerCheckMessages } = require("../shared/prompts");
const { saveAdventureEvent } = require("../shared/store");

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

app.http("checkAnswer", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/check-answer",
  handler: async (request, context) => {
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.");
    if (!payload.book?.id || !payload.answer) {
      return badRequest("book.id and answer are required.");
    }

    let result = checkKnownAnswer(payload);
    let mode = result ? "known-rule" : "azure-openai";

    if (!result && !isOpenAIConfigured()) return aiUnavailable();

    if (!result) {
      try {
        const text = await completeChat(buildAnswerCheckMessages(payload), {
          temperature: 0.1,
          maxTokens: 300,
          reasoningEffort: "minimal",
          verbosity: "low",
          responseFormat: { type: "json_object" }
        });
        const parsed = parseJsonObject(text);
        if (parsed) {
          result = {
            correct: Boolean(parsed.correct),
            message: String(parsed.message || "답을 확인했어요.")
          };
        } else {
          throw new Error("Azure OpenAI returned an invalid answer check.");
        }
      } catch (error) {
        context.log(`Azure OpenAI answer check failed: ${error.message}`);
        return aiUnavailable();
      }
    }

    await saveAdventureEvent({
      type: "answerCheck",
      sessionId: payload.sessionId,
      student: payload.student || null,
      bookId: payload.book.id,
      answer: payload.answer,
      correct: result.correct,
      message: result.message,
      progress: payload.progress || null,
      conversation: Array.isArray(payload.conversation) ? payload.conversation.slice(-12) : [],
      mode
    }, context);

    return json(200, {
      ...result,
      mode,
      sessionId: payload.sessionId || null
    });
  }
});
