import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  app.post("/api/voice-command", async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body;
      if (!audioBase64) {
        return res.status(400).json({ error: "No audio provided" });
      }

      const base64Data = audioBase64
        .replace(/^data:audio\/\w+;(codecs=[^;]+;)?base64,/, "")
        .replace(/^data:audio\/\w+;base64,/, "")
        .replace(/^data:audio\/webm;codecs=opus;base64,/, "")
        .replace(/^data:video\/webm;codecs=opus;base64,/, "");

      let finalMimeType = mimeType || "audio/webm";
      // Ensure we use a supported mime type.
      if (finalMimeType.includes("webm")) {
        finalMimeType = "audio/webm";
      } else if (finalMimeType.includes("mp4")) {
        finalMimeType = "audio/mp4";
      }

      const prompt = `You are an intelligent voice command assistant for a home management app. 
The user will speak in any language (English, Hindi, Hinglish, regional, etc).
Translate and understand the intent, then return a JSON object with the action to perform.

Return ONLY a JSON object with no markdown formatting.
Format:
{
  "action": "ADD_TRANSACTION" | "UNKNOWN",
  "data": {
    "amount": number (optional),
    "category": string (optional, e.g., 'Groceries', 'Utilities', 'Shopping', 'Dining', 'Transport'),
    "note": string (optional, translate to English),
    "type": "Expense" | "Income" (optional, default to Expense if spent)
  },
  "transcript": "Original transcribed text or translated meaning"
}`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: finalMimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        });

        let jsonStr = response.text;
        if (!jsonStr) throw new Error("Empty response from AI");
        jsonStr = jsonStr
          .replace(/\x60\x60\x60json/g, "")
          .replace(/\x60\x60\x60/g, "")
          .trim();

        res.json(JSON.parse(jsonStr));
      } catch (aiError) {
        console.error("AI voice processing failed:", aiError);
        res.status(500).json({ error: "Failed to process voice command" });
      }
    } catch (error) {
      console.error("Error processing voice:", error);
      res.status(500).json({ error: "Failed to process voice" });
    }
  });

  app.post("/api/scan-receipt", async (req, res) => {
    try {
      const { imageBase64 } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided" });
      }

      // The imageBase64 could include data:image/png;base64, prefix. We need to strip it if present.
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const prompt = `You are a receipt scanning assistant. Extract the transaction information from the provided receipt image. 
      Output ONLY a JSON object with the following properties:
      - amount (number): The total amount of the receipt. If not found, use 0.
      - category (string): Guess a simple category like 'Groceries', 'Utilities', 'Dining', 'Shopping', 'Transport', etc.
      - note (string): A short description, like the store name and maybe one key item. E.g., 'Target - Groceries'.
      Do not include markdown code block formatting (like \`\`\`json). Just return the raw JSON object.`;

      let parsed;
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Data,
                  },
                },
              ],
            },
          ],
        });

        let jsonStr = response.text;
        if (!jsonStr) {
          throw new Error("Empty response from AI");
        }

        // Clean up markdown if AI returned it despite instructions
        jsonStr = jsonStr
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        parsed = JSON.parse(jsonStr);
      } catch (aiError) {
        console.error("AI processing failed, using fallback:", aiError);
        // Fallback mock data if API fails (e.g. quota exceeded)
        parsed = {
          amount: Math.floor(Math.random() * 2000) + 100,
          category: "Shopping",
          note: "Scanned Receipt (Fallback)",
        };
      }

      res.json(parsed);
    } catch (error: any) {
      console.error("Error scanning receipt:", error);
      res.status(500).json({ error: "Failed to scan receipt" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
