'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

interface DashboardData {
  business: {
    id: string
    business_name: string
    ranking_score: number
    verified: boolean
    crm_uploaded: boolean
    total_contacts_uploaded: number
    verified_contacts_count: number
    search_matches_30d: number
  }
  rankings: {
    overall_rank: number
    total_businesses: number
    category_rank: number
    state_rank: number
    percentile: number
  }
  competitors: Array<{
    business_name: string
    ranking_score: number
    rank: number
  }>
  matches: {
    total_matches: number
    total_clicks: number
    total_conversions: number
    conversion_rate: number
  }
  recentMatches: Array<{
    query_text: string
    created_at: string
    clicked: boolean
    converted: boolean
  }>
}

export default function BusinessDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      // For MVP: hardcode business ID (later: get from auth/session)
      const businessId = 'demo-business-id'
      const response = await fetch(`/api/business/dashboard?businessId=${businessId}`)
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (error) {
      console.error('Dashboard load error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No business found</p>
          <a href="/business/claim" className="text-blue-600 hover:underline">Claim your business →</a>
        </div>
      </div>
    )
  }

  const { business, rankings, competitors, matches, recentMatches } = data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.business_name}</h1>
          <div className="flex items-center gap-4">
            {business.verified && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✓ Verified
              </span>
            )}
            {business.crm_uploaded && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                CRM Connected
              </span>
            )}
          </div>
        </div>

        {/* Rankings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Overall Rank</div>
            <div className="text-3xl font-bold text-gray-900">#{rankings.overall_rank}</div>
            <div className="text-sm text-gray-500 mt-1">of {rankings.total_businesses}</div>
            <div className="mt-2 text-xs text-green-600">Top {rankings.percentile}%</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Ranking Score</div>
            <div className="text-3xl font-bold text-blue-600">{business.ranking_score}</div>
            <div className="text-sm text-gray-500 mt-1">points</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Search Matches</div>
            <div className="text-3xl font-bold text-gray-900">{business.search_matches_30d}</div>
            <div className="text-sm text-gray-500 mt-1">last 30 days</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
            <div className="text-3xl font-bold text-green-600">{matches.conversion_rate}%</div>
            <div className="text-sm text-gray-500 mt-1">{matches.total_conversions} conversions</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* CRM Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">CRM Upload Status</h2>
              {business.crm_uploaded ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Total Contacts</span>
                      <span className="font-semibold">{business.total_contacts_uploaded}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Verified Matches</span>
                      <span className="font-semibold text-green-600">{business.verified_contacts_count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Match Rate</span>
                      <span className="font-semibold">
                        {Math.round((business.verified_contacts_count / business.total_contacts_uploaded) * 100)}%
                      </span>
                    </div>
                  </div>
                  <a
                    href="/business/crm-upload"
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700"
                  >
                    Upload More Contacts
                  </a>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    Upload your customer list to see how many are already HorseGPT users.
                  </p>
                  <a
                    href="/business/crm-upload"
                    className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700"
                  >
                    Upload CRM (+200 points)
                  </a>
                </>
              )}
            </div>

            {/* Recent Matches */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Search Matches</h2>
              {recentMatches.length > 0 ? (
                <div className="space-y-3">
                  {recentMatches.map((match, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-3 py-2">
                      <div className="text-sm font-medium text-gray-900">{match.query_text}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(match.created_at).toLocaleDateString()}
                        </span>
                        {match.clicked && (
                          <span className="text-xs text-blue-600 font-medium">Clicked</span>
                        )}
                        {match.converted && (
                          <span className="text-xs text-green-600 font-medium">Converted</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent matches</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Competitor Rankings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Competitors</h2>
              <div className="space-y-3">
                {competitors.map((competitor, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      competitor.business_name === business.business_name
                        ? 'bg-blue-50 border-2 border-blue-500'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-gray-400">#{competitor.rank}</div>
                      <div>
                        <div className="font-medium text-gray-900">{competitor.business_name}</div>
                        {competitor.business_name === business.business_name && (
                          <div className="text-xs text-blue-600 font-medium">You</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{competitor.ranking_score}</div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ranking Factors */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">How to Improve Your Rank</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${business.verified ? 'text-green-600' : 'text-gray-400'}`}>
                    {business.verified ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Verify Business</div>
                    <div className="text-sm text-gray-500">+100 points</div>
                  </div>
                  {!business.verified && (
                    <button className="text-sm text-blue-600 font-medium hover:underline">
                      Verify Now
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${business.crm_uploaded ? 'text-green-600' : 'text-gray-400'}`}>
                    {business.crm_uploaded ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Upload CRM</div>
                    <div className="text-sm text-gray-500">+200 points</div>
                  </div>
                  {!business.crm_uploaded && (
                    <a
                      href="/business/crm-upload"
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Upload
                    </a>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-gray-400">○</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Get Search Matches</div>
                    <div className="text-sm text-gray-500">+10 points each</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-gray-400">○</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Get Clicks</div>
                    <div className="text-sm text-gray-500">+20 points each</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 text-gray-400">○</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Get Conversions</div>
                    <div className="text-sm text-gray-500">+50 points each</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

