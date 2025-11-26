// models/Sponsor.js
import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  logo: { type: String, maxlength: 500 }, // Cloudinary URL
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Sponsor", sponsorSchema);
