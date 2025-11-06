import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-client'

interface GenerateTokenParams {
  userId: string
  email: string
  type: 'verify' | 'reset' | 'invite'
}

interface CreateTokenParams {
  email: string
  userId?: string
  businessId?: string
  type: 'user' | 'business'
  expiresInDays?: number
}

interface VerificationToken {
  token: string
  email: string
  type: 'user' | 'business'
  userId?: string
  businessId?: string
  expiresAt: Date
}

export function generateMagicToken(params: GenerateTokenParams): string {
  const { userId, email, type } = params
  const token = typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString('hex')
  const payload = btoa(JSON.stringify({ userId, email, token, type }))
  return `${payload}.${Buffer.from(token).toString('hex')}`
}

export function decodeMagicToken(token: string): { userId: string; email: string; type: string } | null {
  try {
    const [payloadB64] = token.split('.')
    const payload = JSON.parse(atob(payloadB64))
    return { userId: payload.userId, email: payload.email, type: payload.type }
  } catch (err) {
    return null
  }
}

export async function createVerificationToken(params: CreateTokenParams): Promise<{ token: string; error?: string }> {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + (params.expiresInDays ?? 7) * 24 * 60 * 60 * 1000)

  try {
    const { error } = await supabaseAdmin.from('verification_tokens').upsert({
      token,
      email: params.email,
      user_id: params.userId ?? null,
      business_id: params.businessId ?? null,
      type: params.type,
      expires_at: expiresAt.toISOString(),
      used: false,
      created_at: new Date().toISOString(),
    })

    if (error) {
      return { token, error: error.message }
    }

    return { token }
  } catch (error) {
    return { token, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function verifyToken(token: string): Promise<{ valid: boolean; data?: VerificationToken; error?: string }> {
  if (!token) {
    return { valid: false, error: 'Token required' }
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .single()

    if (error) {
      return { valid: false, error: error.message }
    }

    if (!data) {
      return { valid: false, error: 'Token not found' }
    }

    if (data.used) {
      return { valid: false, error: 'Token already used' }
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, error: 'Token expired' }
    }

    return {
      valid: true,
      data: {
        token: data.token,
        email: data.email,
        type: data.type,
        userId: data.user_id ?? undefined,
        businessId: data.business_id ?? undefined,
        expiresAt: new Date(data.expires_at ?? Date.now()),
      },
    }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function markTokenUsed(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('verification_tokens')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('token', token)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export function generateVerificationUrl(token: string, type: 'user' | 'business'): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return type === 'business'
    ? `${baseUrl}/business/verify/${token}`
    : `${baseUrl}/verify/${token}`
}


