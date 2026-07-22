const test = require("node:test");
const assert = require("node:assert/strict");

const { titleScenarioTurnHandler } = require("../src/functions/title-scenario-turn");
const { titleScenarioSubmissionHandler } = require("../src/functions/title-scenario");

const ENV_KEYS = [
  "AZURE_OPENAI_ENDPOINT",
  "AZURE_OPENAI_API_KEY",
  "AZURE_OPENAI_DEPLOYMENT",
  "AZURE_OPENAI_MODEL",
  "AZURE_OPENAI_CHAT_URL",
  "COSMOS_ENDPOINT",
  "COSMOS_KEY",
  "COSMOS_DATABASE_NAME",
  "COSMOS_CONTAINER_NAME"
];

function saveEnvironment() {
  return Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
}

function restoreEnvironment(previous) {
  ENV_KEYS.forEach((key) => {
    if (previous[key] === undefined) delete process.env[key];
    else process.env[key] = previous[key];
  });
}

function createRequest(payload, requestId = "test-request-0001") {
  return {
    headers: new Headers({ "x-request-id": requestId }),
    json: async () => payload
  };
}

function createContext() {
  const logs = [];
  return {
    logs,
    invocationId: "test-invocation",
    log: (value) => logs.push(String(value))
  };
}

function promptPayload() {
  return {
    action: "prompt",
    sessionId: "session-test",
    student: { className: "1", number: "2", nickname: "비밀별명" },
    book: { id: "memil", title: "메밀꽃 필 무렵", author: "이효석" },
    answers: { character: "여행자", setting: "달빛길", event: "편지를 발견한다" },
    scenarioText: "학생이 만든 비밀 시나리오"
  };
}

test("activity 1 prompt request returns complete data and safe timing metadata", async () => {
  const previous = saveEnvironment();
  const originalFetch = global.fetch;
  process.env.AZURE_OPENAI_ENDPOINT = "https://example.openai.azure.com/openai/v1";
  process.env.AZURE_OPENAI_API_KEY = "not-a-real-key";
  process.env.AZURE_OPENAI_DEPLOYMENT = "gpt-5-mini";
  ["COSMOS_ENDPOINT", "COSMOS_KEY", "COSMOS_DATABASE_NAME", "COSMOS_CONTAINER_NAME"].forEach((key) => delete process.env[key]);
  global.fetch = async (url, init) => {
    const body = JSON.parse(init.body);
    assert.equal(String(url), "https://example.openai.azure.com/openai/v1/responses");
    assert.deepEqual(body.reasoning, { effort: "minimal" });
    assert.equal(body.text.verbosity, "low");
    assert.equal(body.max_output_tokens, 1600);
    return new Response(JSON.stringify({
      id: "resp_test_1",
      output_text: JSON.stringify({
        guideText: "완성했어요.",
        scenarioText: "학생이 만든 비밀 시나리오",
        nanoBananaPrompt: {
          mood: "신비로움",
          scene: "달빛 길",
          colors: "남색과 금색",
          ko: "달빛 길을 걷는 여행자와 편지",
          en: "A traveler and a letter on a moonlit road"
        }
      })
    }), { status: 200, headers: { "x-request-id": "azure-request-1" } });
  };

  try {
    const context = createContext();
    const response = await titleScenarioTurnHandler(createRequest(promptPayload()), context);
    assert.equal(response.status, 200);
    assert.equal(response.jsonBody.ok, true);
    assert.equal(response.jsonBody.nanoBananaPrompt.ko, "달빛 길을 걷는 여행자와 편지");
    assert.equal(response.jsonBody.nanoBananaPrompt.en, "A traveler and a letter on a moonlit road");
    assert.equal(response.jsonBody.saved, false);
    assert.ok(response.jsonBody.timings.openaiMs >= 0);
    assert.ok(response.jsonBody.timings.cosmosMs >= 0);
    assert.ok(response.jsonBody.timings.totalMs >= 0);
    assert.match(context.logs.join("\n"), /"openaiRequestId":"resp_test_1"/);
    assert.doesNotMatch(context.logs.join("\n"), /비밀별명|학생이 만든 비밀 시나리오|not-a-real-key/);
  } finally {
    global.fetch = originalFetch;
    restoreEnvironment(previous);
  }
});

test("activity 1 distinguishes an Azure OpenAI HTTP error", async () => {
  const previous = saveEnvironment();
  const originalFetch = global.fetch;
  process.env.AZURE_OPENAI_ENDPOINT = "https://example.openai.azure.com/openai/v1";
  process.env.AZURE_OPENAI_API_KEY = "not-a-real-key";
  process.env.AZURE_OPENAI_DEPLOYMENT = "gpt-5-mini";
  global.fetch = async () => new Response(JSON.stringify({
    error: { code: "rate_limit_exceeded", message: "Try later" }
  }), { status: 429, headers: { "x-request-id": "azure-request-429" } });

  try {
    const context = createContext();
    const response = await titleScenarioTurnHandler(createRequest(promptPayload(), "test-request-0429"), context);
    assert.equal(response.status, 503);
    assert.equal(response.jsonBody.error, "rate_limit_exceeded");
    assert.equal(response.jsonBody.stage, "azure-openai");
    assert.equal(response.jsonBody.requestId, "test-request-0429");
    assert.match(context.logs.join("\n"), /rate_limit_exceeded/);
    assert.doesNotMatch(context.logs.join("\n"), /Try later|비밀별명/);
  } finally {
    global.fetch = originalFetch;
    restoreEnvironment(previous);
  }
});

test("activity 1 submission reports Cosmos not configured without losing the request", async () => {
  const previous = saveEnvironment();
  ["COSMOS_ENDPOINT", "COSMOS_KEY", "COSMOS_DATABASE_NAME", "COSMOS_CONTAINER_NAME"].forEach((key) => delete process.env[key]);
  try {
    const context = createContext();
    const payload = {
      ...promptPayload(),
      nanoBananaPrompt: { ko: "한국어 프롬프트", en: "English prompt" },
      promptKo: "한국어 프롬프트",
      promptEn: "English prompt"
    };
    const response = await titleScenarioSubmissionHandler(createRequest(payload, "test-request-save"), context);
    assert.equal(response.status, 200);
    assert.equal(response.jsonBody.saved, false);
    assert.equal(response.jsonBody.storage, "not-configured");
    assert.equal(response.jsonBody.requestId, "test-request-save");
    assert.match(context.logs.join("\n"), /cosmos_not_configured/);
    assert.doesNotMatch(context.logs.join("\n"), /한국어 프롬프트|비밀별명/);
  } finally {
    restoreEnvironment(previous);
  }
});
