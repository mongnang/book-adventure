const { app } = require("@azure/functions");
const { json } = require("../shared/http");
const { getOpenAIDiagnostics, isOpenAIConfigured } = require("../shared/openai");

const BUILD_VERSION = "2026-07-09-student-session-assessment-1";

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: async () => json(200, {
    ok: true,
    service: "book-adventure-api",
    buildVersion: BUILD_VERSION,
    azureOpenAIConfigured: isOpenAIConfigured(),
    openAI: getOpenAIDiagnostics(),
    time: new Date().toISOString()
  })
});
