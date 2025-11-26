// models/Collaborator.js
import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  logo: { type: String, maxlength: 500 },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Collaborator", collaboratorSchema);
