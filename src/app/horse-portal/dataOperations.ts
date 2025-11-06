// Horse Portal Data Operations - Single responsibility
export async function createHorse(horseData: any) {
  try {

    return { id: 'horse_' + Date.now(), ...horseData }
  } catch (error) {
    console.error('Error creating horse:', error)
    throw error
  }
}

export async function updateHorse(horseId: string, updates: any) {
  try {

    return { id: horseId, ...updates }
  } catch (error) {
    console.error('Error updating horse:', error)
    throw error
  }
}

export async function deleteHorse(horseId: string) {
  try {

    return { success: true }
  } catch (error) {
    console.error('Error deleting horse:', error)
    throw error
  }
}

export async function saveHorse(horseData: any) {
  try {

    return { id: 'horse_' + Date.now(), ...horseData }
  } catch (error) {
    console.error('Error saving horse:', error)
    throw error
  }
}