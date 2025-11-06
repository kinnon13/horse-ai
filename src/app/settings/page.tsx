'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase-client'

export default function Settings() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    disciplines: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [user])

  const loadProfile = async () => {
    if (!user) {
      setProfile({
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '',
        location: '',
        disciplines: []
      })
      setLoading(false)
      return
    }

    try {
      const { data, error} = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setProfile({
          name: data.full_name || data.name || user.email?.split('@')[0] || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          location: data.location || '',
          disciplines: data.disciplines || []
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    if (!user) {
      setMessage('⚠️ Please sign in to save settings')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: profile.email,
          full_name: profile.name,
          phone: profile.phone,
          location: profile.location,
          disciplines: profile.disciplines,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (error) throw error

      setMessage('✅ Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage('❌ Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
          Settings
        </h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input 
                  type="tel" 
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscription</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-800">Current Plan: <span className="text-cyan-600">Free</span></p>
                <p className="text-sm text-gray-600 mt-1">5 AI conversations per month remaining</p>
              </div>
              <button 
                onClick={async () => {
                  const res = await fetch('/api/stripe/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      priceId: 'price_pro',
                      userId: user?.id || 'anonymous'
                    })
                  })
                  const data = await res.json()
                  if (data.url) window.location.href = data.url
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:from-amber-600 hover:to-amber-700"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Notifications</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-800">Email notifications</span>
                <input type="checkbox" className="w-6 h-6" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-800">Competition reminders</span>
                <input type="checkbox" className="w-6 h-6" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-800">Health alerts</span>
                <input type="checkbox" className="w-6 h-6" defaultChecked />
              </label>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <button 
            onClick={saveProfile}
            disabled={saving || !user}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {!user && (
            <p className="text-center text-gray-600">
              <a href="/auth/signin" className="text-cyan-600 hover:underline">Sign in</a> to save your settings
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

