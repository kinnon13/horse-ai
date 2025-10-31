// useClaimsHandlers.ts (20 lines) - Single responsibility: Handler factory
import { ClaimsHandlers } from './ClaimsHandlers'

interface UseClaimsHandlersProps {
  user: any
  setUploading: (uploading: boolean) => void
}

export function useClaimsHandlers({ user, setUploading }: UseClaimsHandlersProps) {
  const handlers = new ClaimsHandlers(user, setUploading)

  return {
    handleApprove: handlers.handleApprove,
    handleReject: handlers.handleReject,
    handleFileUpload: handlers.handleFileUpload
  }
}