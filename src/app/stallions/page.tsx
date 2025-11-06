'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'

export default function StallionDirectory() {
  const [stallions, setStallions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    breed: '',
    discipline: '',
    maxFee: ''
  })

  useEffect(() => {
    loadStallions()
  }, [])

  const loadStallions = async () => {
    try {
      const { data, error } = await supabase
        .from('stud_services')
        .select(`
          *,
          horses:horse_id (
            id,
            registered_name,
            barn_name,
            breed,
            sex,
            color,
            yob
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      const formatted = (data || []).map(s => ({
        id: s.id,
        horseId: s.horse_id,
        name: s.horses?.registered_name || s.horses?.barn_name || 'Unknown Stallion',
        breed: s.horses?.breed || 'Unknown',
        discipline: s.discipline || 'General',
        studFee: s.stud_fee_cents ? `$${(s.stud_fee_cents / 100).toLocaleString()}` : 'Contact for price',
        location: s.location || 'Location not specified',
        offspring: s.offspring_count || 0,
        description: s.description || ''
      }))

      setStallions(formatted.length > 0 ? formatted : getDemoStallions())
    } catch (error) {
      console.error('Error loading stallions:', error)
      setStallions(getDemoStallions())
    } finally {
      setLoading(false)
    }
  }

  const getDemoStallions = () => [
    { 
      id: 'demo1',
      horseId: 'demo1',
      name: 'First Down Dash',
      breed: 'Quarter Horse',
      discipline: 'Barrel Racing',
      studFee: '$2,500',
      location: 'Texas',
      offspring: 150,
      description: 'AQHA Champion, proven barrel racing bloodlines'
    },
    {
      id: 'demo2',
      horseId: 'demo2',
      name: 'Reckless Dash Ta Fame',
      breed: 'Quarter Horse',
      discipline: 'Barrel Racing',
      studFee: '$1,800',
      location: 'Oklahoma',
      offspring: 89,
      description: 'Strong offspring record, excellent temperament'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
          Stallion Directory
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Filter Stallions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={filters.breed}
              onChange={(e) => setFilters({...filters, breed: e.target.value})}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">All Breeds</option>
              <option value="Quarter Horse">Quarter Horse</option>
              <option value="Thoroughbred">Thoroughbred</option>
              <option value="Paint">Paint</option>
              <option value="Appaloosa">Appaloosa</option>
            </select>

            <select
              value={filters.discipline}
              onChange={(e) => setFilters({...filters, discipline: e.target.value})}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">All Disciplines</option>
              <option value="Barrel Racing">Barrel Racing</option>
              <option value="Reining">Reining</option>
              <option value="Cutting">Cutting</option>
              <option value="Racing">Racing</option>
            </select>

            <select
              value={filters.maxFee}
              onChange={(e) => setFilters({...filters, maxFee: e.target.value})}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Any Price</option>
              <option value="1000">Under $1,000</option>
              <option value="2500">Under $2,500</option>
              <option value="5000">Under $5,000</option>
              <option value="10000">Under $10,000</option>
            </select>
          </div>
        </div>

        {loading && <div className="text-center py-12 text-gray-600">Loading stallions...</div>}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stallions.map(stallion => (
              <div key={stallion.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{stallion.name}</h3>
                  <p className="text-gray-300">{stallion.breed}</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
                        {stallion.discipline}
                      </span>
                    </div>
                    <p className="text-gray-600">{stallion.description}</p>
                    <div className="flex justify-between text-sm text-gray-600 pt-3 border-t">
                      <span>📍 {stallion.location}</span>
                      <span>🐴 {stallion.offspring} offspring</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-amber-600">{stallion.studFee}</span>
                  </div>

                  <Link
                    href={`/stallions/${stallion.horseId}`}
                    className="block w-full py-3 text-center bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-teal-700"
                  >
                    View Full Profile
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

