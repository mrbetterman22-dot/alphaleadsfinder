import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize the client only if the key exists to avoid errors on load if missing
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateSalesPitch = async (businessName: string, reviewText: string): Promise<string> => {
  if (!ai) {
    return "API Key missing. Please set the API_KEY environment variable to generate a pitch.";
  }

  try {
    const prompt = `
      You are an expert sales copywriter for an AI Automation Agency. 
      A business named "${businessName}" just received a 1-star review on Google Maps.
      
      Review Text: "${reviewText}"
      
      Write a short, empathetic, but punchy cold email opener/sales pitch (max 2 sentences) 
      that acknowledges their pain point and suggests how an AI phone agent or automation 
      could prevent this issue (e.g., missed calls, rude staff, long wait times).
      Do not include subject lines or greetings, just the core pitch.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Could not generate pitch.";
  } catch (error) {
    console.error("Error generating pitch:", error);
    return "Error generating sales pitch. Please try again later.";
  }
};
