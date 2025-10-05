const Content = require("../models/content");
const { deleteContentFromCloudinary } = require("../utils/cloudinary");
const logger = require("../utils/logger");

const handlePostDeleted = async (event) => {
  logger.info("function started");
  const data=JSON.parse(event);
  console.log(data);
  const { postId, contentIds } = data;
  console.log("post id","content id recieved: ",postId,contentIds);
  try {
    const contentToDelete = await Content.find({ _id: { $in: contentIds } });

    for (const content of contentToDelete) {
      await deleteContentFromCloudinary(content.publicId);
      await Content.findByIdAndDelete(content._id);

      logger.info(
        `Deleted content ${content._id} associated with this deleted post ${postId}`
      );
    }

    logger.info(`Processed deletion of content for post id ${postId}`);
  } catch (e) {
    logger.error(e, "Error occurred while deleting content");
  }
};

module.exports = { handlePostDeleted };