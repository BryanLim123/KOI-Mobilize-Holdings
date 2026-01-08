/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import { GoogleGenAI } from "@google/genai";
import { Product, AIKnowledgeItem } from '../types';

const getSystemInstruction = (products: Product[], knowledge: AIKnowledgeItem[]) => {
  // Debug Log for Knowledge Base Content
  console.log("=== AI KNOWLEDGE BASE CONTENT ===");
  console.log(knowledge);
  console.log("=================================");

  // Process Products for context
  const productContext = products.map(p => 
    `- ${p.name} (${p.category}): ${p.description}. Key Features: ${p.features.join(', ')}`
  ).join('\n');

  // Process Knowledge Base for context
  const groupedKnowledge: Record<string, string[]> = {};
  knowledge.forEach(item => {
    // Normalize keys slightly to handle varied CSV inputs
    const cat = item.category || 'General';
    if (!groupedKnowledge[cat]) {
      groupedKnowledge[cat] = [];
    }
    groupedKnowledge[cat].push(item.information);
  });

  const knowledgeContext = Object.entries(groupedKnowledge).map(([cat, infos]) => {
    return `### ${cat}:\n${infos.map(info => `- ${info}`).join('\n')}`;
  }).join('\n\n');

  return `You are the Chief Strategy Officer (CSO) of "KOI Mobilize Holdings", a global IP platform connecting Games, Media, and Digital Assets.
  
  **Your Persona:**
  - Tone: Professional, authoritative yet accessible, visionary, and commercially sharp.
  - Style: Use strategic terminology (e.g., "ecosystem synergy", "value capture", "IP scalability", "market interoperability").
  - Role: You are not just a support bot; you are a strategic advisor helping users understand the business value and vision of KOI.

  **Core Knowledge Base (Use this to answer questions):**
  ${knowledgeContext}
  
  **Our IP Portfolio:**
  ${productContext}
  
  **CRITICAL RULES:**
  1. **SECRET CODES:** If the user asks for a "secret code", "passphrase", "signal", or "暗号", you must look specifically in the category **'Secret_Code'** (or similar) in the Core Knowledge Base above.
     - IF you find an explicit code there, reveal it.
     - IF you do NOT find it, you must say: "I have not received the secret code data yet from the system." Do NOT invent, hallucinate, or guess a code.
  
  2. Answer inquiries about our IPs, business model, and strategic vision using the Knowledge Base provided.
  3. If a user asks about something not in the knowledge base, pivot gracefully to our core mission of connecting digital and physical worlds.
  4. Keep answers concise (max 3-4 sentences) unless a deep dive is requested.
  5. If asked about purchasing, clarify that we focus on licensing, B2B partnerships, and ecosystem development.
  
  Contact Email: info@koinflation.co`;
};

export const sendMessageToGemini = async (
    history: {role: string, text: string}[], 
    newMessage: string,
    products: Product[],
    knowledge: AIKnowledgeItem[]
): Promise<string> => {
  try {
    let apiKey: string | undefined;
    
    try {
      apiKey = process.env.API_KEY;
    } catch (e) {
      console.warn("Accessing process.env failed");
    }
    
    if (!apiKey) {
      return "I'm sorry, I cannot connect to the secure server right now. (Missing API Key)";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: getSystemInstruction(products, knowledge),
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I seem to be having trouble analyzing that request at the moment. Please try again later.";
  }
};