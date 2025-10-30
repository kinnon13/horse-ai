interface ClaimClaimantInfoProps {
  claim: any
}

export function ClaimClaimantInfo({ claim }: ClaimClaimantInfoProps) {
  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-2">Claimant Information</h4>
      <div className="space-y-1 text-sm text-gray-600">
        <p><strong>Name:</strong> {claim.users?.full_name || 'Not provided'}</p>
        <p><strong>Email:</strong> {claim.users?.email || 'Not provided'}</p>
        <p><strong>Phone:</strong> {claim.users?.phone || 'Not provided'}</p>
      </div>
    </div>
  )
}

