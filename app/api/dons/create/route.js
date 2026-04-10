import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const {
      companyName,
      companySiret,
      companyEmail,
      companyAddress,
      contactName,
      phone,
      amount,
      purpose,
      associationId
    } = await req.json();

    // Validation des données
    if (!companyName || !companySiret || !companyEmail || !amount || !associationId) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }

    // Vérifier si l'entreprise existe déjà
    let company = await prisma.company.findUnique({
      where: { siret: companySiret }
    });

    // Créer l'entreprise si elle n'existe pas
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: companyName,
          siret: companySiret,
          email: companyEmail,
          address: companyAddress,
          contactName,
          phone
        }
      });
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

    // Créer le don
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        date: new Date(),
        purpose,
        status: 'PENDING',
        companyId: company.id,
        associationId,
        cerfaNumber: generateCerfaNumber()
      },
      include: {
        company: true,
        association: true
      }
    });

    // Calculer et attribuer le label si nécessaire
    await calculateAndAssignLabel(company.id);

    return NextResponse.json({
      success: true,
      donation,
      taxBenefit: {
        amount: parseFloat(amount),
        reduction: parseFloat(amount) * 0.6,
        netCost: parseFloat(amount) * 0.4,
        percentage: 60
      }
    });

  } catch (error) {
    console.error('Erreur création don:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du don' },
      { status: 500 }
    );
  }
}

function generateCerfaNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `CERFA-${year}-${random}`;
}

async function calculateAndAssignLabel(companyId) {
  try {
    // Récupérer tous les dons de l'entreprise pour l'année en cours
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    const totalDonations = await prisma.donation.aggregate({
      where: {
        companyId,
        date: {
          gte: startOfYear,
          lte: endOfYear
        },
        status: 'RECEIVED'
      },
      _sum: {
        amount: true
      }
    });

    const totalAmount = totalDonations._sum.amount || 0;

    // Récupérer les niveaux de label disponibles
    const labelTiers = await prisma.labelTier.findMany({
      where: { isActive: true },
      orderBy: { minDonation: 'desc' }
    });

    // Trouver le label approprié
    let eligibleLabel = null;
    for (const tier of labelTiers) {
      if (totalAmount >= tier.minDonation) {
        eligibleLabel = tier;
        break;
      }
    }

    if (eligibleLabel) {
      // Vérifier si l'entreprise a déjà ce label ou un label supérieur
      const existingLabel = await prisma.companyLabel.findFirst({
        where: {
          companyId,
          isActive: true
        },
        include: {
          labelTier: true
        }
      });

      // Attribuer le nouveau label si c'est une amélioration
      if (!existingLabel || eligibleLabel.minDonation > existingLabel.labelTier.minDonation) {
        // Désactiver l'ancien label s'il existe
        if (existingLabel) {
          await prisma.companyLabel.update({
            where: { id: existingLabel.id },
            data: { isActive: false }
          });
        }

        // Créer le nouveau label
        await prisma.companyLabel.create({
          data: {
            companyId,
            labelTierId: eligibleLabel.id,
            badgeUrl: eligibleLabel.badgeUrl,
            startDate: new Date()
          }
        });

        return eligibleLabel;
      }
    }

    return null;
  } catch (error) {
    console.error('Erreur calcul label:', error);
    return null;
  }
}
