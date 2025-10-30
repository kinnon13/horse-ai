'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'
import { ServiceRequest } from './ProviderPortalTypes'
import { ProviderInfoCard } from './ProviderInfoCard'
import { ServiceRequestCard } from './ServiceRequestCard'

export default function ProviderPortal() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [provider, setProvider] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetchProviderData()
    }
  }, [user])

  const fetchProviderData = async () => {
    try {
      // Get provider info
      const { data: providerData } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      setProvider(providerData)

      // Get service requests for this provider
      const { data: requestsData } = await supabase
        .from('service_requests')
        .select(`
          *,
          users (
            full_name,
            phone
          )
        `)
        .order('created_at', { ascending: false })

      setRequests(requestsData || [])
    } catch (error) {
      console.error('Error fetching provider data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimRequest = async (requestId: string) => {
    if (!provider) return

    try {
      const { error } = await supabase
        .from('provider_claims')
        .insert({provider_id: provider.id,
          service_request_id: requestId,
          status: 'pending'
        })

      if (error) throw error
      
      // Refresh the requests
      fetchProviderData()
    } catch (error) {
      console.error('Error claiming request:', error)
    }
  }

  const handleViewDetails = (requestId: string) => {
    // Navigate to request details page
    window.location.href = `/service-requests/${requestId}`
  }

  const handleEditProfile = () => {
    // Navigate to profile edit page
    window.location.href = '/provider-portal/edit'
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Provider Portal</h1>
          <p className="text-gray-600">Manage your service requests and profile</p>
        </div>

        <ProviderInfoCard provider={provider} onEditProfile={handleEditProfile} />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Service Requests</h2>
            <div className="text-sm text-gray-600">
              {requests.length} total requests
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No service requests available at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">Check back later for new opportunities.</p>
            </div>
          ) : (
            requests.map((request) => (
              <ServiceRequestCard
                key={request.id}
                request={request}
                onClaim={handleClaimRequest}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}