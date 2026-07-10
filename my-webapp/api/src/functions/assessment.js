const { app } = require("@azure/functions");
const { aiUnavailable, badRequest, json, readJson } = require("../shared/http");
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

const ASSESSMENT_RUBRIC = [
  { id: "inquiry", label: "질문 태도" },
  { id: "conclusion", label: "추리 결론" },
  { id: "rational-inference", label: "합리적 추론" }
];

function normalizeAssessment(result) {
  if (!result || !Array.isArray(result.scores)) return null;

  const normalizedScores = ASSESSMENT_RUBRIC.map((rubric, index) => {
    const item = result.scores.find((score) => score?.id === rubric.id || score?.label === rubric.label)
      || result.scores[index];
    if (!item) return null;

    return {
      id: rubric.id,
      label: rubric.label,
      score: Math.max(0, Math.min(5, Number(item.score || 0))),
      comment: String(item.comment || "")
    };
  });

  if (normalizedScores.some((item) => !item)) return null;

  const maxScore = ASSESSMENT_RUBRIC.length * 5;
  const totalScore = normalizedScores.reduce((sum, item) => sum + item.score, 0);

  return {
    totalScore,
    maxScore,
    scores: normalizedScores,
    summary: String(result.summary || ""),
    nextStep: String(result.nextStep || "")
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

    if (!isOpenAIConfigured()) return aiUnavailable();

    let assessment = null;
    try {
      const text = await completeChat(buildAssessmentMessages(payload), {
        temperature: 0.15,
        maxTokens: 850,
        responseFormat: { type: "json_object" }
      });
      assessment = normalizeAssessment(parseJsonObject(text));
      if (!assessment) throw new Error("Azure OpenAI returned an invalid assessment.");
    } catch (error) {
      context.log(`Azure OpenAI assessment failed: ${error.message}`);
      return aiUnavailable();
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
      mode: "azure-openai"
    }, context);

    return json(200, {
      ...assessment,
      mode: "azure-openai",
      sessionId: payload.sessionId || null
    });
  }
});
