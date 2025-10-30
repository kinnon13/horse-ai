import { getUserHorses, createUserHorse, updateUserHorse, deleteUserHorse } from './UserHorsesOperations.repo'

interface Horse {
  id: string
  name: string
  sex: 'mare' | 'stud' | 'gelding' | 'filly' | 'colt' | 'unknown'
  year: string | null
  location_city: string | null
  location_state: string | null
}

export async function addUserHorse(userId: string, horseData: Omit<Horse, 'id'>): Promise<Horse | null> {
  try {
    const horse = await createUserHorse({
      user_id: userId,
      horse_name: horseData.name,
      horse_type: horseData.sex,
      breed: 'Unknown', // Default breed
      value: undefined
    })

    return {
      id: horse.id,
      name: horse.horse_name,
      sex: horse.horse_type as any,
      year: null,
      location_city: null,
      location_state: null
    }
  } catch (error) {
    console.error('Error adding horse:', error)
    return null
  }
}

export async function getUserHorsesList(userId: string): Promise<Horse[]> {
  try {
    const horses = await getUserHorses(userId)
    return horses.map(horse => ({
      id: horse.id,
      name: horse.horse_name,
      sex: horse.horse_type as any,
      year: null,
      location_city: null,
      location_state: null
    }))
  } catch (error) {
    console.error('Error getting horses:', error)
    return []
  }
}