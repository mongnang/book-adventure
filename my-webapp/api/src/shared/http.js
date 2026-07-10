const AI_UNAVAILABLE_MESSAGE = "AI와 연결이 불안정합니다. 다시 시도해보세요.";

async function readJson(request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

function json(status, body) {
  return {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    jsonBody: body
  };
}

function badRequest(message) {
  return json(400, {
    error: "bad_request",
    message
  });
}

function aiUnavailable() {
  return json(503, {
    ok: false,
    error: "ai_unavailable",
    message: AI_UNAVAILABLE_MESSAGE
  });
}

module.exports = {
  AI_UNAVAILABLE_MESSAGE,
  aiUnavailable,
  badRequest,
  json,
  readJson
};
