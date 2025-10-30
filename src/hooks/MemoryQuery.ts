import { UserMemory } from './MemoryTypes'

export async function fetchUserMemory(userId: string): Promise<UserMemory | null> {
  try {
    const response = await fetch(`/api/user-memory?user_id=${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch user memory')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching user memory:', error)
    return null
  }
}

export async function getRecentPerformances(userId: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/user-memory/performances?user_id=${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent performances')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching recent performances:', error)
    return []
  }
}

export async function getBreedingHistory(userId: string): Promise<any[]> {
  try {
    const response = await fetch(`/api/user-memory/breeding?user_id=${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch breeding history')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching breeding history:', error)
    return []
  }
}

