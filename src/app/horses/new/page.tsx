'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/useAuth'

export default function AddHorse() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [horse, setHorse] = useState({
    barnName: '',
    registeredName: '',
    breed: '',
    yearOfBirth: '',
    sex: '',
    color: '',
    discipline: ''
  })
  const [saving, setSaving] = useState(false)

  const saveHorse = async () => {
    if (!user) {
      alert('Please sign in to add a horse')
      router.push('/auth/signin')
      return
    }

    if (!horse.barnName) {
      alert('Please enter at least a barn name')
      return
    }

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('horses_master')
        .insert({
          owner_id: user.id,
          barn_name: horse.barnName,
          registered_name: horse.registeredName,
          breed: horse.breed,
          yob: horse.yearOfBirth,
          sex: horse.sex,
          color: horse.color,
          discipline: horse.discipline,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      alert('✅ Horse added successfully!')
      router.push('/horses')
    } catch (error) {
      console.error('Error adding horse:', error)
      alert('❌ Failed to add horse')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
          Add New Horse
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Barn Name *</label>
            <input
              type="text"
              value={horse.barnName}
              onChange={(e) => setHorse({...horse, barnName: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="What you call your horse"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Registered Name</label>
            <input
              type="text"
              value={horse.registeredName}
              onChange={(e) => setHorse({...horse, registeredName: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Official registered name (if any)"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Breed</label>
              <input
                type="text"
                value={horse.breed}
                onChange={(e) => setHorse({...horse, breed: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Quarter Horse, Thoroughbred, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Year of Birth</label>
              <input
                type="text"
                value={horse.yearOfBirth}
                onChange={(e) => setHorse({...horse, yearOfBirth: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="2020"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sex</label>
              <select
                value={horse.sex}
                onChange={(e) => setHorse({...horse, sex: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="mare">Mare</option>
                <option value="stallion">Stallion</option>
                <option value="gelding">Gelding</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
              <input
                type="text"
                value={horse.color}
                onChange={(e) => setHorse({...horse, color: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Bay, Chestnut, Black, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Discipline</label>
            <select
              value={horse.discipline}
              onChange={(e) => setHorse({...horse, discipline: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">Select</option>
              <option value="Barrel Racing">Barrel Racing</option>
              <option value="Dressage">Dressage</option>
              <option value="Reining">Reining</option>
              <option value="Cutting">Cutting</option>
              <option value="Jumping">Jumping</option>
              <option value="Western Pleasure">Western Pleasure</option>
              <option value="Trail">Trail</option>
              <option value="Racing">Racing</option>
              <option value="Endurance">Endurance</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={saveHorse}
              disabled={saving || !horse.barnName}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : '🐴 Add Horse'}
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
