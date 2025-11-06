'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'

export default function Competitions() {
  const [competitions, setCompetitions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCompetitions()
  }, [])

  const loadCompetitions = async () => {
    try {
      const { data, error } = await supabase
        .from('competitions')
        .select('id, name, event_date, location, status, discipline')
        .order('event_date', { ascending: false })
        .limit(20)

      if (error) throw error

      const formatted = (data || []).map(c => ({
        id: c.id,
        name: c.name || 'Unnamed Event',
        date: c.event_date ? new Date(c.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
        location: c.location || 'Location TBD',
        status: c.status || (new Date(c.event_date) > new Date() ? 'upcoming' : 'completed'),
        discipline: c.discipline || 'General'
      }))

      setCompetitions(formatted.length > 0 ? formatted : getDefaultCompetitions())
    } catch (error) {
      console.error('Error loading competitions:', error)
      setCompetitions(getDefaultCompetitions())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultCompetitions = () => [
    { id: 'demo1', name: 'Dallas Barrel Racing Championship', date: 'Nov 15, 2025', location: 'Dallas, TX', status: 'upcoming', discipline: 'Barrel Racing' },
    { id: 'demo2', name: 'State Dressage Finals', date: 'Nov 22, 2025', location: 'Austin, TX', status: 'upcoming', discipline: 'Dressage' },
    { id: 'demo3', name: 'Fall Reining Classic', date: 'Oct 28, 2025', location: 'Houston, TX', status: 'completed', discipline: 'Reining' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
          Competitions & Events
        </h1>

        {loading && <div className="text-center py-12 text-gray-600">Loading competitions...</div>}

        {!loading && <div className="space-y-4">
          {competitions.map(comp => (
            <div key={comp.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-800">{comp.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      comp.status === 'upcoming' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                  <div className="flex gap-6 text-gray-600">
                    <p><span className="font-semibold">📅</span> {comp.date}</p>
                    <p><span className="font-semibold">📍</span> {comp.location}</p>
                    <p><span className="font-semibold">🏇</span> {comp.discipline}</p>
                  </div>
                </div>
                <Link
                  href={comp.status === 'upcoming' ? `/competitions/${comp.id}/register` : `/competitions/${comp.id}/results`}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-teal-700 inline-block"
                >
                  {comp.status === 'upcoming' ? 'Register' : 'View Results'}
                </Link>
              </div>
            </div>
          ))}
        </div>}

        {!loading && <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Find More Events</h2>
          <p className="text-gray-600 mb-6">Search for competitions by discipline, location, or date</p>
          <button 
            onClick={() => {
              const search = prompt('Search competitions by discipline, location, or name:')
              if (search) {
                window.location.href = `/competitions?search=${encodeURIComponent(search)}`
              }
            }}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-700 hover:to-teal-700"
          >
            Search Competitions
          </button>
        </div>}
      </div>
    </div>
  )
}

