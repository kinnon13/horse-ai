import { UserMemory, UserPreferences, TravelPattern } from './MemoryTypes'

export async function updateUserMemory(
  userId: string, 
  updates: Partial<UserMemory>
): Promise<void> {
  try {
    const response = await fetch('/api/user-memory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...updates })
    })
    
    if (!response.ok) {
      throw new Error('Failed to update user memory')
    }
  } catch (error) {
    console.error('Error updating user memory:', error)
    throw error
  }
}

export async function updateUserPreferences(
  userId: string, 
  preferences: UserPreferences
): Promise<void> {
  await updateUserMemory(userId, { preferences })
}

export async function updateTravelPattern(
  userId: string, 
  travelPattern: TravelPattern
): Promise<void> {
  await updateUserMemory(userId, { travel_pattern: travelPattern })
}

export async function updateLocation(
  userId: string, 
  city: string, 
  state: string
): Promise<void> {
  await updateUserMemory(userId, {
    last_known_city: city,
    last_known_state: state,
    last_seen_at: new Date().toISOString()
  })
}

