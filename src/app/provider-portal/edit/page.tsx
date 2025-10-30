'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { ProviderProfileForm } from './ProviderProfileForm'
import { ProviderProfileTypes } from './ProviderProfileTypes'

export default function ProviderPortalEdit() {
  const { user } = useAuth()
  const [provider, setProvider] = useState<ProviderProfileTypes.Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProviderData()
    }
  }, [user])

  const fetchProviderData = async () => {
    try {
      const { data: providerData } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      setProvider(providerData)
    } catch (error) {
      console.error('Error fetching provider data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData: ProviderProfileTypes.ProviderFormData) => {
    if (!user || !provider) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('providers')
        .update({business_name: formData.business_name,
          business_type: formData.business_type,
          services_offered: formData.services_offered,
          service_areas: formData.service_areas,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          description: formData.description,
          years_experience: formData.years_experience,
          certifications: formData.certifications,
          insurance_info: formData.insurance_info,
          updated_at: new Date().toISOString()
        })
        .eq('id', provider.id)

      if (error) throw error

      // Refresh provider data
      await fetchProviderData()
      
      // Navigate back to main portal
      window.location.href = '/provider-portal'
    } catch (error) {
      console.error('Error saving provider data:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  if (!provider) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Provider not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Provider Profile</h1>
          <p className="text-gray-600">Update your business information and services</p>
        </div>

        <ProviderProfileForm
          provider={provider}
          onSave={handleSave}
          saving={saving}
        />
      </div>
    </div>
  )
}

