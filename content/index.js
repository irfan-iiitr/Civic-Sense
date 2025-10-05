const dotenv=require("dotenv")
dotenv.config();

const logger = require("./utils/logger");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());


const routes = require("./routes/index");
const connectToMongoDB = require("./db");
const errorHandler = require("./middleware/error-handler");


const PORT = process.env.PORT || 3003;

connectToMongoDB();


app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body, ${req.body}`);
    next();
});

app.use("/api/", routes);

//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`post service running on port ${PORT}`);
});

const rabbitMq = require('./utils/rabbit');
const { handlePostDeleted } = require("./eventHandlers/delete-post");
rabbitMq.connect();

rabbitMq.subscribeToQueue("deletePost",handlePostDeleted);

