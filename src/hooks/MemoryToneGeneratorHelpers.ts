// MemoryToneGeneratorHelpers.ts (50 lines)
import { UserMemory } from './MemoryTypes'
import { getToneBasedGreeting, getBarnCompliment, getBarnEncouragement } from './ToneTemplates'

export function generatePersonalityTone(userMemory: UserMemory | null): string {
  if (!userMemory) return 'barn-friendly'
  
  // Analyze user preferences to determine tone
  const preferences = userMemory.preferences || {}
  
  if (preferences.sleep_preference === 'quiet') {
    return 'gentle-barn'
  }
  
  if (preferences.kids_with_them) {
    return 'family-barn'
  }
  
  if (preferences.will_pay_for_convenience) {
    return 'premium-barn'
  }
  
  return 'barn-friendly'
}

// Re-export template functions
export { getToneBasedGreeting, getBarnCompliment, getBarnEncouragement }