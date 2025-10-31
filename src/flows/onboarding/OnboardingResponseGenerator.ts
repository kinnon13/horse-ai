// OnboardingResponseGenerator.ts (50 lines)
/**
 * ONBOARDING RESPONSE GENERATOR
 * 
 * PURPOSE:
 * - Generates appropriate onboarding responses
 * - Guides users through the onboarding process
 * - Asks for explicit permission before storing data
 * 
 * SAFETY:
 * - Always asks permission before storing personal info
 * - Explains what we'll do with the data
 * - Gives users control over their information
 */

import { OnboardingResponseGenerator as OnboardingResponseGeneratorClass } from './OnboardingResponseGeneratorHelpers'
import type { OnboardingResponse } from './OnboardingResponseGeneratorHelpers'

// Re-export the main class and interface
export { OnboardingResponseGeneratorClass as OnboardingResponseGenerator }
export type { OnboardingResponse }
