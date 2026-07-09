const { app } = require("@azure/functions");
const { badRequest, json, readJson } = require("../shared/http");
const { saveAdventureEvent } = require("../shared/store");

app.http("adventureSessionStart", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "adventure/session",
  handler: async (request, context) => {
    const payload = await readJson(request);
    if (!payload) return badRequest("JSON body is required.");

    await saveAdventureEvent({
      type: "sessionStart",
      sessionId: payload.sessionId,
      student: payload.student || null,
      event: payload.event || "studentProfileSubmitted",
      clientTimestamp: payload.clientTimestamp || null
    }, context);

    return json(200, {
      ok: true,
      sessionId: payload.sessionId || null
    });
  }
});
