const { app } = require("@azure/functions");
const { badRequest, json, readJson } = require("../shared/http");
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
    let mode = result ? "known-rule" : "practice";

    if (!result && isOpenAIConfigured()) {
      try {
        const text = await completeChat(buildAnswerCheckMessages(payload), {
          temperature: 0.1,
          maxTokens: 300,
          responseFormat: { type: "json_object" }
        });
        const parsed = parseJsonObject(text);
        if (parsed) {
          result = {
            correct: Boolean(parsed.correct),
            message: String(parsed.message || "답을 확인했어요.")
          };
          mode = "azure-openai";
        }
      } catch (error) {
        context.log(`Azure OpenAI answer-check fallback: ${error.message}`);
      }
    }

    if (!result) {
      result = {
        correct: false,
        message: "이 책은 아직 자동 정답 규칙이 준비되지 않았어요. Azure AI Search로 원전 연결을 붙인 뒤 더 정확히 확인할 수 있어요."
      };
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
