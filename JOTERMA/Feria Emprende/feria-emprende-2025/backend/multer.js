// multer.js (adapted from provided code, simplified for this API's needs)
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "..", "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage(); // Use memory to avoid disk writes, since we upload to Cloudinary immediately

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no soportado: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 40 * 1024 * 1024, // 40MB
  },
});

// Middleware for single file uploads (logo, document)
export const singleUpload = upload.single("logo"); // Reuse for logo/doc by changing field name in routes
export const singlePDFUpload = upload.single("doc");

// Middleware for multiple images
export const multipleImagesUpload = upload.array("images", 10); // For hero images

// Error handling middleware
export const multerErrorHandling = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "El archivo es demasiado grande. Máximo 40MB." });
    } else {
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    }
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};
