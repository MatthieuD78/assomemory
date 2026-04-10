'use client';

import { useState, useEffect } from 'react';
import { Building2, Calendar, DollarSign, FileText, TrendingUp, Users, Award } from 'lucide-react';

export default function SuiviDonsPage() {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
    companiesCount: 0,
    avgDonation: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Charger les données depuis l'API
    const mockData = {
      donations: [
        {
          id: '1',
          amount: 1000,
          date: new Date('2024-01-15'),
          purpose: 'Emploi local',
          status: 'RECEIVED',
          company: {
            name: 'SARL Dupont',
            siret: '12345678901234',
            contactName: 'Jean Dupont'
          },
          cerfaNumber: 'CERFA-2024-123456',
          cerfaUrl: '/cerfa/CERFA-2024-123456.pdf'
        },
        {
          id: '2',
          amount: 2500,
          date: new Date('2024-02-20'),
          purpose: 'Projet sportif',
          status: 'PENDING',
          company: {
            name: 'Entreprise Martin',
            siret: '98765432109876',
            contactName: 'Marie Martin'
          },
          cerfaNumber: 'CERFA-2024-789012',
          cerfaUrl: null
        }
      ],
      stats: {
        totalAmount: 3500,
        totalDonations: 2,
        companiesCount: 2,
        avgDonation: 1750
      }
    };

    setTimeout(() => {
      setDonations(mockData.donations);
      setStats(mockData.stats);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'RECEIVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'RECEIVED':
        return 'Reçu';
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Confirmé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Suivi des dons
          </h1>
          <p className="text-gray-600">
            Consultez l'ensemble des dons reçus et téléchargez les reçus fiscaux
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total reçu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAmount.toLocaleString()} EUR
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nombre de dons</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entreprises donatrices</p>
                <p className="text-2xl font-bold text-gray-900">{stats.companiesCount}</p>
              </div>
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Don moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgDonation.toLocaleString()} EUR
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tableau des dons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Historique des dons</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Affectation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.date.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {donation.company.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          SIRET: {donation.company.siret}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.company.contactName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {donation.amount.toLocaleString()} EUR
                      </div>
                      <div className="text-sm text-green-600">
                        -{(donation.amount * 0.6).toLocaleString()} EUR d'impôt
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {donation.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                        {getStatusLabel(donation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {donation.cerfaUrl && (
                          <button className="text-blue-600 hover:text-blue-900 flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            CERFA
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900">
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Labels partenaires</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Consultez les entreprises labellisées et leur niveau de reconnaissance
            </p>
            <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
              Voir les labels
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Rapport annuel</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Générez un rapport détaillé des dons pour votre assemblée générale
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Générer le rapport
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Nouveau don</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Enregistrez un nouveau don et générez automatiquement le CERFA
            </p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Enregistrer un don
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
