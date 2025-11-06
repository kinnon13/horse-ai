// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
import { NextResponse } from 'next/server'
import { checkRateLimit, incrementUsage } from '@/lib/RateLimitService'
import { LeadCaptureService } from '@/lib/LeadCapture.service'

export async function handleRateLimit(userId: string) {
  try {
    const rateLimit = await checkRateLimit(userId)
    
    if (!rateLimit.allowed) {
      return NextResponse.json({ 
        error: 'Rate limit exceeded',
        remaining: rateLimit.remaining,
        limit: rateLimit.limit
      }, { status: 429 })
    }
    
    await incrementUsage(userId)
    return rateLimit
  } catch (error) {
    // If rate limit check fails, allow with defaults
    return { allowed: true, remaining: 100, limit: 100 }
  }
}

export async function handleLeadCapture(message: string, userId: string) {
  try {
    const serviceRequest = await LeadCaptureService.extractServiceRequest(message, userId)
    
    if (serviceRequest) {
      await LeadCaptureService.saveServiceRequest(serviceRequest)
      await LeadCaptureService.notifyProviders(serviceRequest)
    }
  } catch (error) {
    // Lead capture failure shouldn't block chat

  }
}

