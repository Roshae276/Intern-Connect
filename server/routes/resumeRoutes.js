import express from "express";
import multer from "multer";
import { createRequire } from "module"; // <--- The Bridge

const require = createRequire(import.meta.url); // <--- Create legacy loader
const pdfParse = require("pdf-parse"); // <--- Load safe version

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const SKILL_KEYWORDS = ["javascript", "react", "node.js", "python", "java", "sql", "css", "html"]; // Add more as needed

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(200).json({ skills: [] }); // Don't crash on empty

    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text.toLowerCase();

    const foundSkills = new Set();
    SKILL_KEYWORDS.forEach(skill => {
      if (text.includes(skill)) foundSkills.add(skill.toUpperCase());
    });

    res.json({ skills: Array.from(foundSkills) });
  } catch (error) {
    console.error("Resume Analysis Warning:", error.message);
    res.status(200).json({ skills: [] }); // Return empty array instead of crashing
  }
});

export default router;