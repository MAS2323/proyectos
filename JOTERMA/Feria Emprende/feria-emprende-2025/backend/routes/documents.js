// routes/documents.js
import express from "express";
import Document from "../models/Document.js";
import { singlePDFUpload, multerErrorHandling } from "../multer.js";
import { uploadPDF } from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { name } = req.query;
    const query = name ? { name } : {};
    const documents = await Document.find(query).sort({ created_at: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", singlePDFUpload, multerErrorHandling, async (req, res) => {
  try {
    const { name } = req.body;
    if (!req.file || !req.file.mimetype === "application/pdf") {
      return res.status(400).json({ error: "Solo archivos PDF permitidos" });
    }
    const { url } = await uploadPDF(
      req.file.buffer,
      "feria_emprende/documents"
    );
    const doc = new Document({ name, url, type: "pdf" });
    await doc.save();
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
