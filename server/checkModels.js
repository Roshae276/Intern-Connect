import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
  if (!API_KEY) {
    console.error("❌ No API Key found in .env");
    return;
  }

  console.log("🔍 Checking available models for your key...");
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log("\n✅ AVAILABLE MODELS:");
    data.models.forEach(m => {
      // We only care about models that support 'generateContent'
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`- ${m.name.replace('models/', '')}`);
      }
    });

  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.log("👉 Tip: Check if your .env file has extra spaces around the key.");
  }
}

checkModels();