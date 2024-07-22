const express = require("express");
const router = express.Router();
const Package = require("../models/Package");

// Crear un nuevo paquete
router.post("/", async (req, res) => {
  const { estado, destino, apartadoPostalId } = req.body;
  try {
    const newPackage = new Package({ estado, destino, apartadoPostalId });
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todos los paquetes
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener un paquete por ID
router.get("/:id", async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package)
      return res.status(404).json({ message: "Paquete no encontrado" });
    res.json(package);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar un paquete por ID
router.put("/:id", async (req, res) => {
  const { estado, destino, apartadoPostalId } = req.body;
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      { estado, destino, apartadoPostalId },
      { new: true }
    );
    if (!package)
      return res.status(404).json({ message: "Paquete no encontrado" });
    res.json(package);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un paquete por ID
router.delete("/:id", async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(req.params.id);
    if (!package)
      return res.status(404).json({ message: "Paquete no encontrado" });
    res.json({ message: "Paquete eliminado" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
