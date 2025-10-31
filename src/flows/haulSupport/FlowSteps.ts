// FlowSteps.ts (30 lines) - Single responsibility: Individual flow step implementations
import { HaulSupportParser, HaulSupportIntent } from './HaulSupportParser'
import { HaulSupportDataFetcher } from './HaulSupportDataFetcher'
import { HaulSupportSafetyCalculator } from './HaulSupportSafetyCalculator'
import { HaulSupportAuditLogger } from './HaulSupportAuditLogger'
import { HaulSupportResponseGenerator, HaulSupportResponse } from './HaulSupportResponseGenerator'
import { supabase } from '@/lib/supabase'

export class FlowSteps {
  static async processHaulSupportSteps(
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
    
    const supportPoints = await HaulSupportDataFetcher.getHaulSupportPoints(intent)
    const safetyRanking = HaulSupportSafetyCalculator.calculateSafetyRanking(supportPoints)
    
    await HaulSupportAuditLogger.logHaulSupport(userId, 'support_provided', {
      route: intent.route,
      supportPointCount: Object.values(supportPoints).flat().length,
      safetyRanking
    })
    
    return HaulSupportResponseGenerator.generateSuccessResponse(intent, supportPoints, safetyRanking)
  }
}
