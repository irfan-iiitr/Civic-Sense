const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const logger = require("./utils/logger");
const routes = require("./routes/index");
const connectToMongoDB = require("./db");
const errorHandler = require("./middleware/error-handler");
const rabbitMq = require("./utils/rabbit");
const { handlePostDeleted } = require("./eventHandlers/delete-post");

const PORT = process.env.PORT || 3003;

function configureMiddleware(app) {
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
}

function registerRequestLogging(app) {
  app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
  });
}

function registerRoutes(app) {
  app.use("/api/", routes);
}

function registerErrorHandler(app) {
  app.use(errorHandler);
}

function startHttpServer(app) {
  app.listen(PORT, () => {
    logger.info(`content service running on port ${PORT}`);
  });
}

function initializeRabbitMQ() {
  rabbitMq.connect();
  rabbitMq.subscribeToQueue("deletePost", handlePostDeleted);
}

async function start() {
  const app = express();
  configureMiddleware(app);
  await connectToMongoDB();
  registerRequestLogging(app);
  registerRoutes(app);
  registerErrorHandler(app);
  startHttpServer(app);
  initializeRabbitMQ();
}

start().catch((error) => {
  logger.error("Failed to start content service", error);
  process.exit(1);
});

