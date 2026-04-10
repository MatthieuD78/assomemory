import Link from 'next/link'
import { MessageCircle, FileText, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AssoMemory
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Assistant intelligent pour les associations loi 1901
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Posez vos questions administratives et juridiques, notre IA vous répond en utilisant les documents de votre association.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Link 
            href="/dashboard/assos/chat"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <MessageCircle className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chat Assistant
              </h3>
              <p className="text-gray-600">
                Discutez avec l'IA pour obtenir des réponses sur vos documents
              </p>
            </div>
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8 opacity-75">
            <div className="flex flex-col items-center text-center">
              <FileText className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Documents
              </h3>
              <p className="text-gray-600">
                Gérez vos documents associatifs (bientôt disponible)
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 opacity-75">
            <div className="flex flex-col items-center text-center">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Membres
              </h3>
              <p className="text-gray-600">
                Gérez les membres de votre association (bientôt disponible)
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link 
            href="/dashboard/assos/chat"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Commencer à chatter
            <MessageCircle className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
