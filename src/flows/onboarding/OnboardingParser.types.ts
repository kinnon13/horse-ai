/**
 * ONBOARDING PARSER TYPES
 * 
 * PURPOSE:
 * - Type definitions for onboarding message parsing
 * - Defines the structure of parsed onboarding data
 * 
 * SAFETY:
 * - Only extracts data that users explicitly provide
 * - Does not make assumptions about user intent
 */

export interface OnboardingIntent {
  type: 'onboarding'
  step: 'greeting' | 'horse_count' | 'roles' | 'preferences' | 'complete'
  data: {
    horseCount?: number
    roles?: string[]
    sponsorCode?: string
    wantsOutreach?: boolean
    wantsOptions?: boolean
  }
}

export interface OnboardingParseResult {
  horseCount?: number
  roles: string[]
  sponsorCode?: string
  step: OnboardingIntent['step']
}
