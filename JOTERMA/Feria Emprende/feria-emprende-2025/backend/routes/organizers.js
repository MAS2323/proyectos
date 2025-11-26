// routes/organizers.js (similar to sponsors)
import express from "express";
import Organizer from "../models/Organizer.js";
import { singleUpload, multerErrorHandling } from "../multer.js";
import { uploadImage } from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const organizers = await Organizer.find().sort({ created_at: -1 });
    res.json(organizers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", singleUpload, multerErrorHandling, async (req, res) => {
  try {
    let logoUrl = null;
    if (req.file) {
      const { url } = await uploadImage(
        req.file.buffer,
        "feria_emprende/logos"
      );
      logoUrl = url;
    }
    const { name } = req.body;
    const organizer = new Organizer({ name, logo: logoUrl });
    await organizer.save();
    res.status(201).json(organizer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
