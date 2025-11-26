// routes/contact.js
import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, message } = req.body;
    const contact = new Contact({ email, message });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
