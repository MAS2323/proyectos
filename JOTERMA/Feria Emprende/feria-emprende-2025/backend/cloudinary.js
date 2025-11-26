// cloudinary.js (adapted from provided code, with prefix changes)
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube una imagen a Cloudinary en una carpeta específica.
 * @param {Buffer} buffer - Buffer del archivo de imagen (from multer).
 * @param {string} folderName - Nombre de la carpeta en Cloudinary (e.g., "feria_emprende/logos").
 * @returns {Promise<{url: string, public_id: string}>} - URL y public_id de la imagen subida.
 */
export async function uploadImage(buffer, folderName) {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error al subir la imagen a Cloudinary:", error);
    throw error;
  }
}

/**
 * Sube un PDF a Cloudinary en una carpeta específica.
 * @param {Buffer} buffer - Buffer del archivo PDF (from multer).
 * @param {string} folderName - Nombre de la carpeta en Cloudinary (e.g., "feria_emprende/documents").
 * @returns {Promise<{url: string, public_id: string}>} - URL y public_id del PDF subido.
 */
export async function uploadPDF(buffer, folderName) {
  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName, resource_type: "raw" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error al subir el PDF a Cloudinary:", error);
    throw error;
  }
}

export default cloudinary;
