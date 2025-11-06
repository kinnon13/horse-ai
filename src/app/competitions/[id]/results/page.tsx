'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'

export default function CompetitionResults() {
  const params = useParams()
  const competitionId = params.id as string
  
  const [competition, setCompetition] = useState<any>(null)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [competitionId])

  const loadResults = async () => {
    // Load competition
    const { data: comp } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', competitionId)
      .single()

    setCompetition(comp)

    // Load results
    const { data: resultData } = await supabase
      .from('competition_results')
      .select(`
        *,
        horses:horse_id (barn_name, registered_name),
        users:user_id (email)
      `)
      .eq('competition_id', competitionId)
      .order('placement', { ascending: true })

    setResults(resultData || [])
    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading results...</div>
  }

  if (!competition) {
    return <div className="min-h-screen flex items-center justify-center">Competition not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/competitions" className="text-cyan-600 hover:underline mb-4 inline-block">
          ← Back to Competitions
        </Link>

        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
          {competition.name}
        </h1>
        <div className="flex gap-6 text-gray-600 mb-8">
          <p>📅 {new Date(competition.event_date).toLocaleDateString()}</p>
          <p>📍 {competition.location}</p>
          <p>🏇 {competition.discipline}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Results & Standings</h2>
          </div>

          {results.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Place</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Horse</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rider</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time/Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr key={result.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        result.placement === 1 ? 'bg-amber-400 text-white' :
                        result.placement === 2 ? 'bg-gray-300 text-gray-700' :
                        result.placement === 3 ? 'bg-amber-600 text-white' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {result.placement}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {result.horses?.barn_name || result.horses?.registered_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {result.rider_name || result.users?.email?.split('@')[0] || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-800">
                      {result.time || result.score || '-'}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      {result.earnings ? `$${result.earnings.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p className="text-xl mb-2">No results posted yet</p>
              <p className="text-sm">Check back after the competition</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

