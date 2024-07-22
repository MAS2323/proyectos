const express = require("express");
const router = express.Router();
const VirtualAddress = require("../models/VirtualAddress");
const PostBox = require("../models/PostBox");

// Crear una nueva dirección virtual
router.post("/", async (req, res) => {
  const { direccion, apartadoPostalId } = req.body;
  try {
    const postBox = await PostBox.findById(apartadoPostalId);
    if (!postBox) {
      return res.status(404).json({ message: "Apartado postal no encontrado" });
    }

    const newVirtualAddress = new VirtualAddress({
      direccion,
      apartadoPostalId,
    });
    await newVirtualAddress.save();

    postBox.direccionesVirtuales.push(newVirtualAddress._id);
    await postBox.save();

    res.status(201).json(newVirtualAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener todas las direcciones virtuales
router.get("/", async (req, res) => {
  try {
    const virtualAddresses = await VirtualAddress.find().populate(
      "apartadoPostalId"
    );
    res.json(virtualAddresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtener una dirección virtual por ID
router.get("/:id", async (req, res) => {
  try {
    const virtualAddress = await VirtualAddress.findById(
      req.params.id
    ).populate("apartadoPostalId");
    if (!virtualAddress)
      return res
        .status(404)
        .json({ message: "Dirección virtual no encontrada" });
    res.json(virtualAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar una dirección virtual por ID
router.put("/:id", async (req, res) => {
  const { direccion, apartadoPostalId } = req.body;
  try {
    const virtualAddress = await VirtualAddress.findByIdAndUpdate(
      req.params.id,
      { direccion, apartadoPostalId },
      { new: true }
    ).populate("apartadoPostalId");
    if (!virtualAddress)
      return res
        .status(404)
        .json({ message: "Dirección virtual no encontrada" });
    res.json(virtualAddress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar una dirección virtual por ID
router.delete("/:id", async (req, res) => {
  try {
    const virtualAddress = await VirtualAddress.findByIdAndDelete(
      req.params.id
    );
    if (!virtualAddress)
      return res
        .status(404)
        .json({ message: "Dirección virtual no encontrada" });
    res.json({ message: "Dirección virtual eliminada" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
