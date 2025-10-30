/**
 * ONBOARDING DATA OPERATIONS
 * 
 * PURPOSE:
 * - Handles individual data save operations
 * - Creates audit trail for each operation
 * 
 * SAFETY:
 * - Records who provided the data and when
 * - Does not overwrite previous values - versions them
 */

import { supabase } from '@/lib/supabase'
import { OnboardingAuditLogger } from './OnboardingAuditLogger'

export class OnboardingDataOperations {
  static async saveHorseCount(userId: string, horseCount: number): Promise<void> {
    const { error } = await supabase
      .from('user_memory')
      .upsert({
        user_id: userId,
        horse_count: horseCount,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
    
    if (error) {
      console.error('Error saving horse count:', error)
      throw new Error('Failed to save horse count')
    }
    
    await OnboardingAuditLogger.logOnboardingStep(userId, 'horse_count_saved', { horseCount })
  }

  static async saveUserRoles(userId: string, roles: string[]): Promise<void> {
    const { error } = await supabase
      .from('user_memory')
      .upsert({
        user_id: userId,
        roles: roles,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
    
    if (error) {
      console.error('Error saving user roles:', error)
      throw new Error('Failed to save user roles')
    }
    
    await OnboardingAuditLogger.logOnboardingStep(userId, 'roles_saved', { roles })
  }

  static async saveSponsorCode(userId: string, sponsorCode: string): Promise<void> {
    const { error } = await supabase
      .from('user_memory')
      .upsert({
        user_id: userId,
        sponsor_code: sponsorCode,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
    
    if (error) {
      console.error('Error saving sponsor code:', error)
      throw new Error('Failed to save sponsor code')
    }
    
    await OnboardingAuditLogger.logOnboardingStep(userId, 'sponsor_code_saved', { sponsorCode })
  }
}

