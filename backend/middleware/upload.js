const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDirectory = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = path
      .basename(file.originalname, extension)
      .replace(/[^a-z0-9-_]/gi, "-")
      .toLowerCase();
    callback(null, `${Date.now()}-${safeName || "product"}${extension}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith("image/")) {
    return callback(null, true);
  }
  callback(new Error("Only image files are allowed"));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
