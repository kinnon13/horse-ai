'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { BusinessFormData } from './BusinessListTypes'
import { BusinessForm } from './BusinessForm'
import { BusinessSuccess } from './BusinessSuccess'

export default function ListBusinessPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<BusinessFormData>({business_name: '',
    location: '',
    services: [],
    contact_info: {phone: '',
      email: '',
      website: ''
    },
    taking_clients: true,
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('business_listings')
        .insert({business_name: formData.business_name,
          location: formData.location,
          services: formData.services,
          phone: formData.contact_info.phone,
          email: formData.contact_info.email,
          website: formData.contact_info.website,
          taking_clients: formData.taking_clients,
          description: formData.description,
          user_id: user?.id,
          status: 'pending'
        })

      if (error) throw error
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting business listing:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    window.location.href = '/business'
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <BusinessSuccess onBack={handleBack} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <BusinessForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={loading}
        onBack={handleBack}
      />
    </div>
  )
}