const { app } = require("@azure/functions");
const { aiUnavailable, badRequest, json, readJson } = require("../shared/http");
const { completeChat, isOpenAIConfigured } = require("../shared/openai");
const { buildTitleScenarioMessages } = require("../shared/prompts");
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

function normalizePrompt(prompt, fallback = null) {
  if (!prompt || typeof prompt !== "object") return fallback;

  return {
    mood: String(prompt.mood || fallback?.mood || ""),
    scene: String(prompt.scene || fallback?.scene || ""),
    colors: String(prompt.colors || fallback?.colors || ""),
    ko: String(prompt.ko || fallback?.ko || ""),
    en: String(prompt.en || fallback?.en || "")
  };
}

function normalizeTitleScenarioResult(result, payload) {
  if (!result || typeof result !== "object") return null;

  const scenarioText = String(result.scenarioText || payload.scenarioText || "").trim();
  if (!scenarioText) return null;

  const nanoBananaPrompt = normalizePrompt(result.nanoBananaPrompt);
  if (payload.action === "prompt" && (!nanoBananaPrompt?.ko || !nanoBananaPrompt?.en)) return null;

  return {
    guideText: String(result.guideText || (payload.action === "prompt" ? "표지 프롬프트까지 완성했어요." : "학생의 상상을 살려 시나리오를 만들었어요.")),
    scenarioText,
    nanoBananaPrompt: payload.action === "prompt" ? nanoBananaPrompt : null
  };
}

app.http("titleScenarioTurn", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/title-scenario-turn",
  handler: async (request, context) => {
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.");
    if (!payload.book?.id) return badRequest("book.id is required.");
    if (!["draft", "revise", "prompt"].includes(payload.action)) {
      return badRequest("action must be draft, revise, or prompt.");
    }

    if (!isOpenAIConfigured()) return aiUnavailable();

    let result = null;
    try {
      const text = await completeChat(buildTitleScenarioMessages(payload), {
        temperature: 0.55,
        maxTokens: 1600,
        responseFormat: { type: "json_object" }
      });
      result = normalizeTitleScenarioResult(parseJsonObject(text), payload);
      if (!result) throw new Error("Azure OpenAI returned an invalid title scenario result.");
    } catch (error) {
      context.log(`Title scenario AI failed: ${error.message}`);
      return aiUnavailable();
    }

    await saveAdventureEvent({
      type: "titleScenarioTurn",
      activityId: "title-scenario",
      sessionId: payload.sessionId,
      student: payload.student || null,
      bookId: payload.book.id,
      bookTitle: payload.book.title || "",
      action: payload.action,
      answers: payload.answers || null,
      scenarioText: result.scenarioText,
      nanoBananaPrompt: result.nanoBananaPrompt || null,
      revisionLabel: payload.revisionLabel || "",
      customRequest: payload.customRequest || "",
      conversation: Array.isArray(payload.conversation) ? payload.conversation.slice(-30) : [],
      mode: "azure-openai"
    }, context);

    return json(200, {
      ok: true,
      mode: "azure-openai",
      sessionId: payload.sessionId || null,
      ...result
    });
  }
});
