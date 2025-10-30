import { ClaimCard } from './ClaimCard'

interface ClaimsListProps {
  claims: any[]
  uploading: boolean
  onApprove: (claimId: string) => void
  onReject: (claimId: string) => void
  onFileUpload: (claimId: string, file: File) => void
}

export function ClaimsList({ claims, uploading, onApprove, onReject, onFileUpload }: ClaimsListProps) {
  return (
    <div className="space-y-6">
      {claims.map((claim) => (
        <ClaimCard
          key={claim.id}
          claim={claim}
          uploading={uploading}
          onApprove={onApprove}
          onReject={onReject}
          onFileUpload={onFileUpload}
        />
      ))}
    </div>
  )
}



