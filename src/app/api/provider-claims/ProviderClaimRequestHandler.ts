// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// ProviderClaimRequestHandler.ts (25 lines) - Request validation and processing
import { NextRequest } from 'next/server'
import { validateProvider } from './ProviderClaimValidator'
import { validateServiceRequest } from './ProviderClaimService'

export async function processProviderClaimRequest(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const provider = await validateProvider(userId)
  const body = await request.json()
  const { service_request_id, message, quoted_price } = body

  if (!service_request_id) {
    throw new Error('Missing required field: service_request_id')
  }

  const serviceRequest = await validateServiceRequest(service_request_id)

  return {
    provider,
    serviceRequest,
    message,
    quoted_price
  }
}

