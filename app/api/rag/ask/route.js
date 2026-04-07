import { NextResponse } from 'next/server';
import { qdrantClient, COLLECTION_NAME } from '@/lib/qdrant/client';
import { generateEmbedding, askGemini } from '@/lib/gemini/embeddings';

export async function POST(req) {
  const { question, associationId } = await req.json();

  try {
    const questionEmbedding = await generateEmbedding(question);
    
    const searchResult = await qdrantClient.search(COLLECTION_NAME, {
      vector: questionEmbedding,
      limit: 5,
      filter: {
        must: [{
          key: 'associationId',
          match: { value: associationId }
        }]
      }
    });
    
    const context = searchResult.map(point => point.payload?.text).join('\n\n');
    const answer = await askGemini(question, context);
    
    return NextResponse.json({ answer, sources: searchResult.map(r => r.payload?.source) });
    
  } catch (error) {
    console.error('Erreur RAG:', error);
    return NextResponse.json({ error: 'Erreur lors du traitement' }, { status: 500 });
  }
}
