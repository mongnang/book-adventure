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
  return `${base}/openai/deployments/${encodeURIComponent(config.deployment)}/chat/completions?api-version=${encodeURIComponent(config.apiVersion)}`;
}

function buildResponsesUrl(config) {
  const base = config.endpoint.replace(/\/+$/, "");
  return `${base}/responses`;
}

function isOpenAIConfigured() {
  return Boolean(getOpenAIConfig());
}

function getCallUrl(config) {
  return config.mode === "v1" ? buildResponsesUrl(config) : buildChatUrl(config);
}

function getOpenAIDiagnostics() {
  const config = getOpenAIConfig();
  if (!config) {
    return {
      configured: false,
      hasEndpoint: Boolean(process.env.AZURE_OPENAI_ENDPOINT || process.env.AZURE_OPENAI_CHAT_URL),
      hasApiKey: Boolean(process.env.AZURE_OPENAI_API_KEY),
      hasDeployment: Boolean(process.env.AZURE_OPENAI_DEPLOYMENT || process.env.AZURE_OPENAI_MODEL)
    };
  }

  let chatUrl = "";
  try {
    chatUrl = getCallUrl(config);
  } catch (error) {
    chatUrl = "unavailable";
  }

  return {
    configured: true,
    mode: config.mode,
    apiKind: config.mode === "v1" ? "responses" : "chat-completions",
    deployment: config.deployment || null,
    apiVersion: config.apiVersion,
    endpointUsesV1: Boolean(config.endpoint?.includes("/openai/v1")),
    chatUrl
  };
}

function buildHeaders(config) {
  return {
    "Content-Type": "application/json",
    "api-key": config.apiKey
  };
}

function supportsTemperatureForDeployment(deployment) {
  return !/^gpt-5/i.test(deployment || "") && !/^o\d/i.test(deployment || "");
}

function supportsGpt5MiniOptions(deployment) {
  return /^gpt-5-mini(?:-|$)/i.test(deployment || "");
}

function buildChatCompletionsBody(config, messages, options) {
  const body = {
    messages,
    max_completion_tokens: options.maxTokens ?? 700
  };

  if (supportsTemperatureForDeployment(config.deployment) && options.temperature !== undefined) {
    body.temperature = options.temperature;
  }

  if (config.mode === "custom") {
    body.model = config.deployment;
  }

  if (options.responseFormat) {
    body.response_format = options.responseFormat;
  }

  if (supportsGpt5MiniOptions(config.deployment)) {
    if (options.reasoningEffort) {
      body.reasoning_effort = options.reasoningEffort;
    }

    if (options.verbosity) {
      body.verbosity = options.verbosity;
    }
  }

  return body;
}

function buildResponsesBody(config, messages, options) {
  const systemMessages = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");
  const input = messages
    .filter((message) => message.role !== "system")
    .map((message) => `${message.role.toUpperCase()}:\n${message.content}`)
    .join("\n\n");

  let instructions = systemMessages;
  if (options.responseFormat?.type === "json_object") {
    instructions = [
      instructions,
      "반드시 JSON object만 출력하고, 코드블록이나 설명 문장은 붙이지 마세요."
    ].filter(Boolean).join("\n\n");
  }

  const body = {
    model: config.deployment,
    input: input || messages.map((message) => message.content).join("\n\n"),
    max_output_tokens: options.maxTokens ?? 700
  };

  if (instructions) {
    body.instructions = instructions;
  }

  if (supportsTemperatureForDeployment(config.deployment) && options.temperature !== undefined) {
    body.temperature = options.temperature;
  }

  if (supportsGpt5MiniOptions(config.deployment)) {
    if (options.reasoningEffort) {
      body.reasoning = { effort: options.reasoningEffort };
    }

    if (options.verbosity) {
      body.text = { verbosity: options.verbosity };
    }
  }

  return body;
}

function extractResponsesText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text;
  }

  const pieces = [];
  for (const outputItem of data.output || []) {
    for (const contentItem of outputItem.content || []) {
      if (typeof contentItem.text === "string") pieces.push(contentItem.text);
      if (typeof contentItem.value === "string") pieces.push(contentItem.value);
    }
  }
  return pieces.join("\n").trim();
}

async function completeChat(messages, options = {}) {
  const config = getOpenAIConfig();
  if (!config) {
    throw new Error("Azure OpenAI is not configured.");
  }

  const url = getCallUrl(config);
  const body = config.mode === "v1"
    ? buildResponsesBody(config, messages, options)
    : buildChatCompletionsBody(config, messages, options);

  const response = await fetch(url, {
    method: "POST",
    headers: buildHeaders(config),
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI request failed: ${response.status} ${errorText.slice(0, 500)}`);
  }

  const data = await response.json();
  if (config.mode === "v1") {
    return extractResponsesText(data);
  }

  return data.choices?.[0]?.message?.content || "";
}

module.exports = {
  completeChat,
  getOpenAIDiagnostics,
  isOpenAIConfigured
};
