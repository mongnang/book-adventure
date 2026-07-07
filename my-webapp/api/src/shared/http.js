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

module.exports = {
  badRequest,
  json,
  readJson
};
