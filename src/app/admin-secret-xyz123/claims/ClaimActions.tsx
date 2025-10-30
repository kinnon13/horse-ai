interface ClaimActionsProps {
  claim: any
  uploading: boolean
  onApprove: (claimId: string) => void
  onReject: (claimId: string) => void
  onFileUpload: (claimId: string, file: File) => void
}

export function ClaimActions({ claim, uploading, onApprove, onReject, onFileUpload }: ClaimActionsProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex space-x-3">
        <button
          onClick={() => onApprove(claim.id)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Approve Claim
        </button>
        <button
          onClick={() => onReject(claim.id)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reject Claim
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              onFileUpload(claim.id, file)
            }
          }}
          className="hidden"
          id={`file-upload-${claim.id}`}
        />
        <label
          htmlFor={`file-upload-${claim.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </label>
      </div>
    </div>
  )
}



