// routes/hero-images.js
import express from "express";
import HeroImage from "../models/HeroImage.js";
import { multipleImagesUpload, multerErrorHandling } from "../multer.js";
import { uploadImage } from "../cloudinary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const images = await HeroImage.find().sort({ order: 1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
  multipleImagesUpload,
  multerErrorHandling,
  async (req, res) => {
    try {
      const { order: orderStr = "0" } = req.body;
      let currentOrder = parseInt(orderStr, 10);
      const createdImages = [];

      for (const file of req.files) {
        if (file.mimetype.startsWith("image/")) {
          const { url } = await uploadImage(file.buffer, "feria_emprende/hero");
          const image = new HeroImage({ url, order: currentOrder });
          await image.save();
          createdImages.push(image);
          currentOrder += 1;
        } else {
          return res
            .status(400)
            .json({ error: "Solo archivos de imagen permitidos" });
        }
      }

      res.status(201).json(createdImages);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const image = await HeroImage.findByIdAndDelete(id);
    if (!image) {
      return res.status(404).json({ error: "Imagen no encontrada" });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
