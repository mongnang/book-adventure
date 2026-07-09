const { app } = require("@azure/functions");
const { badRequest, json, readJson } = require("../shared/http");
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

function cleanAiText(text) {
  return String(text || "")
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

function buildPracticeScenario(payload) {
  const title = payload.book?.title || "선택한 책";
  const answers = payload.answers || {};
  const character = answers.character || "주인공";
  const setting = answers.setting || "신비로운 장소";
  const event = answers.event || "뜻밖의 사건";

  return [
    `「${title}」라는 제목을 들으면, ${setting}에서 ${character}이(가) ${event} 일을 마주하는 장면이 떠올라요.`,
    `처음에는 평범한 하루처럼 보이지만, 작은 단서 하나가 이야기를 움직이기 시작해요.`,
    `${character}은(는) 그 단서를 그냥 지나치지 않고 조심스럽게 따라가요.`,
    `길을 갈수록 제목 속 말이 점점 다른 뜻으로 느껴지고, 주변 풍경도 비밀을 품은 듯 보여요.`,
    `마지막에는 ${character}이(가) 처음보다 조금 더 용감한 마음으로 자신의 선택을 하게 돼요.`,
    `이 이야기는 아직 진짜 책을 읽기 전, 제목만 보고 만든 상상 속 줄거리예요.`
  ].join(" ");
}

function buildPracticePrompt(payload, scenarioText) {
  const title = payload.book?.title || "선택한 책";
  const answers = payload.answers || {};
  const scene = `${answers.setting || "신비로운 장소"}에서 ${answers.character || "주인공"}이(가) ${answers.event || "뜻밖의 사건"}의 단서를 발견하는 장면`;
  const mood = payload.revisionLabel?.includes("따뜻") ? "따뜻하고 감동적인" : payload.revisionLabel?.includes("반전") ? "신비롭고 반전이 있는" : "따뜻하고 신비로운";
  const colors = "달빛 금색, 짙은 갈색, 부드러운 크림색";

  return {
    mood,
    scene,
    colors,
    ko: [
      "[한국어 설명]",
      `- 분위기: ${mood}`,
      `- 그림 내용: ${scene}. ${String(scenarioText || "").slice(0, 150)}`,
      `- 색감: ${colors}`,
      `- 표지에 넣을 제목 글자: "${title}"`
    ].join("\n"),
    en: `A book cover illustration of ${scene}, ${mood}, ${colors}, with the title text "${title}" in an elegant storybook lettering style, children's book art.`
  };
}

function normalizeRawTextResult(text, payload) {
  const rawText = cleanAiText(text);
  if (!rawText) return null;

  if (payload.action === "prompt") {
    const scenarioText = payload.scenarioText || buildPracticeScenario(payload);
    const fallbackPrompt = buildPracticePrompt(payload, scenarioText);
    return {
      guideText: "AI 사서가 표지 프롬프트를 완성했어요.",
      scenarioText,
      nanoBananaPrompt: {
        ...fallbackPrompt,
        ko: rawText
      }
    };
  }

  return {
    guideText: payload.action === "revise"
      ? "AI 사서가 그 방향으로 다시 고쳐 쓴 시나리오예요."
      : "AI 사서가 네 상상을 살려 만든 가상 시나리오예요.",
    scenarioText: rawText,
    nanoBananaPrompt: null
  };
}

function normalizeTitleScenarioResult(result, payload) {
  const fallbackScenario = payload.scenarioText || buildPracticeScenario(payload);
  const scenarioText = String(result?.scenarioText || fallbackScenario).trim();
  const nanoBananaPrompt = normalizePrompt(result?.nanoBananaPrompt, payload.action === "prompt" ? buildPracticePrompt(payload, scenarioText) : null);

  return {
    guideText: String(result?.guideText || (payload.action === "prompt" ? "표지 프롬프트까지 완성했어요." : "학생의 상상을 살려 시나리오를 만들었어요.")),
    scenarioText,
    nanoBananaPrompt
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

    let result = normalizeTitleScenarioResult(null, payload);
    let mode = "practice";
    let openAIError = "";

    if (isOpenAIConfigured()) {
      try {
        const text = await completeChat(buildTitleScenarioMessages(payload), {
          temperature: 0.55,
          maxTokens: 1600,
          responseFormat: { type: "json_object" }
        });
        const parsed = parseJsonObject(text);
        if (parsed) {
          result = normalizeTitleScenarioResult(parsed, payload);
          mode = "azure-openai";
        } else if (text && text.trim()) {
          result = normalizeTitleScenarioResult(normalizeRawTextResult(text, payload), payload);
          mode = "azure-openai";
        } else {
          openAIError = "Azure OpenAI returned non-JSON content.";
          context.log(`Title scenario AI fallback: ${openAIError}`);
        }
      } catch (error) {
        openAIError = error.message;
        context.log(`Title scenario AI fallback: ${openAIError}`);
      }
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
      mode
    }, context);

    return json(200, {
      ok: true,
      mode,
      openAIError: openAIError ? openAIError.slice(0, 700) : "",
      sessionId: payload.sessionId || null,
      ...result
    });
  }
});
