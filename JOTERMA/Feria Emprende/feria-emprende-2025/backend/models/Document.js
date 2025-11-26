// models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  url: { type: String, required: true, maxlength: 500 }, // Cloudinary URL
  type: { type: String, default: "pdf", maxlength: 50 },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Document", documentSchema);
