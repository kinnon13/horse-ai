// ClaimsHandlers.ts (45 lines) - Single responsibility: Claims CRUD handlers
import { useHorseClaims } from '@/hooks/useHorseClaims'
import { handleClaimsError, showClaimsSuccessMessage } from './ClaimsErrorHandlers'

export class ClaimsHandlers {
  private horseClaims: any

  constructor(
    private user: any,
    private setUploading: (uploading: boolean) => void
  ) {
    this.horseClaims = useHorseClaims({ status: 'pending' })
  }

  handleApprove = async (claimId: string) => {
    if (!this.user) return
    try {
      await this.horseClaims.approveClaim(claimId, this.user.id)
      showClaimsSuccessMessage('approved')
    } catch (error) {
      handleClaimsError('approving claim', error)
    }
  }

  handleReject = async (claimId: string) => {
    if (!this.user) return
    const reason = prompt('Reason for rejection:')
    if (!reason) return
    try {
      await this.horseClaims.rejectClaim(claimId, this.user.id, reason)
      showClaimsSuccessMessage('rejected')
    } catch (error) {
      handleClaimsError('rejecting claim', error)
    }
  }

  handleFileUpload = async (claimId: string, file: File) => {
    if (!this.user) return
    this.setUploading(true)
    try {
      await this.horseClaims.uploadDocument(claimId, file, this.user.id)
      alert('Document uploaded and verified!')
    } catch (error) {
      handleClaimsError('uploading document', error)
    } finally {
      this.setUploading(false)
    }
  }
}
