import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jsPDF from 'jspdf';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Récupérer les informations du don
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        company: true,
        association: true
      }
    });

    if (!donation) {
      return NextResponse.json(
        { error: 'Don non trouvé' },
        { status: 404 }
      );
    }

    // Générer le PDF CERFA
    const pdf = generateCerfaPDF(donation);

    // Sauvegarder l'URL du CERFA dans la base de données
    const cerfaUrl = `/cerfa/${donation.cerfaNumber}.pdf`;
    
    await prisma.donation.update({
      where: { id },
      data: { cerfaUrl }
    });

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="CERFA-${donation.cerfaNumber}.pdf"`
      }
    });

  } catch (error) {
    console.error('Erreur génération CERFA:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du CERFA' },
      { status: 500 }
    );
  }
}

function generateCerfaPDF(donation) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // En-tête CERFA
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CERFA 12156*06', pageWidth / 2, 30, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Reçu de don à une association', pageWidth / 2, 45, { align: 'center' });
  
  // Numéro de reçu
  pdf.setFontSize(12);
  pdf.text(`Numéro de reçu : ${donation.cerfaNumber}`, 20, 70);
  pdf.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 20, 80);
  
  // Informations donateur
  pdf.setFont('helvetica', 'bold');
  pdf.text('DONATEUR', 20, 110);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nom : ${donation.company.name}`, 20, 125);
  pdf.text(`SIRET : ${donation.company.siret}`, 20, 135);
  pdf.text(`Adresse : ${donation.company.address}`, 20, 145);
  pdf.text(`Contact : ${donation.company.contactName}`, 20, 155);
  pdf.text(`Email : ${donation.company.email}`, 20, 165);
  
  if (donation.company.phone) {
    pdf.text(`Téléphone : ${donation.company.phone}`, 20, 175);
  }
  
  // Informations association bénéficiaire
  pdf.setFont('helvetica', 'bold');
  pdf.text('ASSOCIATION BÉNÉFICIAIRE', 20, 200);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nom : ${donation.association.name}`, 20, 215);
  pdf.text(`SIRET : ${donation.association.siret}`, 20, 225);
  pdf.text(`Email : ${donation.association.email}`, 20, 235);
  
  // Détails du don
  pdf.setFont('helvetica', 'bold');
  pdf.text('DÉTAILS DU DON', 20, 260);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Montant : ${donation.amount.toLocaleString('fr-FR')} EUR`, 20, 275);
  pdf.text(`Date du don : ${donation.date.toLocaleDateString('fr-FR')}`, 20, 285);
  pdf.text(`Affectation : ${donation.purpose}`, 20, 295);
  
  // Calcul avantage fiscal
  const reduction = donation.amount * 0.6;
  const netCost = donation.amount * 0.4;
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('AVANTAGE FISCAL', 20, 320);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Montant du don : ${donation.amount.toLocaleString('fr-FR')} EUR`, 20, 335);
  pdf.text(`Taux de réduction : 60%`, 20, 345);
  pdf.text(`Réduction d\'impôt : ${reduction.toLocaleString('fr-FR')} EUR`, 20, 355);
  pdf.text(`Coût net du don : ${netCost.toLocaleString('fr-FR')} EUR`, 20, 365);
  
  // Mentions légales
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  const mention = 'Ce reçu permet au donateur de bénéficier d\'une réduction d\'impôt sur le revenu égale à 60% du montant du don, dans la limite de 5% du revenu imposable. L\'association s\'engage à utiliser les fonds conformément à son objet social.';
  
  const lines = pdf.splitTextToSize(mention, pageWidth - 40);
  pdf.text(lines, 20, pageHeight - 60);
  
  // Signature
  pdf.setFont('helvetica', 'bold');
  pdf.text('Signature du représentant de l\'association', pageWidth - 100, pageHeight - 30);
  
  return pdf.output('arraybuffer');
}
