import type { Server } from "http";
import app from "./app";
import config from "./config";
import { errorLogger, logger } from "./shared/logger";

let server: Server;

// uncaught exception error
process.on("uncaughtException", (error) => {
  errorLogger.error(error);
  process.exit(1);
});

(async function () {
  try {
    // connection here

    logger.info("Database is connected Successfully");

    server = app.listen(config.port, () => {
      logger.info(`Application listing on port ${config.port}`);
    });
  } catch (error) {
    errorLogger.error("Failed to connect database", error);
  }

  // unhandled rejection error
  process.on("unhandledRejection", () => {
    if (server && server.listening) {
      server.close(() => {
        errorLogger.error("Unhandled Rejection Error");
        process.exit(1);
      });
    } else {
      // close the server immediately
      process.exit(1);
    }
  });
})();

// If our server crash suddenly/pm2, to get a signal
process.on("SIGTERM", () => {
  logger.info("SIGTERM is received");
  if (server) {
    server.close();
  }
});
