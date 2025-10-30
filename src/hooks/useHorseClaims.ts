// TEMP STUB
export function useHorseClaims(params?: { status?: string }) {
  return {
    claims: [],
    loading: false,
    error: null,
    fetchClaims: () => {},
    createClaim: () => {},
    updateClaim: () => {},
    refetch: () => {},
    approveClaim: (claimId: string, userId: string) => {},
    rejectClaim: (claimId: string, userId: string, reason: string) => {},
    uploadDocument: (claimId: string, file: File, userId: string) => {}
  };
}