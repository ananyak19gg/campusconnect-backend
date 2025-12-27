import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Ensure your API Key is actually loaded
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ ERROR: GEMINI_API_KEY is missing from .env file!");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const callGemini = async (prompt: string) => {
  try {
    // Try the explicit "latest" alias
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    // If it STILL 404s, it might be a library version issue. 
    // This log will help us see if the model name is the problem.
    console.error("Gemini API Error details:", error);
    throw error;
  }
};