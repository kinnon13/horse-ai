/**
 * HAUL SUPPORT FLOW COORDINATOR
 * 
 * PURPOSE:
 * - Coordinates the haul support flow process
 * - Handles the main haul support logic
 * - Orchestrates all haul support components
 * 
 * SAFETY:
 * - Every user input is timestamped with source_user_id
 * - We explicitly ask permission before storing any personal info
 * - We never assume consent - we ask "do you want me to reach out for you?"
 */

import { HaulSupportDetector } from './HaulSupportDetector'
import { HaulSupportParser, HaulSupportIntent } from './HaulSupportParser'
import { HaulSupportDataFetcher } from './HaulSupportDataFetcher'
import { HaulSupportSafetyCalculator } from './HaulSupportSafetyCalculator'
import { HaulSupportMessageGenerator } from './HaulSupportMessageGenerator'
import { HaulSupportAuditLogger } from './HaulSupportAuditLogger'
import { HaulSupportResponseGenerator, HaulSupportResponse } from './HaulSupportResponseGenerator'
import { supabase } from '@/lib/supabase'

export class HaulSupportFlow {
  static isHaulSupportIntent(message: string): boolean {
    return HaulSupportDetector.isHaulSupportIntent(message)
  }

  static async processHaulSupport(
    message: string,
    userId: string,
    horseContext?: string
  ): Promise<HaulSupportResponse> {
    
    await HaulSupportAuditLogger.logHaulSupport(userId, 'request_received', { message })
    
    const intent = HaulSupportParser.parseHaulSupportRequest(message)
    
    const { data: userMemory } = await supabase
      .from('user_memory')
      .select('subscription_tier')
      .eq('user_id', userId)
      .single()
    
    const userTier = userMemory?.subscription_tier || 'free'
    
    if (userTier === 'free' || userTier === 'guest') {
      return HaulSupportResponseGenerator.generateUpgradeResponse(intent)
    }
    
    const supportPoints = await HaulSupportDataFetcher.getRouteSupportPoints(intent.route)
    const safetyRanking = HaulSupportSafetyCalculator.calculateSafetyRanking(supportPoints)
    
    await HaulSupportAuditLogger.logHaulSupport(userId, 'support_provided', {
      route: intent.route,
      supportPointCount: Object.values(supportPoints).flat().length,
      safetyRanking
    })
    
    return HaulSupportResponseGenerator.generateSuccessResponse(intent, supportPoints, safetyRanking)
  }
}
