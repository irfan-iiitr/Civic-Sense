const express = require("express");
const multer = require("multer");

const {
  uploadContent,
  getAllContents,
} = require("../controllers/index");
const { authenticateRequest } = require("../middleware/auth");
const logger = require("../utils/logger");

const router = express.Router();

// configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

function handleUpload(req, res, next) {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      logger.error("Multer error while uploading:", err);
      return res.status(400).json({
        message: "Multer error while uploading",
        error: err.message,
        stack: err.stack,
      });
    }
    if (err) {
      logger.error("Unknown error occurred while uploading:", err);
      return res.status(500).json({
        message: "Unknown error occurred while uploading",
        error: err.message,
        stack: err.stack,
      });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file found" });
    }
    next();
  });
}

router.post("/upload", authenticateRequest, handleUpload, uploadContent);

router.get("/get", authenticateRequest, getAllContents);

module.exports = router;