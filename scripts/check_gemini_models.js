// Check available Gemini models
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkAvailableModels() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("No API key found. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
    return;
  }
  
  console.log("Checking available Gemini models...");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Common model names to try
  const modelsToTry = [
    "gemini-pro",
    "gemini-pro-vision", 
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-2.0-flash-exp",
    "models/gemini-pro",
    "models/gemini-pro-vision",
    "models/gemini-1.5-pro",
    "models/gemini-1.5-flash"
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Try a simple test
      const result = await model.generateContent("Hello");
      const response = await result.response;
      const text = response.text();
      
      if (text) {
        console.log(`✅ SUCCESS: ${modelName} works!`);
        console.log(`   Response: ${text.substring(0, 50)}...`);
      }
    } catch (error) {
      console.log(`❌ FAILED: ${modelName} - ${error.message}`);
    }
  }
}

checkAvailableModels().catch(console.error);