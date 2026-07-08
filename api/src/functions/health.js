const { app } = require("@azure/functions");
const { json } = require("../shared/http");
const { isOpenAIConfigured } = require("../shared/openai");

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: async () => json(200, {
    ok: true,
    service: "book-adventure-api",
    azureOpenAIConfigured: isOpenAIConfigured(),
    time: new Date().toISOString()
  })
});
