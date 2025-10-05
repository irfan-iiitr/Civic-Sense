const Content = require("../models/content");
const { uploadContentToCloudinary } = require("../utils/cloudinary");
const logger = require("../utils/logger");

const uploadContent = async (req, res) => { 
  logger.info("Uploading Content");
  try {
    if (!req.file) {
      logger.error("No file found. Please add a file and try again!");
      return res.status(400).json({
        success: false,
        message: "No file found. Please add a file and try again!",
      });
    }

    const { originalname, mimetype } = req.file;
    console.log(req.user);
    const userId = req.user.userId;

    logger.info(`File details: name=${originalname}, type=${mimetype}`);

    const cloudinaryUploadResult = await uploadContentToCloudinary(req.file);
    logger.info(`Cloudinary upload successfully. Public Id: - ${cloudinaryUploadResult.public_id}`);

    const newlyCreatedContent = new Content({
      publicId: cloudinaryUploadResult.public_id,
      originalName: originalname,
      mimeType: mimetype,
      url: cloudinaryUploadResult.secure_url,
      userId,
    });

    await newlyCreatedContent.save();

    res.status(201).json({
      success: true,
      ContentId: newlyCreatedContent._id,
      url: newlyCreatedContent.url,
      message: "Content upload is successfully",
    });
  } catch (error) {
    logger.error("Error creating Content", error);
    res.status(500).json({
      success: false,
      message: "Error creating Content",
    });
  }
};

const getAllContents = async (req, res) => {
  try {
    const results = await Content.find({});
    res.json({ results });
  } catch (error) {
    logger.error("Error fetching Contents", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Contents",
    });
  }
};

module.exports = { uploadContent, getAllContents };