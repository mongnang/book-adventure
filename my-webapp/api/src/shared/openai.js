function getOpenAIConfig() {
  const chatUrl = process.env.AZURE_OPENAI_CHAT_URL?.trim();
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.trim();
  const apiKey = process.env.AZURE_OPENAI_API_KEY?.trim();
  const model = process.env.AZURE_OPENAI_MODEL?.trim() || process.env.AZURE_OPENAI_DEPLOYMENT?.trim();
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION?.trim() || "v1";

  if (!apiKey) return null;
  if (chatUrl) return { apiKey, apiVersion, chatUrl, model };
  if (!endpoint || !model) return null;

  return { apiKey, apiVersion, endpoint, model };
}

function buildChatUrl(config) {
  if (config.chatUrl) return config.chatUrl;

  const base = config.endpoint.replace(/\/+$/, "");
  const root = base.endsWith("/openai/v1") ? base : `${base}/openai/v1`;
  return `${root}/chat/completions?api-version=${encodeURIComponent(config.apiVersion)}`;
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
    model: config.model,
    messages,
    temperature: options.temperature ?? 0.4,
    max_completion_tokens: options.maxTokens ?? 700
  };

  if (options.responseFormat) {
    body.response_format = options.responseFormat;
  }

  const response = await fetch(buildChatUrl(config), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": config.apiKey
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
