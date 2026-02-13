
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { BrandIdentity } from "./types";

// Helper to create the AI client
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateBrandStrategy = async (mission: string): Promise<BrandIdentity> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Genera una identidad de marca completa basada en esta misión empresarial: "${mission}".
    Responde estrictamente en español y en formato JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brandName: { type: Type.STRING },
          slogan: { type: Type.STRING },
          missionStatement: { type: Type.STRING },
          colorPalette: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hex: { type: Type.STRING },
                name: { type: Type.STRING },
                usage: { type: Type.STRING }
              },
              required: ["hex", "name", "usage"]
            }
          },
          typography: {
            type: Type.OBJECT,
            properties: {
              headerFont: { type: Type.STRING },
              bodyFont: { type: Type.STRING },
              pairingReason: { type: Type.STRING }
            },
            required: ["headerFont", "bodyFont", "pairingReason"]
          },
          logoPrompt: { type: Type.STRING, description: "Detailed visual prompt for the primary logo in English" },
          secondaryMarkPrompt: { type: Type.STRING, description: "Detailed visual prompt for a secondary brand mark or icon in English" },
          brandVoice: { type: Type.STRING }
        },
        required: ["brandName", "slogan", "missionStatement", "colorPalette", "typography", "logoPrompt", "secondaryMarkPrompt", "brandVoice"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateBrandImage = async (prompt: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    // Cambiado de gemini-3-pro-image-preview a gemini-2.5-flash-image
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A professional, modern brand logo/mark. Style: Minimalist, clean, high-end vector aesthetic. Content: ${prompt}` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
        // Eliminado imageSize ya que solo es para gemini-3-pro-image-preview
      }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }
  
  if (!imageUrl) throw new Error("No se pudo generar la imagen");
  return imageUrl;
};

export const chatWithBrandExpert = async (message: string, context: BrandIdentity) => {
  const ai = getAIClient();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `Eres un experto consultor de branding. Tienes acceso a la identidad de marca actual: 
      Nombre: ${context.brandName}
      Slogan: ${context.slogan}
      Misión: ${context.missionStatement}
      Colores: ${context.colorPalette.map(c => c.name).join(', ')}
      Voz de marca: ${context.brandVoice}
      Responde siempre en español, de forma profesional y creativa.`,
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
