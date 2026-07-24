import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features will not work.");
}

export const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

export const DEFAULT_MODEL = "gemini-1.5-flash";

// Utility for formatting error messages from Gemini
export function handleAiError(error: any) {
  console.error("AI Error:", error);
  return { error: "AI service temporarily unavailable. Please try again later." };
}
