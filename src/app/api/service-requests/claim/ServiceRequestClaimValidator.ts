// Service Request Claim Validator - Single responsibility
export function validateServiceRequest(serviceRequest: any) {
  if (!serviceRequest.id) {
    throw new Error('Service request ID is required')
  }
  if (!serviceRequest.provider_id) {
    throw new Error('Provider ID is required')
  }
  if (!serviceRequest.status) {
    throw new Error('Status is required')
  }
  return true
}

export function validateProviderClaim(claim: any) {
  if (!claim.provider_id) {
    throw new Error('Provider ID is required')
  }
  if (!claim.request_id) {
    throw new Error('Request ID is required')
  }
  return true
}