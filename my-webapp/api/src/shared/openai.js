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

class OpenAIRequestError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "OpenAIRequestError";
    this.code = details.code || "azure_openai_error";
    this.status = details.status || 0;
    this.requestId = details.requestId || "";
    this.durationMs = details.durationMs || 0;
    this.safeMessage = details.safeMessage || message;
  }
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

  const textOptions = {};
  if (options.responseFormat?.type === "json_object") {
    textOptions.format = { type: "json_object" };
  }

  if (supportsGpt5MiniOptions(config.deployment)) {
    if (options.reasoningEffort) {
      body.reasoning = { effort: options.reasoningEffort };
    }

    if (options.verbosity) {
      textOptions.verbosity = options.verbosity;
    }
  }

  if (Object.keys(textOptions).length) body.text = textOptions;

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

async function completeChatDetailed(messages, options = {}) {
  const config = getOpenAIConfig();
  if (!config) {
    throw new OpenAIRequestError("Azure OpenAI is not configured.", {
      code: "azure_openai_not_configured",
      safeMessage: "Azure OpenAI is not configured."
    });
  }

  const url = getCallUrl(config);
  const body = config.mode === "v1"
    ? buildResponsesBody(config, messages, options)
    : buildChatCompletionsBody(config, messages, options);

  const startedAt = Date.now();
  const controller = new AbortController();
  const timeoutMs = Math.max(1000, Number(options.timeoutMs || process.env.AZURE_OPENAI_TIMEOUT_MS || 45000));
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: buildHeaders(config),
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } catch (error) {
    const durationMs = Date.now() - startedAt;
    if (error?.name === "AbortError") {
      throw new OpenAIRequestError("Azure OpenAI request timed out.", {
        code: "azure_openai_timeout",
        durationMs,
        safeMessage: "Azure OpenAI request timed out."
      });
    }
    throw new OpenAIRequestError("Azure OpenAI network request failed.", {
      code: "azure_openai_network_error",
      durationMs,
      safeMessage: "Azure OpenAI network request failed."
    });
  } finally {
    clearTimeout(timeoutId);
  }

  const durationMs = Date.now() - startedAt;
  const requestId = response.headers.get("x-request-id") || response.headers.get("apim-request-id") || "";

  if (!response.ok) {
    const errorText = await response.text();
    let providerCode = "azure_openai_http_error";
    try {
      providerCode = JSON.parse(errorText)?.error?.code || providerCode;
    } catch (error) {
      // The provider sometimes returns a plain-text gateway response.
    }
    throw new OpenAIRequestError(`Azure OpenAI request failed with status ${response.status}.`, {
      code: String(providerCode).slice(0, 80),
      status: response.status,
      requestId,
      durationMs,
      safeMessage: `Azure OpenAI request failed with status ${response.status}.`
    });
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new OpenAIRequestError("Azure OpenAI returned invalid JSON.", {
      code: "azure_openai_invalid_json",
      status: response.status,
      requestId,
      durationMs,
      safeMessage: "Azure OpenAI returned invalid JSON."
    });
  }

  const finishReason = data.choices?.[0]?.finish_reason || data.incomplete_details?.reason || "";
  if (data.status === "incomplete" || finishReason === "length" || finishReason === "max_output_tokens") {
    throw new OpenAIRequestError("Azure OpenAI output was truncated before completion.", {
      code: "azure_openai_output_truncated",
      status: response.status,
      requestId: data.id || requestId,
      durationMs,
      safeMessage: "Azure OpenAI output was truncated before completion."
    });
  }

  const text = config.mode === "v1"
    ? extractResponsesText(data)
    : data.choices?.[0]?.message?.content || "";

  return {
    text,
    durationMs,
    requestId: data.id || requestId,
    mode: config.mode,
    usage: data.usage || null
  };
}

async function completeChat(messages, options = {}) {
  const result = await completeChatDetailed(messages, options);
  return result.text;
}

module.exports = {
  OpenAIRequestError,
  buildChatCompletionsBody,
  buildResponsesBody,
  completeChat,
  completeChatDetailed,
  extractResponsesText,
  getOpenAIDiagnostics,
  isOpenAIConfigured
};
