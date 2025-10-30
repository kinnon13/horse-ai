import { ProviderLoginContentProps } from './ProviderLoginTypes'
import { ProviderInfoCard } from './ProviderInfoCard'
import { ServiceRequestsList } from './ServiceRequestsList'
import { ProviderLoginHeader } from './ProviderLoginHeader'

export function ProviderLoginContent({ 
  provider, 
  serviceRequests, 
  loadingRequests, 
  onClaim, 
  onViewDetails, 
  onEditProfile 
}: ProviderLoginContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ProviderLoginHeader />
      
      <ProviderInfoCard provider={provider} onEditProfile={onEditProfile} />
      
      {loadingRequests ? (
        <div className="text-center py-8">Loading service requests...</div>
      ) : (
        <ServiceRequestsList
          serviceRequests={serviceRequests}
          onClaim={onClaim}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  )
}



