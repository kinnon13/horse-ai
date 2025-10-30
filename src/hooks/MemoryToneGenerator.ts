import { UserMemory } from './MemoryTypes'

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

export function getToneBasedGreeting(tone: string): string {
  const greetings = {
    'gentle-barn': 'Hey there, partner',
    'family-barn': 'Hey! How\'s the crew?',
    'premium-barn': 'Hey there',
    'barn-friendly': 'Hey'
  }
  
  return greetings[tone] || 'Hey'
}

export function getBarnCompliment(horseName: string, performance: string): string {
  const compliments = [
    `That ${horseName} of yours is looking sharp!`,
    `${horseName} is turning heads out there`,
    `I saw that ${performance} - ${horseName} is on fire`,
    `${horseName} is making it look easy`,
    `That ${performance} was clean - ${horseName} is dialed in`
  ]
  
  return compliments[Math.floor(Math.random() * compliments.length)]
}

export function getBarnEncouragement(): string {
  const encouragement = [
    "You've got this",
    "Keep pushing",
    "That's the way to ride",
    "You're dialed in",
    "Ride like you mean it"
  ]
  
  return encouragement[Math.floor(Math.random() * encouragement.length)]
}
