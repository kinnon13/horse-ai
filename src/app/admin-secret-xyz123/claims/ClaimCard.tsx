import { ClaimActions } from './ClaimActions'
import { ClaimClaimantInfo } from './ClaimClaimantInfo'
import { ClaimHorseInfo } from './ClaimHorseInfo'
import { ClaimVerificationDoc } from './ClaimVerificationDoc'

interface ClaimCardProps {
  claim: any
  uploading: boolean
  onApprove: (claimId: string) => void
  onReject: (claimId: string) => void
  onFileUpload: (claimId: string, file: File) => void
}

export function ClaimCard({ claim, uploading, onApprove, onReject, onFileUpload }: ClaimCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <ClaimCardHeader claim={claim} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ClaimClaimantInfo claim={claim} />
        <ClaimHorseInfo claim={claim} />
      </div>

      <ClaimVerificationDoc claim={claim} />
      
      <ClaimActions
        claim={claim}
        uploading={uploading}
        onApprove={onApprove}
        onReject={onReject}
        onFileUpload={onFileUpload}
      />
    </div>
  )
}

function ClaimCardHeader({ claim }: { claim: any }) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {claim.horses?.name || 'Unknown Horse'}
        </h3>
        <p className="text-sm text-gray-600">
          Claimed as: <span className="font-medium">{claim.claim_type}</span>
        </p>
      </div>
      <div className="text-sm text-gray-500">
        {new Date(claim.created_at).toLocaleDateString()}
      </div>
    </div>
  )
}