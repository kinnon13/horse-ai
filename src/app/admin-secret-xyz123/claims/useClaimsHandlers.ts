import { useHorseClaims } from '@/hooks/useHorseClaims'

interface UseClaimsHandlersProps {
  user: any
  setUploading: (uploading: boolean) => void
}

export function useClaimsHandlers({ user, setUploading }: UseClaimsHandlersProps) {
  const { approveClaim, rejectClaim, uploadDocument } = useHorseClaims({ status: 'pending' })

  const handleApprove = async (claimId: string) => {
    if (!user) return
    
    try {
      await approveClaim(claimId, user.id)
      alert('Claim approved successfully!')
    } catch (error) {
      console.error('Error approving claim:', error)
      alert('Failed to approve claim')
    }
  }

  const handleReject = async (claimId: string) => {
    if (!user) return
    
    const reason = prompt('Reason for rejection:')
    if (!reason) return
    
    try {
      await rejectClaim(claimId, user.id, reason)
      alert('Claim rejected successfully!')
    } catch (error) {
      console.error('Error rejecting claim:', error)
      alert('Failed to reject claim')
    }
  }

  const handleFileUpload = async (claimId: string, file: File) => {
    if (!user) return
    
    setUploading(true)
    try {
      await uploadDocument(claimId, file, user.id)
      alert('Document uploaded and verified!')
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  return {
    handleApprove,
    handleReject,
    handleFileUpload
  }
}

