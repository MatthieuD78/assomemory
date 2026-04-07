import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: 'embedding-001' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function askGemini(question, context) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `
Tu es l'assistant juridique et administratif d'une association loi 1901.
Contexte (documents de l'association) : ${context}

Question : ${question}

Réponse de façon précise et concise.
  `;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
