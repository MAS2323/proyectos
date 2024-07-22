const mongoose = require("mongoose");

const PostBoxSchema = new mongoose.Schema({
  ubicacion: { type: String, required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  direccionesVirtuales: [
    { type: mongoose.Schema.Types.ObjectId, ref: "VirtualAddress" },
  ],
});

module.exports = mongoose.model("PostBox", PostBoxSchema);
