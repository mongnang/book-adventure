const AI_UNAVAILABLE_MESSAGE = "AI와 연결이 불안정합니다. 다시 시도해보세요.";

async function readJson(request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

function json(status, body, headers = {}) {
  return {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers
    },
    jsonBody: body
  };
}

function badRequest(message, requestId = "") {
  return json(400, {
    ok: false,
    error: "bad_request",
    message,
    requestId: requestId || undefined
  }, requestId ? { "x-request-id": requestId } : {});
}

function apiError(status, error, message, requestId, details = {}) {
  return json(status, {
    ok: false,
    error,
    message,
    requestId: requestId || undefined,
    retryable: details.retryable !== false,
    stage: details.stage || undefined
  }, requestId ? { "x-request-id": requestId } : {});
}

function aiUnavailable(requestId = "", details = {}) {
  return apiError(
    details.status || 503,
    details.error || "azure_openai_error",
    AI_UNAVAILABLE_MESSAGE,
    requestId,
    { ...details, stage: details.stage || "azure-openai" }
  );
}

module.exports = {
  AI_UNAVAILABLE_MESSAGE,
  apiError,
  aiUnavailable,
  badRequest,
  json,
  readJson
};
