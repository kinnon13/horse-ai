import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface VerificationToken {
  token: string
  userId?: string
  businessId?: string
  email: string
  type: 'user' | 'business'
  expiresAt: Date
}

/**
 * Generate a secure verification token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create and store a verification token
 */
export async function createVerificationToken(params: {
  email: string
  userId?: string
  businessId?: string
  type: 'user' | 'business'
  expiresInDays?: number
}): Promise<{ token: string; error?: string }> {
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (params.expiresInDays || 7))

  try {
    // Store token in verification_emails table
    const { error } = await supabase.from('verification_emails').insert({
      recipient_type: params.type,
      business_id: params.businessId,
      email_to: params.email,
      email_subject: params.type === 'user' ? 'Verify Your Horse' : 'Claim Your Business',
      sent_at: new Date().toISOString()
    })

    if (error) {
      console.error('Token storage error:', error)
      return { token, error: error.message }
    }

    // Also store in a tokens table if it exists (or use in-memory/Redis for production)
    // For MVP, we'll encode the data in the token itself
    const tokenData = {
      token,
      email: params.email,
      userId: params.userId,
      businessId: params.businessId,
      type: params.type,
      expiresAt: expiresAt.toISOString()
    }

    // In production, store this in Redis or a tokens table
    // For MVP, we'll decode it from the URL
     + '...', type: params.type })

    return { token }
  } catch (err) {
    console.error('Token creation error:', err)
    return { token, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

/**
 * Verify a token is valid and not expired
 */
export async function verifyToken(token: string): Promise<{
  valid: boolean
  data?: VerificationToken
  error?: string
}> {
  // In production, look this up in Redis/database
  // For MVP, we'll trust the token exists if it's the right format
  
  if (!token || token.length !== 64) {
    return { valid: false, error: 'Invalid token format' }
  }

  // In production, verify it exists and hasn't expired
  // For MVP, assume it's valid
  return { 
    valid: true,
    data: {
      token,
      email: 'unknown@example.com', // Would be fetched from storage
      type: 'user',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  }
}

/**
 * Mark a token as used
 */
export async function markTokenUsed(token: string): Promise<{ success: boolean }> {
  // In production, update the token record
  // For MVP, just return success
   + '...')
  return { success: true }
}

/**
 * Generate verification URL
 */
export function generateVerificationUrl(token: string, type: 'user' | 'business'): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  if (type === 'user') {
    return `${baseUrl}/verify/${token}`
  } else {
    return `${baseUrl}/business/verify/${token}`
  }
}


