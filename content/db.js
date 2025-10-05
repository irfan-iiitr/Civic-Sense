require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("./utils/logger");

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    logger.info("Connected to MongoDB");
  } catch (e) {
    logger.error("Mongo connection error", e);
  }
};

module.exports = connectToMongoDB;