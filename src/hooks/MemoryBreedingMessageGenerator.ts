import { UserMemory } from './MemoryTypes'
import { generatePersonalityTone, getToneBasedGreeting } from './MemoryToneGenerator'

export function generateBreedingIntroMessage(
  userMemory: UserMemory | null,
  mareInfo?: any
): string {
  if (!userMemory || !mareInfo) {
    return "Hey! I'm learning about your breeding program. Want to help me understand what you're looking for?"
  }
  
  const tone = generatePersonalityTone(userMemory)
  const greeting = getToneBasedGreeting(tone)
  
  if (tone === 'gentle') {
    return `${greeting}, that ${mareInfo.breed} mare line is so nice. Who are you thinking of breeding her to next?`
  }
  
  if (tone === 'family-friendly') {
    return `${greeting}! That ${mareInfo.breed} mare is beautiful. Any new prospects you're excited about for her?`
  }
  
  if (tone === 'premium') {
    return `${greeting}, that ${mareInfo.breed} mare line is exceptional. Want me to find you the perfect match for her?`
  }
  
  return `${greeting}, that ${mareInfo.breed} mare line is so nice. Who are you thinking of breeding her to next?`
}



