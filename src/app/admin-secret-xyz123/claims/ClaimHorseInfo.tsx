interface ClaimHorseInfoProps {
  claim: any
}

export function ClaimHorseInfo({ claim }: ClaimHorseInfoProps) {
  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-2">Horse Information</h4>
      <div className="space-y-1 text-sm text-gray-600">
        <p><strong>Name:</strong> {claim.horses?.name || 'Unknown'}</p>
        <p><strong>Breed:</strong> {claim.horses?.breed || 'Unknown'}</p>
        <p><strong>Registration:</strong> {claim.horses?.reg_number || 'Unknown'}</p>
        <p><strong>Sire:</strong> {claim.horses?.sire || 'Unknown'}</p>
        <p><strong>Dam:</strong> {claim.horses?.dam || 'Unknown'}</p>
      </div>
    </div>
  )
}

