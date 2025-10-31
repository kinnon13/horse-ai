// MemoryQuery.ts (35 lines) - Single responsibility: Main memory query functions
import { UserMemory } from './MemoryTypes'
import { MemoryQueryHelpers } from './MemoryQueryHelpers'

export async function fetchUserMemory(userId: string): Promise<UserMemory | null> {
  const url = MemoryQueryHelpers.buildUserMemoryUrl(userId)
  return MemoryQueryHelpers.executeQuery(url, 'Failed to fetch user memory')
}

export async function getRecentPerformances(userId: string): Promise<any[]> {
  const url = MemoryQueryHelpers.buildPerformancesUrl(userId)
  return MemoryQueryHelpers.executeArrayQuery(url, 'Failed to fetch recent performances')
}

export async function getBreedingHistory(userId: string): Promise<any[]> {
  const url = MemoryQueryHelpers.buildBreedingUrl(userId)
  return MemoryQueryHelpers.executeArrayQuery(url, 'Failed to fetch breeding history')
}