const express = require("express");
const router = express.Router();
const PostBox = require("../models/PostBox");
const User = require("../models/User");

// Crear un nuevo apartado postal
router.post("/", async (req, res) => {
  const { ubicacion, usuarioId } = req.body;
  try {
    const user = await User.findById(usuarioId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const newPostBox = new PostBox({ ubicacion, usuarioId });
    await newPostBox.save();

    user.apartadosPostales.push(newPostBox._id);
    await user.save();

    res.status(201).json(newPostBox);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todos los apartados postales
router.get("/", async (req, res) => {
  try {
    const postBoxes = await PostBox.find().populate(
      "usuarioId direccionesVirtuales"
    );
    res.json(postBoxes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener un apartado postal por ID
router.get("/:id", async (req, res) => {
  try {
    const postBox = await PostBox.findById(req.params.id).populate(
      "usuarioId direccionesVirtuales"
    );
    if (!postBox)
      return res.status(404).json({ message: "Apartado postal no encontrado" });
    res.json(postBox);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar un apartado postal por ID
router.put("/:id", async (req, res) => {
  const { ubicacion, usuarioId } = req.body;
  try {
    const postBox = await PostBox.findByIdAndUpdate(
      req.params.id,
      { ubicacion, usuarioId },
      { new: true }
    ).populate("usuarioId direccionesVirtuales");
    if (!postBox)
      return res.status(404).json({ message: "Apartado postal no encontrado" });
    res.json(postBox);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un apartado postal por ID
router.delete("/:id", async (req, res) => {
  try {
    const postBox = await PostBox.findByIdAndDelete(req.params.id);
    if (!postBox)
      return res.status(404).json({ message: "Apartado postal no encontrado" });
    res.json({ message: "Apartado postal eliminado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
