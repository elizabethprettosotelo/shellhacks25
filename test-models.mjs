// Quick test script to check if a specific model works
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCsNwAMXvJEjyNwYwAwlf6TXE8UWbSmC6U";
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    console.log(`Testing: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    const text = response.text();
    console.log(`✅ ${modelName} works! Response: ${text.substring(0, 30)}...`);
    return true;
  } catch (error) {
    console.log(`❌ ${modelName} failed: ${error.message}`);
    return false;
  }
}

// Test newer models that are more likely to work
const modelsToTest = [
  "gemini-2.0-flash-exp",
  "models/gemini-2.0-flash-exp", 
  "gemini-1.5-flash-002",
  "models/gemini-1.5-flash-002",
  "gemini-1.5-pro-002", 
  "models/gemini-1.5-pro-002",
  "gemini-pro",
  "models/gemini-pro"
];

async function findWorkingModel() {
  for (const model of modelsToTest) {
    const works = await testModel(model);
    if (works) {
      console.log(`\n🎉 FOUND WORKING MODEL: ${model}`);
      break;
    }
  }
}

findWorkingModel().catch(console.error);