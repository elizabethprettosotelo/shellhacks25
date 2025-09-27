import { GoogleGenerativeAI, Content } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

// Get the Gemini Pro model
export const getGeminiModel = (modelName: string = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

// Helper function to generate content
export const generateContent = async (prompt: string, modelName?: string) => {
  try {
    const model = getGeminiModel(modelName);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

// Helper function for chat conversations
export const startChatSession = (modelName?: string, history?: Content[]) => {
  const model = getGeminiModel(modelName);
  return model.startChat({
    history: history || [],
  });
};

// Helper function to generate content with images
export const generateContentWithImage = async (
  prompt: string,
  imageData: string | Uint8Array,
  mimeType: string = "image/jpeg",
  modelName?: string
) => {
  try {
    const model = getGeminiModel(modelName);
    
    const imagePart = {
      inlineData: {
        data: typeof imageData === 'string' ? imageData : Buffer.from(imageData).toString('base64'),
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with image:", error);
    throw error;
  }
};