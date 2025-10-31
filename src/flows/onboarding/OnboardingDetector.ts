/**
 * ONBOARDING INTENT DETECTOR
 * 
 * PURPOSE:
 * - Detects if a message is part of onboarding flow
 * - Returns true if this is onboarding, false if it should go to other handlers
 * 
 * SAFETY:
 * - Only returns true for clear onboarding patterns
 * - Does not trigger on service requests or general questions
 */

export { OnboardingIntentValidator as OnboardingDetector } from './OnboardingIntentValidator'