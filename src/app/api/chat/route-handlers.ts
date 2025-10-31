import { NextResponse } from 'next/server'
import { checkRateLimit, incrementUsage } from '@/lib/RateLimitService'
import { LeadCaptureService } from '@/lib/LeadCapture.service'

export async function handleRateLimit(userId: string) {
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
}

export async function handleLeadCapture(message: string, userId: string) {
  const serviceRequest = await LeadCaptureService.extractServiceRequest(message, userId)
  
  if (serviceRequest) {
    await LeadCaptureService.saveServiceRequest(serviceRequest)
    await LeadCaptureService.notifyProviders(serviceRequest)
  }
}

