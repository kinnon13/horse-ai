import React from 'react'
import { Header } from '@/components/Header'
import { ProviderLoginLoading } from './ProviderLoginLoading'
import { ProviderLoginUnauthorized } from './ProviderLoginUnauthorized'
import { ProviderLoginNotFound } from './ProviderLoginNotFound'
import { ProviderLoginContent } from './ProviderLoginContent'
import { useProviderLogin } from './useProviderLogin'

export default function ProviderLoginPage() {
  const {
    provider,
    serviceRequests,
    loadingRequests,
    loading,
    user,
    handleClaimRequest,
    handleViewDetails,
    handleEditProfile
  } = useProviderLogin()

  if (loading) {
    return <ProviderLoginLoading />
  }

  if (!user) {
    return <ProviderLoginUnauthorized />
  }

  if (!provider) {
    return <ProviderLoginNotFound />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProviderLoginContent
        provider={provider}
        serviceRequests={serviceRequests}
        loadingRequests={loadingRequests}
        onClaim={handleClaimRequest}
        onViewDetails={handleViewDetails}
        onEditProfile={handleEditProfile}
      />
    </div>
  )
}