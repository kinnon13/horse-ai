'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'

export default function StallionDetail() {
  const params = useParams()
  const stallionId = params.id as string
  
  const [stallion, setStallion] = useState<any>(null)
  const [offspring, setOffspring] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStallion()
  }, [stallionId])

  const loadStallion = async () => {
    try {
      // Load horse data
      const { data: horse } = await supabase
        .from('horses_master')
        .select('*')
        .eq('id', stallionId)
        .single()

      // Load stud service info
      const { data: studService } = await supabase
        .from('stud_services')
        .select('*')
        .eq('horse_id', stallionId)
        .single()

      // Load offspring
      const { data: offspringData } = await supabase
        .from('breeding_records')
        .select(`
          *,
          offspring:offspring_id (registered_name, barn_name, yob)
        `)
        .eq('sire_id', stallionId)
        .limit(10)

      setStallion({
        ...horse,
        studFee: studService?.stud_fee_cents || 0,
        location: studService?.location || '',
        description: studService?.description || '',
        bookingInfo: studService?.booking_info || {}
      })

      setOffspring(offspringData || [])
    } catch (error) {
      console.error('Error loading stallion:', error)
      // Demo data
      setStallion({
        registered_name: 'First Down Dash',
        breed: 'Quarter Horse',
        color: 'Sorrel',
        yob: '2015',
        studFee: 250000,
        location: 'Texas',
        description: 'AQHA Champion stallion with proven barrel racing bloodlines...',
        demo: true
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!stallion) {
    return <div className="min-h-screen flex items-center justify-center">Stallion not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/stallions" className="text-cyan-600 hover:underline mb-4 inline-block">
          ← Back to Directory
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{stallion.registered_name}</h1>
              {stallion.demo && <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">DEMO DATA</span>}
              <div className="flex gap-4 mt-4 text-gray-600">
                <p><strong>Breed:</strong> {stallion.breed}</p>
                <p><strong>Color:</strong> {stallion.color}</p>
                <p><strong>Foaled:</strong> {stallion.yob}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">Stud Fee</p>
              <p className="text-4xl font-bold text-amber-600">${(stallion.studFee / 100).toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-2">📍 {stallion.location}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{stallion.description}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Notable Offspring</h2>
              {offspring.length > 0 ? (
                <div className="space-y-3">
                  {offspring.map((o, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-800">
                        {o.offspring?.registered_name || o.offspring?.barn_name}
                      </p>
                      <p className="text-sm text-gray-600">Foaled: {o.offspring?.yob}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Offspring data being added...</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Book Breeding</h3>
              <p className="text-gray-600 mb-4 text-sm">Contact the stallion owner to arrange breeding</p>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-700 hover:to-teal-700">
                Request Booking
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">AI Analysis</h3>
              <p className="text-gray-600 mb-4 text-sm">Get personalized breeding recommendation</p>
              <Link
                href="/breeding"
                className="block w-full text-center px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900"
              >
                Get Recommendation
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Info</h3>
              <p className="text-sm text-gray-600">For booking inquiries, contact through HorseGPT messaging</p>
              <button className="w-full mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

