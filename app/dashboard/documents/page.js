'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Calendar, 
  Search, 
  Filter,
  Clock,
  ExternalLink,
  History,
  AlertTriangle
} from 'lucide-react';

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TOUS');

  const categories = [
    { value: 'TOUS', label: 'Tous les documents', icon: FileText },
    { value: 'AG', label: 'Assemblées Générales', icon: Calendar },
    { value: 'BILAN', label: 'Bilans & Comptes', icon: FileText },
    { value: 'PROJET', label: 'Projets', icon: FileText },
    { value: 'DECLARATION', label: 'Déclarations Obligatoires', icon: AlertTriangle },
    { value: 'CONTRAT', label: 'Contrats', icon: FileText },
    { value: 'AUTRE', label: 'Autres', icon: FileText }
  ];

  const declarationTypes = {
    'PREFECTORALE': { 
      label: 'Déclaration Préfectorale', 
      url: 'https://www.service-public.fr/associations/declaration-prefectorale',
      deadline: '31 décembre'
    },
    'FISCAL': { 
      label: 'Déclaration Fiscale', 
      url: 'https://www.impots.gouv.fr/portail/particulier/je-declare',
      deadline: '15 mai'
    },
    'SOCIAL': { 
      label: 'Déclaration Sociale', 
      url: 'https://www.urssaf.fr/portail/home/associations.html',
      deadline: '31 janvier'
    },
    'STATUTAIRE': { 
      label: 'Déclaration Statutaire', 
      url: 'https://www.greffe.fr',
      deadline: '30 juin'
    }
  };

  const mockDocuments = [
    {
      id: '1',
      title: 'AG Ordinaire 2024',
      category: 'AG',
      description: 'Compte-rendu de l\'assemblée générale ordinaire',
      url: '/uploads/demo/ag-2024.pdf',
      uploadedAt: new Date('2024-03-15'),
      isMemory: true,
      memoryType: 'AG_ANNEE',
      memoryDate: new Date('2024-03-10'),
      vectorized: true,
      tags: ['AG', '2024', 'ordinaire']
    },
    {
      id: '2',
      title: 'Bilan Comptable 2023',
      category: 'BILAN',
      description: 'Bilan et compte de résultat exercice 2023',
      url: '/uploads/demo/bilan-2023.pdf',
      uploadedAt: new Date('2024-02-20'),
      isMemory: true,
      memoryType: 'BILAN_EXERCICE',
      memoryDate: new Date('2023-12-31'),
      vectorized: true,
      tags: ['bilan', '2023', 'comptabilité']
    },
    {
      id: '3',
      title: 'Déclaration Préfectorale 2024',
      category: 'DECLARATION',
      description: 'Déclaration administrative annuelle en préfecture',
      url: '/uploads/demo/declaration-prefectorale-2024.pdf',
      uploadedAt: new Date('2024-01-10'),
      isDeclaration: true,
      declarationType: 'PREFECTORALE',
      declarationUrl: 'https://www.service-public.fr/associations/declaration-prefectorale',
      declarationDeadline: new Date('2024-12-31'),
      vectorized: false,
      tags: ['déclaration', 'préfectorale', '2024']
    }
  ];

  useEffect(() => {
    // Simuler le chargement
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : FileText;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'AG': 'bg-blue-100 text-blue-800',
      'BILAN': 'bg-green-100 text-green-800',
      'PROJET': 'bg-purple-100 text-purple-800',
      'DECLARATION': 'bg-red-100 text-red-800',
      'CONTRAT': 'bg-yellow-100 text-yellow-800',
      'AUTRE': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredDocs = mockDocuments.filter(doc => {
    const matchesCategory = selectedCategory === 'TOUS' || doc.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Documents & Mémoire
              </h1>
              <p className="text-gray-600">
                Gérez vos documents, archivez l'histoire de votre association et suivez vos déclarations obligatoires
              </p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="w-5 h-5" />
              Nouveau document
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredDocs.length} document{filteredDocs.length > 1 ? 's' : ''} trouvé{filteredDocs.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Alertes déclarations */}
        {documents.some(doc => doc.isDeclaration) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Déclarations Obligatoires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(declarationTypes).map(([type, info]) => {
                const hasDeclaration = documents.some(doc => doc.declarationType === type);
                return (
                  <div key={type} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      {hasDeclaration ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{info.label}</div>
                        <div className="text-sm text-gray-600">Deadline: {info.deadline}</div>
                      </div>
                    </div>
                    <a
                      href={info.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Déclarer
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline mémoire associative */}
        {documents.some(doc => doc.isMemory) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Mémoire de l'Association
            </h3>
            <div className="space-y-4">
              {documents
                .filter(doc => doc.isMemory)
                .sort((a, b) => new Date(b.memoryDate) - new Date(a.memoryDate))
                .map(doc => (
                  <div key={doc.id} className="flex items-center gap-4 p-3 bg-white rounded-lg">
                    <div className="flex-shrink-0">
                      {getCategoryIcon(doc.category)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{doc.title}</div>
                      <div className="text-sm text-gray-600">
                        {doc.memoryDate?.toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Liste des documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tous les documents</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredDocs.map((doc) => {
              const Icon = getCategoryIcon(doc.category);
              return (
                <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0">
                        <Icon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium text-gray-900">{doc.title}</h3>
                          {doc.vectorized && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              IA Indexé
                            </span>
                          )}
                        </div>
                        {doc.description && (
                          <p className="text-gray-600 mt-1">{doc.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{doc.uploadedAt.toLocaleDateString('fr-FR')}</span>
                          {doc.tags && (
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              {doc.tags.map(tag => (
                                <span key={tag} className="text-gray-600">#{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" />
                        Voir
                      </a>
                      {doc.isDeclaration && doc.declarationUrl && (
                        <a
                          href={doc.declarationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Service
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

