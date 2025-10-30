import { UserMemory } from './MemoryTypes'
import { generatePersonalityTone, getToneBasedGreeting } from './MemoryToneGenerator'

export function generateMemoryIntroMessage(
  userMemory: UserMemory | null,
  recentPerformance?: any
): string {
  if (!userMemory || !recentPerformance) {
    return "Hey there! I'm still learning about your riding style. Want to help me get smarter about what you need?"
  }
  
  const tone = generatePersonalityTone(userMemory)
  const greeting = getToneBasedGreeting(tone)
  const location = userMemory.last_known_city ? ` in ${userMemory.last_known_city}` : ''
  
  if (tone === 'gentle') {
    return `${greeting}, I remember that ${recentPerformance.time}${location}. Want me to break down what I noticed for your next run?`
  }
  
  if (tone === 'family-friendly') {
    return `${greeting}! That ${recentPerformance.time}${location} was solid. Want me to help you plan the next one with the family?`
  }
  
  if (tone === 'premium') {
    return `${greeting}, that ${recentPerformance.time}${location} was impressive. Want me to find you the best opportunities to showcase that?`
  }
  
  return `${greeting}, I remember that ${recentPerformance.time}${location}. Want me to break down your next run?`
}

