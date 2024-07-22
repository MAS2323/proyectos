const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  apartadosPostales: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostBox" }],
});

module.exports = mongoose.model("User", UserSchema);
