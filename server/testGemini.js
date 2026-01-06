import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = "Explain 'Hackathon' in one sentence.";

    console.log("Asking Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("Response:", response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

run();