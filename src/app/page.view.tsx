'use client'
import Link from 'next/link'

export function PageView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            AI for Horse People
          </h1>
          <p className="text-2xl text-gray-700 mb-8">Your intelligent assistant for training, breeding, and care</p>
          <div className="flex gap-4 justify-center">
            <Link href="/chat" className="px-8 py-4 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition">
              Try Free
            </Link>
            <Link href="/download" className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg text-lg font-semibold hover:bg-purple-50 transition">
              Download App
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">Ask</h3>
            <p className="text-gray-600">Chat naturally with AI trained on equine expertise</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold mb-2">AI Remembers</h3>
            <p className="text-gray-600">Your conversations, horses, and preferences are learned</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2">Get Insights</h3>
            <p className="text-gray-600">Personalized recommendations and expert advice</p>
          </div>
        </div>
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <p className="text-lg text-gray-700"><strong>Used by 10,000+</strong> horse owners, trainers, and breeders worldwide</p>
        </div>
      </div>
    </div>
  )
}
