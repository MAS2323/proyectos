// models/Contact.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  email: { type: String, required: true, maxlength: 255 },
  message: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", contactSchema);
