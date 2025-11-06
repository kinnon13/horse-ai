'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/useAuth'

export default function CompetitionRegister() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const competitionId = params.id as string
  
  const [competition, setCompetition] = useState<any>(null)
  const [horses, setHorses] = useState<any[]>([])
  const [selectedHorse, setSelectedHorse] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [competitionId, user])

  const loadData = async () => {
    // Load competition
    const { data: comp } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', competitionId)
      .single()

    setCompetition(comp)

    // Load user's horses
    if (user) {
      const { data: userHorses } = await supabase
        .from('horses_master')
        .select('id, barn_name, registered_name, breed')
        .eq('owner_id', user.id)

      setHorses(userHorses || [])
    }

    setLoading(false)
  }

  const handleRegister = async () => {
    if (!user) {
      alert('Please sign in to register')
      router.push('/auth/signin')
      return
    }

    if (!selectedHorse) {
      alert('Please select a horse')
      return
    }

    setSubmitting(true)

    try {
      // Create registration
      const { data: registration, error } = await supabase
        .from('competition_registrations')
        .insert({
          competition_id: competitionId,
          user_id: user.id,
          horse_id: selectedHorse,
          status: 'pending',
          entry_fee_paid: false
        })
        .select()
        .single()

      if (error) throw error

      // Process payment via Stripe
      const res = await fetch('/api/competitions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: registration.id,
          competitionId,
          horseId: selectedHorse,
          amount: competition.entry_fee || 5000 // $50 default
        })
      })

      const data = await res.json()

      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl
      } else {
        alert('✅ Registration submitted! (No payment required)')
        router.push('/competitions')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('❌ Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!competition) {
    return <div className="min-h-screen flex items-center justify-center">Competition not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
          Register for Competition
        </h1>
        <p className="text-xl text-gray-600 mb-8">{competition.name}</p>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-4 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">{new Date(competition.event_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold">{competition.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Discipline</p>
              <p className="font-semibold">{competition.discipline}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Entry Fee</p>
              <p className="font-semibold text-cyan-600">${(competition.entry_fee || 5000) / 100}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Horse</label>
            {horses.length > 0 ? (
              <select
                value={selectedHorse}
                onChange={(e) => setSelectedHorse(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Choose a horse</option>
                {horses.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.barn_name || h.registered_name} ({h.breed})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-800">You need to add a horse first.</p>
                <button
                  onClick={() => router.push('/horses/new')}
                  className="mt-2 text-cyan-600 hover:underline font-semibold"
                >
                  Add Horse →
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleRegister}
              disabled={!selectedHorse || submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50"
            >
              {submitting ? 'Processing...' : `Pay $${(competition.entry_fee || 5000) / 100} & Register`}
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

