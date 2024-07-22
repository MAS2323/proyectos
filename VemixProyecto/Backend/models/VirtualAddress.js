const mongoose = require("mongoose");

const VirtualAddressSchema = new mongoose.Schema({
  direccion: { type: String, required: true },
  apartadoPostalId: { type: mongoose.Schema.Types.ObjectId, ref: "PostBox" },
});

module.exports = mongoose.model("VirtualAddress", VirtualAddressSchema);
