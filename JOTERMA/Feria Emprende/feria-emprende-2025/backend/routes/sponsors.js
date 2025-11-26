// routes/sponsors.js
import express from "express";
import Sponsor from "../models/Sponsor.js";
import { singleUpload, multerErrorHandling } from "../multer.js";
import { uploadImage } from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sponsors = await Sponsor.find().sort({ created_at: -1 });
    res.json(sponsors);
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
    const sponsor = new Sponsor({ name, logo: logoUrl });
    await sponsor.save();
    res.status(201).json(sponsor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
