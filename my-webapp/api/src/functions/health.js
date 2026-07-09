const { app } = require("@azure/functions");
const { json } = require("../shared/http");
const { getOpenAIDiagnostics, isOpenAIConfigured } = require("../shared/openai");
const { hasCosmosConfig } = require("../shared/store");

const BUILD_VERSION = "2026-07-09-cosmos-health-1";

function getCosmosDiagnostics() {
  let endpointHost = "";
  try {
    endpointHost = process.env.COSMOS_ENDPOINT ? new URL(process.env.COSMOS_ENDPOINT).host : "";
  } catch (error) {
    endpointHost = "invalid-endpoint";
  }

  return {
    configured: hasCosmosConfig(),
    hasEndpoint: Boolean(process.env.COSMOS_ENDPOINT),
    endpointHost,
    hasKey: Boolean(process.env.COSMOS_KEY),
    database: process.env.COSMOS_DATABASE_NAME || "",
    container: process.env.COSMOS_CONTAINER_NAME || ""
  };
}

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
    cosmos: getCosmosDiagnostics(),
    time: new Date().toISOString()
  })
});
