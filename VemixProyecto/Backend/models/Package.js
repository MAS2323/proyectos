const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  estado: { type: String, required: true },
  destino: { type: String, required: true },
  apartadoPostalId: { type: mongoose.Schema.Types.ObjectId, ref: "PostBox" },
});

module.exports = mongoose.model("Package", PackageSchema);
