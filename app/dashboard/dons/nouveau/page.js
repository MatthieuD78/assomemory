'use client';

import { useState } from 'react';
import { Building2, Calculator, FileText, ArrowRight } from 'lucide-react';

export default function NouveauDonPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    companySiret: '',
    companyEmail: '',
    companyAddress: '',
    contactName: '',
    phone: '',
    amount: '',
    purpose: 'Emploi local',
    associationId: ''
  });
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [taxBenefit, setTaxBenefit] = useState(null);
  const [associations, setAssociations] = useState([]);

  const calculateTaxBenefit = () => {
    if (!formData.amount) return;
    
    setIsCalculating(true);
    const amount = parseFloat(formData.amount);
    const reduction = amount * 0.6; // 60% de réduction d'impôt
    const netCost = amount - reduction;
    
    setTimeout(() => {
      setTaxBenefit({
        amount,
        reduction,
        netCost,
        percentage: 60
      });
      setIsCalculating(false);
    }, 500);
  };

  const handleAmountChange = (value) => {
    setFormData({ ...formData, amount: value });
    setTaxBenefit(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Appel API pour créer le don
    console.log('Don à créer:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Soutenir l'emploi local
            </h1>
            <p className="text-gray-600">
              Faites un don à une association locale et bénéficiez de 60% de réduction d'impôt
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section Entreprise */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Informations entreprise</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: SARL Dupont"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SIRET *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companySiret}
                    onChange={(e) => setFormData({ ...formData, companySiret: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="14 chiffres"
                    maxLength={14}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.companyEmail}
                    onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@entreprise.fr"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyAddress}
                    onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 rue de la République, 59000 Lille"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>
            </div>

            {/* Section Don */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Détails du don</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant du don (EUR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    onBlur={calculateTaxBenefit}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affectation *
                  </label>
                  <select
                    required
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Emploi local">Emploi local</option>
                    <option value="Projet sportif">Projet sportif</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Culture">Culture</option>
                    <option value="Environnement">Environnement</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Association bénéficiaire *
                  </label>
                  <select
                    required
                    value={formData.associationId}
                    onChange={(e) => setFormData({ ...formData, associationId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez une association</option>
                    {/* TODO: Charger la liste des associations depuis l'API */}
                    <option value="demo-1">Club Sportif Local</option>
                    <option value="demo-2">Association Culturelle</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calcul d'avantage fiscal */}
            {taxBenefit && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">Votre avantage fiscal</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {taxBenefit.amount.toLocaleString()} EUR
                    </div>
                    <div className="text-sm text-gray-600">Montant du don</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      -{taxBenefit.reduction.toLocaleString()} EUR
                    </div>
                    <div className="text-sm text-gray-600">Réduction d'impôt ({taxBenefit.percentage}%)</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {taxBenefit.netCost.toLocaleString()} EUR
                    </div>
                    <div className="text-sm text-gray-600">Coût net du don</div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Impact :</strong> Votre don de {taxBenefit.amount.toLocaleString()} EUR ne vous coûte que 
                    {taxBenefit.netCost.toLocaleString()} EUR après réduction d'impôt !
                  </p>
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!formData.amount || isCalculating}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FileText className="w-5 h-5" />
                Générer le CERFA et confirmer le don
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
