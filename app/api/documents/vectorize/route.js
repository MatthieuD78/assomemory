import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { qdrantClient, COLLECTION_NAME } from '@/lib/qdrant/client';
import { generateEmbedding } from '@/lib/gemini/embeddings';
import { readFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json(
        { error: 'ID document requis' },
        { status: 400 }
      );
    }

    // Récupérer le document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        association: true
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      );
    }

    // Lire le contenu du document
    const filePath = path.join(process.cwd(), 'uploads', document.associationId, path.basename(document.url));
    let content = '';

    try {
      const fileBuffer = await readFile(filePath);
      
      // Extraire le texte selon le type de fichier
      if (document.mimeType === 'application/pdf') {
        // TODO: Utiliser une librairie PDF pour extraire le texte
        content = `Contenu du document PDF: ${document.title}\n${document.description || ''}`;
      } else if (document.mimeType?.startsWith('text/')) {
        content = fileBuffer.toString('utf-8');
      } else {
        content = `Document: ${document.title}\n${document.description || ''}`;
      }

      // Ajouter les métadonnées
      const metadata = `
        Catégorie: ${document.category}
        Date: ${document.uploadedAt.toLocaleDateString('fr-FR')}
        Association: ${document.association.name}
        Tags: ${document.tags?.join(', ') || ''}
        ${document.isMemory ? `Type mémoire: ${document.memoryType}` : ''}
        ${document.isDeclaration ? `Type déclaration: ${document.declarationType}` : ''}
      `;

      content += metadata;

    } catch (error) {
      console.error('Erreur lecture fichier:', error);
      content = `Document: ${document.title}\n${document.description || ''}`;
    }

    // Générer l'embedding
    const embedding = await generateEmbedding(content);

    // Stocker dans Qdrant
    const point = {
      id: documentId,
      vector: embedding,
      payload: {
        documentId,
        title: document.title,
        text: content,
        category: document.category,
        associationId: document.associationId,
        source: document.url,
        tags: document.tags || [],
        uploadedAt: document.uploadedAt.toISOString()
      }
    };

    await qdrantClient.upsert(COLLECTION_NAME, {
      wait: true,
      points: [point]
    });

    // Marquer le document comme vectorisé
    await prisma.document.update({
      where: { id: documentId },
      data: { vectorized: true }
    });

    return NextResponse.json({
      success: true,
      message: 'Document vectorisé avec succès',
      documentId,
      vectorSize: embedding.length
    });

  } catch (error) {
    console.error('Erreur vectorisation document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vectorisation du document' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const associationId = searchParams.get('associationId');

    if (!associationId) {
      return NextResponse.json(
        { error: 'ID association requis' },
        { status: 400 }
      );
    }

    // Compter les documents non vectorisés
    const unvectorizedCount = await prisma.document.count({
      where: {
        associationId,
        vectorized: false,
        isArchived: false
      }
    });

    // Compter les documents vectorisés
    const vectorizedCount = await prisma.document.count({
      where: {
        associationId,
        vectorized: true,
        isArchived: false
      }
    });

    return NextResponse.json({
      associationId,
      totalDocuments: unvectorizedCount + vectorizedCount,
      vectorizedDocuments: vectorizedCount,
      unvectorizedDocuments: unvectorizedCount,
      vectorizationProgress: vectorizedCount / (vectorizedCount + unvectorizedCount) * 100
    });

  } catch (error) {
    console.error('Erreur statut vectorisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut de vectorisation' },
      { status: 500 }
    );
  }
}

// Fonction pour vectoriser tous les documents non vectorisés
export async function PUT(req) {
  try {
    const { associationId } = await req.json();

    if (!associationId) {
      return NextResponse.json(
        { error: 'ID association requis' },
        { status: 400 }
      );
    }

    // Récupérer tous les documents non vectorisés
    const documents = await prisma.document.findMany({
      where: {
        associationId,
        vectorized: false,
        isArchived: false
      },
      include: {
        association: true
      }
    });

    const results = [];
    
    for (const doc of documents) {
      try {
        // Appeler l'API de vectorisation pour chaque document
        const vectorResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/documents/vectorize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: doc.id })
        });

        if (vectorResponse.ok) {
          results.push({ documentId: doc.id, success: true });
        } else {
          results.push({ documentId: doc.id, success: false, error: 'Vectorisation failed' });
        }
      } catch (error) {
        results.push({ documentId: doc.id, success: false, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Vectorisation batch terminée: ${results.filter(r => r.success).length}/${results.length} documents traités`,
      results
    });

  } catch (error) {
    console.error('Erreur vectorisation batch:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vectorisation batch' },
      { status: 500 }
    );
  }
}
