const crypto = require("crypto");

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

async function saveAdventureEvent(event, context) {
  const container = await getContainer();
  if (!container) return false;

  const now = new Date().toISOString();
  const sessionId = event.sessionId || "anonymous";

  const item = {
    id: event.id || crypto.randomUUID(),
    sessionId,
    type: event.type || "adventureEvent",
    createdAt: now,
    ...event
  };

  try {
    await container.items.upsert(item);
    return true;
  } catch (error) {
    context?.log?.(`Cosmos DB save skipped: ${error.message}`);
    return false;
  }
}

module.exports = {
  hasCosmosConfig,
  saveAdventureEvent
};
