function getOpenAIConfig() {
  const chatUrl = process.env.AZURE_OPENAI_CHAT_URL?.trim();
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.trim();
  const apiKey = process.env.AZURE_OPENAI_API_KEY?.trim();
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT?.trim() || process.env.AZURE_OPENAI_MODEL?.trim();
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION?.trim() || "2024-06-01";

  if (!apiKey) return null;
  if (chatUrl) return { apiKey, apiVersion, chatUrl, deployment, mode: "custom" };
  if (!endpoint || !deployment) return null;

  return { apiKey, apiVersion, endpoint, deployment, mode: endpoint.includes("/openai/v1") ? "v1" : "deployment" };
}

function buildChatUrl(config) {
  if (config.chatUrl) return config.chatUrl;

  const base = config.endpoint.replace(/\/+$/, "");
  if (config.mode === "v1") {
    return `${base}/chat/completions`;
  }

  return `${base}/openai/deployments/${encodeURIComponent(config.deployment)}/chat/completions?api-version=${encodeURIComponent(config.apiVersion)}`;
}

function isOpenAIConfigured() {
  return Boolean(getOpenAIConfig());
}

async function completeChat(messages, options = {}) {
  const config = getOpenAIConfig();
  if (!config) {
    throw new Error("Azure OpenAI is not configured.");
  }

  const body = {
    messages,
    max_completion_tokens: options.maxTokens ?? 700
  };

  const deployment = config.deployment || "";
  const supportsTemperature = !/^gpt-5/i.test(deployment) && !/^o\d/i.test(deployment);
  if (supportsTemperature && options.temperature !== undefined) {
    body.temperature = options.temperature;
  }

  if (config.mode === "v1" || config.mode === "custom") {
    body.model = config.deployment;
  }

  if (options.responseFormat) {
    body.response_format = options.responseFormat;
  }

  const response = await fetch(buildChatUrl(config), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": config.apiKey,
      "Authorization": `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI request failed: ${response.status} ${errorText.slice(0, 500)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

module.exports = {
  completeChat,
  isOpenAIConfigured
};
