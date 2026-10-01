import app from "./app";
import { logger } from "./lib/logger";
import { seedMenuCatalogIfEmpty } from "./lib/menu-catalog";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function startServer() {
  try {
    const seeded = await seedMenuCatalogIfEmpty();
    if (seeded) {
      logger.info("Seeded the Bianco menu catalog.");
    }
  } catch (err) {
    logger.error({ err }, "Unable to prepare the menu catalog");
    process.exit(1);
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

void startServer();
