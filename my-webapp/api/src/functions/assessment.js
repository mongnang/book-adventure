const { app } = require("@azure/functions");
const { badRequest, json, readJson } = require("../shared/http");
const { buildPracticeAssessment } = require("../shared/demo");
const { completeChat, isOpenAIConfigured } = require("../shared/openai");
const { buildAssessmentMessages } = require("../shared/prompts");
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

function normalizeAssessment(result, fallback) {
  const scores = Array.isArray(result?.scores) ? result.scores : fallback.scores;
  const maxScore = Number(fallback.maxScore || fallback.scores.length * 5 || 10);
  const normalizedScores = scores.slice(0, fallback.scores.length).map((item, index) => ({
    id: String(item.id || fallback.scores[index]?.id || `score-${index + 1}`),
    label: String(item.label || fallback.scores[index]?.label || "평가 항목"),
    score: Math.max(0, Math.min(5, Number(item.score || 0))),
    comment: String(item.comment || fallback.scores[index]?.comment || "")
  }));

  return {
    totalScore: Math.max(0, Math.min(maxScore, Number(result?.totalScore ?? normalizedScores.reduce((sum, item) => sum + item.score, 0)))),
    maxScore,
    scores: normalizedScores,
    summary: String(result?.summary || fallback.summary),
    nextStep: String(result?.nextStep || fallback.nextStep)
  };
}

app.http("conversationAssessment", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/assessment",
  handler: async (request, context) => {
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.");
    if (!payload.book?.id) return badRequest("book.id is required.");

    const fallback = buildPracticeAssessment(payload);
    let assessment = fallback;
    let mode = "practice";

    if (isOpenAIConfigured()) {
      try {
        const text = await completeChat(buildAssessmentMessages(payload), {
          temperature: 0.15,
          maxTokens: 650,
          responseFormat: { type: "json_object" }
        });
        const parsed = parseJsonObject(text);
        if (parsed) {
          assessment = normalizeAssessment(parsed, fallback);
          mode = "azure-openai";
        }
      } catch (error) {
        context.log(`Azure OpenAI assessment fallback: ${error.message}`);
      }
    }

    await saveAdventureEvent({
      type: "conversationAssessment",
      sessionId: payload.sessionId,
      student: payload.student || null,
      bookId: payload.book.id,
      answer: payload.answer || "",
      progress: payload.progress || null,
      conversation: Array.isArray(payload.conversation) ? payload.conversation.slice(-20) : [],
      assessment,
      mode
    }, context);

    return json(200, {
      ...assessment,
      mode,
      sessionId: payload.sessionId || null
    });
  }
});
