// Corrected server.js (using static imports for ES modules; ensure "type": "module" is in package.json)
// Also importing multerErrorHandling properly
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { multerErrorHandling } from "./multer.js";
import contactRouter from "./routes/contact.js";
import sponsorsRouter from "./routes/sponsors.js";
import collaboratorsRouter from "./routes/collaborators.js";
import organizersRouter from "./routes/organizers.js";
import heroImagesRouter from "./routes/hero-images.js";
import documentsRouter from "./routes/documents.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de Feria Emprende 2025" });
});

app.use("/contact", contactRouter);
app.use("/sponsors", sponsorsRouter);
app.use("/collaborators", collaboratorsRouter);
app.use("/organizers", organizersRouter);
app.use("/hero-images", heroImagesRouter);
app.use("/documents", documentsRouter);

// Global multer error handling (optional; per-route is already in place)
app.use(multerErrorHandling);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
