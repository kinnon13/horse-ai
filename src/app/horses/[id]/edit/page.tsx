'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/useAuth'

export default function EditHorse() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const horseId = params.id as string
  
  const [horse, setHorse] = useState({
    name: '',
    registeredName: '',
    breed: '',
    age: '',
    sex: '',
    color: '',
    discipline: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadHorse()
  }, [horseId])

  const loadHorse = async () => {
    try {
      const { data, error } = await supabase
        .from('horses_master')
        .select('*')
        .eq('id', horseId)
        .single()

      if (error) throw error

      setHorse({
        name: data.barn_name || '',
        registeredName: data.registered_name || '',
        breed: data.breed || '',
        age: data.yob || '',
        sex: data.sex || '',
        color: data.color || '',
        discipline: data.discipline || ''
      })
    } catch (error) {
      console.error('Error loading horse:', error)
      alert('Could not load horse')
    } finally {
      setLoading(false)
    }
  }

  const saveHorse = async () => {
    if (!user) {
      alert('Please sign in to save changes')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('horses_master')
        .update({
          barn_name: horse.name,
          registered_name: horse.registeredName,
          breed: horse.breed,
          yob: horse.age,
          sex: horse.sex,
          color: horse.color,
          discipline: horse.discipline,
          updated_at: new Date().toISOString()
        })
        .eq('id', horseId)

      if (error) throw error

      alert('✅ Horse updated successfully!')
      router.push('/horses')
    } catch (error) {
      console.error('Error saving horse:', error)
      alert('❌ Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading horse...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
          Edit Horse
        </h1>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Barn Name</label>
            <input
              type="text"
              value={horse.name}
              onChange={(e) => setHorse({...horse, name: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="What you call your horse"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Registered Name</label>
            <input
              type="text"
              value={horse.registeredName}
              onChange={(e) => setHorse({...horse, registeredName: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Official registered name"
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
                value={horse.age}
                onChange={(e) => setHorse({...horse, age: e.target.value})}
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
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button
              onClick={() => router.push('/horses')}
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

