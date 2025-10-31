// ClaimCardHeader.tsx (15 lines) - Claim card header component
interface ClaimCardHeaderProps {
  claim: any
}

export function ClaimCardHeader({ claim }: ClaimCardHeaderProps) {
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
