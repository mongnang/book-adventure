const test = require("node:test");
const assert = require("node:assert/strict");

const {
  OpenAIRequestError,
  buildChatCompletionsBody,
  buildResponsesBody,
  extractResponsesText
} = require("../src/shared/openai");
const { selectRelevantClues } = require("../src/shared/prompts");
const { safeErrorMessage } = require("../src/shared/telemetry");
const { saveAdventureEventDetailed } = require("../src/shared/store");

test("Responses API body uses the Azure/OpenAI GPT-5 options", () => {
  const body = buildResponsesBody(
    { deployment: "gpt-5-mini", mode: "v1" },
    [{ role: "system", content: "system" }, { role: "user", content: "hello" }],
    {
      maxTokens: 800,
      reasoningEffort: "minimal",
      verbosity: "low",
      responseFormat: { type: "json_object" }
    }
  );

  assert.equal(body.max_output_tokens, 800);
  assert.deepEqual(body.reasoning, { effort: "minimal" });
  assert.deepEqual(body.text, { format: { type: "json_object" }, verbosity: "low" });
  assert.match(body.instructions, /JSON object/);
});

test("Chat Completions body keeps the matching GPT-5 options", () => {
  const body = buildChatCompletionsBody(
    { deployment: "gpt-5-mini", mode: "deployment" },
    [{ role: "user", content: "hello" }],
    { maxTokens: 800, reasoningEffort: "minimal", verbosity: "low" }
  );

  assert.equal(body.max_completion_tokens, 800);
  assert.equal(body.reasoning_effort, "minimal");
  assert.equal(body.verbosity, "low");
});

test("Responses API text extraction handles output content", () => {
  assert.equal(extractResponsesText({ output_text: "complete answer" }), "complete answer");
  assert.equal(extractResponsesText({ output: [{ content: [{ type: "output_text", text: "part one" }, { value: "part two" }] }] }), "part one\npart two");
});

test("the OpenAI error type carries safe operational metadata", () => {
  const error = new OpenAIRequestError("failed", { code: "azure_openai_output_truncated", status: 200, requestId: "resp-1", durationMs: 12 });
  assert.equal(error.code, "azure_openai_output_truncated");
  assert.equal(error.requestId, "resp-1");
  assert.equal(error.durationMs, 12);
});

test("only the two most relevant source clues are selected", () => {
  const clues = [
    "허 생원이 봉평에서 겪은 오래전 기억",
    "동이가 어머니와 고향에 대해 하는 말",
    "조 선달의 반응",
    "메밀꽃밭의 분위기"
  ];
  const selected = selectRelevantClues(clues, "동이의 어머니와 고향은 어디인가요?", 2);
  assert.equal(selected.length, 2);
  assert.equal(selected[0], clues[1]);
});

test("telemetry removes credentials and endpoint host names", () => {
  const safe = safeErrorMessage({
    message: "api-key=secret123 Authorization:token456 Bearer abc.def https://private.openai.azure.com/path"
  });
  assert.doesNotMatch(safe, /secret123|token456|abc\.def|private\.openai/);
});

test("Cosmos save reports not configured without writing", async () => {
  const keys = ["COSMOS_ENDPOINT", "COSMOS_KEY", "COSMOS_DATABASE_NAME", "COSMOS_CONTAINER_NAME"];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  keys.forEach((key) => delete process.env[key]);
  try {
    const result = await saveAdventureEventDetailed({ type: "test" });
    assert.deepEqual({ saved: result.saved, configured: result.configured }, { saved: false, configured: false });
    assert.ok(result.durationMs >= 0);
  } finally {
    keys.forEach((key) => {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    });
  }
});
