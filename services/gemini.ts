import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // Use the API Key from the environment
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const sendMessageToGemini = async (message: string, history: {role: 'user' | 'model', text: string}[]) => {
  try {
    const ai = getClient();
    
    // Format history for the chat model
    // Note: This simple implementation sends the message as a fresh prompt with context 
    // or uses the chat feature if we were maintaining a stateful object. 
    // For simplicity in this functional component architecture, we'll use a new chat instance each time 
    // or just generate content if history is short. Let's use chat.
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "Sen 9-B sinfining virtual yordamchisisan. O'quvchilarning savollariga o'zbek tilida, do'stona va qisqa javob ber. Maktab, fanlar va umumiy bilimlar haqida gaplash.",
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Uzr, hozir javob bera olmayman. Keyinroq urinib ko'ring.";
  }
};
