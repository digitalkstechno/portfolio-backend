const multer = require("multer");

function createUploader(relativePath) {
  // Use memory storage so req.file has file.buffer instead of saving to local disk
  const storage = multer.memoryStorage();
  return multer({ storage });
}

module.exports = createUploader;
