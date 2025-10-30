import { useState } from 'react'
import { useHorseClaims } from '@/hooks/useHorseClaims'
import { useAuth } from '@/components/AuthProvider'
import { ClaimsPageHeader } from './ClaimsPageHeader'
import { ClaimsLoadingState } from './ClaimsLoadingState'
import { ClaimsErrorState } from './ClaimsErrorState'
import { ClaimsEmptyState } from './ClaimsEmptyState'
import { ClaimsList } from './ClaimsList'
import { useClaimsHandlers } from './useClaimsHandlers'

export function ClaimsPageContent() {
  const { user } = useAuth()
  const { claims, loading, error } = useHorseClaims({ status: 'pending' })
  const [uploading, setUploading] = useState(false)
  
  const handlers = useClaimsHandlers({ user, setUploading })

  if (loading) return <ClaimsLoadingState />
  if (error) return <ClaimsErrorState error={error} />

  return (
    <div className="min-h-screen bg-gray-50">
      <ClaimsPageHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {claims.length === 0 ? (
          <ClaimsEmptyState />
        ) : (
          <ClaimsList 
            claims={claims} 
            uploading={uploading}
            onApprove={handlers.handleApprove}
            onReject={handlers.handleReject}
            onFileUpload={handlers.handleFileUpload}
          />
        )}
      </div>
    </div>
  )
}

