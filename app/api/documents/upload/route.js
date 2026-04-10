import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Récupérer le fichier
    const file = formData.get('file');
    const title = formData.get('title');
    const category = formData.get('category');
    const description = formData.get('description');
    const associationId = formData.get('associationId');
    const isMemory = formData.get('isMemory') === 'true';
    const memoryType = formData.get('memoryType');
    const memoryDate = formData.get('memoryDate');
    const isDeclaration = formData.get('isDeclaration') === 'true';
    const declarationType = formData.get('declarationType');
    const declarationDeadline = formData.get('declarationDeadline');
    const tags = JSON.parse(formData.get('tags') || '[]');
    const isPublic = formData.get('isPublic') === 'true';

    if (!file || !title || !category || !associationId) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Vérifier que l'association existe
    const association = await prisma.association.findUnique({
      where: { id: associationId }
    });

    if (!association) {
      return NextResponse.json(
        { error: 'Association non trouvée' },
        { status: 404 }
      );
    }

    // Créer le répertoire si nécessaire
    const uploadDir = path.join(process.cwd(), 'uploads', associationId);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Le répertoire existe déjà
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Créer l'entrée dans la base de données
    const document = await prisma.document.create({
      data: {
        title,
        type: file.type,
        category,
        description,
        url: `/uploads/${associationId}/${fileName}`,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        associationId,
        isMemory,
        memoryType: isMemory ? memoryType : null,
        memoryDate: isMemory && memoryDate ? new Date(memoryDate) : null,
        isDeclaration,
        declarationType: isDeclaration ? declarationType : null,
        declarationUrl: getDeclarationUrl(declarationType),
        declarationDeadline: isDeclaration && declarationDeadline ? new Date(declarationDeadline) : null,
        tags,
        isPublic
      }
    });

    // Vectoriser le document pour le RAG
    if (file.type.startsWith('text/') || file.type === 'application/pdf') {
      // TODO: Implémenter la vectorisation avec Qdrant
      // await vectorizeDocument(document.id, filePath);
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        title: document.title,
        category: document.category,
        url: document.url,
        uploadedAt: document.uploadedAt,
        vectorized: document.vectorized
      }
    });

  } catch (error) {
    console.error('Erreur upload document:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du document' },
      { status: 500 }
    );
  }
}

function getDeclarationUrl(declarationType) {
  const urls = {
    'PREFECTORALE': 'https://www.service-public.fr/associations/declaration-prefectorale',
    'FISCAL': 'https://www.impots.gouv.fr/portail/particulier/je-declare',
    'SOCIAL': 'https://www.urssaf.fr/portail/home/associations.html',
    'STATUTAIRE': 'https://www.greffe.fr/centrales-de-depots-et-de-conservations/les-centrales-de-depots-de-declarations',
    'CERFA': 'https://www.service-civilique.gouv.fr/cerfa-12156.html'
  };
  return urls[declarationType] || null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const associationId = searchParams.get('associationId');
    const category = searchParams.get('category');
    const isMemory = searchParams.get('isMemory');
    const isDeclaration = searchParams.get('isDeclaration');

    if (!associationId) {
      return NextResponse.json(
        { error: 'ID association requis' },
        { status: 400 }
      );
    }

    const where = { associationId };

    if (category) where.category = category;
    if (isMemory === 'true') where.isMemory = true;
    if (isDeclaration === 'true') where.isDeclaration = true;
    where.isArchived = false;

    const documents = await prisma.document.findMany({
      where,
      orderBy: { uploadedAt: 'desc' }
    });

    return NextResponse.json({ documents });

  } catch (error) {
    console.error('Erreur récupération documents:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des documents' },
      { status: 500 }
    );
  }
}
