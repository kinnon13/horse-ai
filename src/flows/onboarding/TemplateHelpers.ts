// TemplateHelpers.ts (20 lines) - Main template helpers coordinator
/**
 * ONBOARDING TEMPLATE HELPERS
 * 
 * PURPOSE:
 * - Helper functions for creating response templates
 * - Utility functions for template processing
 * 
 * SAFETY:
 * - Always asks permission before storing personal info
 * - Explains what we'll do with the data
 * - Gives users control over their information
 */

import { TemplateResponseHelpers } from './TemplateResponseHelpers'
import { TemplateStepHelpers } from './TemplateStepHelpers'

export class TemplateHelpers {
  static createGreetingResponse = TemplateResponseHelpers.createGreetingResponse
  static createHorseCountResponse = TemplateResponseHelpers.createHorseCountResponse
  static createDefaultResponse = TemplateResponseHelpers.createDefaultResponse
  static createRolesResponse = TemplateStepHelpers.createRolesResponse
  static createPreferencesResponse = TemplateStepHelpers.createPreferencesResponse
}