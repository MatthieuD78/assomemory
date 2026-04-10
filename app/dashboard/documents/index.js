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
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Upload className="w-5 h-5" />
              Nouveau document
            </button>
          </div>
        </div>

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
                              <span className="text-gray-400">#</span>
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
