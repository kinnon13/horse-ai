interface ClaimVerificationDocProps {
  claim: any
}

export function ClaimVerificationDoc({ claim }: ClaimVerificationDocProps) {
  if (!claim.proof_doc_url) return null

  return (
    <div className="mb-4">
      <h4 className="font-medium text-gray-900 mb-2">Verification Document</h4>
      <div className="flex items-center space-x-4">
        <a
          href={claim.proof_doc_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-teal-700 underline"
        >
          View Document
        </a>
        {claim.auto_verified && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            AI Verified
          </span>
        )}
      </div>
    </div>
  )
}



