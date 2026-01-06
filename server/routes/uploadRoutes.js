import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Check if the file is a PDF
    const isPdf = file.mimetype === 'application/pdf';

    return {
      folder: 'intern-connect-profiles',
      // 'auto' lets Cloudinary optimize the file. 
      // For PDFs, this ensures it's served with correct headers (application/pdf)
      resource_type: 'auto', 
      // CRITICAL: Force the extension to be .pdf if the file is a PDF
      // This solves the "txt file" and "failed to load" errors simultaneously.
      format: isPdf ? 'pdf' : undefined,
      public_id: file.originalname.split('.')[0] + '-' + Date.now(),
    };
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Force HTTPS
    let secureUrl = req.file.path;
    if (secureUrl.startsWith("http://")) {
        secureUrl = secureUrl.replace("http://", "https://");
    }

    res.json({ url: secureUrl, filename: req.file.originalname });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;