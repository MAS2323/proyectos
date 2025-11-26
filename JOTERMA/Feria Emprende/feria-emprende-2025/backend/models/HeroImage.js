// models/HeroImage.js
import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema({
  url: { type: String, required: true, maxlength: 500 },
  order: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

heroImageSchema.index({ order: 1 }); // For efficient sorting

export default mongoose.model("HeroImage", heroImageSchema);
