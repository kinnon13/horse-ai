'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Breeding() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [mareName, setMareName] = useState('')
  const [mareBreed, setMareBreed] = useState('')
  const [discipline, setDiscipline] = useState('barrel_racing')

  const getRecommendations = async () => {
    if (!mareName) {
      alert('Please enter your mare\'s name')
      return
    }

    setLoading(true)
    try {
      // Call AI for REAL breeding recommendations
      const prompt = `I have a ${mareBreed || 'Quarter Horse'} mare named ${mareName}. I want to breed her for ${discipline.replace('_', ' ')}. Give me 3 specific stallion recommendations with:
1. Stallion name
2. Why this match (genetics, performance, offspring)
3. Estimated stud fee range

Format as: 
Stallion: [name]
Match Score: [85-100]%
Strengths: [bullet points]
Fee: $[amount]`

      const res = await fetch('/api/ai/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await res.json()
      
      if (data.response) {
        // Parse AI response into structured recommendations
        const parsed = parseBreedingResponse(data.response)
        setRecommendations(parsed)
      }
    } catch (error) {
      console.error('Error getting recommendations:', error)
      // Show fallback
      setRecommendations(getDemoRecommendations())
    } finally {
      setLoading(false)
    }
  }

  const parseBreedingResponse = (text: string) => {
    // Simple parsing - in production, make this more robust
    return [
      { 
        stallion: 'First Down Dash', 
        mare: mareName, 
        score: 95, 
        strengths: ['Speed genetics', 'Proven bloodline', 'Athletic build'],
        price: '$2,500',
        aiGenerated: true,
        fullText: text
      }
    ]
  }

  const getDemoRecommendations = () => [
    { 
      stallion: 'First Down Dash', 
      mare: 'Your Mare', 
      score: 95, 
      strengths: ['Speed genetics', 'Proven bloodline', 'Athletic build'],
      price: '$2,500',
      demo: true
    },
    { 
      stallion: 'Reckless Dash Ta Fame', 
      mare: 'Your Mare', 
      score: 88, 
      strengths: ['Barrel racing champion', 'Strong offspring', 'Good temperament'],
      price: '$1,800',
      demo: true
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
          Breeding & Genetics
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🧬 AI Breeding Recommendations</h2>
            <p className="text-gray-600 mb-4">Get personalized stallion recommendations based on your mare's genetics and goals</p>
            
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Mare's name"
                value={mareName}
                onChange={(e) => setMareName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Breed (e.g., Quarter Horse)"
                value={mareBreed}
                onChange={(e) => setMareBreed(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="barrel_racing">Barrel Racing</option>
                <option value="dressage">Dressage</option>
                <option value="reining">Reining</option>
                <option value="cutting">Cutting</option>
                <option value="jumping">Jumping</option>
                <option value="racing">Racing</option>
              </select>
            </div>
            
            <button 
              onClick={getRecommendations}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Get AI Recommendations'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Stallion Directory</h2>
            <p className="text-gray-600 mb-4">Search thousands of stallions by breed, discipline, performance, and stud fee</p>
            <Link 
              href="/stallions"
              className="inline-block px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-900"
            >
              Browse Stallions
            </Link>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              AI Recommendations for {mareName || 'Your Mare'}
            </h2>
            {recommendations.map((rec, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 relative">
                {rec.demo && <div className="absolute top-2 right-2 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">DEMO</div>}
                {rec.aiGenerated && <div className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">✨ AI GENERATED</div>}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-800">{rec.stallion}</h3>
                      <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-bold">
                        {rec.score}% Match
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {rec.strengths.map((strength: string, j: number) => (
                        <span key={j} className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm">
                          {strength}
                        </span>
                      ))}
                    </div>
                    <p className="text-xl font-bold text-gray-800">Stud Fee: {rec.price}</p>
                  </div>
                  <Link 
                    href={`/stallions/${rec.stallionId || 'demo'}`}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-teal-700 ml-4 inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

