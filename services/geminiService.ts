import { GoogleGenAI } from "@google/genai";
import { IPConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const analyzeNetworkContext = async (
  url: string,
  config: IPConfig
): Promise<string> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return "API Key missing. Please set GEMINI_API_KEY environment variable to use AI diagnostics.";
  }

  try {
    const prompt = `
      Act as a Senior Network Engineer and QA Tester.
      
      I am simulating a connection to the website "${url}" using the following network context:
      - ISP: ${config.provider}
      - IP Address: ${config.ip}
      - Connection Type: ${config.type}
      - Estimated Latency: ${config.latency}ms
      - Location: ${config.location}

      Please provide a technical diagnostic report containing:
      1. Expected routing behavior for this ISP in this region.
      2. Potential bottlenecks (e.g., specific CDN nodes, throttling known for this ISP).
      3. A simulated "traceroute" summary (just the key hops).
      4. A brief recommendation for optimizing the website for users on this specific network type.

      Keep the response concise, professional, and formatted in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate AI analysis. Please check your API key and try again.";
  }
};
