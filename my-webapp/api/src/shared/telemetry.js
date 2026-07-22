const crypto = require("crypto");

const SECRET_PATTERNS = [
  /api[-_ ]?key\s*[:=]\s*[^\s,;]+/gi,
  /authorization\s*[:=]\s*[^\s,;]+/gi,
  /bearer\s+[a-z0-9._-]+/gi,
  /https:\/\/[^\s/]+/gi
];

function createRequestId(request, context) {
  const supplied = request?.headers?.get?.("x-request-id");
  if (supplied && /^[a-zA-Z0-9._:-]{8,96}$/.test(supplied)) return supplied;
  if (context?.invocationId) return String(context.invocationId);
  return crypto.randomUUID();
}

function safeErrorMessage(error) {
  let message = String(error?.safeMessage || error?.message || "Unknown error");
  SECRET_PATTERNS.forEach((pattern) => {
    message = message.replace(pattern, "[redacted]");
  });
  return message.replace(/[\r\n\t]+/g, " ").slice(0, 240);
}

function logEvent(context, details) {
  const entry = {
    event: "book_adventure_api",
    requestId: details.requestId,
    route: details.route,
    stage: details.stage,
    status: details.status,
    httpStatus: details.httpStatus,
    errorCode: details.errorCode,
    errorMessage: details.errorMessage ? safeErrorMessage({ message: details.errorMessage }) : undefined,
    openaiMs: details.openaiMs,
    cosmosMs: details.cosmosMs,
    totalMs: details.totalMs,
    openaiRequestId: details.openaiRequestId
  };

  Object.keys(entry).forEach((key) => entry[key] === undefined && delete entry[key]);
  context?.log?.(JSON.stringify(entry));
}

module.exports = {
  createRequestId,
  logEvent,
  safeErrorMessage
};
