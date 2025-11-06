'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase-client'

export default function MyHorses() {
  const { user } = useAuth()
  const [horses, setHorses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHorses()
  }, [user])

  const loadHorses = async () => {
    if (!user) {
      // Show demo horses for non-logged-in users
      setHorses([
        { id: 'demo1', name: 'Thunder', breed: 'Quarter Horse', age: 5, discipline: 'Barrel Racing', demo: true },
        { id: 'demo2', name: 'Spirit', breed: 'Thoroughbred', age: 7, discipline: 'Dressage', demo: true },
      ])
      setLoading(false)
      return
    }

    try {
      // Try horses_master table first
      let { data, error } = await supabase
        .from('horses_master')
        .select('id, registered_name, barn_name, breed, yob, sex, discipline')
        .eq('owner_id', user.id)

      // Fallback to horses table if horses_master doesn't exist
      if (error && error.code === '42P01') {
        const result = await supabase
          .from('horses')
          .select('id, registered_name, barn_name, breed, yob, sex, performance_disciplines')
          .eq('owner_id', user.id)
        // Transform performance_disciplines to discipline
        data = (result.data || []).map((h: any) => ({
          ...h,
          discipline: h.performance_disciplines
        }))
        error = result.error
      }

      if (error) throw error

      // Transform data
      const transformedHorses = (data || []).map((h: any) => ({
        id: h.id,
        name: h.barn_name || h.registered_name || 'Unknown',
        breed: h.breed || 'Unknown',
        age: h.yob ? new Date().getFullYear() - parseInt(h.yob) : null,
        discipline: h.discipline || h.performance_disciplines?.[0] || 'General',
        demo: false
      }))

      setHorses(transformedHorses)
    } catch (error) {
      console.error('Error loading horses:', error)
      // Show demo data if database fails
      setHorses([
        { id: 'demo1', name: 'Thunder (Demo)', breed: 'Quarter Horse', age: 5, discipline: 'Barrel Racing', demo: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
            My Horses {!user && '(Demo)'}
          </h1>
          <Link href="/horses/new" className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-700 hover:to-teal-700">
            + Add Horse
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-600">Loading your horses...</div>
          </div>
        )}

        {!loading && horses.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">🐴</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No horses yet</h2>
            <p className="text-gray-600 mb-6">Add your first horse to get started with HorseGPT</p>
            <Link href="/horses/new" className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-700 hover:to-teal-700">
              Add Your First Horse
            </Link>
          </div>
        )}

        {!loading && horses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {horses.map(horse => (
              <div key={horse.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 relative">
                {horse.demo && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">
                    DEMO
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-3xl">
                    🐴
                  </div>
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
                    {horse.discipline}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{horse.name}</h3>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-semibold">Breed:</span> {horse.breed}</p>
                  {horse.age && <p><span className="font-semibold">Age:</span> {horse.age} years</p>}
                </div>
                <div className="mt-6 flex gap-2">
                  <Link 
                    href={horse.demo ? '/auth/signin' : `/horse-portal?id=${horse.id}`}
                    className="flex-1 py-2 text-center bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-teal-700"
                  >
                    {horse.demo ? 'Sign In to Add' : 'View Profile'}
                  </Link>
                  {!horse.demo && (
                    <Link 
                      href={`/horses/${horse.id}/edit`}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                    >
                      ⚙️
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {/* Add Horse Card */}
            <Link href="/horses/new" className="bg-white rounded-2xl shadow-xl p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[300px] hover:border-cyan-500 cursor-pointer transition-all">
              <div className="text-6xl mb-4">➕</div>
              <h3 className="text-xl font-semibold text-gray-700">Add New Horse</h3>
              <p className="text-gray-500 mt-2 text-center">Create a profile for your horse</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

