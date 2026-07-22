const crypto = require("crypto");
const { safeErrorMessage } = require("./telemetry");

let cachedContainerPromise;

function hasCosmosConfig() {
  return Boolean(
    process.env.COSMOS_ENDPOINT &&
    process.env.COSMOS_KEY &&
    process.env.COSMOS_DATABASE_NAME &&
    process.env.COSMOS_CONTAINER_NAME
  );
}

async function getContainer() {
  if (!hasCosmosConfig()) return null;
  if (cachedContainerPromise) return cachedContainerPromise;

  cachedContainerPromise = (async () => {
    const { CosmosClient } = require("@azure/cosmos");
    const client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY
    });

    return client
      .database(process.env.COSMOS_DATABASE_NAME)
      .container(process.env.COSMOS_CONTAINER_NAME);
  })();

  return cachedContainerPromise;
}

function normalizeStudent(student) {
  return {
    className: String(student?.className || "").trim(),
    number: String(student?.number || "").trim(),
    nickname: String(student?.nickname || "").trim()
  };
}

function getStudentKey(student, sessionId = "") {
  const normalized = normalizeStudent(student);
  const className = normalized.className.toLowerCase();
  const number = normalized.number.toLowerCase();

  if (className && number) {
    return `class:${className}|number:${number}`;
  }

  return `session:${sessionId || "anonymous"}`;
}

function normalizeLimit(value) {
  const limit = Number(value || 500);
  if (!Number.isFinite(limit)) return 500;
  return Math.max(1, Math.min(1000, Math.round(limit)));
}

async function saveAdventureEventDetailed(event, context) {
  const startedAt = Date.now();
  const container = await getContainer();
  if (!container) return { saved: false, configured: false, durationMs: Date.now() - startedAt };

  const now = new Date().toISOString();
  const sessionId = event.sessionId || "anonymous";
  const student = normalizeStudent(event.student);
  const studentKey = getStudentKey(student, sessionId);

  const item = {
    ...event,
    id: crypto.randomUUID(),
    sessionId,
    studentKey,
    student,
    studentClassName: student.className,
    studentNumber: student.number,
    studentNickname: student.nickname,
    type: event.type || "adventureEvent",
    createdAt: now
  };

  try {
    await container.items.create(item);
    return { saved: true, configured: true, durationMs: Date.now() - startedAt };
  } catch (error) {
    return {
      saved: false,
      configured: true,
      durationMs: Date.now() - startedAt,
      errorCode: String(error?.code || "cosmos_save_failed").slice(0, 80),
      errorMessage: safeErrorMessage(error)
    };
  }
}

async function saveAdventureEvent(event, context) {
  const result = await saveAdventureEventDetailed(event, context);
  if (!result.saved && result.errorMessage) {
    context?.log?.(`Cosmos DB save skipped: ${safeErrorMessage({ message: result.errorMessage })}`);
  }
  return result.saved;
}

async function listAdventureEvents(options = {}, context) {
  const container = await getContainer();
  if (!container) {
    return {
      configured: false,
      items: []
    };
  }

  const limit = normalizeLimit(options.limit);
  const querySpec = {
    query: `SELECT TOP ${limit} * FROM c ORDER BY c.createdAt DESC`
  };

  try {
    const { resources } = await container.items
      .query(querySpec, {
        enableCrossPartitionQuery: true,
        maxItemCount: limit
      })
      .fetchAll();

    return {
      configured: true,
      items: resources
    };
  } catch (error) {
    context?.log?.(`Cosmos DB list skipped: ${safeErrorMessage(error)}`);
    return {
      configured: true,
      error: safeErrorMessage(error),
      items: []
    };
  }
}

module.exports = {
  getStudentKey,
  hasCosmosConfig,
  listAdventureEvents,
  normalizeStudent,
  saveAdventureEvent,
  saveAdventureEventDetailed
};
