/**
 * GENERAL ANSWER TIER CHECKER
 * 
 * PURPOSE:
 * - Checks user tier and determines if upgrade is needed
 * - Handles tier gating for sensitive information
 * 
 * SAFETY:
 * - We gate sensitive information behind Plus tier
 * - We log every general answer for audit trail
 * - We never expose private contact info without explicit consent
 */

import { supabase } from '@/lib/supabase'
import { GeneralAnswerIntent } from './GeneralAnswerParser'

export class GeneralAnswerTierChecker {
  static async checkUserTier(userId: string): Promise<string> {
    const { data: userMemory } = await supabase
      .from('user_memory')
      .select('subscription_tier')
      .eq('user_id', userId)
      .single()
    
    return userMemory?.subscription_tier || 'free'
  }

  static requiresUpgrade(intent: GeneralAnswerIntent, userTier: string): boolean {
    return intent.requiresPlus && (userTier === 'free' || userTier === 'guest')
  }
}




