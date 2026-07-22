const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const { performance } = require("node:perf_hooks");
const { webcrypto } = require("node:crypto");

const clientSource = fs.readFileSync(path.join(__dirname, "..", "..", "agent-client.js"), "utf8");

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value))
  };
}

function loadClient(fetchImpl, timeoutMs = 100) {
  const warnings = [];
  const window = {
    crypto: webcrypto,
    sessionStorage: createStorage(),
    localStorage: createStorage(),
    setTimeout,
    clearTimeout,
    __BOOK_ADVENTURE_API_TIMEOUT_MS: timeoutMs
  };
  const context = {
    AbortController,
    Blob,
    Date,
    Math,
    Response,
    URL,
    console: { warn: (...args) => warnings.push(args) },
    fetch: fetchImpl,
    performance,
    setTimeout,
    clearTimeout,
    window
  };
  vm.runInNewContext(clientSource, context, { filename: "agent-client.js" });
  return { window, warnings };
}

const payload = {
  action: "prompt",
  book: { id: "memil", title: "메밀꽃 필 무렵" }
};

function successResponse() {
  return new Response(JSON.stringify({
    scenarioText: "달빛 아래 메밀꽃밭을 걷는다.",
    nanoBananaPrompt: { ko: "달빛 메밀꽃밭", en: "moonlit buckwheat field" }
  }), { status: 200, headers: { "content-type": "application/json", "x-request-id": "server-request-123" } });
}

test("browser client accepts a valid image-prompt response", async () => {
  const { window } = loadClient(async () => successResponse());
  const result = await window.requestTitleScenarioTurn(payload);
  assert.equal(result.nanoBananaPrompt.ko, "달빛 메밀꽃밭");
});

test("browser client distinguishes network, HTTP, server, Azure, JSON, and data failures", async (t) => {
  const cases = [
    ["network", async () => { throw new TypeError("network down"); }, "network_error", "network", 0],
    ["http", async () => new Response(JSON.stringify({ error: "bad_request", message: "bad" }), { status: 400 }), "http_error", "http", 400],
    ["server", async () => new Response(JSON.stringify({ error: "server_error", message: "failed" }), { status: 500 }), "server_error", "server", 500],
    ["azure", async () => new Response(JSON.stringify({ error: "azure_openai_timeout", stage: "azure-openai" }), { status: 503 }), "azure_openai_timeout", "azure-openai", 503],
    ["json", async () => new Response("not-json", { status: 200 }), "response_json_error", "response-json", 200],
    ["data", async () => new Response(JSON.stringify({ scenarioText: "only scenario" }), { status: 200 }), "response_data_error", "response-data", 0]
  ];

  for (const [name, fetchImpl, code, stage, status] of cases) {
    await t.test(name, async () => {
      const { window, warnings } = loadClient(fetchImpl);
      await assert.rejects(window.requestTitleScenarioTurn(payload), (error) => {
        assert.equal(error.code, code);
        assert.equal(error.stage, stage);
        if (status) assert.equal(error.status, status);
        return true;
      });
      assert.ok(warnings.length > 0);
      assert.equal(JSON.stringify(warnings).includes("moonlit buckwheat field"), false);
    });
  }
});

test("browser client classifies timeout and succeeds when retried", async () => {
  let attempts = 0;
  const fetchImpl = (url, options) => {
    attempts += 1;
    if (attempts > 1) return Promise.resolve(successResponse());
    return new Promise((resolve, reject) => {
      options.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })));
    });
  };
  const { window } = loadClient(fetchImpl, 15);
  await assert.rejects(window.requestTitleScenarioTurn(payload), (error) => error.code === "request_timeout" && error.stage === "timeout");
  const retried = await window.requestTitleScenarioTurn(payload);
  assert.equal(retried.nanoBananaPrompt.en, "moonlit buckwheat field");
});
