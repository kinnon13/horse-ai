import { Header } from '@/components/Header'

export function ProviderLoginNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Provider Not Found</h1>
          <p className="text-gray-600 mb-6">You need to set up your provider profile first.</p>
          <button
            onClick={() => window.location.href = '/provider-portal'}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    </div>
  )
}




